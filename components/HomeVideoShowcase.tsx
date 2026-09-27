"use client";

import { PlayCircle } from "lucide-react";
import { useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

type HomeVideoShowcaseProps = {
  eyebrow: string;
  title: string;
  locale?: Locale;
};

export function HomeVideoShowcase({ eyebrow, title, locale = "en" }: HomeVideoShowcaseProps) {
  const ui = getPublicUi(locale);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playError, setPlayError] = useState(false);

  async function playVideo() {
    const video = videoRef.current;
    if (!video) return;
    setPlayError(false);
    try {
      await video.play();
      setIsPlaying(true);
    } catch {
      setPlayError(true);
    }
  }

  return (
    <div className="video-showcase" aria-labelledby="home-video-title">
      <div className="video-showcase-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h2 id="home-video-title">{title}</h2>
      </div>
      <div className="video-tech-card">
        <div className="home-video-frame">
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            poster="/assets/magnetic-separator-banner-800.webp"
            aria-label={title}
            onPlay={() => { setIsPlaying(true); setPlayError(false); }}
            onPause={() => setIsPlaying(false)}
            onError={() => setPlayError(true)}
          >
            <source src="/videos/cowinmagnet-home-product-showcase-2026.mp4" type="video/mp4" />
            <track
              kind="captions"
              src="/videos/cowinmagnet-home-product-showcase-2026.en.vtt"
              srcLang="en"
              label="English"
              default={locale === "en"}
            />
            {locale !== "en" ? <track kind="captions" src={`/videos/cowinmagnet-home-product-showcase-2026.${locale}.vtt`} srcLang={locale} label={locale.toUpperCase()} default /> : null}
            {ui.videoUnsupported}
          </video>
          {!isPlaying ? (
            <button type="button" className="video-load-button" onClick={playVideo} aria-label={ui.videoPlay}>
              <PlayCircle size={44} aria-hidden />
            </button>
          ) : null}
          <div className="video-caption"><strong>{ui.videoCaption}</strong><span>0:00 / 1:13</span></div>
        </div>
        {playError ? <p className="video-play-error" role="alert">{ui.videoError}</p> : null}
      </div>
    </div>
  );
}
