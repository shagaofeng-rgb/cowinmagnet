import fs from "node:fs";

const required = [
  "app",
  "components",
  "data",
  "lib",
  "scripts/final-audit-smoke.mjs",
  "scripts/monitor/run-monitor.mjs",
  "vercel.json"
];

const missing = required.filter((path) => !fs.existsSync(path));
console.log(JSON.stringify({ ok: missing.length === 0, missing }, null, 2));
if (missing.length) process.exitCode = 1;
