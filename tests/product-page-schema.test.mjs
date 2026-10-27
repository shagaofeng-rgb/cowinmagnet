import assert from "node:assert/strict";
import test from "node:test";
import { productPageSchema } from "../lib/productPageSchema.ts";

test("custom B2B product pages describe their subject without fake rich-result claims", () => {
  const input = {
    name: "RCYD Permanent Self-Cleaning Iron Remover",
    description: "Custom magnetic separation equipment configured to buyer requirements.",
    imageUrls: ["https://www.cowinmagnet.com/assets/products/rcyd.jpg"],
    url: "https://www.cowinmagnet.com/en/products/rcyd"
  };
  const schema = productPageSchema(input);
  assert.equal(schema["@type"], "ItemPage");
  assert.equal(schema.about["@type"], "Thing");
  assert.equal(schema.about.name, input.name);
  assert.equal(schema.url, input.url);
  assert.deepEqual(schema.image, input.imageUrls);
  assert.equal("offers" in schema, false);
  assert.equal("review" in schema, false);
  assert.equal("aggregateRating" in schema, false);
  assert.doesNotMatch(JSON.stringify(schema), /"@type":"Product"/);
});
