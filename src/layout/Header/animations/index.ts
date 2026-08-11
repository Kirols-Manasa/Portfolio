 "use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const SCROLL_MARGIN = 10;

export function useHeader(threshold = 40, ready = true) {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<HTMLSpanElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const rafId = useRef<number | null>(null);
  const scrolled$ = useRef(false);
  const mmRef = useRef<gsap.MatchMedia | null>(null);

  const handleScroll = useCallback(() => {
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const shouldBeScrolled = currentY > threshold && currentY > SCROLL_MARGIN;
      if (scrolled$.current !== shouldBeScrolled) {
        scrolled$.current = shouldBeScrolled;
        setScrolled(shouldBeScrolled);
      }
      rafId.current = null;
    });
  }, [threshold]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [handleScroll]);

  // Initial hidden state — runs immediately on mount, before ready
  useGSAP(
    () => {
      if (!navRef.current || !nameRef.current) return;
      gsap.set(navRef.current, { opacity: 0, y: -18 });
      gsap.set(nameRef.current, { clipPath: "inset(0 100% 0 0)", opacity: 0 });
    },
    { scope: headerRef }
  );

  // Entrance animation — only runs once ready flips true
  useGSAP(
    () => {
      if (!ready || !headerRef.current || !navRef.current || !nameRef.current) return;

      const mm = gsap.matchMedia();
      mmRef.current = mm;

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(navRef.current, { opacity: 1, y: 0 });
        gsap.set(nameRef.current, { clipPath: "inset(0 0% 0 0)", opacity: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        gsap
          .timeline({ delay: 0.2 })
          .to(navRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
          .to(
            nameRef.current,
            { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.6, ease: "power3.out" },
            "-=0.3"
          );
      });

      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)", () => {
        gsap
          .timeline({ delay: 0.15 })
          .to(navRef.current, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" })
          .to(
            nameRef.current,
            { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.45, ease: "power3.out" },
            "-=0.2"
          );
      });

      return () => {
        mm.revert();
        mmRef.current = null;
      };
    },
    { scope: headerRef, dependencies: [ready] }
  );

  return { headerRef, nameRef, navRef, scrolled };
}