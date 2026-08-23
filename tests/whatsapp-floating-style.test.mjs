import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("WhatsApp floating action stays visible at the right-side midpoint across desktop and mobile", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const floatingBlock = css.match(/\.whatsapp-float \{\s*position: fixed;([\s\S]*?)\n\}/)?.[1] || "";

  assert.match(floatingBlock, /top:\s*50%/);
  assert.match(floatingBlock, /right:\s*max\(28px/);
  assert.match(floatingBlock, /bottom:\s*auto/);
  assert.match(floatingBlock, /animation:\s*whatsappFloatAttention/);
  assert.match(css, /@media \(max-width: 430px\) \{[\s\S]*?\.whatsapp-float \{\s*display:\s*inline-flex/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
