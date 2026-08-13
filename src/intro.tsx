 "use client";

import Image from "next/image";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, useGSAP);

interface IntroContextValue {
  introComplete: boolean;
  setIntroComplete: (value: boolean) => void;
}

const IntroContext = createContext<IntroContextValue | undefined>(undefined);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <IntroContext.Provider value={{ introComplete, setIntroComplete }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    throw new Error("useIntro must be used within an IntroProvider");
  }
  return ctx;
}

const CARD_IMAGES = ["/5.webp", "/1.webp", "/4.webp", "/3.webp", "/2.webp"];
const CARD_ROTATIONS = [8, -3, -10, 10, -7];

export default function Intro() {
  const { setIntroComplete } = useIntro();
  const rootRef = useRef<HTMLDivElement | null>(null);

  // ✅ أضف هذا: منع الاسكرول في البداية
  useEffect(() => {
    const previousOverflowY = document.body.style.overflowY;
    document.body.style.overflowY = "hidden";
    window.scrollTo(0, 0);

    return () => {
      document.body.style.overflowY = previousOverflowY;
    };
  }, []);

  useGSAP(
    () => {
      const cards = document.querySelectorAll(".intro-card");
      const counterEl = document.querySelector(".intro-count p");

      const title = new SplitText(".intro-title", {
        type: "chars",
        mask: "chars",
      });

      cards.forEach((el, i) => {
        gsap.set(el, {
          xPercent: -50,
          yPercent: -50,
          scale: 0,
          rotate: CARD_ROTATIONS[i],
          clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
        });
      });

      gsap.set(title.chars, {
        yPercent: 100,
        rotation: 10,
        transformOrigin: "0% 100%",
      });

      gsap.set(".intro-count p", { yPercent: 100 });

      const tl = gsap.timeline({ delay: 0.6 });

      tl.to(".intro-card", {
        scale: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.6,
        ease: "power3.inOut",
        stagger: 0.2,
      });

      tl.set(".intro-brand", { visibility: "visible" }, 0.2);

      tl.to(
        title.chars,
        {
          yPercent: 0,
          rotation: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.04,
        },
        0.2
      );

      tl.to(
        ".intro-count p",
        { yPercent: 0, duration: 0.6, ease: "power3.out" },
        "<"
      );

      const counter = { value: 0 };
      tl.to(
        counter,
        {
          value: 100,
          duration: 1.2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterEl) {
              counterEl.textContent = String(
                Math.round(counter.value)
              ).padStart(3, "0");
            }
          },
        },
        "<0.3"
      );

      tl.to(
        title.chars,
        {
          yPercent: -100,
          rotation: -10,
          duration: 0.5,
          ease: "power3.in",
          stagger: 0.04,
        },
        1.95
      );

      tl.to(
        ".intro-count p",
        { yPercent: -100, duration: 0.5, ease: "power3.in" },
        1.95
      );

      tl.to(
        ".intro-card",
        {
          scale: 0,
          clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
          duration: 0.6,
          ease: "power3.inOut",
          stagger: -0.075,
        },
        2.45
      );

      tl.to(
        rootRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 0.6,
          ease: "power3.inOut",
        },
        3.05
      );

      tl.call(() => {
        setIntroComplete(true);
        document.body.style.overflowY = "";
      }, [], 3.05);

      tl.set(rootRef.current, { display: "none", pointerEvents: "none" });
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="intro-loader fixed inset-0 z-[100] overflow-hidden"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
       {CARD_IMAGES.map((src, i) => (
  <div
    className="intro-card absolute top-1/2 left-1/2"
    key={src}
  >
    <Image
  src={src}
  alt=""
  fill
  className="object-cover"
  priority={i === 0}
  quality={src === "/2.webp" ? 85 : 60}
  sizes={
    src === "/2.webp"
      ? "(max-width: 640px) 300px, 500px"
      : "(max-width: 640px) 160px, 250px"
  }
/>
  </div>
))}
      <div
        className="intro-brand absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ visibility: "hidden" }}
      >
        <h1 className="intro-title">Kirols</h1>
        <div className="intro-count">
          <p>000</p>
        </div>
      </div>
      <style jsx>{`
        .intro-loader {
          background: #f5efe6;
          color: #1c1917;
        }
        .intro-card {
          width: 250px;
          height: 300px;
        }
        .intro-title {
          font-family: var(--font-display);
          text-transform: uppercase;
          line-height: 0.85;
          font-size: clamp(2rem, 10vw, 15rem);
          font-weight: 600;
        }
        .intro-count {
          position: absolute;
          top: -1.5rem;
          left: calc(100% + 1.5rem);
          overflow: hidden;
          font-size: clamp(1rem, 1.5vw, 2rem);
          font-family: var(--font-display);
        }
        @media (max-width: 640px) {
          .intro-card {
            width: 160px;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}