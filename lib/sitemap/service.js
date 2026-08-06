import crypto from "node:crypto";
import { maybeSubmitSitemap } from "../searchConsoleClient.js";
import { recordSyncJobRun } from "../syncStatusStore.js";
import { buildSitemapSnapshotPayload, diffSitemapManifests, validateSitemapXml } from "./core.js";
import { collectSitemapSections, SITEMAP_SITE_URL } from "./source.js";
import {
  getCurrentSitemapState,
  isSitemapStateDirty,
  saveCurrentSitemapSnapshot,
  withSitemapGenerationLock
} from "./storage.js";

function safeError(error) {
  return String(error?.message || error || "Unknown sitemap error").slice(0, 1000);
}

function isUsableSnapshot(snapshot) {
  if (!snapshot?.indexXml || !Array.isArray(snapshot.files) || !snapshot.files.length) return false;
  if (!validateSitemapXml(snapshot.indexXml, { kind: "index" }).valid) return false;
  return snapshot.files.every((file) => file?.name && validateSitemapXml(file.xml).valid);
}

function isPreviewDeployment() {
  return process.env.VERCEL_ENV === "preview";
}

async function checkRobotsSitemapDeclaration(siteUrl = SITEMAP_SITE_URL) {
  const robotsUrl = `${siteUrl.replace(/\/$/, "")}/robots.txt`;
  const expectedSitemapUrl = `${siteUrl.replace(/\/$/, "")}/sitemap.xml`;
  try {
    const response = await fetch(robotsUrl, {
      headers: { Accept: "text/plain", "User-Agent": "Cowinmagnet-Sitemap-Maintenance/1.0" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000)
    });
    const body = response.ok ? await response.text() : "";
    const declaredSitemaps = body
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*Sitemap:\s*(\S+)\s*$/i)?.[1] || "")
      .filter(Boolean);
    return {
      success: response.ok && declaredSitemaps.includes(expectedSitemapUrl),
      statusCode: response.status,
      robotsUrl,
      expectedSitemapUrl,
      declaredSitemaps
    };
  } catch (error) {
    return { success: false, statusCode: 0, robotsUrl, expectedSitemapUrl, declaredSitemaps: [], error: safeError(error) };
  }
}

async function recordRun(run) {
  try {
    return await recordSyncJobRun(run);
  } catch (error) {
    console.error("[sitemap] failed to persist run log", { message: safeError(error) });
    return { ok: false, storageMode: "unavailable" };
  }
}

export async function buildFreshSitemapSnapshot({ previousSnapshot = null, siteUrl = SITEMAP_SITE_URL, maxUrls, maxBytes } = {}) {
  const sections = await collectSitemapSections({ siteUrl });
  const generatedAt = new Date().toISOString();
  const payload = buildSitemapSnapshotPayload({ sections, siteUrl, generatedAt, maxUrls, maxBytes });
  return {
    ...payload,
    id: `sitemap-${generatedAt}-${crypto.randomUUID()}`,
    diff: diffSitemapManifests(previousSnapshot?.manifest || {}, payload.manifest)
  };
}

export async function runSitemapMaintenance({
  trigger = "manual",
  force = false,
  dryRun = false,
  submit = false,
  verbose = false,
  maxUrls,
  maxBytes
} = {}) {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  const previewReadOnly = isPreviewDeployment();
  const lockResult = await withSitemapGenerationLock(async () => {
    const previousState = await getCurrentSitemapState();
    const robotsCheck = await checkRobotsSitemapDeclaration();
    const snapshot = await buildFreshSitemapSnapshot({
      previousSnapshot: previousState.snapshot,
      maxUrls,
      maxBytes
    });
    const changed = !previousState.snapshot || previousState.snapshot.manifestHash !== snapshot.manifestHash;
    let saveResult = { saved: false, storageMode: previousState.storageMode };
    if (!previewReadOnly && !dryRun && (changed || force || isSitemapStateDirty(previousState))) {
      saveResult = await saveCurrentSitemapSnapshot(snapshot);
    }

    let submission = {
      attempted: false,
      success: false,
      reason: previewReadOnly ? "preview-read-only" : submit ? "disabled-or-unconfigured" : "not-requested"
    };
    // Search Console only needs a submission when the canonical sitemap
    // manifest has actually changed. This is not a URL indexing mechanism.
    if (!previewReadOnly && !dryRun && submit && changed) {
      try {
        submission = await maybeSubmitSitemap();
      } catch (error) {
        submission = { attempted: true, success: false, error: safeError(error) };
      }
    }

    const finishedAt = new Date().toISOString();
    const status = previewReadOnly ? "preview_read_only" : dryRun ? "dry_run" : changed || force ? "success" : "unchanged";
    const metadata = {
      trigger,
      manifestHash: snapshot.manifestHash,
      changed,
      forced: Boolean(force),
      dryRun: Boolean(dryRun),
      previewReadOnly,
      storageMode: saveResult.storageMode,
      saved: Boolean(saveResult.saved),
      split: snapshot.split,
      files: snapshot.files.map(({ name, section, lastmod, urlCount, byteSize }) => ({ name, section, lastmod, urlCount, byteSize })),
      addedUrls: snapshot.diff.added,
      modifiedUrls: snapshot.diff.modified,
      removedUrls: snapshot.diff.removed,
      skippedUrls: snapshot.skipped,
      robotsCheck,
      submission
    };
    if (!previewReadOnly) {
      await recordRun({
        jobName: "sitemap-maintenance",
        status,
        startedAt,
        finishedAt,
        durationMs: Date.now() - startedMs,
        processedCount: snapshot.totalUrls,
        skippedCount: snapshot.skipped.length,
        failedCount: 0,
        metadata
      });
    }

    return {
      success: true,
      status,
      changed,
      saved: Boolean(saveResult.saved),
      snapshot,
      robotsCheck,
      submission,
      durationMs: Date.now() - startedMs,
      ...(verbose ? { metadata } : {})
    };
  });

  if (!lockResult.locked) {
    const finishedAt = new Date().toISOString();
    if (!previewReadOnly) {
      await recordRun({
        jobName: "sitemap-maintenance",
        status: "skipped_due_to_lock",
        startedAt,
        finishedAt,
        durationMs: Date.now() - startedMs,
        skippedCount: 1,
        metadata: { trigger, storageMode: lockResult.storageMode }
      });
    }
    return { success: true, status: "skipped_due_to_lock", locked: false, durationMs: Date.now() - startedMs };
  }

  return { ...lockResult.value, locked: true, storageMode: lockResult.storageMode };
}

export async function runSitemapMaintenanceSafely(options = {}) {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  try {
    return await runSitemapMaintenance(options);
  } catch (error) {
    const message = safeError(error);
    if (!isPreviewDeployment()) {
      await recordRun({
        jobName: "sitemap-maintenance",
        status: "failed",
        startedAt,
        finishedAt: new Date().toISOString(),
        durationMs: Date.now() - startedMs,
        failedCount: 1,
        errorMessage: message,
        metadata: { trigger: options.trigger || "manual" }
      });
    }
    return { success: false, status: "failed", error: message, durationMs: Date.now() - startedMs };
  }
}

export async function getRenderableSitemapSnapshot() {
  if (isPreviewDeployment()) {
    return buildFreshSitemapSnapshot({ previousSnapshot: null });
  }

  let state;
  try {
    state = await getCurrentSitemapState();
    if (isUsableSnapshot(state.snapshot) && !isSitemapStateDirty(state)) return state.snapshot;
  } catch (error) {
    console.error("[sitemap] failed to read current snapshot", { message: safeError(error) });
  }

  const run = await runSitemapMaintenanceSafely({ trigger: "public-request", force: !state?.snapshot, submit: false });
  if (isUsableSnapshot(run.snapshot)) return run.snapshot;
  if (isUsableSnapshot(state?.snapshot)) return state.snapshot;

  const transient = await buildFreshSitemapSnapshot({ previousSnapshot: null });
  if (!isUsableSnapshot(transient)) throw new Error("No valid sitemap snapshot is available");
  return transient;
}
