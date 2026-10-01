import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { publicationDateKey } from "../lib/newsSchedule.js";

test("publication day follows the configured site timezone", () => {
  const beforeShanghaiMidnight = new Date("2026-08-29T15:59:59.000Z");
  const afterShanghaiMidnight = new Date("2026-08-29T16:00:00.000Z");
  assert.equal(publicationDateKey(beforeShanghaiMidnight, "Asia/Shanghai"), "2026-08-29");
  assert.equal(publicationDateKey(afterShanghaiMidnight, "Asia/Shanghai"), "2026-08-30");
});

test("News automation has no scheduled triggers while Blog publishing keeps its retry cadence", async () => {
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.equal(config.crons.some((cron) => cron.path.startsWith("/api/automation/news-")), false);
  assert.equal(config.crons.find((cron) => cron.path === "/api/cron/blog-publish-retry")?.schedule, "*/30 * * * *");
  assert.equal(config.crons.find((cron) => cron.path === "/api/cron/sitemap-maintenance")?.schedule, "35 2 * * 1");
});

test("retired News endpoints cannot run discovery or publishing", async () => {
  for (const route of ["news-discovery", "news-publish"]) {
    const source = await readFile(new URL(`../app/api/automation/${route}/route.js`, import.meta.url), "utf8");
    assert.match(source, /status: "paused"/);
    assert.doesNotMatch(source, /runNews(Ingest|Publish)Cycle/);
  }
  const adminSource = await readFile(new URL("../app/api/admin/news-operations/route.js", import.meta.url), "utf8");
  assert.match(adminSource, /body\.action === "discover" \|\| body\.action === "publish"/);
  assert.doesNotMatch(adminSource, /runNews(Ingest|Publish)Cycle/);
});
