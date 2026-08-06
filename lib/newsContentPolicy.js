const TEMPLATE_MARKERS = [
  "cowinmagnet reviews",
  "why it matters",
  "industry perspective",
  "brand/product connection",
  "buyer questions",
  "this article is not a repost"
];

const OFF_TOPIC_MARKERS = [
  "listeria",
  "food recall",
  "pasta recall",
  "chicken recall",
  "cocaine",
  "chief executive",
  "ceo appointment",
  "quarterly earnings"
];

function normalizedText(post = {}) {
  return [
    post.title,
    post.excerpt,
    post.content,
    ...(post.sections || []).map((section) => `${section?.heading || ""} ${section?.body || ""}`)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function assessNewsContent(post = {}) {
  const text = normalizedText(post);
  const templateHits = TEMPLATE_MARKERS.filter((marker) => text.includes(marker));
  const offTopicHits = OFF_TOPIC_MARKERS.filter((marker) => text.includes(marker));
  const automated = Boolean(post.automation || post.contentOrigin === "automated-news-collection");
  const editoriallyApproved = post.editorialStatus === "approved" && Boolean(post.technicalReviewer);

  if (post.status !== "published") {
    return { indexable: false, visibleInListings: false, reason: "not-published", automated, templateHits, offTopicHits };
  }

  if (post.seoIndexable === false) {
    return { indexable: false, visibleInListings: false, reason: "seo-indexing-disabled", automated, templateHits, offTopicHits };
  }

  if (automated && !editoriallyApproved) {
    return { indexable: false, visibleInListings: false, reason: "awaiting-editorial-review", automated, templateHits, offTopicHits };
  }

  if (templateHits.length >= 2 || offTopicHits.length > 0) {
    return {
      indexable: false,
      visibleInListings: false,
      reason: offTopicHits.length ? "off-topic-or-low-value" : "template-like-content",
      automated,
      templateHits,
      offTopicHits
    };
  }

  return { indexable: true, visibleInListings: true, reason: "editorially-eligible", automated, templateHits, offTopicHits };
}

export function isIndexableNews(post = {}) {
  return assessNewsContent(post).indexable;
}
