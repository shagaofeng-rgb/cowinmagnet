import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedApplicationDetailPage } from "@/components/LocalizedPages";
import { applications } from "@/data/applications";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return applications.map((application) => ({ slug: application.industrySlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const application = applications.find((item) => item.industrySlug === slug);
  if (!application) return {};

  return {
    title: application.seoTitle,
    description: application.seoDescription,
    alternates: { canonical: `/industries/${application.industrySlug}` }
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const application = applications.find((item) => item.industrySlug === slug);
  if (!application) notFound();
  return <LocalizedApplicationDetailPage locale="en" application={application} />;
}
