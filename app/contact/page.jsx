import Header from "@/components/Header";
import GoogleMapCard from "@/components/GoogleMapCard";
import QuoteSection from "@/components/QuoteSection";
import DirectContactCard from "@/components/DirectContactCard";

export const metadata = {
  title: "Contact Cowinmagnet | Magnetic Separation Equipment",
  description:
    "Contact Cowinmagnet for magnetic separation equipment sourcing, product selection, OEM/ODM coordination and export support."
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <DirectContactCard />
        <GoogleMapCard title="Visit Cowinmagnet in Quzhou, Zhejiang" kicker="Contact location" />
        <QuoteSection title="Send your conveyor details for product recommendation." />
      </main>
    </>
  );
}
