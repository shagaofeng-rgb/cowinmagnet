import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Editorial Policy | COWIN MAGNET",
  description: "How COWIN MAGNET prepares and reviews editorial guidance and industry news for industrial buyers.",
  alternates: { canonical: "/editorial-policy" }
};

export default function EditorialPolicyPage() {
  return <section className="section legal-page"><div className="section-heading"><span className="eyebrow">Editorial policy</span><h1>How COWIN MAGNET publishes technical content</h1><p>COWIN MAGNET publishes practical material for industrial buyers. Content is prepared from approved product information, clearly attributed sources where a news item depends on external reporting, and editorial review for accuracy and relevance.</p></div><div className="legal-copy"><h2>Accuracy and boundaries</h2><p>Configuration, performance and suitability depend on material and site conditions. We do not present unverified technical figures, certifications, customer projects or commercial commitments as facts.</p><h2>News and guidance</h2><p>News pages distinguish sourced facts from editorial analysis. Technical and procurement guides focus on selection questions and do not use unrelated current events as evidence.</p><h2>Corrections</h2><p>To report an accuracy issue, contact <a href={`mailto:${site.email}`}>{site.email}</a>. We retain publication dates and update material content when a correction is verified.</p></div></section>;
}
