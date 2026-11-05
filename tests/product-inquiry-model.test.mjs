import assert from "node:assert/strict";
import test from "node:test";
import { products } from "../data/products.ts";
import { getProductInquiryModel } from "../lib/productDisplay.ts";

test("catalogue inquiry models survive when a product has no approved technical facts", () => {
  const expected = new Map([
    ["rcyd-type-permanent-magnet-self-dumping-iron-remover", "RCYD"],
    ["rcydii-type-permanent-magnet-self-dumping-iron-remover", "RCYDII"],
    ["gls-type-integral-channel-metal-separator", "GLS"],
    ["wet-drum-magnetic-separator", "CTB / CTS / CTN"],
    ["suspended-permanent-magnetic-separator", "RCYB / RCYP"],
    ["suspended-electromagnetic-conveyor-belt-separator", "RCDD / RCDC / RCDF"],
    ["permanent-overband-magnetic-separator", "RCYC(D) (self-cleaning series)"]
  ]);
  for (const [slug, model] of expected) {
    const product = products.find((item) => item.slug === slug);
    assert.ok(product, slug);
    assert.equal(getProductInquiryModel({ ...product, specs: [] }), model);
  }
  const unassigned = products.find((product) => product.slug === "magnetic-head-pulley");
  assert.ok(unassigned);
  assert.equal(getProductInquiryModel({ ...unassigned, specs: [] }), "");
});

test("approved model values take precedence and duplicate values are collapsed", () => {
  assert.equal(getProductInquiryModel({
    inquiryModel: "RCYD",
    specs: [
      { label: "Model", value: "RCYD(C)-5" },
      { label: "Model No.", value: "RCYD(C)-6" },
      { label: "型号", value: "RCYD(C)-5" },
      { label: "Weight", value: "1200 kg" }
    ]
  }), "RCYD(C)-5 / RCYD(C)-6");
});
