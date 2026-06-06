import BrandIcon from "@/components/BrandIcon";

const whatsappMessageUrl = "https://wa.me/message/FROFUJEVUZDOC1";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappMessageUrl}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact COWIN MAGNET on WhatsApp"
    >
      <span className="whatsapp-float-ring" aria-hidden />
      <span className="whatsapp-float-wave whatsapp-float-wave-one" aria-hidden />
      <span className="whatsapp-float-wave whatsapp-float-wave-two" aria-hidden />
      <span className="whatsapp-float-badge" aria-hidden />
      <BrandIcon name="whatsapp" className="whatsapp-float-icon" />
    </a>
  );
}
