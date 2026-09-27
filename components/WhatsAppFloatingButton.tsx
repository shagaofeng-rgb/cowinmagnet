"use client";

import { usePathname } from "next/navigation";
import BrandIcon from "@/components/BrandIcon";
import { getLocaleFromPath } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

const whatsappMessageUrl = "https://wa.me/message/FROFUJEVUZDOC1";

export function WhatsAppFloatingButton() {
  const ui = getPublicUi(getLocaleFromPath(usePathname()));
  return (
    <a
      href={whatsappMessageUrl}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${ui.contact} COWIN MAGNET — WhatsApp`}
      data-whatsapp-placement="floating"
      data-whatsapp-component="global-floating-button"
    >
      <span className="whatsapp-float-ring" aria-hidden />
      <span className="whatsapp-float-wave whatsapp-float-wave-one" aria-hidden />
      <span className="whatsapp-float-wave whatsapp-float-wave-two" aria-hidden />
      <span className="whatsapp-float-badge" aria-hidden />
      <BrandIcon name="whatsapp" className="whatsapp-float-icon" />
    </a>
  );
}
