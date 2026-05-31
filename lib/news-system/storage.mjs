import fs from "node:fs/promises";
import path from "node:path";
import { toMarkdown } from "./exporters.mjs";

const root = () => path.join(process.cwd(), "data", "news-opportunities");

async function ensureRoot() {
  await fs.mkdir(root(), { recursive: true });
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export async function saveDailyRun(run) {
  await ensureRoot();
  const base = path.join(root(), run.date);
  await fs.writeFile(`${base}.json`, JSON.stringify(run, null, 2), "utf8");
  await fs.writeFile(`${base}.md`, toMarkdown(run), "utf8");
  return { jsonPath: `${base}.json`, markdownPath: `${base}.md` };
}

export async function readDailyRun(date) {
  const file = path.join(root(), `${date}.json`);
  const content = await fs.readFile(file, "utf8");
  return JSON.parse(content);
}

export async function listDailyRuns() {
  await ensureRoot();
  const files = await fs.readdir(root());
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""))
    .sort()
    .reverse();
}
