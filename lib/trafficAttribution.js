export const ATTRIBUTION_WINDOWS = {
  firstTouchDays: Number(process.env.ANALYTICS_FIRST_TOUCH_EXPIRY_DAYS || 365),
  lastTouchDays: Number(process.env.ANALYTICS_LAST_TOUCH_EXPIRY_DAYS || 90),
  sessionMinutes: Number(process.env.ANALYTICS_SESSION_EXPIRY_MINUTES || 30),
  directOverwritesLastTouch: String(process.env.ANALYTICS_DIRECT_OVERWRITES_LAST_TOUCH || "false") === "true"
};

export const CLICK_ID_RULES = [
  { key: "gclid", source: "google_ads", platform: "Google Ads", channel: "paid_search" },
  { key: "gbraid", source: "google_ads", platform: "Google Ads", channel: "paid_search" },
  { key: "wbraid", source: "google_ads", platform: "Google Ads", channel: "paid_search" },
  { key: "fbclid", source: "meta", platform: "Meta Ads", channel: "paid_social" },
  { key: "ttclid", source: "tiktok_ads", platform: "TikTok Ads", channel: "paid_social" },
  { key: "li_fat_id", source: "linkedin_ads", platform: "LinkedIn Ads", channel: "paid_social" },
  { key: "msclkid", source: "microsoft_ads", platform: "Microsoft Ads", channel: "paid_search" },
  { key: "twclid", source: "x_ads", platform: "X Ads", channel: "paid_social" },
  { key: "epik", source: "pinterest_ads", platform: "Pinterest Ads", channel: "paid_social" }
];

const REFERRER_RULES = [
  { pattern: /(^|\.)facebook\.com$|(^|\.)fb\.com$/i, source: "facebook", platform: "Facebook", channel: "organic_social" },
  { pattern: /(^|\.)instagram\.com$/i, source: "instagram", platform: "Instagram", channel: "organic_social" },
  { pattern: /(^|\.)tiktok\.com$/i, source: "tiktok", platform: "TikTok", channel: "organic_social" },
  { pattern: /(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/i, source: "linkedin", platform: "LinkedIn", channel: "organic_social" },
  { pattern: /(^|\.)youtube\.com$|(^|\.)youtu\.be$/i, source: "youtube", platform: "YouTube", channel: "organic_social" },
  { pattern: /(^|\.)x\.com$|(^|\.)twitter\.com$|(^|\.)t\.co$/i, source: "x", platform: "X / Twitter", channel: "organic_social" },
  { pattern: /(^|\.)pinterest\.com$|(^|\.)pin\.it$/i, source: "pinterest", platform: "Pinterest", channel: "organic_social" },
  { pattern: /(^|\.)reddit\.com$/i, source: "reddit", platform: "Reddit", channel: "organic_social" },
  { pattern: /(^|\.)whatsapp\.com$|(^|\.)wa\.me$/i, source: "whatsapp", platform: "WhatsApp", channel: "organic_social" },
  { pattern: /(^|\.)telegram\.org$|(^|\.)t\.me$/i, source: "telegram", platform: "Telegram", channel: "organic_social" },
  { pattern: /(^|\.)google\./i, source: "google", platform: "Google", channel: "organic_search" },
  { pattern: /(^|\.)bing\.com$/i, source: "bing", platform: "Bing", channel: "organic_search" },
  { pattern: /(^|\.)yahoo\./i, source: "yahoo", platform: "Yahoo", channel: "organic_search" },
  { pattern: /(^|\.)baidu\.com$/i, source: "baidu", platform: "Baidu", channel: "organic_search" },
  { pattern: /(^|\.)yandex\./i, source: "yandex", platform: "Yandex", channel: "organic_search" },
  { pattern: /(^|\.)duckduckgo\.com$/i, source: "duckduckgo", platform: "DuckDuckGo", channel: "organic_search" },
  { pattern: /(^|\.)naver\.com$/i, source: "naver", platform: "Naver", channel: "organic_search" },
  { pattern: /(^|\.)sogou\.com$/i, source: "sogou", platform: "Sogou", channel: "organic_search" }
];

function trim(value, max = 200) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, max);
}

export function hostFromUrl(value = "") {
  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

export function parseTrafficParams(search = "") {
  const params = search instanceof URLSearchParams ? search : new URLSearchParams(String(search || "").replace(/^\?/, ""));
  const clickRule = CLICK_ID_RULES.find((rule) => params.get(rule.key));
  return {
    utm: {
      source: trim(params.get("utm_source"), 100),
      medium: trim(params.get("utm_medium"), 100),
      campaign: trim(params.get("utm_campaign"), 200),
      term: trim(params.get("utm_term"), 200),
      content: trim(params.get("utm_content"), 200),
      id: trim(params.get("utm_id"), 120)
    },
    clickId: clickRule ? trim(params.get(clickRule.key), 220) : "",
    clickIdType: clickRule?.key || "",
    clickRule
  };
}

function channelFromUtm(source, medium) {
  const src = source.toLowerCase();
  const med = medium.toLowerCase();
  if (/email|newsletter/.test(med) || /email|newsletter/.test(src)) return "email";
  if (/affiliate/.test(med)) return "affiliate";
  if (/display|banner|programmatic/.test(med)) return "display";
  if (/cpc|ppc|paid_search|sem/.test(med)) return "paid_search";
  if (/paid_social|paidsocial|social_paid/.test(med)) return "paid_social";
  if (/social/.test(med)) return "organic_social";
  if (/organic/.test(med)) return "organic_search";
  return medium || "campaign";
}

function platformFromSource(source) {
  const src = source.toLowerCase();
  if (/google_ads|adwords/.test(src)) return "Google Ads";
  if (/google/.test(src)) return "Google";
  if (/facebook/.test(src)) return "Facebook";
  if (/instagram/.test(src)) return "Instagram";
  if (/meta/.test(src)) return "Meta Ads";
  if (/tiktok/.test(src)) return "TikTok";
  if (/linkedin/.test(src)) return "LinkedIn";
  if (/youtube/.test(src)) return "YouTube";
  if (/bing|microsoft/.test(src)) return /ads/.test(src) ? "Microsoft Ads" : "Bing";
  if (/twitter|x\.com|\bx\b/.test(src)) return "X / Twitter";
  if (/pinterest/.test(src)) return "Pinterest";
  if (/whatsapp/.test(src)) return "WhatsApp";
  if (/email|newsletter/.test(src)) return "Email";
  return source || "Unknown";
}

export function classifyTraffic({ currentUrl = "", referrer = "", search = "", countryCode = "", locale = "" } = {}) {
  const url = currentUrl ? new URL(currentUrl, "https://cowinmagnet.com") : null;
  const params = parseTrafficParams(search || url?.search || "");
  const referrerDomain = hostFromUrl(referrer);
  const now = new Date().toISOString();

  if (params.utm.source || params.utm.medium || params.utm.campaign) {
    const source = params.utm.source || params.clickRule?.source || "campaign";
    const channel = channelFromUtm(source, params.utm.medium);
    return {
      source,
      medium: params.utm.medium || channel,
      channel,
      platform: platformFromSource(source),
      campaign: params.utm.campaign,
      term: params.utm.term,
      content: params.utm.content,
      utmId: params.utm.id,
      clickId: params.clickId,
      clickIdType: params.clickIdType,
      referrer: trim(referrer, 300),
      referrerDomain,
      landingPage: trim(url ? `${url.pathname}${url.search}` : "", 300),
      currentUrl: trim(currentUrl, 500),
      hostname: trim(url?.hostname || "", 120),
      locale: trim(locale, 20),
      countryCode: trim(countryCode, 8),
      createdAt: now,
      isDirect: false
    };
  }

  if (params.clickRule) {
    return {
      source: params.clickRule.source,
      medium: params.clickRule.channel,
      channel: params.clickRule.channel,
      platform: params.clickRule.platform,
      campaign: "",
      term: "",
      content: "",
      utmId: "",
      clickId: params.clickId,
      clickIdType: params.clickIdType,
      referrer: trim(referrer, 300),
      referrerDomain,
      landingPage: trim(url ? `${url.pathname}${url.search}` : "", 300),
      currentUrl: trim(currentUrl, 500),
      hostname: trim(url?.hostname || "", 120),
      locale: trim(locale, 20),
      countryCode: trim(countryCode, 8),
      createdAt: now,
      isDirect: false
    };
  }

  const referrerRule = REFERRER_RULES.find((rule) => rule.pattern.test(referrerDomain));
  if (referrerRule) {
    return {
      source: referrerRule.source,
      medium: referrerRule.channel,
      channel: referrerRule.channel,
      platform: referrerRule.platform,
      campaign: "",
      term: "",
      content: "",
      utmId: "",
      clickId: "",
      clickIdType: "",
      referrer: trim(referrer, 300),
      referrerDomain,
      landingPage: trim(url ? `${url.pathname}${url.search}` : "", 300),
      currentUrl: trim(currentUrl, 500),
      hostname: trim(url?.hostname || "", 120),
      locale: trim(locale, 20),
      countryCode: trim(countryCode, 8),
      createdAt: now,
      isDirect: false
    };
  }

  if (referrerDomain) {
    return {
      source: "referral",
      medium: "referral",
      channel: "referral",
      platform: referrerDomain,
      campaign: "",
      term: "",
      content: "",
      utmId: "",
      clickId: "",
      clickIdType: "",
      referrer: trim(referrer, 300),
      referrerDomain,
      landingPage: trim(url ? `${url.pathname}${url.search}` : "", 300),
      currentUrl: trim(currentUrl, 500),
      hostname: trim(url?.hostname || "", 120),
      locale: trim(locale, 20),
      countryCode: trim(countryCode, 8),
      createdAt: now,
      isDirect: false
    };
  }

  return {
    source: "direct",
    medium: "direct",
    channel: "direct",
    platform: "Direct",
    campaign: "",
    term: "",
    content: "",
    utmId: "",
    clickId: "",
    clickIdType: "",
    referrer: "",
    referrerDomain: "",
    landingPage: trim(url ? `${url.pathname}${url.search}` : "", 300),
    currentUrl: trim(currentUrl, 500),
    hostname: trim(url?.hostname || "", 120),
    locale: trim(locale, 20),
    countryCode: trim(countryCode, 8),
    createdAt: now,
    isDirect: true
  };
}

export function buildAttributionState({ firstTouch, lastTouch, sessionTouch, currentTouch }) {
  const first = firstTouch?.source ? firstTouch : currentTouch;
  const shouldOverwriteLast = !lastTouch?.source || !currentTouch.isDirect || ATTRIBUTION_WINDOWS.directOverwritesLastTouch;
  const last = shouldOverwriteLast ? currentTouch : lastTouch;
  return { firstTouch: first, lastTouch: last, sessionTouch: sessionTouch?.source ? sessionTouch : currentTouch };
}

export function attributionToUtm(touch = {}) {
  return {
    source: touch.source || "",
    medium: touch.medium || "",
    campaign: touch.campaign || "",
    term: touch.term || "",
    content: touch.content || "",
    id: touch.utmId || ""
  };
}
