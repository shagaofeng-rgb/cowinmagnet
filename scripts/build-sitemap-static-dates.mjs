import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const portableGit = path.join(cwd, ".tools", "PortableGit", "cmd", "git.exe");
const git = process.env.GIT_BINARY || (fs.existsSync(portableGit) ? portableGit : "git");
const outputPath = path.join(cwd, "data", "sitemapStaticDates.json");
const groups = {
  pages: ["app", "components", "data/site.ts", "messages"],
  products: ["data/products.ts", "lib/productCms.js", "components/ProductDetail.jsx", "components/ProductCard.tsx"],
  categories: ["data/applications.ts", "components/ApplicationsPageContent.jsx"],
  posts: ["data/blogs.ts", "data/contentHub.js", "data/generatedNews.js", "content/blog"]
};

function gitOutput(args) {
  return execFileSync(git, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

function groupDate(paths) {
  try {
    const dirty = gitOutput(["status", "--porcelain", "--", ...paths]);
    if (dirty) return new Date().toISOString().slice(0, 10);
    const committed = gitOutput(["log", "-1", "--format=%cI", "--", ...paths]);
    if (committed) return new Date(committed).toISOString().slice(0, 10);
  } catch {}
  return new Date().toISOString().slice(0, 10);
}

const dates = Object.fromEntries(Object.entries(groups).map(([group, paths]) => [group, groupDate(paths)]));
const next = `${JSON.stringify(dates, null, 2)}\n`;
const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
if (current !== next) fs.writeFileSync(outputPath, next, "utf8");
console.log(`[sitemap-dates] ${JSON.stringify(dates)}`);
