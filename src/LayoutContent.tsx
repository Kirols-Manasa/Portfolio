 "use client";

import type { ReactNode } from "react";
import { useRef, useCallback, useEffect, createContext, useContext } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { scrollWithLenis } from "@/lib/lenis";

gsap.registerPlugin(DrawSVGPlugin);

// ── Context ──
type ScrollTransitionCtx = { scrollTo: (id: string) => void };
const ScrollTransitionContext = createContext<ScrollTransitionCtx>({
  scrollTo: (_id: string) => undefined,
});
export const useScrollTransition = () => useContext(ScrollTransitionContext);

// ── Paths ──
// Desktop: original sweeping wave across 1316×664
const DESKTOP_PATH =
  "M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213";

// Mobile: vertical S-curve designed for a 390×844 viewport.
// Travels top-to-bottom so the stroke bloom covers the full screen width
// at a lower strokeWidth — feels natural and purposeful on narrow displays.
const MOBILE_PATH =
  "M-40 80C-40 80 60 -60 195 40C330 140 20 380 195 460C370 540 300 200 195 320C90 440 340 620 195 720C50 820 -40 900 -40 900";

// ── LayoutContent ──
export default function LayoutContent({ children }: { children: ReactNode }) {
  const overlayRef     = useRef<HTMLDivElement | null>(null);
  const desktopPathRef = useRef<SVGPathElement | null>(null);
  const mobilePathRef  = useRef<SVGPathElement | null>(null);
  const isAnimating    = useRef(false);
  const isMobileRef    = useRef(false);

  // Track breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    isMobileRef.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      isMobileRef.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Set initial DrawSVG state on both paths
  useEffect(() => {
    const paths = [desktopPathRef.current, mobilePathRef.current].filter(Boolean);
    if (paths.length) {
      gsap.set(paths, { drawSVG: "0%", strokeWidth: 2 });
    }
  }, []);

  const scrollTo = useCallback((id: string) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const isMobile  = isMobileRef.current;
    const activeRef = isMobile ? mobilePathRef.current : desktopPathRef.current;

    // Mobile: faster animation + tighter bloom to feel snappy on small screens
    const bloomWidth   = isMobile ? 180  : 300;
    const inDuration   = isMobile ? 0.85 : 1.2;
    const outDuration  = isMobile ? 0.85 : 1.2;
    const fadeDuration = isMobile ? 0.3  : 0.4;
    const ease         = isMobile ? "power2.out" : "power2.inOut";

    gsap
      .timeline({ onComplete: () => { isAnimating.current = false; } })
      .to(overlayRef.current, {
        opacity: 1,
        duration: fadeDuration,
        ease: "power2.inOut",
      })
      .to(
        activeRef,
        {
          drawSVG: "100%",
          strokeWidth: bloomWidth,
          duration: inDuration,
          ease,
          onComplete: () => {
            scrollWithLenis(`#${id}`, { offset: 0 });
          },
        },
        0
      )
      .to(activeRef, {
        drawSVG: "100% 100%",
        strokeWidth: 2,
        duration: outDuration,
        ease,
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: fadeDuration,
        ease: "power2.inOut",
      }, `-=${fadeDuration}`)
      .set(activeRef, { drawSVG: "0%", strokeWidth: 2 });
  }, []);

  return (
    <ScrollTransitionContext.Provider value={{ scrollTo }}>
      {children}

      {/* ===== SCROLL TRANSITION OVERLAY ===== */}
      <div
        ref={overlayRef}
        className="fixed inset-0 pointer-events-none opacity-0"
        style={{ zIndex: 9999 }}
        aria-hidden="true"
      >
        {/* ── Desktop: original wave (hidden on mobile) ── */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1316 664"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hidden sm:block w-full h-full scale-[1.3]"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            ref={desktopPathRef}
            d={DESKTOP_PATH}
            stroke=" #8b1a1a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* ── Mobile: vertical S-curve (hidden on sm+) ── */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 390 844"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block sm:hidden w-full h-full scale-[1.15]"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            ref={mobilePathRef}
            d={MOBILE_PATH}
            stroke=" #8b1a1a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </ScrollTransitionContext.Provider>
  );
}
