import assert from "node:assert/strict";
import test from "node:test";
import { isTransientFetchFailure, monitoredImageUrl } from "../lib/monitor/index.mjs";

test("monitor retries only network and server failures", () => {
  assert.equal(isTransientFetchFailure({ status: 0 }), true);
  assert.equal(isTransientFetchFailure({ status: 503 }), true);
  assert.equal(isTransientFetchFailure({ status: 403 }), false);
  assert.equal(isTransientFetchFailure({ status: 200 }), false);
});

test("monitor checks a representative responsive image instead of the 3840px fallback", () => {
  const tag = '<img src="/_next/image?url=%2Fimage.jpg&amp;w=3840&amp;q=75" srcset="/_next/image?url=%2Fimage.jpg&amp;w=640&amp;q=75 640w, /_next/image?url=%2Fimage.jpg&amp;w=1200&amp;q=75 1200w, /_next/image?url=%2Fimage.jpg&amp;w=3840&amp;q=75 3840w">';
  assert.equal(monitoredImageUrl("https://www.cowinmagnet.com", tag), "https://www.cowinmagnet.com/_next/image?url=%2Fimage.jpg&w=1200&q=75");
});
