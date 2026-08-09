"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { attributionToUtm, buildAttributionState, classifyTraffic } from "@/lib/trafficAttribution";
import { getClientTrackingIdentity } from "@/lib/clientTrackingIdentity";

const firstTouchKey = "traffic_first_touch";
const lastTouchKey = "traffic_last_touch";
const sessionTouchKey = "traffic_session";
const visitorCookieKey = "anonymous_visitor_id";

function readJsonStorage(storage, key) {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeCookie(key, value, maxAgeDays = 90) {
  const encoded = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${key}=${encoded}; Max-Age=${maxAgeDays * 86400}; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
}

function getVisitorId() {
  const { visitorId: value } = getClientTrackingIdentity();
  document.cookie = `${visitorCookieKey}=${encodeURIComponent(value)}; Max-Age=${365 * 86400}; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
  return value;
}

function getSessionId() {
  return getClientTrackingIdentity().sessionId;
}

function getExternalReferrer() {
  if (!document.referrer) return "";
  try {
    const referrerUrl = new URL(document.referrer);
    return referrerUrl.origin === window.location.origin ? "" : document.referrer;
  } catch {
    return "";
  }
}

function getSessionAttribution(searchParams) {
  const currentTouch = classifyTraffic({
    currentUrl: window.location.href,
    search: searchParams?.toString() || window.location.search,
    referrer: getExternalReferrer(),
    locale: document.documentElement.lang || window.location.pathname.split("/").filter(Boolean)[0] || "en"
  });
  const state = buildAttributionState({
    firstTouch: readJsonStorage(window.localStorage, firstTouchKey),
    lastTouch: readJsonStorage(window.localStorage, lastTouchKey),
    sessionTouch: readJsonStorage(window.sessionStorage, sessionTouchKey),
    currentTouch
  });

  window.localStorage.setItem(firstTouchKey, JSON.stringify(state.firstTouch));
  window.localStorage.setItem(lastTouchKey, JSON.stringify(state.lastTouch));
  window.sessionStorage.setItem(sessionTouchKey, JSON.stringify(state.sessionTouch));
  writeCookie(firstTouchKey, state.firstTouch, 365);
  writeCookie(lastTouchKey, state.lastTouch, 90);
  writeCookie(sessionTouchKey, state.sessionTouch, 1);
  window.__cowinAttribution = state;

  return {
    referrer: currentTouch.referrer || state.sessionTouch.referrer || "",
    utm: attributionToUtm(currentTouch),
    attribution: state
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

function trackMetaContact() {
  if (typeof window.fbq !== "function") return;
  window.fbq("track", "Contact");
}

function publicTrackEvent(type, extra = {}) {
  const attribution = window.__cowinAttribution || {
    firstTouch: readJsonStorage(window.localStorage, firstTouchKey),
    lastTouch: readJsonStorage(window.localStorage, lastTouchKey),
    sessionTouch: readJsonStorage(window.sessionStorage, sessionTouchKey)
  };
  sendAnalyticsEvent({
    type,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    page: extra.page || window.location.pathname,
    pageTitle: document.title,
    referrer: attribution?.sessionTouch?.referrer || "",
    utm: attributionToUtm(attribution?.sessionTouch || {}),
    attribution,
    targetText: extra.targetText || "",
    outboundUrl: extra.outboundUrl || "",
    timestamp: new Date().toISOString()
  });
  if (["click_whatsapp", "click_email", "click_phone", "submit_inquiry", "form_success"].includes(type)) {
    trackMetaContact();
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPageRef = useRef("");
  const startedAtRef = useRef(0);
  const scrollDepthRef = useRef(new Set());

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    window.__cowinTrackEvent = publicTrackEvent;

    const page = `${pathname || "/"}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    const attribution = getSessionAttribution(searchParams);
    const eventBase = {
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      page,
      previousPage: previousPageRef.current,
      pageTitle: document.title,
      referrer: attribution.referrer,
      utm: attribution.utm,
      attribution: attribution.attribution,
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
        const lowerHref = link.href.toLowerCase();
        const eventType = lowerHref.includes("wa.me") || lowerHref.includes("whatsapp")
          ? "click_whatsapp"
          : lowerHref.startsWith("mailto:")
            ? "click_email"
            : lowerHref.startsWith("tel:")
              ? "click_phone"
              : "outbound_link_click";
        sendAnalyticsEvent({
          type: eventType,
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
          page: window.location.pathname,
          pageTitle: document.title,
          attribution: window.__cowinAttribution || null,
          outboundUrl: link.href,
          targetText: link.textContent?.trim().slice(0, 120) || "",
          timestamp: new Date().toISOString()
        });
        if (["click_whatsapp", "click_email", "click_phone"].includes(eventType)) {
          trackMetaContact();
        }
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
