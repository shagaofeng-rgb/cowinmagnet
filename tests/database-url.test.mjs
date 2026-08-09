import assert from "node:assert/strict";
import test from "node:test";
import { withDatabaseRetry } from "../lib/databaseUrl.js";

test("retries a transient database timeout once", async () => {
  let attempts = 0;
  const result = await withDatabaseRetry(
    async () => {
      attempts += 1;
      if (attempts === 1) {
        const error = new Error("connect ETIMEDOUT");
        error.code = "ETIMEDOUT";
        throw error;
      }
      return "saved";
    },
    { attempts: 2, delayMs: 1 }
  );

  assert.equal(result, "saved");
  assert.equal(attempts, 2);
});

test("does not retry a non-transient database error", async () => {
  let attempts = 0;
  await assert.rejects(
    withDatabaseRetry(
      async () => {
        attempts += 1;
        throw new Error("invalid SQL syntax");
      },
      { attempts: 2, delayMs: 1 }
    ),
    /invalid SQL syntax/
  );
  assert.equal(attempts, 1);
});
