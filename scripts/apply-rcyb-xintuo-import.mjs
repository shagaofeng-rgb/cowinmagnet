import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const productsPath = path.join(process.cwd(), "data", "products.ts");
const slug = "rcyb-type-permanent-magnet-manual-iron-remover";

const replacement = `  {
    "slug": "${slug}",
    "name": "RCYB Suspended Permanent Magnetic Iron Remover",
    "category": "Suspended & Self-Unloading Iron Removers",
    "image": "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/legacy-import/rcyb-suspended-permanent-magnet-main.jpg",
    "imageGallery": [
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/legacy-import/rcyb-suspended-permanent-magnet-main.jpg",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-01.jpg",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-02.png",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-03.png",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-04.png",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-05.png",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-06.png",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-08.jpg",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-07.jpg"
    ],
    "summary": "The RCYB suspended permanent magnetic iron remover is installed above a conveyor, vibratory feeder or chute to capture ferromagnetic tramp metal from non-magnetic bulk material. Its permanent magnetic circuit operates without excitation power and is generally selected where planned manual cleaning is practical.",
    "keywords": [
      "RCYB suspended permanent magnetic iron remover",
      "manual cleaning suspended magnet",
      "conveyor tramp iron removal"
    ],
    "features": [
      "Permanent magnetic circuit with no excitation power during operation",
      "Suspended placement above conveyor, feeder or chute applications",
      "Manual cleaning suited to lines where collected tramp iron can be cleared safely at planned intervals",
      "Model selection considers belt width, suspension height, burden thickness, belt speed and access for cleaning"
    ],
    "principle": "A composite permanent magnetic circuit creates a magnetic field above the material stream. Ferromagnetic pieces entering its effective field are retained on the separator face while non-magnetic material continues through the line. The collection surface is cleaned manually using a safe isolation and removal procedure, so this is not a self-cleaning configuration.",
    "specs": [
      { "label": "Series", "value": "RCYB" },
      { "label": "Cleaning method", "value": "Manual" },
      { "label": "Installation", "value": "Suspended above conveyor, feeder or chute" }
    ],
    "applications": [
      "Conveyor protection",
      "Vibratory feeders",
      "Chutes handling non-magnetic bulk material"
    ],
    "installation": "Confirm the conveyor layout, material trajectory, suspension height and safe access for manual cleaning before selecting an installation position. The imported reference drawings show inline and cross-belt arrangements; final mounting details depend on the site layout.",
    "customization": [
      "Model selection by belt width and installation clearance",
      "Configuration review based on material burden and tramp iron conditions"
    ],
    "faqs": [
      {
        "question": "When is manual cleaning a suitable choice?",
        "answer": "Manual cleaning is generally suitable when the expected quantity of collected tramp iron allows planned, safe cleaning intervals. Continuous heavy tramp iron conditions may require a self-cleaning separator instead."
      },
      {
        "question": "What information is needed before selection?",
        "answer": "Provide the belt width, material burden thickness, belt speed, suspension clearance, material type and the expected size and quantity of ferromagnetic tramp iron."
      },
      {
        "question": "Can the RCYB be installed in different conveyor positions?",
        "answer": "The installation position depends on the material trajectory and available clearance. Inline and cross-belt arrangements should be reviewed against the actual conveyor layout."
      }
    ],
    "specificationTable": {
      "columns": [
        "Model",
        "Suitable belt width (mm)",
        "Suspension height h (max. mm)",
        "Belt speed (max. m/s)",
        "Material burden thickness (max. mm)",
        "Weight (kg)",
        "Overall length L (mm)",
        "Overall width D (mm)",
        "Overall height H (mm)"
      ],
      "rows": [
        ["RCYB-4", "400", "125", "4.5", "60", "115", "400", "300", "230"],
        ["RCYB-4-1", "400", "75", "4.5", "30", "65", "400", "250", "140"],
        ["RCYB-5", "500", "150", "4.5", "90", "206", "500", "350", "260"],
        ["RCYB-5-1", "500", "100", "4.5", "50", "96", "500", "260", "160"],
        ["RCYB-6", "600", "175", "4.5", "120", "295", "600", "450", "280"],
        ["RCYB-6-1", "600", "130", "4.5", "60", "158", "600", "350", "180"],
        ["RCYB-6.5", "650", "200", "4.5", "150", "450", "650", "600", "300"],
        ["RCYB-8", "800", "250", "4.5", "200", "680", "950", "950", "380"],
        ["RCYB-8-1", "800", "200", "4.5", "150", "550", "800", "600", "300"],
        ["RCYB-10", "1000", "300", "4.5", "250", "1180", "1100", "1000", "380"],
        ["RCYB-12", "1200", "350", "4.5", "300", "1670", "1300", "1340", "420"],
        ["RCYB-14", "1400", "400", "4.5", "350", "2350", "1500", "1500", "420"],
        ["RCYB-16", "1600", "450", "4.5", "400", "2850", "1750", "1750", "460"]
      ],
      "sourceLabel": "Imported RCYB model reference. Final configuration must be confirmed against material and site conditions."
    },
    "engineeringDiagrams": [
      {
        "src": "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/legacy-import/rcyb-dimensional-reference.gif",
        "alt": "RCYB suspended permanent magnetic iron remover dimensional reference drawing",
        "caption": "Dimensional reference for preliminary configuration."
      },
      {
        "src": "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/legacy-import/rcyb-inline-installation-reference.gif",
        "alt": "RCYB suspended permanent magnetic iron remover inline installation reference drawing",
        "caption": "Inline installation reference. Confirm clearance and material trajectory for the final layout."
      },
      {
        "src": "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/legacy-import/rcyb-cross-belt-installation-reference.gif",
        "alt": "RCYB suspended permanent magnetic iron remover cross-belt installation reference drawing",
        "caption": "Cross-belt installation reference. Final mounting is reviewed against the conveyor layout."
      }
    ]
  },
`;

async function main() {
  const source = await readFile(productsPath, "utf8");
  const start = source.indexOf(`  {\n    "slug": "${slug}",`);
  const next = source.indexOf('  {\n    "slug": "rcdb-type-self-cooling-plate-electromagnetic-iron-remover",', start);
  if (start === -1 || next === -1) throw new Error("Could not locate the RCYB product record boundaries.");
  await writeFile(productsPath, `${source.slice(0, start)}${replacement}${source.slice(next)}`, "utf8");
  process.stdout.write("RCYB source import applied.\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
