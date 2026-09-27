"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

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
  const locale = getLocaleFromPath(usePathname());
  const ui = getPublicUi(locale);
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
    <nav className="product-section-tabs" aria-label={ui.productCenter}>
      {sections.map(([id], index) => <button type="button" aria-pressed={activeId === id} className={activeId === id ? "is-active" : ""} onClick={() => activate(id)} key={id}>{id === "support" && locale !== "en" ? ui.submit : ui.productTabs[index]}</button>)}
    </nav>
  );
}
