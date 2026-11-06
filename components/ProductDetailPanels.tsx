"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { BookOpen, ClipboardList, FileQuestion, Settings2, Workflow } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";
import { getProductSection, productSections, type ProductSection } from "@/lib/productSections";

const icons = [BookOpen, Settings2, Workflow, ClipboardList, FileQuestion];
const panelEvent = "cowin-product-section";

function readSectionFromUrl() {
  return getProductSection(new URLSearchParams(window.location.search).get("section"));
}

function subscribeToHistory(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(panelEvent, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(panelEvent, callback);
  };
}

export function ProductDetailSectionTabs({ initialSection }: { initialSection: ProductSection }) {
  const pathname = usePathname();
  const ui = getPublicUi(getLocaleFromPath(pathname));
  const activeId = useSyncExternalStore(subscribeToHistory, readSectionFromUrl, () => initialSection);
  const controls = useRef<HTMLElement>(null);

  useEffect(() => {
    const workspace = controls.current?.closest(".product-detail-workspace");
    workspace?.querySelectorAll<HTMLElement>("[data-product-panel]").forEach((element) => {
      element.hidden = element.dataset.productPanel !== activeId;
    });
  }, [activeId, pathname]);

  function activate(id: ProductSection) {
    const url = new URL(window.location.href);
    if (id === activeId) return;
    if (id === "overview") url.searchParams.delete("section");
    else url.searchParams.set("section", id);
    url.hash = "";
    window.history.pushState(null, "", url);
    window.dispatchEvent(new Event(panelEvent));
  }

  return <nav ref={controls} id="product-sections" className="product-section-tabs" aria-label={ui.productCenter}>
    {productSections.map((id, index) => {
      const Icon = icons[index];
      return (
        <a
          key={id}
          href={id === "overview" ? pathname : `${pathname}?section=${id}#product-sections`}
          aria-current={activeId === id ? "location" : undefined}
          className={activeId === id ? "is-active" : ""}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            activate(id);
          }}
        >
          <Icon size={17} aria-hidden />
          {ui.productTabs[index]}
        </a>
      );
    })}
  </nav>;
}
