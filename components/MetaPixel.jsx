"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

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
  const didMount = useRef(false);
  const validPixelId = /^\d+$/.test(String(pixelId || "")) ? String(pixelId) : "";

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!validPixelId || !didMount.current) {
      didMount.current = true;
      return;
    }
    if (typeof window.fbq === "function") window.fbq("track", "PageView");
  }, [pathname, searchParams, validPixelId]);

  if (!validPixelId) return null;

  return (
    <>
      <Script id="cowin-meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${validPixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${validPixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
