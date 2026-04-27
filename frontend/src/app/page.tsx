import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import Features from "@/features/landing/components/Features";
import StatsSection from "@/features/landing/components/StatsSection";
import TestimonialsSection from "@/features/landing/components/testimonials/TestimonialsSection";
import HowItWorksSection from "@/features/landing/components/how/HowItWorksSection";
import TabsSection from "@/features/landing/components/TabsSection";
import Benefits from "@/features/landing/components/benefits/Benefits";
import PricingSection from "@/features/landing/components/pricing/PricingSection";
import FAQSection from "@/features/landing/components/faq/FAQSection";
import FinalCTASection from "@/features/landing/components/cta/FinalCTASection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-[#D4F461] selection:text-black">
      <Navbar />
      <Hero />
      <Features />
      <StatsSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <TabsSection />
      <Benefits />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
