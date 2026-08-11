 import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export interface BeforeProjectsRefs {
  section: HTMLElement;
  heading: HTMLElement;
  paragraphs: HTMLElement[];
  scrollIndicator: HTMLElement;
}

export interface BeforeProjectsAnimation {
  destroy: () => void;
}

export function animateBeforeProjects({
  section,
  heading,
  paragraphs,
  scrollIndicator,
}: BeforeProjectsRefs): BeforeProjectsAnimation {
  let split: InstanceType<typeof SplitText> | null = null;
  const triggers: ScrollTrigger[] = [];
  let ctx: gsap.Context | null = null;
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;

  function teardown() {
    triggers.forEach((t) => t.kill());
    triggers.length = 0;
    if (split) {
      split.revert();
      split = null;
    }
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
  }

  function build() {
    teardown();

    ctx = gsap.context(() => {
      split = SplitText.create(heading, {
        type: "lines",
        linesClass: "bp-line",
        mask: "lines",
      });
      const lines = split.lines as HTMLElement[];

      gsap.set(lines, { y: "100%", opacity: 0 });
      gsap.set(paragraphs, { y: 32, opacity: 0, scale: 0.98 });
      gsap.set(scrollIndicator, { y: 16, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "expo.out" },
      });

      tl.to(lines, { y: "0%", opacity: 1, duration: 1, stagger: 0.15 }, 0);
      tl.to(
        paragraphs,
        { y: 0, opacity: 1, scale: 1, duration: 0.85, stagger: 0.16 },
        0.55
      );
      tl.to(scrollIndicator, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3");

      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }, section);
  }

  build();

  const onResize = () => {
    if (resizeTimer !== null) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 150);
  };

  window.addEventListener("resize", onResize, { passive: true });

  return {
    destroy() {
      teardown();
      if (resizeTimer !== null) {
        clearTimeout(resizeTimer);
        resizeTimer = null;
      }
      window.removeEventListener("resize", onResize);
    },
  };
}