import test from "node:test";
import assert from "node:assert/strict";
import { hasDirectCowinNewsScopeSignal } from "../lib/news/scopeGate.js";

test("News scope gate accepts concrete Cowin-relevant process signals", () => {
  assert.equal(hasDirectCowinNewsScopeSignal("A recycling line adds ferrous metal recovery before the crusher."), true);
  assert.equal(hasDirectCowinNewsScopeSignal("Wet magnetic separation for iron ore tailings."), true);
});

test("News scope gate rejects unrelated technology coverage", () => {
  assert.equal(hasDirectCowinNewsScopeSignal("A student developed a printable chipless RFID tag."), false);
  assert.equal(hasDirectCowinNewsScopeSignal("A closer look at local recycling education initiatives."), false);
});
