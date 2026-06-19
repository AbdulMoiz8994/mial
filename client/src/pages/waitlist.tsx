import { useEffect } from "react";
import "@/components/waitlist/waitlist.css";
import Navbar from "@/components/waitlist/Navbar";
import Hero from "@/components/waitlist/Hero";
import WaitlistForm from "@/components/waitlist/WaitlistForm";
import WhyJoinEarly from "@/components/waitlist/WhyJoinEarly";
import HowItWorks from "@/components/waitlist/HowItWorks";
import StatsQuote from "@/components/waitlist/StatsQuote";
import Faq from "@/components/waitlist/Faq";
import Footer from "@/components/waitlist/Footer";

export default function Waitlist() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "MIA — Is Coming";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="mia-waitlist bg-[var(--color-ink)]">
      <Navbar />
      <Hero />
      <WaitlistForm />
      <WhyJoinEarly />
      <HowItWorks />
      <StatsQuote />
      <Faq />
      <Footer />
    </main>
  );
}
