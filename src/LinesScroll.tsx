 "use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LENIS_SCROLL_EVENT, type LenisScrollOptions } from "@/lib/lenis";
import { useIntro } from "@/intro"; // ✅ استخدم useIntro

export default function LinesScroll({ children }: { children: React.ReactNode }) {
  const { introComplete } = useIntro(); // ✅ احصل على حالة الانترو

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

    // ✅ منع الاسكرول أثناء الانترو
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

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener(LENIS_SCROLL_EVENT, handleScrollTo);
      lenis.destroy();
    };
  }, [introComplete]); // ✅ أضف introComplete في dependencies

  return <>{children}</>;
}
