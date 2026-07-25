import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import MetaPixel from "@/components/MetaPixel";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { organizationSchema } from "@/lib/seo";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "COWIN MAGNET | Magnetic Separator Supplier",
    template: "%s | COWIN MAGNET"
  },
  description: site.description,
  keywords: [
    "magnetic separator supplier",
    "overhead magnetic separator",
    "suspended magnetic separator",
    "self-cleaning magnetic separator",
    "magnetic pulley",
    "magnetic drum separator",
    "grate magnet",
    "magnetic bar"
  ],
  openGraph: {
    type: "website",
    url: site.url,
    title: "COWIN MAGNET | Magnetic Separator Supplier",
    description: site.description,
    images: ["/images/catalog/page-1-image-9-2546x1532.jpg"]
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon-cowin-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-cowin-48.png", sizes: "48x48", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon-cowin.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"]
  },
  manifest: "/site.webmanifest"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={organizationSchema()} />
        <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
