"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      infinite: false,
    });

    // expose Lenis instance so other components can trigger programmatic smooth scroll
    // (useful for hash/link navigation)
    // @ts-ignore
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      // cleanup Lenis and remove global reference
      try {
        // @ts-ignore
        if ((window as any).lenis) delete (window as any).lenis;
      } catch (e) {}
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
