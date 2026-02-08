import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import Features from "@/components/landing/Features";
import TestimonialsSection from "@/components/landing/testimonials/TestimonialsSection";
import HowItWorksSection from "@/components/landing/how/HowItWorksSection";
import TabsSection from "@/components/landing/TabsSection";
import Benefits from "@/components/landing/benefits/Benefits";
import PricingSection from "@/components/landing/pricing/PricingSection";
import FAQSection from "@/components/landing/faq/FAQSection";
import FinalCTASection from "@/components/landing/cta/FinalCTASection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/10">
      <Navbar />
      <Hero />
      <Features />
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
