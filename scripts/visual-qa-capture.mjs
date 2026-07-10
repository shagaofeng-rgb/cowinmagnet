import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = process.argv.find((arg) => arg.startsWith("--base="))?.slice(7) || "http://localhost:3010";
const outputDir = path.resolve(process.argv.find((arg) => arg.startsWith("--out="))?.slice(6) || "reports/visual-qa/latest");
const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), "cowin-visual-qa-"));

const cases = [
  ["home-320", 320, 800, "/en"],
  ["home-390", 390, 844, "/en"],
  ["home-768", 768, 1024, "/en"],
  ["home-1440", 1440, 1000, "/en"],
  ["products-390", 390, 844, "/en/products"],
  ["product-detail-390", 390, 844, "/en/products/wet-drum-magnetic-separator"],
  ["news-390", 390, 844, "/en/news"],
  ["quote-390", 390, 844, "/en/request-quote"],
  ["arabic-390", 390, 844, "/ar"]
];

const browser = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-sync",
    "--no-first-run",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "about:blank"
  ],
  { stdio: "ignore" }
);

async function waitForActivePort() {
  const file = path.join(userDataDir, "DevToolsActivePort");
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const [port] = (await fs.readFile(file, "utf8")).split(/\r?\n/);
      if (port) return Number(port);
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("Chrome DevTools port was not created");
}

class CdpSession {
  constructor(webSocketUrl) {
    this.socket = new WebSocket(webSocketUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      this.events.push(message);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  close() {
    this.socket.close();
  }
}

const port = await waitForActivePort();
await fs.mkdir(outputDir, { recursive: true });
const reports = [];

try {
  for (const [name, width, height, route] of cases) {
    const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
    const target = await targetResponse.json();
    const cdp = new CdpSession(target.webSocketDebuggerUrl);
    await cdp.open();
    await Promise.all([cdp.send("Page.enable"), cdp.send("Runtime.enable"), cdp.send("Network.enable"), cdp.send("Log.enable")]);
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width <= 430,
      screenWidth: width,
      screenHeight: height
    });
    if (width <= 430) {
      await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
      await cdp.send("Network.setUserAgentOverride", {
        userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/140.0.0.0 Mobile Safari/537.36"
      });
    }
    await cdp.send("Page.navigate", { url: `${baseUrl}${route}` });
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const evaluation = await cdp.send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const root = document.documentElement;
        const viewportWidth = root.clientWidth;
        const overflowElements = [...document.querySelectorAll('body *')].filter((element) => {
          if (element.closest('.form-honeypot')) return false;
          const style = getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && (rect.left < -1 || rect.right > viewportWidth + 1);
        }).slice(0, 20).map((element) => ({
          tag: element.tagName.toLowerCase(),
          className: String(element.className || '').slice(0, 120),
          left: Math.round(element.getBoundingClientRect().left),
          right: Math.round(element.getBoundingClientRect().right),
          width: Math.round(element.getBoundingClientRect().width)
        }));
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          url: location.href,
          title: document.title,
          lang: root.lang,
          dir: root.dir || document.body.dir || 'ltr',
          contentLang: document.querySelector('.locale-shell')?.getAttribute('lang') || root.lang,
          contentDir: document.querySelector('.locale-shell')?.getAttribute('dir') || root.dir || document.body.dir || 'ltr',
          viewportWidth,
          viewportHeight: root.clientHeight,
          scrollWidth: root.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          overflowElements,
          h1Count: document.querySelectorAll('h1').length,
          canonical: document.querySelector('link[rel="canonical"]')?.href || '',
          hreflangCount: document.querySelectorAll('link[rel="alternate"][hreflang]').length,
          brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src).slice(0, 20),
          formCount: document.forms.length,
          fontStatus: document.fonts?.status || 'unknown',
          domContentLoadedMs: navigation ? Math.round(navigation.domContentLoadedEventEnd) : null,
          loadMs: navigation ? Math.round(navigation.loadEventEnd) : null
        };
      })()`
    });
    let mobileMenu = null;
    if (width <= 900) {
      await cdp.send("Runtime.evaluate", { expression: "document.querySelector('.mobile-nav-toggle')?.click()" });
      await new Promise((resolve) => setTimeout(resolve, 100));
      const opened = await cdp.send("Runtime.evaluate", {
        returnByValue: true,
        expression: "(() => { const menu = document.querySelector('#mobile-site-navigation'); return { expanded: document.querySelector('.mobile-nav-toggle')?.getAttribute('aria-expanded'), visible: Boolean(menu && menu.getClientRects().length && getComputedStyle(menu).visibility !== 'hidden') }; })()"
      });
      await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
      await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
      await new Promise((resolve) => setTimeout(resolve, 100));
      const closed = await cdp.send("Runtime.evaluate", {
        returnByValue: true,
        expression: "(() => { const menu = document.querySelector('#mobile-site-navigation'); return { expanded: document.querySelector('.mobile-nav-toggle')?.getAttribute('aria-expanded'), visible: Boolean(menu && menu.getClientRects().length && getComputedStyle(menu).visibility !== 'hidden') }; })()"
      });
      mobileMenu = { opened: opened.result.value, closed: closed.result.value };
    }
    const screenshot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
    const screenshotPath = path.join(outputDir, `${name}.png`);
    await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));

    const consoleErrors = cdp.events
      .filter((event) => event.method === "Runtime.exceptionThrown" || (event.method === "Log.entryAdded" && event.params?.entry?.level === "error"))
      .map((event) => event.params?.exceptionDetails?.text || event.params?.entry?.text || event.method)
      .slice(0, 20);
    const failedRequests = cdp.events
      .filter((event) => event.method === "Network.loadingFailed" && !event.params?.canceled)
      .map((event) => event.params?.errorText || "network-failed")
      .slice(0, 20);

    reports.push({ name, width, height, route, screenshotPath, ...evaluation.result.value, mobileMenu, consoleErrors, failedRequests });
    cdp.close();
    await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {});
  }
  await fs.writeFile(path.join(outputDir, "report.json"), `${JSON.stringify(reports, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(reports, null, 2));
} finally {
  browser.kill();
  await fs.rm(userDataDir, { recursive: true, force: true }).catch(() => {});
}
