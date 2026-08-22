import { copyFile, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const backupDir = path.join(root, ".backups", "xintuo-product-sync-20260822", "media", "40");
const publicDir = path.join(root, "public", "assets", "products", "rcyb-type-permanent-magnet-manual-iron-remover", "legacy-import");
const reportPath = path.join(root, "reports", "xintuo-product-sync", "rcyb-asset-promotion.json");

const files = [
  ["2013052723244980.jpg", "rcyb-suspended-permanent-magnet-main.jpg"],
  ["20130104163742174.gif", "rcyb-dimensional-reference.gif"],
  ["20130104163742782.gif", "rcyb-inline-installation-reference.gif"],
  ["20130104163742125.gif", "rcyb-cross-belt-installation-reference.gif"]
];

async function main() {
  await mkdir(publicDir, { recursive: true });
  const promoted = [];
  for (const [sourceName, targetName] of files) {
    const source = path.join(backupDir, sourceName);
    const target = path.join(publicDir, targetName);
    await copyFile(source, target);
    const details = await stat(target);
    promoted.push({
      sourceBackup: path.relative(root, source).replaceAll("\\", "/"),
      publicPath: `/${path.relative(path.join(root, "public"), target).replaceAll("\\", "/")}`,
      bytes: details.size,
      reviewStatus: "approved-from-user-owned-source"
    });
  }
  await writeFile(reportPath, `${JSON.stringify({ productSlug: "rcyb-type-permanent-magnet-manual-iron-remover", promotedAt: new Date().toISOString(), promoted }, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ promoted: promoted.length, publicDir: path.relative(root, publicDir) })}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
