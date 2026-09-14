"use client";

import { useEffect } from "react";

export function MetaProductView({ name, category, slug }) {
  useEffect(() => {
    window.__cowinMetaTrack?.("ViewContent", {
      content_name: name,
      content_category: category,
      content_ids: [slug],
      content_type: "product"
    });
  }, [name, category, slug]);

  return null;
}
