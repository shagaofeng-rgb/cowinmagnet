import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const portableGit = path.join(cwd, ".tools", "PortableGit", "cmd", "git.exe");
const git = process.env.GIT_BINARY || (fs.existsSync(portableGit) ? portableGit : "git");
const outputPath = path.join(cwd, "data", "sitemapStaticDates.json");
const groups = {
  // Keep lastmod tied to content records rather than template/component releases.
  // Template edits can affect hundreds of routes without changing page content.
  pages: ["data/site.ts", "messages"],
  products: ["data/products.ts", "data/productDetailProfiles.ts", "lib/productCms.js"],
  categories: ["data/applications.ts", "components/ApplicationsPageContent.jsx"],
  posts: ["data/blogs.ts", "data/contentHub.js", "data/generatedNews.js", "content/blog"]
};

function gitOutput(args) {
  return execFileSync(git, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

function groupDate(paths, fallback = "") {
  try {
    const dirty = gitOutput(["status", "--porcelain", "--", ...paths]);
    // A local build must never refresh all lastmod values merely because the
    // worktree is dirty. Preserve the last verified value until the content
    // change is committed and can be dated from Git history.
    if (dirty) return fallback;
    const committed = gitOutput(["log", "-1", "--format=%cI", "--", ...paths]);
    if (committed) {
      const committedDate = new Date(committed).toISOString().slice(0, 10);
      // A verified CMS update may be newer than the tracked content path.
      // Do not move a truthful sitemap lastmod backwards during a build.
      return committedDate > fallback ? committedDate : fallback;
    }
  } catch {}
  return fallback;
}

const existing = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, "utf8")) : {};
const dates = Object.fromEntries(Object.entries(groups).map(([group, paths]) => [group, groupDate(paths, existing[group] || "1970-01-01")]));
const next = `${JSON.stringify(dates, null, 2)}\n`;
const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
if (current !== next) fs.writeFileSync(outputPath, next, "utf8");
console.log(`[sitemap-dates] ${JSON.stringify(dates)}`);
