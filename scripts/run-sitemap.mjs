import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const args = new Set(process.argv.slice(2));
const options = {
  trigger: "cli",
  force: args.has("--force"),
  dryRun: args.has("--dry-run"),
  submit: args.has("--submit"),
  verbose: args.has("--verbose")
};

const { runSitemapMaintenanceSafely } = await import("../lib/sitemap/service.js");
const result = await runSitemapMaintenanceSafely(options);
const snapshot = result.snapshot;
const output = {
  success: result.success,
  status: result.status,
  changed: Boolean(result.changed),
  saved: Boolean(result.saved),
  totalUrls: snapshot?.totalUrls || 0,
  totalBytes: snapshot?.totalBytes || 0,
  files: snapshot?.files?.map(({ name, section, lastmod, urlCount, byteSize }) => ({ name, section, lastmod, urlCount, byteSize })) || [],
  changes: snapshot
    ? { added: snapshot.diff.added, modified: snapshot.diff.modified, removed: snapshot.diff.removed }
    : { added: [], modified: [], removed: [] },
  robotsCheck: result.robotsCheck || { success: false, reason: "not-checked" },
  submission: result.submission || { attempted: false, success: false, reason: "not-requested" },
  durationMs: result.durationMs
};

console.log(JSON.stringify(options.verbose ? { ...output, skipped: snapshot?.skipped || [] } : output, null, 2));
if (!result.success) process.exitCode = 1;
