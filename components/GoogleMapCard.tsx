import Link from "next/link";
import Image from "next/image";
import { ExternalLink, MapPin } from "lucide-react";
import { site } from "@/data/site";
import type { Locale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

const googleEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d878.1241356264704!2d118.839750!3d28.965204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1780393502977!5m2!1sen!2sus";
const googleMapsUrl = site.googleMapsUrl;

type GoogleMapCardProps = {
  address?: string;
  title?: string;
  note?: string;
  locale?: Locale;
};

export function GoogleMapCard({
  address = site.address,
  title,
  note,
  locale = "en"
}: GoogleMapCardProps) {
  const ui = getPublicUi(locale);
  return (
    <section className="map-card" aria-label={ui.mapLocation}>
      <div className="map-card-header">
        <div>
          <span className="map-kicker">
            <MapPin size={16} aria-hidden />
            {ui.mapLocation}
          </span>
          <h2>{title || ui.mapTitle}</h2>
          <p>{address}</p>
          <p className="map-note">{note || ui.mapNote}</p>
        </div>
        <Link href={googleMapsUrl} className="map-button" target="_blank" rel="noopener noreferrer nofollow">
          {ui.mapOpen}
          <ExternalLink size={16} aria-hidden />
        </Link>
      </div>
      <div className="map-frame-wrap">
        <div className="map-logo-marker" aria-hidden>
          <Image src="/images/cowin-logo.png" width={42} height={42} alt="COWIN MAGNET map marker logo" />
        </div>
        <iframe
          title={`${site.name} location map`}
          src={googleEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="map-card-glow" aria-hidden />
    </section>
  );
}
