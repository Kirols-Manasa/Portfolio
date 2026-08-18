  "use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LENIS_SCROLL_EVENT, type LenisScrollOptions } from "@/lib/lenis";
import { useIntro } from "@/intro";

export default function LinesScroll({ children }: { children: React.ReactNode }) {
  const { introComplete } = useIntro();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1.5,
      touchMultiplier: 1.2,
      infinite: false,
      respectReducedMotion: false,
    });

    if (!introComplete) {
      lenis.stop();
    } else {
      lenis.start();
    }

    lenis.on("scroll", () => ScrollTrigger.update());

    const handleScrollTo = (event: Event) => {
      const { target, options } = (
        event as CustomEvent<{
          target: string | number;
          options?: LenisScrollOptions;
        }>
      ).detail;

      lenis.scrollTo(target, options);
    };

    window.addEventListener(LENIS_SCROLL_EVENT, handleScrollTo);

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // وقف الـ loop لو التاب مش active — بيوفر CPU وبطارية الموبايل
    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(raf);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener(LENIS_SCROLL_EVENT, handleScrollTo);
      lenis.destroy();
    };
  }, [introComplete]);

  return <>{children}</>;
}