import fs from "node:fs/promises";
import path from "node:path";
import { toMarkdown } from "./exporters.mjs";

const runtimeRoot = () => (process.env.VERCEL ? path.join("/tmp", "cowinmagnet-news-system") : process.cwd());
const root = () => path.join(runtimeRoot(), "data", "news-opportunities");
const generatedRoot = () => path.join(runtimeRoot(), "data", "news-generated");
const stateFile = () => path.join(runtimeRoot(), ".data", "news-system-state.json");

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

export async function saveGeneratedArticle(article) {
  await fs.mkdir(generatedRoot(), { recursive: true });
  const file = path.join(generatedRoot(), `${article.slug}.json`);
  await fs.writeFile(file, JSON.stringify(article, null, 2), "utf8");
  return file;
}

export async function listGeneratedArticles() {
  await fs.mkdir(generatedRoot(), { recursive: true });
  const files = await fs.readdir(generatedRoot());
  return files.filter((file) => file.endsWith(".json")).sort().reverse();
}

export async function readNewsState() {
  try {
    return JSON.parse(await fs.readFile(stateFile(), "utf8"));
  } catch {
    return {
      seenNews: { urls: {}, titles: {}, semantic: {}, images: {} },
      publishedSlugs: {},
      publishedTopics: [],
      runs: [],
      updatedAt: null
    };
  }
}

export async function saveNewsState(state) {
  await fs.mkdir(path.dirname(stateFile()), { recursive: true });
  await fs.writeFile(stateFile(), JSON.stringify(state, null, 2), "utf8");
  return stateFile();
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
