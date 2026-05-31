import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { isLocale, isRtl, locales } from "@/data/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <div className="locale-shell" lang={locale} dir={isRtl(locale) ? "rtl" : "ltr"}>
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
      <FloatingWhatsApp label="WhatsApp" />
    </div>
  );
}
