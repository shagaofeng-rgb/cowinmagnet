import "./globals.css";
import { Suspense } from "react";
import { Inter, Montserrat, Noto_Sans_SC, Roboto_Mono } from "next/font/google";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { siteUrl } from "@/data/i18n";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat"
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono"
});

const notoSansSc = Noto_Sans_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-sc"
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cowinmagnet | Magnetic Separation Equipment",
  description:
    "Cowinmagnet helps global industrial buyers source, select, inspect and export suitable magnetic separation equipment from China."
};

const criticalCss = `
html{background:#050b14}
body{margin:0;background:#050b14;color:#fff;font-family:var(--font-inter),Arial,sans-serif}
.site-header{min-height:72px;z-index:80}
.brand img,.footer-logo img,.map-logo{aspect-ratio:1/1}
.hero-visual img{display:block;width:100%;height:auto;aspect-ratio:1983/793}
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${robotoMono.variable} ${notoSansSc.variable}`}
    >
      <head>
        <style id="critical-css" dangerouslySetInnerHTML={{ __html: criticalCss }} />
        <link
          rel="preload"
          as="image"
          href="/assets/magnetic-separator-banner-800.avif"
          type="image/avif"
          imageSrcSet="/assets/magnetic-separator-banner-480.avif 480w, /assets/magnetic-separator-banner-800.avif 800w, /assets/magnetic-separator-banner-1200.avif 1200w, /assets/magnetic-separator-banner-1600.avif 1600w"
          imageSizes="(max-width: 640px) 92vw, (max-width: 980px) 88vw, 48vw"
          fetchPriority="high"
        />
      </head>
      <body>
        {children}
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
