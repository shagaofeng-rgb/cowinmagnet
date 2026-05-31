import { getMessages } from "@/messages";
import InquiryForm from "@/components/InquiryForm";

export default function QuoteSection({ locale = "en", title }) {
  const messages = getMessages(locale);
  const quote = messages.quote;
  const sectionTitle = title || quote.title;

  return (
    <section className="quote-section" id="quote">
      <div className="quote-copy">
        <p className="eyebrow">{quote.eyebrow}</p>
        <h2>{sectionTitle}</h2>
        <p>{quote.text}</p>
        <div className="quote-proof">
          {quote.proof.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <InquiryForm />
    </section>
  );
}
