 import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface AboutRefs {
  section: HTMLElement;
  statement: HTMLElement;
  intro: HTMLElement;
  list: HTMLElement;
  divider: HTMLElement;
  expertiseParagraphs: HTMLElement[];
}

export interface AboutAnimation {
  destroy: () => void;
}

export function animateAbout({
  section,
  statement,
  intro,
  list,
  divider,
  expertiseParagraphs,
}: AboutRefs): AboutAnimation {
  const triggers: ScrollTrigger[] = [];

  const ctx = gsap.context(() => {
    const items = Array.from(
      list.querySelectorAll<HTMLElement>("[data-about-item]")
    );
    const badges = items.map((it) =>
      it.querySelector<HTMLElement>("[data-about-badge]")
    );
    const texts = items.map((it) =>
      it.querySelector<HTMLElement>("[data-about-text]")
    );

    gsap.set(statement, { y: 46, opacity: 0, scale: 0.96 });
    gsap.set(intro, { y: 36, opacity: 0, scale: 0.97 });
    gsap.set(items, { y: 34, opacity: 0 });
    gsap.set(badges, { scale: 0.3, opacity: 0, rotate: -45 });
    gsap.set(texts, { opacity: 0, y: 8 });
    gsap.set(divider, { scaleX: 0 });
    gsap.set(expertiseParagraphs, { y: 40, opacity: 0, scale: 0.97 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
      defaults: { ease: "expo.out" },
    });

    tl.to(statement, { y: 0, opacity: 1, scale: 1, duration: 1.1 }, 0.05);
    tl.to(intro, { y: 0, opacity: 1, scale: 1, duration: 0.9 }, 0.35);

    items.forEach((item, i) => {
      const start = 0.6 + i * 0.22;
      tl.to(item, { y: 0, opacity: 1, duration: 0.7 }, start);
      if (badges[i]) {
        tl.to(
          badges[i],
          { scale: 1, opacity: 1, rotate: 0, duration: 0.65, ease: "back.out(3)" },
          start
        );
      }
      if (texts[i]) {
        tl.to(texts[i], { opacity: 1, y: 0, duration: 0.6 }, start + 0.1);
      }
    });

    const dividerStart = 0.6 + items.length * 0.22 + 0.15;
    tl.to(
      divider,
      { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
      dividerStart
    );
    tl.to(
      expertiseParagraphs,
      { y: 0, opacity: 1, scale: 1, duration: 0.85, stagger: 0.18 },
      dividerStart + 0.2
    );

    if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
  }, section);

  return {
    destroy() {
      triggers.forEach((t) => t.kill());
      ctx.revert();
    },
  };
}