import socialLinks from "@/data/socialLinks.json";

const contactItems = [
  {
    label: "Email",
    value: "davidsha@cowinmagnet.com",
    href: "mailto:davidsha@cowinmagnet.com",
    note: "Send drawings, conveyor details or product requirements directly."
  },
  {
    label: "Phone / WhatsApp",
    value: "+86 156 6513 5205",
    href: "tel:+8615665135205",
    note: "Call or add WhatsApp for faster communication."
  },
  {
    label: "Office",
    value: "Quzhou, Zhejiang, China",
    href: "https://www.google.com/maps/search/?api=1&query=Room%20110%2C%201st%20Floor%2C%20Building%201%2C%20Qushidai%20Future%20Building%2C%20Kecheng%20District%2C%20Quzhou%2C%20Zhejiang%20Province%2C%20China",
    note: "Room 110, 1st Floor, Building 1, Qushidai Future Building."
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
          <a className="direct-contact-card" href={item.href} key={item.label} target={item.label === "Office" ? "_blank" : undefined} rel={item.label === "Office" ? "noopener noreferrer" : undefined}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.note}</small>
          </a>
        ))}
      </div>

      <div className="direct-contact-actions">
        <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">
          Message on WhatsApp
        </a>
        <a href="mailto:davidsha@cowinmagnet.com">Email Now</a>
      </div>
    </section>
  );
}
