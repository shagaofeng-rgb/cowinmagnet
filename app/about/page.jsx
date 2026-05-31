import Header from "@/components/Header";
import GoogleMapCard from "@/components/GoogleMapCard";
import QuoteSection from "@/components/QuoteSection";

export const metadata = {
  title: "About Cowinmagnet | Magnetic Separation Export Service Partner",
  description:
    "Cowinmagnet helps global buyers source suitable magnetic separation equipment and coordinate OEM/ODM, inspection and export service."
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="about-hero">
          <div className="section-copy">
            <p className="eyebrow">About Cowinmagnet</p>
            <h1>Professional Magnetic Separation Equipment Export Service Partner</h1>
            <p>
              Cowinmagnet is a magnetic separation equipment brand operated by Quzhou Qiying Import & Export Co., Ltd.
              We help overseas buyers source suitable magnetic separators, coordinate customization, check quality and
              communicate export requirements.
            </p>
          </div>
          <div className="value-grid">
            <article><span>Selection</span><h3>Product matching</h3><p>Recommend equipment according to working conditions and conveyor details.</p></article>
            <article><span>Service</span><h3>Export support</h3><p>Coordinate documentation, packaging, shipment and long-term communication.</p></article>
            <article><span>Custom</span><h3>OEM/ODM coordination</h3><p>Support size, magnetic strength, installation method, color, logo and packaging needs.</p></article>
          </div>
        </section>
        <GoogleMapCard title="Cowinmagnet Office Location" kicker="Company location" />
        <QuoteSection title="Talk to Cowinmagnet about your magnetic separation project." />
      </main>
    </>
  );
}
