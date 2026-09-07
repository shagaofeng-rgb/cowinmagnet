"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const sections = [
  ["overview", "Overview"],
  ["selection", "Selection"],
  ["applications", "Applications"],
  ["technical", "Technical data"],
  ["support", "FAQ & quote"]
] as const;

type SectionId = (typeof sections)[number][0];

function isSectionId(value: string | null): value is SectionId {
  return sections.some(([id]) => id === value);
}

function readSectionFromUrl(): SectionId {
  const requested = new URLSearchParams(window.location.search).get("section");
  return isSectionId(requested) ? requested : "overview";
}

function subscribeToHistory(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

export function ProductDetailSectionTabs() {
  const urlSection = useSyncExternalStore(subscribeToHistory, readSectionFromUrl, () => "overview");
  const [selectedId, setSelectedId] = useState<SectionId | null>(null);
  const activeId = selectedId || urlSection;

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-product-panel]").forEach((element) => {
      element.hidden = element.dataset.productPanel !== activeId;
    });
  }, [activeId]);

  function activate(id: SectionId) {
    setSelectedId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("section", id);
    window.history.replaceState({}, "", url);
  }

  return (
    <nav className="product-section-tabs" aria-label="Product information sections">
      {sections.map(([id, label]) => <button type="button" aria-pressed={activeId === id} className={activeId === id ? "is-active" : ""} onClick={() => activate(id)} key={id}>{label}</button>)}
    </nav>
  );
}
