"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { useState } from "react";

type HomeVideoShowcaseProps = {
  eyebrow: string;
  title: string;
  text: string;
  quoteHref: string;
  quoteLabel: string;
};

export function HomeVideoShowcase({ eyebrow, title, text, quoteHref, quoteLabel }: HomeVideoShowcaseProps) {
  const [loadVideo, setLoadVideo] = useState(false);
  return (
    <section className="section video-showcase" aria-labelledby="home-video-title">
      <div className="video-showcase-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h2 id="home-video-title">{title}</h2>
        <p>{text}</p>
        <div className="video-feature-list">
          <span>Product details</span>
          <span>Service communication</span>
          <span>Global buyer support</span>
        </div>
        <Link href={quoteHref} className="btn btn-primary">
          {quoteLabel}
        </Link>
      </div>
      <div className="video-tech-card">
        <div className="video-card-header">
          <span><PlayCircle size={16} aria-hidden /> COWIN MAGNET Video</span>
          <strong>16:9</strong>
        </div>
        <div className="home-video-frame">
          <video
            {...(loadVideo ? { src: "/videos/cowinmagnet-home-product-showcase-2026.mp4" } : {})}
            controls
            playsInline
            preload="none"
            poster="/assets/magnetic-separator-banner-800.webp"
            aria-label="COWIN MAGNET product and service showcase video"
          >
            <track
              kind="captions"
              src="/videos/cowinmagnet-home-product-showcase-2026.en.vtt"
              srcLang="en"
              label="English"
              default
            />
            Your browser does not support the video tag.
          </video>
          {!loadVideo ? (
            <button type="button" className="video-load-button" onClick={() => setLoadVideo(true)}>
              <PlayCircle size={20} aria-hidden /> Load product showcase video
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
