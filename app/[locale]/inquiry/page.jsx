import InquiryForm from "@/components/InquiryForm";
import { createSeoMetadata } from "@/data/i18n";
import { getMessages } from "@/messages";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return createSeoMetadata(locale, "/inquiry", {
    title: `${messages.nav.inquiry} | Cowinmagnet`,
    description: messages.quote.text
  });
}

export default async function LocaleInquiryPage({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);

  return (
    <main>
      <section className="inquiry-hero">
        <div>
          <p className="eyebrow">{messages.quote.eyebrow}</p>
          <h1>{messages.quote.title}</h1>
          <p>{messages.quote.text}</p>
        </div>
        <aside className="inquiry-side-card">
          <span>{messages.quote.proof[0]}</span>
          <ul>
            {messages.quote.proof.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="inquiry-panel-section">
        <div className="inquiry-panel-copy">
          <p className="eyebrow">{messages.nav.inquiry}</p>
          <h2>{messages.quote.title}</h2>
          <p>{messages.quote.text}</p>
        </div>
        <InquiryForm />
      </section>
    </main>
  );
}
