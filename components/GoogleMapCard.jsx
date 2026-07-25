import { getMessages } from "@/messages";
import ResponsiveImage from "@/components/ResponsiveImage";

const address =
  "Room 110, 1st Floor, Building 2, Qushidai Future Building, Kecheng District, Quzhou City, Zhejiang Province, China";
const googleEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d878.1241356264704!2d118.83929087483493!3d28.96505140816817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1780393502977!5m2!1sen!2sus";
const googleNavUrl =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export default function GoogleMapCard({ locale = "en", title, kicker }) {
  const messages = getMessages(locale);
  const map = messages.map;

  return (
    <section className="map-section" aria-labelledby="map-title">
      <div className="map-card">
        <div className="map-card-header">
          <div>
            <span className="map-kicker">{kicker || map.kicker}</span>
            <h2 id="map-title">{title || map.title}</h2>
            <p>{map.intro}</p>
          </div>
          <ResponsiveImage
            className="map-logo"
            src="/images/cowin-logo.png"
            alt={map.alt}
            width={72}
            height={72}
            sizes="72px"
            quality={85}
          />
        </div>

        <div className="map-frame-wrap">
          <iframe
            title="Cowinmagnet office location map"
            width="600"
            height="420"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={googleEmbedUrl}
          />
        </div>

        <div className="map-actions">
          <p className="map-address">{address}</p>
          <a className="map-button" href={googleNavUrl} target="_blank" rel="noopener noreferrer nofollow">
            {map.button}
          </a>
        </div>
      </div>
    </section>
  );
}
