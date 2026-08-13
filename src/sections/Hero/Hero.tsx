 "use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Container from "@/Container";
import { initHeroSmudge } from "./animations";

const FLASH_IMAGES  = ["/1.webp", "/2.webp", "/3.webp", "/4.webp"];
const RESTING_IMAGE = "/5.webp";

const socials = [
  { icon: "/icon/github.webp",    label: "GitHub",   href: "https://github.com/Kirols-Manasa" },
  { icon: "/icon/linkedin.webp",  label: "LinkedIn", href: "https://linkedin.com/in/kirols-manasa" },
  { icon: "/icon/telephone.webp", label: "Phone",    href: "tel:+201277924126" },
];

export default function Hero() {
  const sectionRef               = useRef<HTMLElement>(null);
  const [flashIndex, setFlashIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    // ✅ بنبعت setFlashIndex + عدد الصور — مفيش DOM manipulation خالص
    return initHeroSmudge(section, setFlashIndex, FLASH_IMAGES.length);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* L0 — صورة 5 الملونة */}
      <div className="layer-rest absolute inset-0 z-0">
        <Image
          src={RESTING_IMAGE}
          alt="Kirols Manasa"
          fill
          priority
         quality={85}
        sizes="(max-width: 640px) 300vw, 100vw"
          className="object-cover object-center"
        />
      </div>

      {/* L1 — خلفية #555 */}
      <div
        className="layer-bg absolute inset-0 z-10"
        style={{
          backgroundColor: "#555",
          WebkitMaskImage: "url(#smudge-mask)",
          maskImage:       "url(#smudge-mask)",
        }}
      />

      {/* L2 — صور الـ flash — كل صورة Next/Image بـ sizes صح */}
      <div
        className="layer-flash absolute inset-0 z-20"
        style={{
          WebkitMaskImage: "url(#smudge-mask)",
          maskImage:       "url(#smudge-mask)",
          filter:          "grayscale(1) contrast(1.1)",
        }}
      >
        {FLASH_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0"
            // ✅ opacity بس — مفيش layout shift
            style={{ opacity: flashIndex === i ? 1 : 0 }}
            aria-hidden="true"
          >
            <Image
              src={src}
              alt=""
              fill
              // أول صورة priority، باقيهم lazy
              priority={i === 0}
               quality={85}
              // ✅ Next.js بيختار الحجم المناسب للـ device تلقائياً
              sizes="(max-width: 640px) 640w, (max-width: 1280px) 1280w, 1920w"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* SVG — goo filter + mask */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="smudge-revealer absolute inset-0 z-30 pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <filter id="smudge-goo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -13"
            />
          </filter>
          <mask id="smudge-mask">
            <g className="smudge-blobs" filter="url(#smudge-goo)" />
          </mask>
        </defs>
      </svg>

      {/* UI — social nav */}
      <div className="pointer-events-none absolute inset-0 z-40">
        <Container className="h-full">
          <div className="relative h-full">
            <nav className="absolute left-0 top-1/2 flex -translate-y-1/2 flex-col gap-4 pointer-events-auto">
              {socials.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={label === "Phone" ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <span className="relative h-5 w-5 shrink-0">
                    <Image
                      src={icon}
                      alt={label}
                      fill
                      loading="lazy"
                      quality={75}
                      sizes="20px"
                      className="object-contain"
                      style={{ filter: "brightness(0)" }}
                    />
                  </span>
                  <span
                    className="hidden sm:block"
                    style={{
                      fontSize:      "13px",
                      fontWeight:    500,
                      color:         "#1c1917",
                      letterSpacing: "0.01em",
                      fontFamily:    "var(--font-display)",
                    }}
                  >
                    {label}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </Container>
      </div>
    </section>
  );
}