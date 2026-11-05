"use client";

import Image from "next/image";
import { useState } from "react";

export function ResponsiveArticleImage({ src, fallback, width, height, alt, priority = false, sizes }: {
  src: string; fallback: string; width: number; height: number; alt: string; priority?: boolean; sizes: string;
}) {
  const [failed, setFailed] = useState(false);
  return <Image
    src={failed ? fallback : src}
    width={width}
    height={height}
    alt={failed ? "COWIN MAGNET industrial magnetic separation" : alt}
    priority={priority}
    sizes={sizes}
    style={{ objectFit: "cover" }}
    onError={() => setFailed(true)}
  />;
}
