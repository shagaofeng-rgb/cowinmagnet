import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const webhookRoute = fs.readFileSync(path.join(root, "app", "api", "webhook", "send_article", "route.js"), "utf8");
const retryRoute = fs.readFileSync(path.join(root, "app", "api", "cron", "blog-publish-retry", "route.js"), "utf8");
const store = fs.readFileSync(path.join(root, "lib", "blogWebhookStore.js"), "utf8");

test("external Blog webhook publishes after durable acceptance", () => {
  assert.match(webhookRoute, /enqueueBlogWebhookJob/);
  assert.match(webhookRoute, /publishExternalBlog/);
  assert.match(webhookRoute, /Article published successfully/);
  assert.doesNotMatch(webhookRoute, /pending-editorial-review/);
});

test("Blog webhook retries are bounded and avoid duplicate publication", () => {
  assert.match(store, /MAX_ATTEMPTS = 3/);
  assert.match(store, /ON CONFLICT \(fingerprint\)/);
  assert.match(store, /status = 'published'/);
  assert.match(retryRoute, /claimDueBlogWebhookJobs/);
  assert.match(retryRoute, /getLegacyExternalBlogDrafts/);
});
