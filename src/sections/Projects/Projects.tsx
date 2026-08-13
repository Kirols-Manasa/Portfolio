 "use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animateProjects } from "./animations";

const projects = [
  {
    id: 1,
    image: "/progect/Jones.webp",
    title: "Jones Blue Bubblegum",
    subtitle: "Cane Sugar Soda",
    url: "https://jones-ten.vercel.app",
  },
  {
    id: 2,
    image: "/progect/airbods.webp",
    title: "AirPods 4",
    subtitle: "Iconic. Now supersonic.",
    url: "https://airpods-4.vercel.app/",
  },
  {
    id: 3,
    image: "/progect/fashion.webp",
    title: "Aura Store",
    subtitle: "Wear what moves you.",
    url: "https://aura-store-vert.vercel.app/",
  },
] as const;

const PROJECT_COUNT = projects.length;

export default function Projects() {
  const [hovered, setHovered] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const destroyRef = useRef<(() => void) | null>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseEnter = useCallback((id: number) => () => setHovered(id), []);
  const handleMouseLeave = useCallback(() => setHovered(null), []);

  const handleLinkEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.25)";
    },
    []
  );

  const handleLinkLeave = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.12)";
    },
    []
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const refs = projects.map((_, i) => ({
      panel: panelRefs.current[i]!,
      imageWrap: imageWrapRefs.current[i]!,
      img: imgRefs.current[i]!,
      contentChildren: contentRefs.current[i]
        ? Array.from(contentRefs.current[i]!.children).filter(
            (el): el is HTMLElement => el instanceof HTMLElement
          )
        : [],
    }));

    rafRef.current = requestAnimationFrame(() => {
      const { destroy } = animateProjects(refs, containerRef.current!);
      destroyRef.current = destroy;
    });

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      destroyRef.current?.();
      destroyRef.current = null;
    };
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      style={{
        position: "relative",
        height: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {projects.map((project, index) => {
        const isHovered = hovered === project.id;
        return (
          <div
            key={project.id}
            ref={(el) => {
              panelRefs.current[index] = el;
            }}
            onMouseEnter={handleMouseEnter(project.id)}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: PROJECT_COUNT - index,
              pointerEvents: "none",
            }}
          >
            {/* ── Image wrap — clip-path lives here ── */}
            <div
              ref={(el) => {
                imageWrapRefs.current[index] = el;
              }}
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                willChange: "clip-path",
              }}
            >
              {/* ✅ محسّن: صورة responsive مع sizes صحيح */}
              <Image
  ref={(el) => {
    imgRefs.current[index] = el;
  }}
  src={project.image}
  alt={project.title}
  fill
  sizes="(max-width: 640px) 200vw, (max-width: 1024px) 150vw, 100vw"
  priority={index === 0}
  loading={index === 0 ? "eager" : "lazy"}
  quality={85}
  decoding="async"
  style={{
    objectFit: "cover",
    objectPosition: "center",
    willChange: "transform",
    transform: index === 0 ? "scale(1)" : "scale(1.2)",
    transition:
      "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.5s ease",
    filter: isHovered ? "brightness(1.05)" : "brightness(1)",
  }}
/>

              {/* Dark overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: isHovered
                    ? "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
                  transition: "background 0.5s ease",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              {/* ── Content ── */}
              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                style={{
                  position: "absolute",
                  bottom: "10%",
                  left: "8%",
                  right: "8%",
                  color: "#fff",
                  zIndex: 2,
                  pointerEvents: "auto",
                }}
              >
                {/* Title */}
                <h2
                  style={{
                    margin: 0,
                    fontSize: "clamp(1.6rem, 5vw, 4rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                    transition: "transform 0.5s ease",
                  }}
                >
                  {project.title}
                </h2>

                {/* Subtitle */}
                <p
                  style={{
                    margin: "0.4rem 0 2rem",
                    fontSize: "clamp(0.9rem, 2vw, 1.4rem)",
                    fontWeight: 300,
                    opacity: 0.75,
                    letterSpacing: "0.01em",
                    color: "#fff",
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    transition: "transform 0.5s ease 0.05s",
                  }}
                >
                  {project.subtitle}
                </p>

                {/* View Live button */}
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.75rem",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.45)",
                    borderRadius: "999px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textDecoration: "none",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    transition:
                      "transform 0.5s ease 0.1s, background 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={handleLinkEnter}
                  onMouseLeave={handleLinkLeave}
                >
                  View Live
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    style={{
                      transform: isHovered
                        ? "translate(2px,-2px)"
                        : "translate(0,0)",
                      transition: "transform 0.4s ease",
                    }}
                  >
                    <path
                      d="M3 13L13 3M13 3H6M13 3V10"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              {/* Project number — top right */}
              <div
                style={{
                  position: "absolute",
                  top: "8%",
                  right: "6%",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.15em",
                  fontWeight: 500,
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                {String(project.id).padStart(2, "0")} /{" "}
                {String(PROJECT_COUNT).padStart(2, "0")}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}