export function assessNewsContent(post = {}) {
  if (post.status !== "published") {
    return { indexable: false, visibleInListings: false, reason: "not-published" };
  }

  if (post.archived || post.seoIndexable === false) {
    return { indexable: false, visibleInListings: false, reason: "seo-indexing-disabled" };
  }

  return { indexable: true, visibleInListings: true, reason: "published-news" };
}

export function isIndexableNews(post = {}) {
  return assessNewsContent(post).indexable;
}
