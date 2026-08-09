import assert from "node:assert/strict";
import test from "node:test";
import { getAdminDateRange } from "../lib/adminDateRange.js";

test("custom admin ranges retain the submitted Beijing calendar dates", () => {
  const range = getAdminDateRange({
    range: "custom",
    start: "2026-06-01",
    end: "2026-06-05"
  });

  assert.equal(range.preset, "custom");
  assert.equal(range.startInput, "2026-06-01");
  assert.equal(range.endInput, "2026-06-05");
  assert.equal(range.days, 5);
});

test("custom admin ranges safely normalize an inverted date selection", () => {
  const range = getAdminDateRange({
    range: "custom",
    start: "2026-06-10",
    end: "2026-06-05"
  });

  assert.equal(range.startInput, "2026-06-05");
  assert.equal(range.endInput, "2026-06-05");
  assert.equal(range.days, 1);
});
