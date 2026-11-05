import Image from "next/image";
import Link from "next/link";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  imageNote?: string;
  mediaStyle?: "equipment" | "scene";
  compact?: boolean;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  imageNote,
  mediaStyle = "scene",
  compact = false,
  primaryHref = "/request-quote",
  primaryLabel = "Get a Quote",
  secondaryHref,
  secondaryLabel
}: PageHeroProps) {
  return (
    <section className={`page-hero${compact ? " page-hero--compact" : ""}${mediaStyle === "equipment" ? " page-hero--equipment" : ""}`}>
      <div className="page-hero-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {primaryHref || (secondaryHref && secondaryLabel) ? <div className="hero-actions">
          {primaryHref ? <Link href={primaryHref} className="btn btn-primary">{primaryLabel}</Link> : null}
          {secondaryHref && secondaryLabel && (
            <Link href={secondaryHref} className="btn btn-secondary">{secondaryLabel}</Link>
          )}
        </div> : null}
      </div>
      {image && (
        <div className="page-hero-media">
          <Image src={image} width={780} height={520} sizes="(max-width: 900px) 100vw, 48vw" alt={imageAlt || title} priority />
          {imageNote ? <span className="inner-hero-image-note">{imageNote}</span> : null}
        </div>
      )}
    </section>
  );
}
