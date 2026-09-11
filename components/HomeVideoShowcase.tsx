"use client";

import { PlayCircle } from "lucide-react";
import { useRef, useState } from "react";

type HomeVideoShowcaseProps = {
  eyebrow: string;
  title: string;
};

export function HomeVideoShowcase({ eyebrow, title }: HomeVideoShowcaseProps) {
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
            aria-label="COWIN MAGNET product and service showcase video"
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
              default
            />
            Your browser does not support the video tag.
          </video>
          {!isPlaying ? (
            <button type="button" className="video-load-button" onClick={playVideo} aria-label="Play COWIN MAGNET product showcase video">
              <PlayCircle size={44} aria-hidden />
            </button>
          ) : null}
          <div className="video-caption"><strong>Reliable Magnetic Separation<br />for Real-World Challenges</strong><span>0:00 / 1:13</span></div>
        </div>
        {playError ? <p className="video-play-error" role="alert">The video could not start. Please use the play control again or open it in a new tab.</p> : null}
      </div>
    </div>
  );
}
