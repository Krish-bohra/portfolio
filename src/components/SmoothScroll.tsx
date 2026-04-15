"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // 1. Initialize Lenis with premium settings
    const lenis = new Lenis({
      duration: isTouch ? 1.0 : 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: isTouch ? 1.5 : 2.0,
      lerp: isTouch ? 0.08 : 0.1, 
      infinite: false,
    });

    lenisRef.current = lenis;

    // 2. Efficiently bridge Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 3. Hook into GSAP's ticker for perfectly timed frames
    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateRaf);

    // 4. Force GSAP to use Lenis's ticker
    gsap.ticker.lagSmoothing(0);

    // Initial refresh
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateRaf);
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
