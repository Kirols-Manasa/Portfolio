"use client";

import { useEffect, useRef } from "react";
import Container from "@/Container";
import { animateSkills } from "./animations";

const categories = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    title: "Frontend",
    items: [
      { text: "React 19 / Next.js 15 (App Router)", highlight: false },
      { text: "TypeScript", highlight: false },
      { text: "Tailwind CSS", highlight: false },
      { text: "Server & Client Components", highlight: false },
      { text: "Responsive Design", highlight: false },
      { text: "SEO & Metadata", highlight: false },
    ],
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Motion",
    items: [
      { text: "GSAP & ScrollTrigger", highlight: true },
      { text: "Lenis Smooth Scroll", highlight: false },
      { text: "SplitText & Text Reveals", highlight: false },
      { text: "SVG Path Animation", highlight: false },
      { text: "Pinned Scroll Sections", highlight: false },
      { text: "Mouse-Reactive Effects", highlight: false },
    ],
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Performance",
    items: [
      { text: "Core Web Vitals", highlight: false },
      { text: "Next/Image (AVIF & WebP)", highlight: false },
      { text: "Lazy Loading", highlight: false },
      { text: "Accessibility", highlight: false },
      { text: "Open Graph & Twitter Cards", highlight: false },
      { text: "PageSpeed Insights", highlight: false },
    ],
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Tools",
    items: [
      { text: "Git & GitHub", highlight: false },
      { text: "ESLint / Prettier", highlight: false },
      { text: "Lighthouse / Web Vitals", highlight: false },
      { text: "VS Code", highlight: false },
      { text: "npm / Node.js", highlight: false },
      { text: "Vercel", highlight: false },
    ],
  },
] as const;

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerLabelRef = useRef<HTMLParagraphElement>(null);
  const headerTitleRef = useRef<HTMLHeadingElement>(null);
  const headerDescRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !headerLabelRef.current ||
      !headerTitleRef.current ||
      !headerDescRef.current ||
      !gridRef.current
    )
      return;

    const { destroy } = animateSkills({
      section: sectionRef.current,
      headerLabel: headerLabelRef.current,
      headerTitle: headerTitleRef.current,
      headerDesc: headerDescRef.current,
      grid: gridRef.current,
    });

    return destroy;
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="py-20 lg:py-28">
      <Container>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-4">
          <div>
            <p
              ref={headerLabelRef}
              className="text-label-sm text-neutral-500 uppercase tracking-widest mb-3"
            >
              SKILLS
            </p>
            <h2 ref={headerTitleRef} className="text-headline-lg text-neutral-900">
              Technical Arsenal
            </h2>
          </div>
          <p
            ref={headerDescRef}
            className="text-body-md text-neutral-500 lg:text-right lg:whitespace-nowrap"
          >
            A curated selection of tools and technologies I use
            <br />
            to build fast, animated websites.
          </p>
        </div>

        {/* Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.title}
              data-skill-card
              className="bg-[#f0f0f0] rounded-2xl p-6 flex flex-col gap-5 min-h-[400px]"
            >
              {/* Icon */}
              <div data-skill-icon className="text-neutral-700 w-9 h-9 flex items-center justify-center">
                {cat.icon}
              </div>

              {/* Title */}
              <h3 className="text-headline-md text-neutral-900">{cat.title}</h3>

              {/* Items */}
              <ul className="flex flex-col gap-2">
                {cat.items.map((item) => (
                  <li
                    key={item.text}
                    data-skill-item
                    className="flex items-start gap-2 text-body-md"
                  >
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" aria-hidden="true" />
                   <span className="text-neutral-600">
  {item.text}
</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}