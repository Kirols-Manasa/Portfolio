import gsap from "gsap";

export interface LetsTalkRefs {
  section: HTMLElement;
  imageWrap: HTMLElement;
  headerLabel: HTMLElement;
  headerTitle: HTMLElement;
  divider: HTMLElement;
  list: HTMLElement;
}

export interface LetsTalkAnimation {
  destroy: () => void;
}

export function animateLetsTalk({
  section,
  imageWrap,
  headerLabel,
  headerTitle,
  divider,
  list,
}: LetsTalkRefs): LetsTalkAnimation {
  const items = list.querySelectorAll<HTMLElement>("[data-contact-item]");

  gsap.set(imageWrap, { y: 50, opacity: 0, scale: 0.95 });
  gsap.set([headerLabel, headerTitle], { y: 40, opacity: 0 });
  gsap.set(divider, { scaleX: 0 });
  gsap.set(items, { y: 40, opacity: 0 });

  let hasAnimated = false;
  let observer: IntersectionObserver | null = null;
  let ctx: gsap.Context | null = null;

  const runAnimation = () => {
    ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(imageWrap, { y: 0, opacity: 1, scale: 1, duration: 1 }, 0);
      tl.to([headerLabel, headerTitle], { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }, 0.1);
      tl.to(divider, { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, 0.4);
      tl.to(items, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07 }, 0.45);
    });
  };

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          observer?.disconnect();
          observer = null;
          runAnimation();
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
  );

  observer.observe(section);

  return {
    destroy() {
      observer?.disconnect();
      observer = null;
      ctx?.revert();
      ctx = null;
    },
  };
}