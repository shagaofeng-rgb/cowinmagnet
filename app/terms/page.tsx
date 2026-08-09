import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the COWIN MAGNET website, product information, inquiries, and external resources.",
  alternates: { canonical: "/terms" }
};

export default function TermsPage() {
  return (
    <section className="section legal-page">
      <span className="eyebrow">Terms</span>
      <h1>Terms of Use</h1>
      <p>
        This website provides product information, application notes, industry content, and inquiry channels for B2B buyers.
        By using the website, you agree to use the content for lawful business evaluation and communication.
      </p>
      <h2>Product Information</h2>
      <p>
        Product pages and technical descriptions are for general selection reference. Final equipment configuration, dimensions, magnetic strength,
        installation method, and quotation details must be confirmed according to the buyer&apos;s actual working conditions.
      </p>
      <h2>News and External Sources</h2>
      <p>
        News pages may summarize public industry information and include source links. External websites are controlled by their own operators.
        We review sources for relevance, but buyers should verify critical market, regulatory, and technical information before making decisions.
      </p>
      <h2>Website Availability</h2>
      <p>
        We work to keep the website, forms, and data systems available, but temporary interruptions may occur during maintenance, hosting incidents,
        network issues, or third-party service limits.
      </p>
      <h2>Contact</h2>
      <p>
        For questions about these terms, contact {site.legalName} at <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </section>
  );
}
