import Header from "@/components/Header";
import InquiryForm from "@/components/InquiryForm";

export const metadata = {
  title: "Request a Quote | Cowinmagnet",
  description:
    "Submit your magnetic separation equipment inquiry and send material details to Cowinmagnet for product recommendation."
};

export default function InquiryPage() {
  return (
    <>
      <Header />
      <main>
        <section className="inquiry-hero">
          <div>
            <p className="eyebrow">B2B inquiry</p>
            <h1>Request Magnetic Separation Equipment Recommendation</h1>
            <p>
              Send us your material type, conveyor width, installation condition and iron removal requirement. Our team
              will help you match a suitable magnetic separation solution.
            </p>
          </div>
          <aside className="inquiry-side-card">
            <span>Response checklist</span>
            <ul>
              <li>Product model recommendation</li>
              <li>Basic configuration discussion</li>
              <li>OEM/ODM coordination support</li>
              <li>Export communication and quotation follow-up</li>
            </ul>
          </aside>
        </section>

        <section className="inquiry-panel-section">
          <div className="inquiry-panel-copy">
            <p className="eyebrow">Contact form</p>
            <h2>Tell us what you need.</h2>
            <p>
              Required fields are marked clearly. Phone numbers support international formats such as +1, +44, +971,
              +966 and +86.
            </p>
          </div>
          <InquiryForm />
        </section>
      </main>
    </>
  );
}
