const LEGACY_TEMPLATE_MARKERS = [
  "Why It Matters",
  "Industry Perspective",
  "Brand/Product Connection",
  "Buyer Questions",
  "This article is not a repost",
  "Cowinmagnet reviews"
];

function needsLegacyNewsReview(post) {
  if (post.contentOrigin === "news-automation" || post.contentOrigin === "manual") return false;
  const content = String(post.content || "");
  return LEGACY_TEMPLATE_MARKERS.filter((marker) => content.includes(marker)).length >= 2;
}

export function assessNewsContent(post = {}) {
  if (post.status !== "published" || post.articleDocument?.status === "needs_revision") {
    return { indexable: false, visibleInListings: false, reason: "not-published" };
  }

  if (post.archived || post.seoIndexable === false) {
    return { indexable: false, visibleInListings: false, reason: "seo-indexing-disabled" };
  }

  if (needsLegacyNewsReview(post)) {
    return { indexable: false, visibleInListings: false, reason: "legacy-template-needs-review" };
  }

  return { indexable: true, visibleInListings: true, reason: "published-news" };
}

export function isIndexableNews(post = {}) {
  return assessNewsContent(post).indexable;
}
