import EditorialPolicyPage, { metadata as baseMetadata } from "@/app/editorial-policy/page";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const metadata = baseMetadata;
export default async function LocalizedEditorialPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  if (!isLocale((await params).locale)) notFound();
  return <EditorialPolicyPage />;
}
