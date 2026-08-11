 "use client";

import { useCallback, useEffect, useRef } from "react";
import Container from "@/Container";
import { animateHeadLine, type HeadLineAnimation } from "./animations";

export default function HeadLine() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const animationRef = useRef<HeadLineAnimation | null>(null);
  const rafRef = useRef<number | null>(null);

  const initAnimation = useCallback(() => {
    if (!sectionRef.current || !headingRef.current) return;

    animationRef.current = animateHeadLine({
      section: sectionRef.current,
      heading: headingRef.current,
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
      className="w-full py-16 sm:py-20 lg:py-28"
    >
      <Container>
        <div className="flex justify-center">
          <h1
            ref={headingRef}
            className="max-w-6xl text-center text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-neutral-950 dark:text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {/*
              NOTE: SplitText splits by words.
              Spans inside the words carry role classes so the animation
              can identify "muted" vs "climax" words without index-counting.

              hl-muted  → neutral/secondary words  ("2 years", "Next.js")
              hl-climax → red accent climax word   ("T3 Stack")

              These classes carry NO styles — they are purely semantic markers
              for the animation layer.
            */}
            I&apos;m a Frontend Developer who bridges the gap between design and
            engineering.{" "}
            <span className="text-neutral-500 dark:text-neutral-400">
              {/* SplitText wraps "2" and "years" as separate words —
                  each word element will contain this muted span */}
              <span className="hl-muted">2 years</span>
            </span>{" "}
            of building fast, beautiful, and scalable web experiences with{" "}
            <span className="text-neutral-500 dark:text-neutral-400">
              <span className="hl-muted">Next.js</span>
            </span>{" "}
            and the{" "}
            <span className="text-red-700 dark:text-red-600 font-black">
              <span className="hl-climax">T3 Stack</span>
            </span>
            .
          </h1>
        </div>
      </Container>
    </section>
  );
}