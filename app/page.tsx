import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2, Headphones, Settings, ShieldCheck } from "lucide-react";
import { GlobalCustomerNetwork } from "@/components/GlobalCustomerNetwork";
import { HomeVideoShowcase } from "@/components/HomeVideoShowcase";
import { ProductCard } from "@/components/ProductCard";
import { QuoteForm } from "@/components/QuoteForm";
import { applications } from "@/data/applications";
import { productCategories, products } from "@/data/products";
import { site } from "@/data/site";

const advantages = [
  { icon: ShieldCheck, title: "Strong Magnetic Force", text: "Deep magnetic penetration for removing ferromagnetic impurities from conveyed bulk materials." },
  { icon: Settings, title: "OEM/ODM Customization", text: "Flexible designs for belt width, suspension height, installation method, and application scenario." },
  { icon: Headphones, title: "Service-First Support", text: "Clear communication, practical selection advice, sourcing coordination, and responsive follow-up." },
  { icon: Globe2, title: "Global B2B Support", text: "Serving mining, recycling, cement, aggregate, metallurgy, coal, and bulk material buyers worldwide." }
];

export default function Home() {
  const featured = products.slice(0, 6);
  const categoryCards = productCategories.map((category) => ({
    title: category,
    count: products.filter((product) => product.category === category).length,
    href: "/products"
  }));

  return (
    <>
      <section className="home-hero">
        <Image
          src="/images/generated/home-hero-cowinmagnet.png"
          fill
          sizes="100vw"
          alt="COWIN MAGNET magnetic separator working above a conveyor line"
          className="hero-banner-image"
          priority
        />
        <div className="hero-copy">
          <span className="eyebrow">Magnetic Separation Equipment Supplier</span>
          <h1>COWIN MAGNET</h1>
          <p>
            Industrial magnetic separators, suspended magnets, magnetic pulleys, magnetic bars, and customized iron removal systems for global B2B buyers.
          </p>
          <div className="hero-actions">
            <Link href="/request-quote" className="btn btn-primary">Get a Quote</Link>
            <Link href="/products" className="btn btn-secondary">View Products</Link>
          </div>
          <div className="hero-proof">
            <span>OEM/ODM</span>
            <span>Mining</span>
            <span>Recycling</span>
            <span>Cement</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Why COWIN MAGNET</span>
          <h2>Practical industrial design, not exaggerated claims</h2>
        </div>
        <div className="advantage-grid">
          {advantages.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="advantage-item">
                <Icon size={28} aria-hidden />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <HomeVideoShowcase
        eyebrow="Video Showcase"
        title="See COWIN MAGNET product and service details in motion"
        text="A product showcase video helps overseas buyers understand separator operation, communication style, and the practical support we provide before quote confirmation."
        quoteHref="/request-quote"
        quoteLabel="Send Your Requirements"
      />

      <section className="section section-muted">
        <div className="section-heading">
          <span className="eyebrow">Featured Products</span>
          <h2>Core products for iron removal and equipment protection</h2>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <GlobalCustomerNetwork categories={categoryCards} />

      <section className="section section-split industry-overview-section">
        <div className="industry-overview-copy">
          <span className="eyebrow">Industries</span>
          <h2>Where our magnetic separation equipment works</h2>
          <p>
            Reliable magnetic separation solutions for cement, aggregates, recycling, waste processing, and incineration applications.
          </p>
          <Link href="/industries" className="text-link">Explore industry solutions <ArrowRight size={16} aria-hidden /></Link>
        </div>
        <div className="application-mini-grid">
          {applications.map((application) => (
            <Link key={application.industrySlug} href={`/industries/${application.industrySlug}`} className="application-mini">
              <Image
                src={application.image}
                width={1024}
                height={768}
                sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 340px"
                alt={`Magnetic separator used in ${application.name.toLowerCase()} application`}
                loading="lazy"
              />
              {application.iconImage ? (
                <span className="application-mini-icon" aria-hidden="true">
                  <Image src={application.iconImage} width={80} height={80} alt={`${application.name} magnetic separation icon`} loading="lazy" />
                </span>
              ) : null}
              <span>{application.name}</span>
              <p>{application.summary}</p>
              <small>View industry solution <ArrowRight size={14} aria-hidden /></small>
            </Link>
          ))}
        </div>
      </section>

      <section className="section quote-section">
        <div className="quote-intro-card">
          <span className="eyebrow">Fast Inquiry</span>
          <h2>Request a custom magnetic separation quote</h2>
          <p>Send basic project information and we will contact you soon through email or WhatsApp.</p>
          <div className="quote-intro-media">
            <Image
              src="/images/generated/contact-support-cowinmagnet.png"
              width={760}
              height={520}
              alt="Cowinmagnet export service team supporting magnetic separator inquiries"
            />
            <div className="quote-intro-overlay">
              <strong>24-hour response direction</strong>
              <span>Model selection, sourcing coordination and shipment communication.</span>
            </div>
          </div>
          <div className="quote-intro-points">
            <span>Material review</span>
            <span>Model selection</span>
            <span>Export support</span>
          </div>
        </div>
        <QuoteForm compact />
      </section>
    </>
  );
}
