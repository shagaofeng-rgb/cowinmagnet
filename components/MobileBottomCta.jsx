"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import socialLinks from "@/data/socialLinks.json";
import { withLocale } from "@/data/i18n";

const storageKey = "cowin_quote_products";

export default function MobileBottomCta({ locale = "en" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function readCount() {
      try {
        const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
        setCount(Array.isArray(items) ? items.length : 0);
      } catch {
        setCount(0);
      }
    }

    function addProduct(event) {
      const slug = event.detail;
      if (!slug) return;
      try {
        const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const nextItems = Array.from(new Set([...(Array.isArray(items) ? items : []), slug]));
        localStorage.setItem(storageKey, JSON.stringify(nextItems));
        setCount(nextItems.length);
      } catch {
        setCount(1);
      }
    }

    readCount();
    window.addEventListener("storage", readCount);
    window.addEventListener("cowin:add-quote-product", addProduct);

    return () => {
      window.removeEventListener("storage", readCount);
      window.removeEventListener("cowin:add-quote-product", addProduct);
    };
  }, []);

  return (
    <div className="mobile-bottom-cta" aria-label="Quick contact actions">
      <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer nofollow">
        WhatsApp
      </a>
      <Link href={withLocale(locale, "/inquiry")}>
        Request Quote{count ? ` (${count})` : ""}
      </Link>
    </div>
  );
}
