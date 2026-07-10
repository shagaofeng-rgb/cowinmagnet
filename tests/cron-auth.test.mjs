import assert from "node:assert/strict";
import test from "node:test";
import { isCronAuthorized } from "../lib/cronAuth.js";

function withSecret(callback) {
  const original = {
    CRON_SECRET: process.env.CRON_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL
  };
  process.env.CRON_SECRET = "test-cron-secret";
  process.env.NODE_ENV = "production";
  process.env.VERCEL = "1";
  try {
    callback();
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("Cron authorization accepts the Vercel bearer secret", () => {
  withSecret(() => {
    const request = new Request("https://example.com/api/cron/test", {
      headers: { Authorization: "Bearer test-cron-secret" }
    });
    assert.equal(isCronAuthorized(request), true);
  });
});

test("Cron authorization rejects spoofable Vercel headers and query secrets", () => {
  withSecret(() => {
    const request = new Request("https://example.com/api/cron/test?secret=test-cron-secret", {
      headers: { "x-vercel-cron": "1", "user-agent": "vercel-cron/1.0" }
    });
    assert.equal(isCronAuthorized(request), false);
  });
});

test("Cron authorization supports the protected manual header", () => {
  withSecret(() => {
    const request = new Request("https://example.com/api/cron/test", {
      headers: { "x-cron-secret": "test-cron-secret" }
    });
    assert.equal(isCronAuthorized(request), true);
  });
});
