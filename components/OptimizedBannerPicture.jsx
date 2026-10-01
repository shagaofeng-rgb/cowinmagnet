export default function OptimizedBannerPicture({
  alt,
  className,
  eager = false,
  sizes = "(max-width: 640px) 92vw, (max-width: 980px) 88vw, 48vw"
}) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet="/assets/magnetic-separator-banner-480-cowin-brand-20261001.avif 480w, /assets/magnetic-separator-banner-800-cowin-brand-20261001.avif 800w, /assets/magnetic-separator-banner-1200-cowin-brand-20261001.avif 1200w, /assets/magnetic-separator-banner-1600-cowin-brand-20261001.avif 1600w"
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet="/assets/magnetic-separator-banner-480-cowin-brand-20261001.webp 480w, /assets/magnetic-separator-banner-800-cowin-brand-20261001.webp 800w, /assets/magnetic-separator-banner-1200-cowin-brand-20261001.webp 1200w, /assets/magnetic-separator-banner-1600-cowin-brand-20261001.webp 1600w"
        sizes={sizes}
      />
      <img
        className={className}
        src="/assets/magnetic-separator-banner-1200-cowin-brand-20261001.webp"
        alt={alt}
        width="1983"
        height="793"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding={eager ? "sync" : "async"}
      />
    </picture>
  );
}
