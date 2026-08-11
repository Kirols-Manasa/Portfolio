 import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface FooterRefs {
  spacer: HTMLElement;
  availability: HTMLElement;
  brandCol: HTMLElement;
  navCol: HTMLElement;
  divider: HTMLElement;
  bottomBar: HTMLElement;
}

export interface FooterAnimation {
  destroy: () => void;
}

export function animateFooter({
  spacer,
  availability,
  brandCol,
  navCol,
  divider,
  bottomBar,
}: FooterRefs): FooterAnimation {
  const triggers: ScrollTrigger[] = [];

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    // Respect prefers-reduced-motion
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([availability, brandCol, navCol, divider, bottomBar], {
        clearProps: "all",
      });
    });

    // Desktop animations
    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
      () => {
        gsap.set(availability, { y: 16, opacity: 0 });
        gsap.set([brandCol, navCol], { y: 30, opacity: 0, scale: 0.98 });
        gsap.set(divider, { scaleX: 0 });
        gsap.set(bottomBar, { y: 16, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: spacer,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "expo.out" },
        });

        tl.to(availability, { y: 0, opacity: 1, duration: 0.6 }, 0);
        tl.to(
          [brandCol, navCol],
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.08 },
          0.15
        );
        tl.to(divider, { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, 0.55);
        tl.to(bottomBar, { y: 0, opacity: 1, duration: 0.6 }, 0.7);

        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
      }
    );

    // Mobile/tablet animations — lighter values
    mm.add(
      "(prefers-reduced-motion: no-preference) and (max-width: 767px)",
      () => {
        gsap.set(availability, { y: 10, opacity: 0 });
        gsap.set([brandCol, navCol], { y: 18, opacity: 0, scale: 0.99 });
        gsap.set(divider, { scaleX: 0 });
        gsap.set(bottomBar, { y: 10, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: spacer,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "expo.out" },
        });

        tl.to(availability, { y: 0, opacity: 1, duration: 0.45 }, 0);
        tl.to(
          [brandCol, navCol],
          { y: 0, opacity: 1, scale: 1, duration: 0.56, stagger: 0.05 },
          0.1
        );
        tl.to(divider, { scaleX: 1, duration: 0.45, ease: "power3.inOut" }, 0.4);
        tl.to(bottomBar, { y: 0, opacity: 1, duration: 0.45 }, 0.5);

        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
      }
    );

    return () => mm.revert();
  });

  return {
    destroy() {
      triggers.forEach((t) => t.kill());
      ctx.revert();
    },
  };
}