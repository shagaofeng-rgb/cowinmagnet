import Image from "next/image";

type BlogImageProps = {
  src: string;
  width: number;
  height: number;
  alt: string;
  priority?: boolean;
};

export function BlogImage({ src, width, height, alt, priority = false }: BlogImageProps) {
  const directSource = src.startsWith("/api/news-image?")
    ? new URL(src, "https://www.cowinmagnet.com").searchParams.get("src") || ""
    : src;

  if (/^https?:\/\//i.test(directSource)) {
    return (
      <img
        src={directSource}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        style={{ objectFit: "cover" }}
      />
    );
  }

  return <Image src={directSource} width={width} height={height} alt={alt} priority={priority} />;
}
