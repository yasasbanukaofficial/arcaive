import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import TestimonialsSection from "@/components/landing/testimonials/TestimonialsSection";
import HowItWorksSection from "@/components/landing/how/HowItWorksSection";
import TabsSection from "@/components/TabsSection";
import Benefits from "@/components/Benefits";
import PricingSection from "@/components/landing/pricing/PricingSection";
import FAQSection from "@/components/landing/faq/FAQSection";
import FinalCTASection from "@/components/cta/FinalCTASection";
import Footer from "@/components/Footer";

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
