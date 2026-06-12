import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/QuoteForm";
import { applications, type Application } from "@/data/applications";
import { products } from "@/data/products";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";

type ApplicationPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return applications.map((application) => ({ slug: application.slug }));
}

export async function generateMetadata({ params }: ApplicationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const application = applications.find((item) => item.slug === slug);

  if (!application) return {};

  return {
    title: application.seoTitle,
    description: application.seoDescription,
    alternates: { canonical: `/applications/${application.slug}` }
  };
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const { slug } = await params;
  const application = applications.find((item) => item.slug === slug);

  if (!application) notFound();

  const related = products.filter((product) => application.recommendedProducts.includes(product.name));

  return (
    <>
      {application.faqs?.length ? <JsonLd data={faqSchema(application.faqs)} /> : null}
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Applications", path: "/applications" },
        { name: application.name, path: `/applications/${application.slug}` }
      ])} />
      <section className="detail-hero">
        <div>
          <span className="eyebrow">Application</span>
          <h1>{application.pageTitle}</h1>
          <p>{application.summary}</p>
          {application.secondaryDescription ? <p>{application.secondaryDescription}</p> : null}
          <div className="hero-actions">
            <Link href="/request-quote" className="btn btn-primary">Get a Quote</Link>
            <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </div>
        <div className="detail-image">
          <Image src={application.image} width={820} height={560} alt={application.imageAlt} priority />
        </div>
      </section>

      <section className="section detail-layout">
        <article className="detail-main">
          <div className="content-block">
            <h2>Common Buyer Pain Points</h2>
            <ul className="feature-list">
              {application.painPoints.map((point) => (
                <li key={point}><CheckCircle2 size={18} aria-hidden />{point}</li>
              ))}
            </ul>
          </div>
          <div className="content-block">
            <h2>Problems We Solve</h2>
            <IndustrySolutionGrid items={application.solutionPairs} />
          </div>
          <div className="content-block">
            <h2>Recommended Equipment</h2>
            <IndustryEquipmentGrid items={application.equipment} />
          </div>
          <div className="content-block">
            <h2>Application Scenarios</h2>
            <IndustryScenarioGrid application={application} />
          </div>
          {application.table ? (
            <div className="content-block">
              <h2>{application.table.title}</h2>
              <IndustryTable table={application.table} />
            </div>
          ) : null}
          <div className="content-block">
            <h2>Recommended Product Types</h2>
            <div className="related-products">
              {related.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.slug}>
                  {product.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="content-block">
            <h2>FAQ</h2>
            <div className="faq-list">
              {application.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </article>
        <aside className="quote-panel">
          <h2>Application Quote</h2>
          <p>Tell us your material, belt width, capacity, and downstream equipment risk.</p>
          <QuoteForm compact />
        </aside>
      </section>
      <section className="section industry-bottom-cta">
        <div>
          <span className="eyebrow">Selection Support</span>
          <h2>Need a Magnetic Separation Solution for Your Production Line?</h2>
          <p>Tell us your material type, belt width, installation height, and processing capacity. Our team will help you choose the right magnetic separator.</p>
        </div>
        <div className="hero-actions">
          <Link href="/request-quote" className="btn btn-primary">Get a Quote</Link>
          <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
        </div>
      </section>
    </>
  );
}

function IndustrySolutionGrid({ items }: { items: Application["solutionPairs"] }) {
  return (
    <div className="industry-solution-grid">
      {items.map((item, index) => (
        <article key={item.issue}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{item.issue}</h3>
          <strong>{item.solution}</strong>
          <p>{item.note}</p>
        </article>
      ))}
    </div>
  );
}

function IndustryEquipmentGrid({ items }: { items: Application["equipment"] }) {
  return (
    <div className="industry-equipment-grid">
      {items.map((item) => (
        <article key={item.name}>
          <h3>{item.name}</h3>
          <p>{item.usage}</p>
        </article>
      ))}
    </div>
  );
}

function IndustryScenarioGrid({ application }: { application: Application }) {
  return (
    <div className={`industry-scenario-grid scenario-count-${application.scenarios.length}`}>
      {application.scenarios.map((scenario) => (
        <article
          key={scenario}
          className={`industry-scenario-card${application.slug === "mining" ? " is-material-scenario" : ""}`}
        >
          <Image
            src={application.scenarioImages?.[scenario] || application.image}
            width={420}
            height={260}
            alt={`${scenario} magnetic separation application`}
          />
          <div>
            <span>{application.name}</span>
            <h3>{scenario}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}

function IndustryTable({ table }: { table: NonNullable<Application["table"]> }) {
  return (
    <div className="industry-table-wrap">
      <table className="industry-table">
        <thead>
          <tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join("-")}>{row.map((cell, index) => <td key={`${cell}-${index}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
