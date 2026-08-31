import assert from "node:assert/strict";
import test from "node:test";
import { pageTitleForTemplate } from "../lib/seoTitle.js";

test("page titles do not duplicate the root metadata brand template", () => {
  assert.equal(pageTitleForTemplate("Magnetic separator guide | COWIN MAGNET"), "Magnetic separator guide");
  assert.equal(pageTitleForTemplate("Magnetic separator guide | COWIN MAGNET | COWIN MAGNET"), "Magnetic separator guide");
  assert.equal(pageTitleForTemplate("Magnetic separator guide"), "Magnetic separator guide");
});
