import BrandIcon from "@/components/BrandIcon";
import socialLinks from "@/data/socialLinks.json";

export default function FloatingWhatsApp({ label = "WhatsApp" }) {
  return (
    <a
      className="whatsapp-float"
      href={socialLinks.whatsapp}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={label}
      title={label}
    >
      <BrandIcon name="whatsapp" />
      <span>WhatsApp</span>
    </a>
  );
}
