import Link from "next/link";
import { withLocale } from "@/data/i18n";

const applicationSections = [
  {
    id: "waste-recycling",
    title: "Waste Recycling",
    includes: ["C&D waste", "Scrap recycling", "Municipal solid waste", "Shredded material lines"],
    problem:
      "Recycling lines often process mixed and irregular materials. Ferrous metal can damage shredders, reduce sorting efficiency and lower downstream material quality.",
    products: [
      "Permanent overband magnetic separator",
      "Self-cleaning magnetic separator",
      "Eddy current separator",
      "Magnetic drum"
    ],
    notes:
      "Confirm belt width, material layer depth, particle size, iron amount and whether the line needs continuous automatic discharge."
  },
  {
    id: "mining-mineral-processing",
    title: "Mining & Mineral Processing",
    includes: ["Ore conveyor protection", "Crusher protection", "Tramp iron removal"],
    problem:
      "Mining conveyors may carry bolts, teeth, steel fragments and other tramp iron. These contaminants can damage crushers, mills and transfer equipment.",
    products: [
      "Suspended electromagnetic separator",
      "Self-cleaning electromagnetic separator",
      "Permanent magnetic drum",
      "Dry or wet magnetic separator"
    ],
    notes:
      "For deeper burden layers and heavy tramp iron, electromagnetic options may be considered. Mineral separation results should be confirmed by material data or testing."
  },
  {
    id: "quarry-aggregate",
    title: "Quarry & Aggregate",
    includes: ["Crusher feed conveyors", "Screens", "Stone and sand lines"],
    problem:
      "Metal contamination in stone and aggregate lines can damage crushers, screens and conveyor equipment before the problem is visible to operators.",
    products: [
      "Suspended permanent magnet",
      "Permanent overband magnetic separator",
      "Magnetic pulley"
    ],
    notes:
      "Permanent magnets are often practical for quarry and aggregate conveyors. Cleaning method depends on iron frequency and maintenance access."
  },
  {
    id: "cement-building-materials",
    title: "Cement & Building Materials",
    includes: ["Raw material handling", "Clinker", "Coal mill protection", "Additive conveying"],
    problem:
      "Cement and building material plants need stable iron removal before mills, crushers, coal handling equipment and raw material transfer points.",
    products: [
      "Suspended electromagnetic separator",
      "Permanent overband separator",
      "Metal detector if available"
    ],
    notes:
      "Confirm material temperature, belt width, dust condition, installation height and whether a metal detector should work together with the separator."
  },
  {
    id: "coal-power",
    title: "Coal Handling & Power Plant",
    includes: ["Coal conveyor protection", "Bunker feeding lines", "Boiler fuel handling safety"],
    problem:
      "Coal handling systems need reliable equipment protection before crushers, bunkers and boiler fuel handling systems.",
    products: [
      "Self-cleaning electromagnetic separator",
      "Suspended permanent magnetic separator",
      "Magnetic pulley"
    ],
    notes:
      "Selection should consider conveyor speed, burden depth, coal moisture, installation height and continuous operation requirements."
  },
  {
    id: "food-grain-powder",
    title: "Food, Grain & Powder Processing",
    includes: ["Fine ferrous particle capture", "Hopper and chute protection", "Powder and granular flow"],
    problem:
      "Fine iron particles in powder, grain or chemical material streams can affect product cleanliness and equipment safety.",
    products: [
      "Magnetic bar",
      "Magnetic grid",
      "Magnetic filter",
      "Plate magnet"
    ],
    notes:
      "Confirm material flowability, cleaning access, stainless steel requirement, magnetic strength expectation and whether food-grade contact surfaces are needed."
  }
];

export default function ApplicationsPageContent({ locale = "en" }) {
  return (
    <main className="applications-page">
      <section className="applications-hero">
        <p className="eyebrow">Applications</p>
        <h1>Magnetic Separation Applications by Industry</h1>
        <p>
          Plan separator selection around your material, conveyor layout, ferrous contamination level, and downstream
          equipment protection needs.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href={withLocale(locale, "/inquiry")}>Send Application Details</Link>
          <Link className="button ghost" href={withLocale(locale, "/products")}>View Products</Link>
        </div>
      </section>

      <section className="application-solution-list" aria-label="Magnetic separator applications">
        {applicationSections.map((item) => (
          <article className="application-solution-card" id={item.id} key={item.id}>
            <div className="application-solution-head">
              <p className="eyebrow">Industry solution</p>
              <h2>{item.title}</h2>
              <p>{item.problem}</p>
            </div>

            <div className="application-solution-body">
              <div>
                <h3>Common line conditions</h3>
                <ul>
                  {item.includes.map((line) => <li key={line}>{line}</li>)}
                </ul>
              </div>
              <div>
                <h3>Recommended equipment</h3>
                <ul>
                  {item.products.map((product) => <li key={product}>{product}</li>)}
                </ul>
              </div>
              <div>
                <h3>Selection notes</h3>
                <p>{item.notes}</p>
                <Link href={withLocale(locale, `/inquiry?application=${item.id}`)}>Send Application Details</Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="applications-final-cta">
        <div>
          <p className="eyebrow">Unsure which separator fits?</p>
          <h2>Send material photos, conveyor data and target separation result.</h2>
          <p>
            Cowinmagnet will help evaluate a practical equipment option and coordinate sourcing, customization,
            inspection support and export communication.
          </p>
        </div>
        <Link className="button primary" href={withLocale(locale, "/inquiry")}>Request Recommendation</Link>
      </section>
    </main>
  );
}
