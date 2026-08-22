import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "reports", "xintuo-product-sync", "xintuo-product-catalog.json");
const productsPath = path.join(root, "data", "products.ts");
const reportPath = path.join(root, "reports", "xintuo-product-sync", "matched-product-import-result.json");
const apply = process.argv.includes("--apply");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

const profiles = {
  RCDB: { slug: "rcdb-type-self-cooling-plate-electromagnetic-iron-remover", name: "RCDB Self-Cooling Plate Electromagnetic Iron Remover", kind: "manual-electromagnetic", cooling: "self-cooling" },
  RCDA: { slug: "rcda-type-air-cooled-electromagnetic-iron-remover", name: "RCDA Air-Cooled Suspended Electromagnetic Iron Remover", kind: "manual-electromagnetic", cooling: "air-cooled" },
  RCDD: { slug: "rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover", name: "RCDD Self-Cooling Self-Dumping Electromagnetic Iron Remover", kind: "self-cleaning-electromagnetic", cooling: "self-cooling" },
  RCDE: { slug: "rcde-type-oil-cooled-electromagnetic-iron-remover", name: "RCDE Oil-Cooled Electromagnetic Iron Remover", kind: "manual-electromagnetic", cooling: "oil-cooled" },
  RCYB: { slug: "rcyb-type-permanent-magnet-manual-iron-remover", name: "RCYB Suspended Permanent Magnetic Iron Remover", kind: "manual-permanent" },
  "RCYD(C)": { slug: "rcyd-type-permanent-magnet-self-dumping-iron-remover", name: "RCYD Self-Dumping Permanent Magnetic Iron Remover", kind: "self-cleaning-permanent" },
  RCYP: { slug: "rcyp-type-permanent-magnet-manual-self-dumping-iron-remover", name: "RCYP Manual-Cleaning Permanent Magnetic Iron Remover", kind: "manual-permanent" },
  RCYA: { slug: "rcya-type-inclined-pipeline-permanent-magnet-iron-remover", name: "RCYA Inclined Pipeline Permanent Magnetic Iron Remover", kind: "pipeline-permanent", orientation: "inclined" },
  RCYG: { slug: "rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover", name: "RCYG Pipeline Self-Dumping Permanent Magnetic Iron Remover", kind: "self-cleaning-pipeline" },
  RCDC: { slug: "rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover", name: "RCDC Air-Cooled Self-Dumping Electromagnetic Iron Remover", kind: "self-cleaning-electromagnetic", cooling: "air-cooled" },
  RCDF: { slug: "rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover", name: "RCDF Oil-Cooled Self-Dumping Electromagnetic Iron Remover", kind: "self-cleaning-electromagnetic", cooling: "oil-cooled" },
  RCYF: { slug: "rcyf-type-vertical-pipeline-permanent-magnet-iron-remover", name: "RCYF Vertical Pipeline Permanent Magnetic Iron Remover", kind: "pipeline-permanent", orientation: "vertical" }
};

function cleanHeader(value) {
  return value.replace(/\s+/g, " ").trim();
}

function translateHeader(value) {
  const header = cleanHeader(value);
  const mappings = [
    [/型号/, "Model"],
    [/适应带宽|带宽/, "Suitable belt width (mm)"],
    [/悬挂高度/, "Suspension height (max. mm)"],
    [/适应带速|带速/, "Belt speed (max. m/s)"],
    [/物料厚度/, "Material burden thickness (max. mm)"],
    [/重量/, "Weight (kg)"],
    [/励磁功率/, "Excitation power"],
    [/卸铁功率|电机功率/, "Discharge drive power"],
    [/冷却方式/, "Cooling method"],
    [/工作制/, "Duty cycle"],
    [/外型尺寸.*L/, "Overall length L (mm)"],
    [/外型尺寸.*D/, "Overall width D (mm)"],
    [/外型尺寸.*H/, "Overall height H (mm)"],
    [/外型尺寸/, "Overall dimensions"],
    [/管径|口径/, "Pipe size"],
    [/处理量/, "Throughput"],
    [/磁场|磁感应/, "Magnetic field reference"],
    [/电压/, "Power supply"],
    [/电流/, "Current"],
    [/倾角/, "Installation angle"]
  ];
  return mappings.find(([pattern]) => pattern.test(header))?.[1] || `Reference field: ${header}`;
}

function contentFor(profile) {
  const common = {
    keywords: [profile.name, "industrial magnetic iron removal", "bulk material handling"],
    applications: ["Bulk material conveying", "Conveyor or process equipment protection", "Ferromagnetic tramp iron removal"],
    customization: ["Configuration review based on actual material and site conditions"],
    faqs: []
  };

  if (profile.kind === "manual-electromagnetic") {
    return {
      ...common,
      summary: `The ${profile.name} is a suspended electromagnetic separator for removing ferromagnetic tramp iron from non-magnetic bulk material. Its ${profile.cooling} configuration is selected with the required suspension height, material burden, available power and site environment in mind.`,
      features: [
        "Electromagnetic separation for suspended conveyor and chute positions",
        `${profile.cooling[0].toUpperCase()}${profile.cooling.slice(1)} configuration referenced for this series`,
        "Manual cleaning arrangement where safe planned access is available",
        "Selection depends on belt width, burden depth, suspension clearance and electrical conditions"
      ],
      principle: "When energized, the electromagnetic circuit attracts ferromagnetic pieces from the material stream. Non-magnetic material continues through the process while collected metal is removed during a planned and safe cleaning procedure. The final selection must consider heat dissipation, available power and access for maintenance.",
      specs: [
        { label: "Series", value: profile.name.split(" ")[0] },
        { label: "Magnetic system", value: "Electromagnetic" },
        { label: "Cooling reference", value: profile.cooling },
        { label: "Cleaning method", value: "Manual" }
      ],
      installation: "Confirm the conveyor layout, suspension clearance, burden depth, available electrical supply and maintenance access before finalizing the installation position."
    };
  }

  if (profile.kind === "self-cleaning-electromagnetic") {
    return {
      ...common,
      summary: `The ${profile.name} combines an electromagnetic separator with a discharge belt for continuous removal of collected ferromagnetic tramp iron from bulk material streams. It is considered where the expected contamination level makes planned manual cleaning impractical.`,
      features: [
        "Electromagnetic circuit for suspended material-handling positions",
        "Self-dumping belt arrangement for continuous iron discharge",
        `${profile.cooling[0].toUpperCase()}${profile.cooling.slice(1)} configuration referenced for this series`,
        "Configuration review based on burden depth, suspension height, power and discharge clearance"
      ],
      principle: "The energized magnetic circuit retains ferromagnetic pieces above the material stream. A separate discharge belt carries collected metal away from the magnetic zone to a designated discharge area. Electrical excitation and discharge-belt drive requirements are confirmed for the selected configuration.",
      specs: [
        { label: "Series", value: profile.name.split(" ")[0] },
        { label: "Magnetic system", value: "Electromagnetic" },
        { label: "Cleaning method", value: "Self-dumping" },
        { label: "Cooling reference", value: profile.cooling }
      ],
      installation: "Confirm belt width, burden depth, suspension height, electrical supply, discharge-belt clearance and a safe ferrous-metal discharge position before finalizing the layout."
    };
  }

  if (profile.kind === "self-cleaning-permanent") {
    return {
      ...common,
      summary: `The ${profile.name} uses a permanent magnetic circuit and a discharge belt to continuously remove captured ferromagnetic tramp iron from conveyor-fed bulk material. It is selected where continuous discharge is required and the site layout provides a clear discharge path.`,
      features: [
        "Permanent magnetic circuit with no excitation power during operation",
        "Self-dumping belt arrangement for continuous iron discharge",
        "Suspended use above conveyor-fed non-magnetic material",
        "Selection based on belt width, burden, suspension height and discharge clearance"
      ],
      principle: "A permanent magnetic circuit captures ferromagnetic pieces from the material stream. The self-dumping belt moves the collected material out of the magnetic zone so it can discharge at a planned position. The final layout depends on the conveyor trajectory and available service clearance.",
      specs: [
        { label: "Series", value: "RCYD" },
        { label: "Magnetic system", value: "Permanent magnetic" },
        { label: "Cleaning method", value: "Self-dumping" }
      ],
      installation: "Confirm conveyor width, material trajectory, suspension height, expected tramp iron and the available discharge area before finalizing the mounting arrangement."
    };
  }

  if (profile.kind === "manual-permanent") {
    return {
      ...common,
      summary: `The ${profile.name} is a suspended permanent magnetic separator for capturing ferromagnetic tramp iron from non-magnetic bulk material. It operates without excitation power and is generally selected where collected metal can be removed manually at safe planned intervals.`,
      features: [
        "Permanent magnetic circuit with no excitation power during operation",
        "Suspended positioning above conveyors, feeders or chutes",
        "Manual cleaning for planned low-to-moderate contamination conditions",
        "Selection based on material burden, suspension height and access for cleaning"
      ],
      principle: "The permanent magnetic circuit retains ferromagnetic pieces as material passes through its effective field. Non-magnetic material continues downstream. Collected metal is removed manually following a safe isolation and cleaning procedure, so this configuration is not intended to replace a self-dumping separator.",
      specs: [
        { label: "Series", value: profile.name.split(" ")[0] },
        { label: "Magnetic system", value: "Permanent magnetic" },
        { label: "Cleaning method", value: "Manual" }
      ],
      installation: "Confirm the material trajectory, available suspension clearance and safe maintenance access before choosing the mounting position."
    };
  }

  const position = profile.orientation ? `${profile.orientation} pipeline` : "pipeline";
  const selfCleaning = profile.kind === "self-cleaning-pipeline";
  return {
    ...common,
    summary: `The ${profile.name} is a permanent magnetic separator for ferromagnetic contamination in material moving through a ${position}. The final configuration depends on the material flow, pipe size, particle condition, access for cleaning and process constraints.`,
    features: [
      "Permanent magnetic separation for material flowing through a pipeline position",
      selfCleaning ? "Self-dumping arrangement referenced for this series" : "Cleaning access planned around the process layout",
      "Configuration review based on pipe size, material flow and contamination characteristics",
      "Suitable product and material scope confirmed per application"
    ],
    principle: selfCleaning
      ? "A permanent magnetic circuit captures ferromagnetic contamination from the product flow. The separator configuration is arranged to move collected metal to its designated discharge path. Final installation and cleaning details depend on material flow and the process connection."
      : "A permanent magnetic circuit captures ferromagnetic contamination as material passes through the separator. The collection zone is cleaned using the method selected for the process. Final installation details depend on material flow, pipe size and access requirements.",
    specs: [
      { label: "Series", value: profile.name.split(" ")[0] },
      { label: "Magnetic system", value: "Permanent magnetic" },
      { label: "Installation reference", value: position },
      { label: "Cleaning method", value: selfCleaning ? "Self-dumping" : "To be confirmed by configuration" }
    ],
    installation: "Confirm pipe size, material flow characteristics, contamination type, available access and the required cleaning arrangement before the final process connection is selected."
  };
}

function assetName(sourceId, url) {
  const baseName = path.basename(new URL(url).pathname).replace(/[^a-zA-Z0-9._-]/g, "_");
  return `xintuo-${sourceId}-${baseName}`;
}

async function promoteAssets(record, profile) {
  const sourceDir = path.join(root, ".backups", "xintuo-product-sync-20260822", "media", record.sourceId);
  const targetDir = path.join(root, "public", "assets", "products", profile.slug, "legacy-import");
  await mkdir(targetDir, { recursive: true });
  const publicPaths = [];
  for (const url of record.mediaUrls) {
    const extension = path.extname(new URL(url).pathname).toLowerCase();
    if (!imageExtensions.has(extension)) continue;
    const source = path.join(sourceDir, path.basename(new URL(url).pathname));
    const targetName = assetName(record.sourceId, url);
    const target = path.join(targetDir, targetName);
    await copyFile(source, target);
    publicPaths.push(`/assets/products/${profile.slug}/legacy-import/${targetName}`);
  }
  return publicPaths;
}

function diagramsFrom(record, profile, publicPaths) {
  return record.mediaUrls
    .map((url, index) => ({ url, publicPath: publicPaths[index] }))
    .filter(({ url }) => path.extname(new URL(url).pathname).toLowerCase() === ".gif")
    .map(({ publicPath }, index) => ({
      src: publicPath,
      alt: `${profile.name} technical reference drawing ${index + 1}`,
      caption: "Technical reference drawing. Confirm final dimensions and installation details for the selected configuration."
    }));
}

async function main() {
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  const selected = catalog.records.filter((record) => (
    profiles[record.mapping?.modelCode]
    && record.mapping?.status === "matched"
    && record.mapping?.modelCode !== "RCYB"
  ));
  const plan = selected.map((record) => ({
    sourceId: record.sourceId,
    sourceTitle: record.sourceTitle,
    modelCode: record.mapping.modelCode,
    targetSlug: profiles[record.mapping.modelCode].slug,
    parameterRows: record.technicalTable.rows.length,
    mediaCount: record.mediaUrls.filter((url) => imageExtensions.has(path.extname(new URL(url).pathname).toLowerCase())).length
  }));

  if (!apply) {
    process.stdout.write(`${JSON.stringify({ mode: "dry-run", products: plan }, null, 2)}\n`);
    return;
  }

  const source = await readFile(productsPath, "utf8");
  const declaration = source.indexOf("export const products");
  const start = source.indexOf("[", source.indexOf("=", declaration));
  const end = source.lastIndexOf("]; ");
  const safeEnd = end === -1 ? source.lastIndexOf("]; ".trim()) : end;
  const products = JSON.parse(source.slice(start, safeEnd + 1).replace(/,\s*([}\]])/g, "$1"));
  const changes = [];

  for (const record of selected) {
    const profile = profiles[record.mapping.modelCode];
    const product = products.find((item) => item.slug === profile.slug);
    if (!product) throw new Error(`Missing target product ${profile.slug}`);
    const importedMedia = await promoteAssets(record, profile);
    if (!importedMedia.length) throw new Error(`No static media found for ${profile.slug}`);
    const content = contentFor(profile);
    const existingGallery = product.imageGallery || [];
    Object.assign(product, content, {
      name: profile.name,
      image: importedMedia[0],
      imageGallery: [...new Set([...importedMedia, ...existingGallery])],
      specificationTable: {
        columns: record.technicalTable.columns.map(translateHeader),
        rows: record.technicalTable.rows,
        sourceLabel: "Model reference. Final configuration must be confirmed against material and site conditions."
      },
      engineeringDiagrams: diagramsFrom(record, profile, importedMedia)
    });
    changes.push({ sourceId: record.sourceId, sourceTitle: record.sourceTitle, targetSlug: profile.slug, parameterRows: record.technicalTable.rows.length, importedMedia: importedMedia.length, diagrams: product.engineeringDiagrams.length });
  }

  const output = `${source.slice(0, start)}${JSON.stringify(products, null, 2)};${source.slice(safeEnd + 2)}`;
  await writeFile(productsPath, output, "utf8");
  await writeFile(reportPath, `${JSON.stringify({ importedAt: new Date().toISOString(), changes, skipped: catalog.records.length - changes.length }, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ mode: "applied", imported: changes.length, changes }, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
