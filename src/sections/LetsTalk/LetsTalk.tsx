  "use client";

import { useCallback, useEffect, useRef } from "react";
import Container from "@/Container";
import Image from "next/image";
import { scrollWithLenis } from "@/lib/lenis";
import { animateLetsTalk } from "./animations";

const contactItems = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.541 5.961L.057 23.854a.5.5 0 0 0 .609.609l5.893-1.484A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.51-5.191-1.396l-.372-.217-3.847.968.985-3.738-.237-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
    label: "WHATSAPP",
    values: [{ text: "Send me a message", href: "https://wa.me/201277924126" }],
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.44 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.59-1.59a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "PHONE",
    values: [
      { text: "01277924126", href: "tel:+201277924126" },
      { text: "01229533807", href: "tel:+201229533807" },
    ],
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "EMAIL",
    values: [{ text: "kirols.online@gmail.com", href: "mailto:kirols.online@gmail.com" }],
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    label: "LINKEDIN",
    values: [{ text: "linkedin.com/in/kirols-manasa", href: "https://linkedin.com/in/kirols-manasa" }],
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "LOCATION",
    values: [{ text: "Cairo, Egypt", href: "https://www.google.com/maps/place/%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9+%D8%A7%D9%84%D8%AC%D8%AF%D9%8A%D8%AF%D8%A9%E2%80%AD/@30.0095669,31.4418284,17z/data=!3m1!4b1!4m6!3m5!1s0x14583d3cf1b3a55f:0x4144cc1269e9c70e!8m2!3d30.0095623!4d31.4444033!16s%2Fg%2F11sw_nb14n?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D" }],
  },
] as const;

export default function LetsTalk() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const headerLabelRef = useRef<HTMLParagraphElement>(null);
  const headerTitleRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !imageWrapRef.current ||
      !headerLabelRef.current ||
      !headerTitleRef.current ||
      !dividerRef.current ||
      !listRef.current
    )
      return;

    const { destroy } = animateLetsTalk({
      section: sectionRef.current,
      imageWrap: imageWrapRef.current,
      headerLabel: headerLabelRef.current,
      headerTitle: headerTitleRef.current,
      divider: dividerRef.current,
      list: listRef.current,
    });

    return destroy;
  }, []);

  const handleClick = useCallback((href: string) => {
    if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      window.location.href = href;
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  }, []);

  const scrollToTop = useCallback(() => {
    scrollWithLenis(0, {
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  }, []);

  return (
    <section ref={sectionRef} id="lets-talk" className="py-20 lg:py-28 bg-white">
      <Container>
        <div className="flex flex-col lg:flex-row gap-20 items-center">

          {/* Left — Image + Back to Top */}
          <div className="w-full lg:w-1/2">
            <div ref={imageWrapRef} className="relative w-full aspect-[3/4]">
              {/* ✅ محسّن: صورة responsive مع sizes صحيح */}
              <Image
  src="/3.webp"
  alt="Kirols Manasa"
  fill
   sizes="(max-width: 640px) 200vw, (max-width: 1024px) 150vw, 50vw"
  className="object-cover rounded-2xl"
  loading="lazy"
  decoding="async"
  quality={85}
/>

              <div className="absolute bottom-0 left-0">
                <button
                  onClick={scrollToTop}
                  style={{ cursor: "pointer" }}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors duration-200 text-white text-xs font-medium px-4 py-2 rounded-tl-none rounded-tr-full rounded-br-none rounded-bl-2xl"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                  BACK TO TOP
                </button>
              </div>
            </div>
          </div>

          {/* Right — Contact Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center gap-12">

            {/* Header */}
            <div className="flex flex-col gap-3">
              <p ref={headerLabelRef} className="text-xs text-neutral-400 uppercase tracking-[0.25em]">
                Get In Touch
              </p>
              <h2 ref={headerTitleRef} className="text-4xl font-semibold text-neutral-900 leading-tight">
                Let&apos;s Talk
              </h2>
            </div>

            {/* Divider */}
            <div ref={dividerRef} className="w-12 h-px bg-neutral-200 origin-left" />

            {/* Contact Items */}
            <ul ref={listRef} className="flex flex-col gap-8">
              {contactItems.map((item) => (
                <li key={item.label} data-contact-item>
                  <div className="flex items-start gap-5 group cursor-pointer">
                    <div
                      className="text-red-400 mt-0.5 shrink-0"
                      onClick={() => handleClick(item.values[0].href)}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-neutral-300 uppercase tracking-[0.2em] mb-1">
                        {item.label}
                      </p>
                      <div className="flex flex-row gap-3">
                        {item.values.map((v, i) => (
                          <button
                            key={v.text}
                            onClick={() => handleClick(v.href)}
                            className="text-sm text-neutral-600 hover:text-red-500 transition-colors duration-200 text-left cursor-pointer break-words"
                          >
                            {v.text}
                            {i < item.values.length - 1 && (
                              <span className="text-neutral-300 ml-3">|</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </Container>
    </section>
  );
}