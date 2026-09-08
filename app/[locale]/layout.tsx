import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { defaultLocale, getDirection, isLocale, locales, type Locale } from "@/lib/i18n";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// The edge proxy already returns X-Robots-Tag for untranslated locales. Keep
// the document metadata in agreement so alternate URLs stay excluded even
// when an intermediary does not preserve that response header.
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === defaultLocale) return {};
  return { robots: { index: false, follow: true } };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const direction = getDirection(locale as Locale);
  // Keep the document language accurate for assistive technology. Direction is
  // intentionally scoped to the locale shell: applying RTL to <html> causes
  // an oversized scroll coordinate space in Chromium on this layout.
  const documentAttributesScript = `document.documentElement.lang=${JSON.stringify(locale)};`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: documentAttributesScript }} />
      <div className="locale-shell" lang={locale} dir={direction}>{children}</div>
    </>
  );
}
