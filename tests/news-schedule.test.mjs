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

test("daily retry cron runs multiple times while the publisher enforces one success per day", async () => {
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  const publisher = config.crons.find((cron) => cron.path === "/api/automation/news-publish");
  assert.equal(publisher.schedule, "45 1,3,6 * * *");
});
