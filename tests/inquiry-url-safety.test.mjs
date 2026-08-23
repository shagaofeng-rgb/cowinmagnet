import assert from "node:assert/strict";
import test from "node:test";
import { safeSitePath, safeSiteUrl } from "../lib/siteUrlSafety.js";

test("inquiry source links remain on the Cowin public site", () => {
  assert.equal(safeSitePath("/en/products/wet-drum-magnetic-separator?utm_source=email"), "/en/products/wet-drum-magnetic-separator?utm_source=email");
  assert.equal(safeSitePath("https://cowinmagnet.com/en/request-quote"), "/en/request-quote");
  assert.equal(safeSiteUrl("/en/news?ref=campaign"), "https://www.cowinmagnet.com/en/news?ref=campaign");
});

test("inquiry source links reject javascript, data, and external URLs", () => {
  for (const value of ["javascript:alert(1)", "data:text/html,test", "https://example.com/en", "//example.com/en"]) {
    assert.equal(safeSitePath(value), "");
    assert.equal(safeSiteUrl(value), "");
  }
});
