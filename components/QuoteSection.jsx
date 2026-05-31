import { getMessages } from "@/messages";

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
      <form className="quote-form">
        <label>
          {quote.productRequirement}
          <select>
            <option>Permanent overband magnetic separator</option>
            <option>Suspended permanent magnet</option>
            <option>Electromagnetic separator</option>
            <option>Magnetic pulley / drum / bar / grid</option>
          </select>
        </label>
        <label>
          {quote.conveyorWidth}
          <input type="text" placeholder="800 mm, 1000 mm..." />
        </label>
        <label>
          {quote.materialType}
          <input type="text" placeholder="Recycling waste, ore, coal, aggregate..." />
        </label>
        <label>
          {quote.emailWhatsapp}
          <input type="text" placeholder="Your email or WhatsApp number" />
        </label>
        <button className="button primary full" type="button">
          {quote.send}
        </button>
      </form>
    </section>
  );
}
