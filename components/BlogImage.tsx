import Image from "next/image";

type BlogImageProps = {
  src: string;
  width: number;
  height: number;
  alt: string;
  priority?: boolean;
};

// The editorial image proxy needs query parameters, which Next's local image
// optimizer intentionally restricts. Its route validates source URLs itself.
export function BlogImage({ src, width, height, alt, priority = false }: BlogImageProps) {
  if (src.startsWith("/api/news-image?")) {
    return (
      <img
        src={src}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        style={{ objectFit: "cover" }}
      />
    );
  }

  return <Image src={src} width={width} height={height} alt={alt} priority={priority} />;
}
