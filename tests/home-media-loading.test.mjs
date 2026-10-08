import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const videoComponent = readFileSync(new URL("../components/HomeVideoShowcase.tsx", import.meta.url), "utf8");
const homepage = readFileSync(new URL("../components/LocalizedPages.tsx", import.meta.url), "utf8");

test("homepage video is requested only after the visitor clicks play", () => {
  assert.match(videoComponent, /preload="none"/);
  assert.match(videoComponent, /video\.src = "\/videos\/cowinmagnet-home-product-showcase-2026\.mp4"/);
  assert.doesNotMatch(videoComponent, /<source\s+src=/);
});

test("homepage prioritizes the hero and sizes mobile industry tiles for two columns", () => {
  assert.match(homepage, /home-hero-option-two-branded-20261009\.webp" fill sizes="\(max-width: 760px\) 100vw, 62vw" alt=\{t\.home\.heroAlt\} priority fetchPriority="high"/);
  assert.match(homepage, /sizes="\(max-width: 760px\) 46vw, 20vw"/);
});
