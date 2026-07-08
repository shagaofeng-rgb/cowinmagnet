import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for COWIN MAGNET website inquiries, analytics, and business communication.",
  alternates: { canonical: "/privacy-policy" }
};

export default function PrivacyPolicyPage() {
  return (
    <section className="section legal-page">
      <span className="eyebrow">Privacy</span>
      <h1>Privacy Policy</h1>
      <p>
        COWIN MAGNET uses this website to receive B2B product inquiries, understand website performance, and respond to buyer requests.
        We only collect information that helps us communicate about magnetic separation equipment and related service needs.
      </p>
      <h2>Information We Receive</h2>
      <p>
        Inquiry forms may collect your name, company, email, phone, country, product interest, application details, and message content.
        Website analytics may record page views, referrer information, device type, browser type, approximate region, and campaign parameters.
      </p>
      <h2>How We Use Information</h2>
      <p>
        We use inquiry information to answer product questions, prepare selection support, follow up on quotations, and maintain internal service records.
        Analytics information is used to improve page performance, SEO/GEO quality, campaign attribution, and website reliability.
      </p>
      <h2>Sharing and Retention</h2>
      <p>
        We do not sell website inquiry data. Information may be processed by hosting, email, analytics, and database service providers that support the website.
        Business inquiry records are retained as long as needed for communication, compliance, and service continuity.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy-related questions, contact us at <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </section>
  );
}
