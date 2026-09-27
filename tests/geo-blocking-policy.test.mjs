import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const proxySource = fs.readFileSync(new URL("../proxy.ts", import.meta.url), "utf8");

test("public traffic is not blocked by country in the proxy", () => {
  assert.doesNotMatch(proxySource, /blockedVisitorCountries|getRequestCountry|X-Cowin-Geo-Block/);
  assert.doesNotMatch(proxySource, /x-vercel-ip-country|cf-ipcountry|cloudfront-viewer-country/);
});

test("proxy retains API and admin route handling", () => {
  assert.match(proxySource, /pathname\.startsWith\("\/api"\)/);
  assert.match(proxySource, /pathname\.startsWith\("\/admin"\)/);
});
