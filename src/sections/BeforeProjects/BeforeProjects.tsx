 "use client";

import { useCallback, useEffect, useRef } from "react";
import Container from "@/Container";
import { animateBeforeProjects, type BeforeProjectsAnimation } from "./animations";

export default function BeforeProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<BeforeProjectsAnimation | null>(null);
  const rafRef = useRef<number | null>(null);

  const initAnimation = useCallback(() => {
    if (
      !sectionRef.current ||
      !headingRef.current ||
      !scrollIndicatorRef.current
    ) return;

    animationRef.current = animateBeforeProjects({
      section: sectionRef.current,
      heading: headingRef.current,
      paragraphs: paragraphRefs.current.filter(
        (el): el is HTMLParagraphElement => !!el
      ),
      scrollIndicator: scrollIndicatorRef.current,
    });
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(initAnimation);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [initAnimation]);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 sm:py-20 lg:py-24 bg-white dark:bg-neutral-950"
    >
      <Container>
        <div className="max-w-3xl">
          {/* Main Heading */}
          <h2
            ref={headingRef}
            style={{ fontFamily: "var(--font-inter-tight)" }}
            className="text-[32px] sm:text-[42px] lg:text-[52px] font-bold text-neutral-950 dark:text-white mb-8 leading-tight"
          >
            From idea to the browser —<br />
            <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              because great developers never stop designing
            </span>
            .
          </h2>

          {/* Body Text */}
          <div className="space-y-4">
            <p
              ref={(el) => { paragraphRefs.current[0] = el; }}
              className="text-body-lg text-neutral-700 dark:text-neutral-400 leading-relaxed"
            >
              Most frontend developers stop at the code. I don&apos;t.
            </p>

            <p
              ref={(el) => { paragraphRefs.current[1] = el; }}
              className="text-body-lg text-neutral-700 dark:text-neutral-400 leading-relaxed"
            >
              These are production-ready web experiences, taken from concept to deployment solo — using
              <span className="font-black text-neutral-950 dark:text-white mx-1">Figma</span>,
              <span className="font-black text-neutral-950 dark:text-white mx-1">Google Stitch</span>, and
              <span className="font-black text-neutral-950 dark:text-white mx-1">AI as a force multiplier</span>. No designer needed. No bottlenecks. No waiting.
            </p>

            <p
              ref={(el) => { paragraphRefs.current[2] = el; }}
              className="text-body-lg text-neutral-700 dark:text-neutral-400 leading-relaxed"
            >
              This is what it looks like when design and engineering live in the same person.
            </p>

            {/* Scroll Down */}
            <div ref={scrollIndicatorRef} className="flex items-center gap-2 pt-4">
              <p className="text-body-md text-neutral-600 dark:text-neutral-500">
                Scroll down to explore the work.
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-600 dark:text-neutral-500 animate-bounce sm:w-[18px] sm:h-[18px]"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}