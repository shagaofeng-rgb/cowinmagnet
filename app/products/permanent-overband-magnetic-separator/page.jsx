import Header from "@/components/Header";
import ProductDetail from "@/components/ProductDetail";
import QuoteSection from "@/components/QuoteSection";

export const metadata = {
  title: "Permanent Overband Magnetic Separator | Cowinmagnet",
  description:
    "Permanent overband magnetic separator for continuous tramp iron removal from conveyor belt systems in recycling, mining, quarrying and bulk material handling."
};

export default function ProductPage() {
  return (
    <>
      <Header />
      <ProductDetail />
      <QuoteSection />
    </>
  );
}
