"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getVisitorId() {
  const key = "cowin_visitor_id";
  let value = window.localStorage.getItem(key);
  if (!value) {
    value = `v_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(key, value);
  }
  return value;
}

function getSessionId() {
  const key = "cowin_session_id";
  let value = window.sessionStorage.getItem(key);
  if (!value) {
    value = `s_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    window.sessionStorage.setItem(key, value);
  }
  return value;
}

function parseUtm(searchParams) {
  return {
    source: searchParams.get("utm_source") || "",
    medium: searchParams.get("utm_medium") || "",
    campaign: searchParams.get("utm_campaign") || "",
    term: searchParams.get("utm_term") || "",
    content: searchParams.get("utm_content") || ""
  };
}

function sendAnalyticsEvent(payload) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics/track", blob);
    return;
  }

  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => {});
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPageRef = useRef("");
  const startedAtRef = useRef(Date.now());
  const scrollDepthRef = useRef(new Set());

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const page = `${pathname || "/"}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    const eventBase = {
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      page,
      previousPage: previousPageRef.current,
      pageTitle: document.title,
      referrer: document.referrer,
      utm: parseUtm(searchParams),
      timestamp: new Date().toISOString()
    };

    startedAtRef.current = Date.now();
    scrollDepthRef.current = new Set();
    sendAnalyticsEvent({ ...eventBase, type: "page_view" });
    previousPageRef.current = page;

    const reportDuration = () => {
      sendAnalyticsEvent({
        ...eventBase,
        type: "session_end",
        duration: Math.round((Date.now() - startedAtRef.current) / 1000),
        timestamp: new Date().toISOString()
      });
    };

    window.addEventListener("pagehide", reportDuration);
    return () => window.removeEventListener("pagehide", reportDuration);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return undefined;

    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const depth = Math.round((window.scrollY / scrollable) * 100);
      [25, 50, 75, 100].forEach((milestone) => {
        if (depth >= milestone && !scrollDepthRef.current.has(milestone)) {
          scrollDepthRef.current.add(milestone);
          sendAnalyticsEvent({
            type: "scroll_depth",
            visitorId: getVisitorId(),
            sessionId: getSessionId(),
            page: window.location.pathname,
            pageTitle: document.title,
            scrollDepth: milestone,
            timestamp: new Date().toISOString()
          });
        }
      });
    }

    function handleClick(event) {
      const link = event.target.closest?.("a");
      if (!link?.href) return;
      const targetUrl = new URL(link.href);
      if (targetUrl.origin !== window.location.origin) {
        sendAnalyticsEvent({
          type: "outbound_link_click",
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
          page: window.location.pathname,
          pageTitle: document.title,
          outboundUrl: link.href,
          targetText: link.textContent?.trim().slice(0, 120) || "",
          timestamp: new Date().toISOString()
        });
      }
    }

    function handleSubmit(event) {
      const form = event.target;
      sendAnalyticsEvent({
        type: "form_submit",
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        page: window.location.pathname,
        pageTitle: document.title,
        targetText: form?.getAttribute("aria-label") || form?.className || "form",
        timestamp: new Date().toISOString()
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit, true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit, true);
    };
  }, [pathname]);

  return null;
}
