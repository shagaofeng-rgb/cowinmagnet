import assert from "node:assert/strict";
import test from "node:test";
import { adminVisitorCode } from "../lib/adminVisitorCode.js";

test("the same visitor keeps one customer code across date ranges", () => {
  const visitorId = "v_1791184270958_e38fb32e21a24";
  const first = adminVisitorCode(visitorId);
  assert.match(first, /^[0-9A-Z]{10}$/);
  assert.equal(adminVisitorCode(visitorId), first);
  assert.notEqual(adminVisitorCode("v_1791183995003_b165e366953c78"), first);
  assert.equal(adminVisitorCode(""), "");
});
