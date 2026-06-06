import fs from "node:fs";
import path from "node:path";
import { runWebsiteMonitor } from "../../lib/monitor/index.mjs";

function loadEnvFile(filename) {
  const fullPath = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(fullPath)) return;
  const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1).replace(/\\n/g, "\n");
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const args = new Set(process.argv.slice(2));
const report = await runWebsiteMonitor({
  sendEmail: !args.has("--no-email"),
  saveReports: !args.has("--no-save")
});

console.log(JSON.stringify({
  checkedAtShanghai: report.checkedAtShanghai,
  siteUrl: report.siteUrl,
  health: report.health,
  counts: report.counts,
  pagesChecked: report.summary.pagesChecked,
  abnormalPages: report.summary.abnormalPages,
  reportJson: report.paths.json,
  reportHtml: report.paths.html,
  email: report.notification.email,
  visual: report.visual
}, null, 2));

if (report.counts.P0 > 0) {
  process.exitCode = 2;
} else if (report.counts.P1 > 0) {
  process.exitCode = 1;
}
