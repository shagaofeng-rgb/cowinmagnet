import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const proxySource = fs.readFileSync(new URL("../proxy.ts", import.meta.url), "utf8");

test("public China mainland traffic remains in the proxy block list", () => {
  assert.match(proxySource, /new Set<string>\(\["CN"\]\)/);
  assert.match(proxySource, /X-Cowin-Geo-Block/);
});

test("geo blocking retains API and admin allow-list protections", () => {
  assert.match(proxySource, /pathname\.startsWith\("\/api"\)/);
  assert.match(proxySource, /pathname\.startsWith\("\/admin"\)/);
});
