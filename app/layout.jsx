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
    "Cowinmagnet helps global industrial buyers source magnetic separation equipment, match products by working conditions and coordinate export support."
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${robotoMono.variable} ${notoSansSc.variable}`}
    >
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
