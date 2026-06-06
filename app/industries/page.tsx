import type { Metadata } from "next";
import { LocalizedIndustriesPage } from "@/components/LocalizedPages";

export const metadata: Metadata = {
  title: "Industry Magnetic Separation Solutions | COWIN MAGNET",
  description:
    "Explore magnetic separation solutions for recycling, mining, cement and aggregate, and food processing industries.",
  alternates: { canonical: "/industries" }
};

export default function IndustriesPage() {
  return <LocalizedIndustriesPage locale="en" />;
}
