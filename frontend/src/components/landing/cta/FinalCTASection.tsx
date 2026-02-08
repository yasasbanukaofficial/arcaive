import React from "react";
import CTABackground from "./CTABackground";
import CTAContent from "./CTAContent";
import CTAButton from "./CTAButton";

const FinalCTASection: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-[#0a0a0a] flex items-center justify-center">
      <section className="relative w-full max-w-6xl aspect-[1.4/1] sm:aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[3.2/1] overflow-hidden rounded-lg sm:rounded-xl border border-zinc-900/50">
        <CTABackground
          imageUrl="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
          imageAlt="Atmospheric Landscape"
        />

        <div className="relative z-10 h-full w-full flex flex-col justify-center px-5 sm:px-8 md:px-16">
          <CTAContent
            heading="Step into the future,"
            headingHighlight="guided by AI clarity"
            subtext="Experience the tool right now. Just dive in and see what AI can do for you."
          />

          <CTAButton text="Try It Now" href="/get-started" />
        </div>
      </section>
    </div>
  );
};

export default FinalCTASection;
