"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getDirection, getLocaleFromPath, localizeHref } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";
import { getMarketingCopy, marketingConsentCookie, marketingPreferenceEvent } from "@/lib/marketingConsent";

const consentChanged = "cowin-marketing-choice";

function subscribeToChoice(listener) {
  window.addEventListener(consentChanged, listener);
  return () => window.removeEventListener(consentChanged, listener);
}

function createEventId(prefix = "evt") {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readCookie(name) {
  const prefix = `${name}=`;
  return document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(prefix))?.slice(prefix.length) || "";
}

function facebookClickCookie() {
  const existing = readCookie("_fbc");
  if (existing) return existing;
  const clickId = new URLSearchParams(window.location.search).get("fbclid");
  return clickId ? `fb.1.${Date.now()}.${clickId}` : "";
}

function sendServerContactEvent({ eventId, contentName, contentCategory }) {
  const body = JSON.stringify({
    eventName: "Contact",
    eventId,
    eventSourceUrl: window.location.href,
    contentName,
    contentCategory,
    fbp: readCookie("_fbp"),
    fbc: facebookClickCookie()
  });
  fetch("/api/meta/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => {});
}

export default function MetaPixel({ pixelId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = getLocaleFromPath(pathname);
  const ui = getPublicUi(locale);
  const [title, description, allowLabel, declineLabel] = getMarketingCopy(locale);
  const [editing, setEditing] = useState(false);
  const choice = useSyncExternalStore(subscribeToChoice, () => readCookie(marketingConsentCookie), () => null);
  const lastView = useRef("");
  const pixelIdValue = String(pixelId || "");
  const canShow = /^\d+$/.test(pixelIdValue) && !pathname.startsWith("/admin");
  const enabled = canShow && choice === "allow";
  const pageKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    if (!canShow) return undefined;
    function openPreferences() { setEditing(true); }
    window.addEventListener(marketingPreferenceEvent, openPreferences);
    return () => window.removeEventListener(marketingPreferenceEvent, openPreferences);
  }, [canShow]);

  function choose(nextChoice) {
    document.cookie = `${marketingConsentCookie}=${nextChoice}; path=/; max-age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    if (typeof window.fbq === "function") window.fbq("consent", nextChoice === "allow" ? "grant" : "revoke");
    if (nextChoice === "decline") {
      lastView.current = "";
      for (const cookie of ["_fbp", "_fbc"]) document.cookie = `${cookie}=; path=/; max-age=0; SameSite=Lax`;
    }
    window.dispatchEvent(new Event(consentChanged));
    setEditing(false);
  }

  useEffect(() => {
    if (!enabled) return undefined;
    window.__cowinMetaCreateEventId = createEventId;
    window.__cowinMetaBrowserIds = () => ({ fbp: readCookie("_fbp"), fbc: facebookClickCookie() });
    window.__cowinMetaTrack = (eventName, customData = {}, options = {}) => {
      const eventId = options.eventId || createEventId(String(eventName || "evt").toLowerCase());
      if (typeof window.fbq === "function") window.fbq("track", eventName, customData, { eventID: eventId });
      if (options.sendServer && eventName === "Contact") {
        sendServerContactEvent({
          eventId,
          contentName: String(customData.content_name || "Contact intent"),
          contentCategory: String(customData.content_category || "Website contact")
        });
      }
      return eventId;
    };
    return () => {
      delete window.__cowinMetaCreateEventId;
      delete window.__cowinMetaBrowserIds;
      delete window.__cowinMetaTrack;
    };
  }, [enabled]);

  const trackPage = useCallback(() => {
    if (!enabled || typeof window.fbq !== "function" || lastView.current === pageKey) return;
    lastView.current = pageKey;
    window.fbq("track", "PageView");
  }, [enabled, pageKey]);

  useEffect(trackPage, [trackPage]);

  if (!canShow) return null;

  return (
    <>
      {(editing || choice === "") && (
        <aside className="marketing-preferences" dir={getDirection(locale)} aria-labelledby="marketing-title">
          <strong id="marketing-title">{title}</strong>
          <p>{description} <Link href={localizeHref("/privacy-policy", locale)}>{ui.privacy}</Link></p>
          <div>
            <button type="button" onClick={() => choose("allow")}>{allowLabel}</button>
            <button type="button" onClick={() => choose("decline")}>{declineLabel}</button>
          </div>
        </aside>
      )}
      {enabled && <Script id="cowin-meta-pixel" strategy="afterInteractive" onReady={trackPage}>
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelIdValue}');
        `}
      </Script>}
    </>
  );
}
