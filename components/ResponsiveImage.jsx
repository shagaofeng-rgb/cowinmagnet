import Image from "next/image";

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  loading = "lazy",
  quality = 78,
  className
}) {
  const isVector = typeof src === "string" && src.toLowerCase().endsWith(".svg");
  const isInlineImage = typeof src === "string" && src.startsWith("data:");

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : loading}
      quality={quality}
      className={className}
      unoptimized={isVector || isInlineImage}
      decoding="async"
    />
  );
}
