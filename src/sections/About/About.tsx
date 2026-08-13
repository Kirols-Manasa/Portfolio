 "use client";

import { useCallback, useEffect, useRef } from "react";
import Container from "@/Container";
import Image from "next/image";
import { animateAbout, type AboutAnimation } from "./animations";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const expertiseRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const animationRef = useRef<AboutAnimation | null>(null);
  const rafRef = useRef<number | null>(null);

  const initAnimation = useCallback(() => {
    if (!sectionRef.current) return;

    animationRef.current = animateAbout({
      section: sectionRef.current,
      statement: statementRef.current!,
      intro: introRef.current!,
      list: listRef.current!,
      divider: dividerRef.current!,
      expertiseParagraphs: expertiseRefs.current.filter(
        (el): el is HTMLParagraphElement => !!el
      ),
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
      id="about"
      className="w-full py-20 sm:py-28 lg:py-32 bg-white dark:bg-neutral-950"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image - Left Side — محسّن */}
          <div className="relative h-[650px] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
            {/* ✅ محسّن: صورة responsive مع sizes صحيح */}
            <Image
  src="/2.webp"
  alt="Kirols Manasa - Frontend Developer"
  fill
   sizes="(max-width: 640px) 300vw, (max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 800px"
  className="object-cover object-center"
  priority={false}
  quality={85}
  decoding="async"
  placeholder="blur"
  blurDataURL="data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAQCdASoIAAgAAkA4JZQCdAEO/gHOAAD++P/YAAAA"
  style={{
    objectFit: "cover",
    objectPosition: "center top",
  }}
/>
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Text Content - Right Side */}
          <div className="flex flex-col gap-8 order-1 lg:order-2">
            <div className="space-y-8">
              {/* Main Statement */}
              <div>
                <p ref={statementRef} className="text-body-lg text-neutral-950 dark:text-white">
                  I believe clients don&apos;t receive code — they receive{" "}
                  <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent font-black">
                    results
                  </span>
                  .
                </p>
              </div>

              {/* Intro to Three Points */}
              <p ref={introRef} className="text-body-md text-neutral-700 dark:text-neutral-400">
                That&apos;s why every project I build is measured by three things:
              </p>

              {/* Three Key Points */}
              <ul ref={listRef} className="space-y-5">
                <li className="flex gap-4" data-about-item>
                  <span
                    data-about-badge
                    className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white text-xs font-bold"
                  >
                    ✓
                  </span>
                  <span data-about-text className="text-body-md text-neutral-700 dark:text-neutral-400 leading-relaxed">
                    A design that looks and feels premium.
                  </span>
                </li>
                <li className="flex gap-4" data-about-item>
                  <span
                    data-about-badge
                    className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white text-xs font-bold"
                  >
                    ✓
                  </span>
                  <span data-about-text className="text-body-md text-neutral-700 dark:text-neutral-400 leading-relaxed">
                    Performance that scores 90+ on every metric.
                  </span>
                </li>
                <li className="flex gap-4" data-about-item>
                  <span
                    data-about-badge
                    className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white text-xs font-bold"
                  >
                    ✓
                  </span>
                  <span data-about-text className="text-body-md text-neutral-700 dark:text-neutral-400 leading-relaxed">
                    SEO that makes sure the right people find it.
                  </span>
                </li>
              </ul>
            </div>

            {/* Expertise Section */}
            <div className="space-y-6 pt-8 border-t border-neutral-200 dark:border-neutral-800 relative">
              <div
                ref={dividerRef}
                className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-red-600 to-red-700 origin-left scale-x-0"
              />

              <p
                ref={(el) => { expertiseRefs.current[0] = el; }}
                className="text-body-md text-neutral-700 dark:text-neutral-400 leading-relaxed"
              >
                I specialize in{" "}
                <span className="font-semibold text-neutral-950 dark:text-white">
                  Next.js, TypeScript, and the T3 Stack
                </span>{" "}
                — building interfaces where clean architecture meets immersive user experience.
              </p>

              <p
                ref={(el) => { expertiseRefs.current[1] = el; }}
                className="text-body-md text-neutral-700 dark:text-neutral-400 leading-relaxed"
              >
                And because I understand the full system — from database design to authentication
                flows — I don&apos;t just build what&apos;s in front of me.
              </p>

              <p
                ref={(el) => { expertiseRefs.current[2] = el; }}
                className="text-body-md font-semibold text-neutral-950 dark:text-white leading-relaxed"
              >
                I understand everything behind it.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}