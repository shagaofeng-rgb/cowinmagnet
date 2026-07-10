import assert from "node:assert/strict";
import test from "node:test";
import { parseRss, resolveOriginalArticleUrl } from "../lib/news-system/fetcher.mjs";
import { buildDiversityContext, evaluateNewsDiversity, topicClusterId } from "../lib/news-system/diversity.mjs";
import { isApprovedSourceImageUrl } from "../lib/news-system/image-handler.mjs";

test("Google News RSS items preserve the publisher and source image", () => {
  const xml = `
    <rss><channel><item>
      <title><![CDATA[Battery recycler opens a new processing line - Trade Daily]]></title>
      <link>https://news.google.com/rss/articles/example</link>
      <guid>https://news.google.com/rss/articles/example</guid>
      <description><![CDATA[<img data-srcset="https://cdn.example.com/a.jpg 320w, https://cdn.example.com/b.jpg 1200w">Story]]></description>
      <pubDate>Thu, 09 Jul 2026 10:00:00 GMT</pubDate>
      <source url="https://www.tradedaily.example/">Trade Daily</source>
    </item></channel></rss>`;

  const [item] = parseRss(xml, {
    sourceName: "Google News RSS - Battery",
    sourceUrl: "https://news.google.com/rss/search?q=battery",
    sourceGroup: "trade-publications",
    allowedUseImage: true
  });

  assert.equal(item.sourceName, "Trade Daily");
  assert.equal(item.publisherUrl, "https://www.tradedaily.example/");
  assert.equal(item.url, "https://news.google.com/rss/articles/example");
  assert.equal(item.imageUrl, "https://cdn.example.com/b.jpg");
});

test("publisher domains drive diversity instead of the Google News host", () => {
  const item = {
    title: "New conveyor sorting technology for recycling plants",
    description: "A material recovery facility added a new sorting line.",
    url: "https://news.google.com/rss/articles/example",
    publisherUrl: "https://industry.example/news/story",
    sourceName: "Industry Example",
    sourceGroup: "trade-publications",
    sourceFeedUrl: "https://news.google.com/rss/search?q=sorting"
  };
  const result = evaluateNewsDiversity(item, buildDiversityContext(), []);

  assert.equal(result.sourceDomain, "industry.example");
  assert.equal(result.sourceFeedDomain, "google.com");
});

test("topic coverage separates materially different recycling intents", () => {
  assert.equal(topicClusterId({ title: "PCB and circuit board e-waste recovery expands" }), "electronics-e-waste-recovery");
  assert.equal(topicClusterId({ title: "Hydrometallurgical battery recycling line opens" }), "battery-recycling-hydrometallurgy");
  assert.equal(topicClusterId({ title: "PCR plastic packaging certification program" }), "plastics-packaging-circularity");
  assert.equal(topicClusterId({ title: "New material recovery facility sorting line" }), "recycling-sorting-equipment");
});

test("direct publisher URLs do not invoke Google News decoding", async () => {
  const item = { title: "Direct source", url: "https://publisher.example/story" };
  assert.deepEqual(await resolveOriginalArticleUrl(item), item);
});

test("aggregator thumbnails are rejected as news source images", () => {
  assert.equal(isApprovedSourceImageUrl("https://lh3.googleusercontent.com/example.jpg"), false);
  assert.equal(isApprovedSourceImageUrl("https://publisher.example/article-photo.jpg"), true);
});
