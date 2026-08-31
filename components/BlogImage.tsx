import Image from "next/image";

const BLOG_IMAGE_FALLBACK = "/images/generated/recycling-application-cowinmagnet.png";

function approvedRemoteBlogImage(src: string) {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === "laikegeo.oss-cn-shanghai.aliyuncs.com" && url.pathname.startsWith("/uploads/");
  } catch {
    return false;
  }
}

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

  const imageSource = /^https?:\/\//i.test(directSource) && !approvedRemoteBlogImage(directSource)
    ? BLOG_IMAGE_FALLBACK
    : directSource;

  return <Image src={imageSource} width={width} height={height} alt={alt} priority={priority} sizes="(max-width: 760px) 92vw, (max-width: 1180px) 44vw, 760px" style={{ objectFit: "cover" }} />;
}
