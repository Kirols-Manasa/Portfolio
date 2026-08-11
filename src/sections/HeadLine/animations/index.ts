 import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export interface HeadLineRefs {
  section: HTMLElement;
  heading: HTMLElement;
}

export interface HeadLineAnimation {
  destroy: () => void;
}

export function animateHeadLine({
  heading,
}: HeadLineRefs): HeadLineAnimation {
  let split: InstanceType<typeof SplitText> | null = null;
  const triggers: ScrollTrigger[] = [];
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;

  function teardown() {
    triggers.forEach((t) => t.kill());
    triggers.length = 0;
    if (split) {
      gsap.killTweensOf(split.lines);
      split.revert();
      split = null;
    }
  }

  function setup() {
    teardown();

    split = SplitText.create(heading, {
      type: "lines",
      linesClass: "hl-line",
      mask: "lines",
    });

    const lines = split.lines as HTMLElement[];

    gsap.set(lines, { opacity: 0.08 });

    lines.forEach((line) => {
      const t = ScrollTrigger.create({
        trigger: line,
        start: "top 88%",
        end: "top 55%",
        scrub: 0.9,
        onUpdate: (self) => {
          gsap.set(line, { opacity: 0.08 + self.progress * 0.92 });
        },
        onLeaveBack: () => {
          gsap.to(line, { opacity: 0.08, duration: 0.35, ease: "power2.out" });
        },
      });
      triggers.push(t);
    });
  }

  setup();

  const onResize = () => {
    if (resizeTimer !== null) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 150);
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