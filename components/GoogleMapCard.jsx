import { getMessages } from "@/messages";
import ResponsiveImage from "@/components/ResponsiveImage";

const address =
  "Room 110, 1st Floor, Building 1, Qushidai Future Building, Kecheng District, Quzhou, Zhejiang Province, China";
const googleEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1037.8381299189082!2d118.84405914474489!3d28.96195222141102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sRoom%20110%2C%201st%20Floor%2C%20Building%201%2C%20Qushidai%20Future%20Building%2C%20Kecheng%20District%2C%20Quzhou%2C%20Zhejiang%20Province%2C%20China!5e0!3m2!1sen!2sus!4v1780204792478!5m2!1sen!2sus";

export default function GoogleMapCard({ locale = "en", title, kicker }) {
  const messages = getMessages(locale);
  const map = messages.map;
  const query = encodeURIComponent(address);
  const googleNavUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

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
            src="/assets/logo.jpg"
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
