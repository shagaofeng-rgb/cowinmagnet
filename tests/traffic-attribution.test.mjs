import assert from "node:assert/strict";
import test from "node:test";
import { classifyTraffic } from "../lib/trafficAttribution.js";

test("traffic attribution distinguishes paid, organic, AI, and direct sources", () => {
  const paid = classifyTraffic({ currentUrl: "https://www.cowinmagnet.com/en?gclid=example", countryCode: "US" });
  assert.equal(paid.channel, "paid_search");
  assert.equal(paid.platform, "Google Ads");
  assert.equal(paid.countryCode, "US");

  const organic = classifyTraffic({ currentUrl: "https://www.cowinmagnet.com/en", referrer: "https://www.google.com/search?q=magnetic+separator" });
  assert.equal(organic.channel, "organic_search");
  assert.equal(organic.platform, "Google");

  const ai = classifyTraffic({ currentUrl: "https://www.cowinmagnet.com/en", referrer: "https://gemini.google.com/app/example" });
  assert.equal(ai.channel, "ai_search");
  assert.equal(ai.platform, "Gemini");

  const taggedAi = classifyTraffic({ currentUrl: "https://www.cowinmagnet.com/en?utm_source=chatgpt" });
  assert.equal(taggedAi.channel, "ai_search");
  assert.equal(taggedAi.platform, "ChatGPT");

  const direct = classifyTraffic({ currentUrl: "https://www.cowinmagnet.com/en" });
  assert.equal(direct.channel, "direct");
});
