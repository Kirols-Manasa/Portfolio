 import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ProjectRefs {
  panel: HTMLElement;
  imageWrap: HTMLElement;
  img: HTMLImageElement;
  contentChildren: HTMLElement[];
}

export interface ProjectsAnimation {
  destroy: () => void;
}

export function animateProjects(
  panels: ProjectRefs[],
  container: HTMLElement
): ProjectsAnimation {
  const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

  const panelCount = panels.length;

  panels.forEach(({ imageWrap, contentChildren }, i) => {
    if (i > 0 && contentChildren.length > 0) {
      tl.fromTo(
        contentChildren,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power1.inOut",
        }
      );
    }

    if (i < panelCount - 1) {
      const nextPanel = panels[i + 1];
      if (!nextPanel) return;

      tl.fromTo(
        imageWrap,
        { clipPath: "inset(0 0 0% 0)" },
        { clipPath: "inset(0 0 100% 0)", ease: "none", duration: 1 }
      ).fromTo(
        nextPanel.img,
        { scale: 1.2 },
        { scale: 1, duration: 1.3, ease: "power2.out" },
        "<"
      );
    }
  });

  const totalDuration = tl.totalDuration();

  const st = ScrollTrigger.create({
    animation: tl,
    trigger: container,
    start: "top top",
    end: () => `+=${totalDuration * window.innerHeight}`,
    scrub: 0.6,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onLeave: () => {
      ScrollTrigger.refresh();
    },
  });

  return {
    destroy() {
      st.kill();
      tl.kill();
    },
  };
}