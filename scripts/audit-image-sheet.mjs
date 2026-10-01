import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const productSource = await fs.readFile(path.join(root, "data/products.ts"), "utf8");
const primaryProducts = [...productSource.matchAll(/"image": "(\/assets\/products\/[^"]+)"/g)].map((match) => match[1]);
const additionalDirectories = ["public/images/catalog", "public/images/industries", "public/images/applications", "public/images/generated", "public/images/source-products"];
const additional = [];
for (const directory of additionalDirectories) {
  const queue = [path.join(root, directory)];
  while (queue.length) {
    const current = queue.pop();
    for (const entry of await fs.readdir(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) queue.push(file);
      else if (/\.(png|jpe?g|webp|avif|gif)$/i.test(entry.name)) additional.push(`/${path.relative(path.join(root, "public"), file)}`);
    }
  }
}

const manifestFile = process.argv.find((arg) => arg.startsWith("--manifest="))?.slice(11);
const images = manifestFile
  ? (JSON.parse(await fs.readFile(path.resolve(manifestFile), "utf8")).entries || []).map((entry) => entry.branded)
  : [...new Set([...primaryProducts, ...additional])].sort();
const cellWidth = 190;
const cellHeight = 152;
const columns = 7;
const rows = 8;
const pageSize = columns * rows;
const outputDir = process.argv.find((arg) => arg.startsWith("--out="))?.slice(6) || "/tmp";
await fs.mkdir(outputDir, { recursive: true });
const manifest = [];
for (let start = 0; start < images.length; start += pageSize) {
  const page = Math.floor(start / pageSize) + 1;
  const cells = [];
  for (let offset = 0; offset < Math.min(pageSize, images.length - start); offset++) {
    const index = start + offset;
    const source = path.join(root, "public", images[index].slice(1));
    try {
      const thumb = await sharp(source).rotate().resize(cellWidth - 10, cellHeight - 28, { fit: "contain", background: "#ffffff" }).png().toBuffer();
      const x = (offset % columns) * cellWidth;
      const y = Math.floor(offset / columns) * cellHeight;
      cells.push({ input: thumb, top: y, left: x + 5 });
      const label = Buffer.from(`<svg width="${cellWidth}" height="24"><rect width="100%" height="100%" fill="white"/><text x="7" y="17" font-size="14" font-family="Arial" fill="black">${index + 1}</text></svg>`);
      cells.push({ input: label, top: y + cellHeight - 24, left: x });
    } catch {
      continue;
    }
  }
  const output = path.join(outputDir, `cowin-image-sheet-${page}.png`);
  await sharp({ create: { width: columns * cellWidth, height: rows * cellHeight, channels: 4, background: "#e8ebef" } }).composite(cells).png().toFile(output);
  manifest.push(output);
}
await fs.writeFile(path.join(outputDir, "cowin-image-sheet-manifest.txt"), images.map((image, index) => `${index + 1}\t${image}`).join("\n") + "\n");
console.log(JSON.stringify({ images: images.length, sheets: manifest }));
