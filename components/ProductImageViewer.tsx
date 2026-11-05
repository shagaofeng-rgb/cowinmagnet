"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useRef } from "react";

export function ProductImageViewer({ src, title, openLabel, closeLabel }: { src: string; title: string; openLabel: string; closeLabel: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <div className="product-media-panel">
    <button type="button" className="product-primary-image" onClick={() => dialog.current?.showModal()} aria-label={`${openLabel}: ${title}`}>
      <Image src={src} alt={title} width={920} height={680} priority sizes="(max-width: 760px) 95vw, (max-width: 1260px) 47vw, 580px" />
      <span><Maximize2 size={16} aria-hidden />{openLabel}</span>
    </button>
    <dialog ref={dialog} className="inner-image-dialog" aria-label={title} onClick={(event) => { if (event.currentTarget === event.target) event.currentTarget.close(); }}>
      <div><button type="button" className="inner-dialog-close" aria-label={closeLabel} onClick={() => dialog.current?.close()}><X size={23} aria-hidden /></button><Image src={src} alt={title} width={1280} height={920} sizes="90vw" /></div>
    </dialog>
  </div>;
}
