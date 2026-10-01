import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "docs/audits/2026-10-01-branded-image-manifest.json"), "utf8"));

test("published content images use versioned files containing the official brand mark", async () => {
  assert.equal(manifest.logo, "/images/cowin-logo.png");
  assert.ok(manifest.entries.length >= 100);
  for (const entry of manifest.entries) {
    assert.match(entry.branded, /-cowin-brand-20261001\.(?:jpe?g|png|webp|avif|gif)$/);
    const original = path.join(root, "public", entry.source.slice(1));
    const branded = path.join(root, "public", entry.branded.slice(1));
    assert.ok(fs.existsSync(original), `Original missing: ${entry.source}`);
    assert.ok(fs.existsSync(branded), `Branded version missing: ${entry.branded}`);
    const bytes = fs.readFileSync(branded);
    assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"), entry.sha256);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, entry.width);
    assert.equal(metadata.height, entry.height);
  }
});
