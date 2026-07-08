const DEFAULT_SITE_URL = "https://www.cowinmagnet.com";
const DEFAULT_RECIPIENT = "davidsha@cowinmagnet.com";

function boolEnv(name, fallback) {
  const value = process.env[name];
  if (value == null || value === "") return fallback;
  return !["0", "false", "no", "off"].includes(String(value).toLowerCase());
}

function numberEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function listEnv(name, fallback) {
  const value = process.env[name];
  if (!value) return fallback;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeSiteUrl(value = DEFAULT_SITE_URL) {
  return String(value || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

export function resolveMonitorConfig(overrides = {}) {
  const siteUrl = normalizeSiteUrl(overrides.siteUrl || process.env.MONITOR_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL);
  const reportRoot = process.env.VERCEL ? "/tmp/cowinmagnet-monitor" : "reports/website-monitor";

  return {
    siteUrl,
    timezone: "Asia/Shanghai",
    scheduleBeijing: ["09:00", "21:00"],
    scheduleUtc: "0 1,13 * * *",
    emailRecipients: listEnv("MONITOR_EMAIL_TO", [DEFAULT_RECIPIENT]),
    webhookUrl: process.env.MONITOR_WEBHOOK_URL || "",
    reportOutputDir: overrides.reportOutputDir || process.env.MONITOR_REPORT_DIR || reportRoot,
    screenshotOutputDir: overrides.screenshotOutputDir || process.env.MONITOR_SCREENSHOT_DIR || `${reportRoot}/screenshots`,
    timeoutMs: numberEnv("MONITOR_TIMEOUT_MS", 18000),
    maxPages: numberEnv("MONITOR_MAX_PAGES", 36),
    maxSitemapUrls: numberEnv("MONITOR_MAX_SITEMAP_URLS", 28),
    maxResourcesPerPage: numberEnv("MONITOR_MAX_RESOURCES_PER_PAGE", 45),
    saveReports: overrides.saveReports ?? boolEnv("MONITOR_SAVE_REPORTS", true),
    sendEmail: overrides.sendEmail ?? boolEnv("MONITOR_SEND_EMAIL", true),
    enablePlaywright: overrides.enablePlaywright ?? boolEnv("MONITOR_ENABLE_PLAYWRIGHT", true),
    testFormEnabled: boolEnv("MONITOR_TEST_FORM_ENABLED", false),
    performanceThresholds: {
      pageResponseMs: numberEnv("MONITOR_PAGE_RESPONSE_WARN_MS", 5000),
      resourceResponseMs: numberEnv("MONITOR_RESOURCE_RESPONSE_WARN_MS", 5000),
      imageBytes: numberEnv("MONITOR_LARGE_IMAGE_BYTES", 1024 * 1024),
      scriptBytes: numberEnv("MONITOR_LARGE_JS_BYTES", 500 * 1024),
      totalPageBytes: numberEnv("MONITOR_TOTAL_PAGE_BYTES_WARN", 5 * 1024 * 1024)
    },
    viewports: [
      { name: "desktop-1920", width: 1920, height: 1080 },
      { name: "desktop-1440", width: 1440, height: 900 },
      { name: "desktop-1366", width: 1366, height: 768 },
      { name: "mobile-430", width: 430, height: 932 },
      { name: "mobile-390", width: 390, height: 844 },
      { name: "mobile-375", width: 375, height: 812 },
      { name: "mobile-360", width: 360, height: 800 }
    ],
    pagesToCheck: [
      { label: "Home", path: "/" },
      { label: "Products", path: "/products" },
      { label: "Product detail", path: "/products/suspended-permanent-magnetic-separator" },
      { label: "Applications", path: "/applications" },
      { label: "Application detail", path: "/applications/recycling" },
      { label: "Industries", path: "/industries" },
      { label: "Blog", path: "/blog" },
      { label: "Blog detail", path: "/blog/how-to-choose-overband-magnetic-separator" },
      { label: "News", path: "/news" },
      { label: "Search", path: "/search?q=magnetic%20separator" },
      { label: "About", path: "/about" },
      { label: "Contact", path: "/contact" },
      { label: "Quote", path: "/request-quote" },
      { label: "Privacy policy", path: "/privacy-policy" },
      { label: "Terms", path: "/terms" },
      { label: "English home", path: "/en" },
      { label: "English search", path: "/en/search?q=overband%20magnet" },
      { label: "Spanish products", path: "/es/products" },
      { label: "French contact", path: "/fr/contact" },
      { label: "Portuguese applications", path: "/pt/applications" },
      { label: "Russian blog", path: "/ru/blog" },
      { label: "Arabic home", path: "/ar" }
    ],
    apiEndpointsToCheck: [
      { label: "Analytics health API", path: "/api/analytics/health", expectJson: true },
      { label: "News opportunities API", path: "/api/news-opportunities", expectJson: true },
      { label: "robots.txt", path: "/robots.txt", expectJson: false },
      { label: "sitemap.xml", path: "/sitemap.xml", expectJson: false }
    ],
    testFormData: {
      name: "Website Monitor Test",
      email: "monitor-test@example.com",
      phone: "+10000000000",
      country: "Monitor",
      message: "This is an automated website monitoring test. Please ignore.",
      consent: true
    }
  };
}
