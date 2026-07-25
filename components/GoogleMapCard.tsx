import Link from "next/link";
import Image from "next/image";
import { ExternalLink, MapPin } from "lucide-react";
import { site } from "@/data/site";

const googleEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d878.1241356264704!2d118.83929087483493!3d28.96505140816817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1780393502977!5m2!1sen!2sus";
const googleMapsUrl =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;

type GoogleMapCardProps = {
  address?: string;
  title?: string;
  note?: string;
};

export function GoogleMapCard({
  address = site.address,
  title = "Visit COWIN MAGNET",
  note = "Use Google Maps for route planning, nearby roads, and satellite view."
}: GoogleMapCardProps) {
  return (
    <section className="map-card" aria-label="Company location map">
      <div className="map-card-header">
        <div>
          <span className="map-kicker">
            <MapPin size={16} aria-hidden />
            Company Location
          </span>
          <h2>{title}</h2>
          <p>{address}</p>
          <p className="map-note">{note}</p>
        </div>
        <Link href={googleMapsUrl} className="map-button" target="_blank" rel="noopener noreferrer nofollow">
          View on Google Maps
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
