import socialLinks from "@/data/socialLinks.json";

const contactItems = [
  {
    label: "Email",
    value: "davidsha@cowinmagnet.com",
    href: "mailto:davidsha@cowinmagnet.com",
    note: "Send drawings, material details or product requirements directly."
  },
  {
    label: "Phone / WhatsApp",
    value: "+86 156 6513 5205",
    href: "https://wa.me/8615665135205",
    note: "Call or add WhatsApp for faster communication."
  },
  {
    label: "Office",
    value: "Quzhou, Zhejiang, China",
    href: "https://maps.app.goo.gl/P1YyVHoCdGBd9ef37",
    note: "Room 110, 1st Floor, Building 2, Qushidai Future Building."
  }
];

export default function DirectContactCard() {
  return (
    <section className="direct-contact-section" aria-labelledby="direct-contact-title">
      <div className="direct-contact-copy">
        <p className="eyebrow">Direct Contact</p>
        <h1 id="direct-contact-title">Contact Us Directly</h1>
        <p>
          If you do not want to fill in the inquiry form, you can contact us directly by email, phone or WhatsApp.
        </p>
      </div>

      <div className="direct-contact-grid">
        {contactItems.map((item) => (
          <a className="direct-contact-card" href={item.href} key={item.label} target={item.label === "Email" ? undefined : "_blank"} rel={item.label === "Email" ? undefined : "noopener noreferrer nofollow"}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.note}</small>
          </a>
        ))}
      </div>

      <div className="direct-contact-actions">
        <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer nofollow">
          Message on WhatsApp
        </a>
        <a href="mailto:davidsha@cowinmagnet.com">Email Now</a>
      </div>
    </section>
  );
}
