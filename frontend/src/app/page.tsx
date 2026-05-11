import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import Features from "@/features/landing/components/Features";
import CoreValueSection from "@/features/landing/components/CoreValueSection";
import HowItWorksSection from "@/features/landing/components/how/HowItWorksSection";
import Benefits from "@/features/landing/components/benefits/Benefits";
import PricingSection from "@/features/landing/components/pricing/PricingSection";
import FinalCTASection from "@/features/landing/components/cta/FinalCTASection";
import Footer from "@/components/layout/Footer";
import Experience from "@/components/animations/Experience";

export default function Home() {
  return (
    <main className="relative selection:bg-[var(--text-primary)] selection:text-[var(--text-primary)]">
      <Experience />
      
      <div className="relative z-10 w-full min-h-screen">
        <Navbar />
        <Hero />
        <Features />
        <CoreValueSection />
        <HowItWorksSection />
        <Benefits />
        <PricingSection />
        <FinalCTASection />
        <Footer />
      </div>
    </main>
  );
}
