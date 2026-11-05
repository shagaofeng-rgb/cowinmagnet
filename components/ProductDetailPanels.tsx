"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { BookOpen, ClipboardList, FileQuestion, Settings2, Workflow } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

const sections = [
  ["overview", BookOpen],
  ["selection", Settings2],
  ["applications", Workflow],
  ["technical", ClipboardList],
  ["support", FileQuestion]
] as const;
type SectionId = (typeof sections)[number][0];
const panelEvent = "cowin-product-section";

function readSectionFromUrl(): SectionId {
  const requested = new URLSearchParams(window.location.search).get("section");
  return sections.find(([id]) => id === requested)?.[0] || "overview";
}

function subscribeToHistory(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(panelEvent, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(panelEvent, callback);
  };
}

export function ProductDetailSectionTabs() {
  const pathname = usePathname();
  const ui = getPublicUi(getLocaleFromPath(pathname));
  const activeId = useSyncExternalStore(subscribeToHistory, readSectionFromUrl, () => "overview");
  const controls = useRef<HTMLElement>(null);

  useEffect(() => {
    const workspace = controls.current?.closest(".product-detail-workspace");
    workspace?.querySelectorAll<HTMLElement>("[data-product-panel]").forEach((element) => {
      element.hidden = element.dataset.productPanel !== activeId;
    });
  }, [activeId, pathname]);

  function activate(id: SectionId) {
    const url = new URL(window.location.href);
    if (id === activeId) return;
    if (id === "overview") url.searchParams.delete("section");
    else url.searchParams.set("section", id);
    url.hash = "";
    window.history.pushState(null, "", url);
    window.dispatchEvent(new Event(panelEvent));
  }

  return <nav ref={controls} className="product-section-tabs" aria-label={ui.productCenter}>
    {sections.map(([id, Icon], index) => <button type="button" aria-pressed={activeId === id} className={activeId === id ? "is-active" : ""} onClick={() => activate(id)} key={id}><Icon size={17} aria-hidden />{ui.productTabs[index]}</button>)}
  </nav>;
}
