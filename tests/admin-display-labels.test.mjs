import assert from "node:assert/strict";
import test from "node:test";
import { displayAdminLabel } from "../lib/adminDisplayLabels.js";

test("admin labels translate channel codes without altering raw values", () => {
  assert.equal(displayAdminLabel("direct"), "直接访问");
  assert.equal(displayAdminLabel("organic_search"), "自然搜索");
  assert.equal(displayAdminLabel("paid_social"), "付费社交媒体");
  assert.equal(displayAdminLabel("Google"), "Google");
});
