 "use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import Container from "@/Container";
import { scrollWithLenis } from "@/lib/lenis";
import { animateFooter } from "./animations";

const NAV_LINKS = [
  { label: "About",      id: "about" },
  { label: "Projects",   id: "projects" },
  { label: "Skills",     id: "skills" },
  { label: "Let's Talk", id: "lets-talk" },
] as const;

const SOCIAL = [
  {
    id: "GitHub",
    href: "https://github.com/Kirols-Manasa",
    label: "GitHub profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    id: "LinkedIn",
    href: "https://linkedin.com/in/kirols-manasa",
    label: "LinkedIn profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "WhatsApp",
    href: "https://wa.me/201277924126",
    label: "WhatsApp contact",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.541 5.961L.057 23.854a.5.5 0 0 0 .609.609l5.893-1.484A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.51-5.191-1.396l-.372-.217-3.847.968.985-3.738-.237-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    id: "Email",
    href: "mailto:kirols.online@gmail.com",
    label: "Send email",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
] as const;

// Stable scroll helper — defined outside the component to avoid re-creation
function scrollToSection(id: string) {
  scrollWithLenis(`#${id}`, {
    offset: 0,
    duration: 1.8,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
}

// Current year computed once at module level — avoids recalculation on every render
const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const availabilityRef = useRef<HTMLDivElement>(null);
  const brandColRef = useRef<HTMLDivElement>(null);
  const navColRef = useRef<HTMLElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const [footerHeight, setFooterHeight] = useState(0);

  // Measure real footer height and sync onto spacer for the reveal effect
  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const update = () => setFooterHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (
      !spacerRef.current ||
      !availabilityRef.current ||
      !brandColRef.current ||
      !navColRef.current ||
      !dividerRef.current ||
      !bottomBarRef.current
    )
      return;

    const { destroy } = animateFooter({
      spacer: spacerRef.current,
      availability: availabilityRef.current,
      brandCol: brandColRef.current,
      navCol: navColRef.current,
      divider: dividerRef.current,
      bottomBar: bottomBarRef.current,
    });

    return destroy;
  }, []);

  // Stable nav-link click handler
  const handleNavClick = useCallback((id: string) => {
    scrollToSection(id);
  }, []);

  return (
    <>
      <style>{`
  .ft-root {
    --ft-bg:             #151515;
    --ft-text-primary:   #ededed;
    --ft-text-secondary: #9c9c9c;
    --ft-text-muted:     #666666;
    --ft-accent:         #ef4444;
    --ft-accent-subtle:  rgba(239,68,68,0.1);
    --ft-border:         rgba(255,255,255,0.07);
    --ft-border-strong:  rgba(255,255,255,0.13);
    --ft-status-dot:     #4ade80;
    --ft-radius-full:    9999px;
    --ft-transition:     color 0.18s ease, border-color 0.18s ease,
                         background-color 0.18s ease, transform 0.2s ease;
  }

  .ft-availability {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid var(--ft-border);
  }
  .ft-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 500;
    color: var(--ft-text-secondary);
    letter-spacing: 0.01em;
  }
  .ft-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ft-status-dot);
    box-shadow: 0 0 0 3px rgba(74,222,128,0.15);
    flex-shrink: 0;
  }
  .ft-availability-time {
    font-size: 12px;
    color: var(--ft-text-muted);
    letter-spacing: 0.02em;
  }

  .ft-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 48px;
    padding: 48px 0 40px;
  }

  .ft-brand-eyebrow {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ft-accent);
    margin-bottom: 8px;
  }
  .ft-brand-name {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--ft-text-primary);
    line-height: 1.2;
    margin-bottom: 12px;
  }
  .ft-brand-tagline {
    font-size: 14px;
    color: var(--ft-text-secondary);
    line-height: 1.7;
    max-width: 240px;
    margin-bottom: 28px;
  }

  .ft-social-row { display: flex; gap: 8px; }
  .ft-social-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--ft-radius-full);
    border: 1px solid var(--ft-border-strong);
    color: var(--ft-text-secondary);
    background: transparent;
    text-decoration: none;
    transition: var(--ft-transition);
    outline-offset: 3px;
  }
  .ft-social-btn:hover {
    border-color: var(--ft-accent);
    color: var(--ft-accent);
    background: var(--ft-accent-subtle);
    transform: translateY(-2px);
  }
  .ft-social-btn:focus-visible {
    outline: 2px solid var(--ft-accent);
  }

  .ft-section-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ft-text-muted);
    margin-bottom: 20px;
  }

  .ft-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .ft-link {
    font-size: 15px;
    color: var(--ft-text-secondary);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    line-height: 1.5;
    transition: color 0.18s ease;
    outline-offset: 3px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
  }
  .ft-link:hover { color: var(--ft-accent); }
  .ft-link:focus-visible {
    outline: 2px solid var(--ft-accent);
    border-radius: 2px;
  }
  .ft-link-arrow {
    font-size: 11px;
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity 0.18s ease, transform 0.18s ease;
  }
  .ft-link:hover .ft-link-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .ft-divider {
    height: 1px;
    background: var(--ft-border-strong);
    width: 100%;
  }

  .ft-bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-top: 8px;
  }
  .ft-copyright {
    font-size: 12px;
    color: var(--ft-text-muted);
    letter-spacing: 0.02em;
    padding-bottom: 20px;
  }

  .ft-wordmark {
    font-size: clamp(52px, 8vw, 110px);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 0.85;
    color: #232323;
    user-select: none;
    white-space: nowrap;
    transition: color 0.25s ease;
  }
  .ft-wordmark:hover { color: #2e2e2e; }
  .ft-wordmark-dot {
    color: var(--ft-accent);
    opacity: 0.6;
  }

  @media (max-width: 639px) {
    .ft-availability {
      align-items: flex-start;
      flex-direction: column;
      gap: 8px;
    }
    .ft-grid {
      grid-template-columns: 1fr;
      gap: 36px;
      padding: 36px 0;
    }
    .ft-bottom {
      align-items: flex-start;
      flex-direction: column;
      gap: 20px;
    }
  }
`}</style>

      {/* Spacer — reserves normal-flow space equal to the footer's real
          height. As the page scrolls up through this empty gap, the
          fixed footer underneath becomes visible — the "reveal" effect. */}
      <div ref={spacerRef} style={{ height: footerHeight }} aria-hidden="true" />

      <footer
        ref={footerRef}
        className="ft-root"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 0,
          background: "var(--ft-bg)",
          color: "var(--ft-text-primary)",
          fontFamily: "inherit",
          borderTop: "1px solid var(--ft-border-strong)",
          overflow: "hidden",
        }}
      >
        <Container>
          <div>

            {/* ── Availability strip ── */}
            <div ref={availabilityRef} className="ft-availability">
              <span className="ft-badge">
                <span className="ft-status-dot" />
                I am available for any job
              </span>
              <span className="ft-availability-time">Cairo, Egypt · GMT+2</span>
            </div>

            {/* ── Main grid ── */}
            <div className="ft-grid">

              {/* Col 1: Brand */}
              <div ref={brandColRef}>
                <span className="ft-brand-eyebrow">Frontend Developer</span>
                <p className="ft-brand-name">Kirols Manasa</p>
                <p className="ft-brand-tagline">
                  &ldquo;Crafting web experiences where every detail is intentional and every pixel earns its place.&rdquo;
                </p>
                <nav aria-label="Social media links">
                  <div className="ft-social-row">
                    {SOCIAL.map(({ id, href, label, icon }) => (
                      <a
                        key={id}
                        href={href}
                        aria-label={label}
                        className="ft-social-btn"
                        {...(href.startsWith("http")
                          ? { target: "_blank", rel: "noreferrer noopener" }
                          : {})}
                      >
                        {icon}
                      </a>
                    ))}
                  </div>
                </nav>
              </div>

              {/* Col 2: Navigate */}
              <nav ref={navColRef} aria-label="Footer navigation">
                <span className="ft-section-label">Navigate</span>
                <ul className="ft-links">
                  {NAV_LINKS.map(({ label, id }) => (
                    <li key={id}>
                      <button
                        onClick={() => handleNavClick(id)}
                        className="ft-link"
                      >
                        {label}
                        <span className="ft-link-arrow" aria-hidden="true">→</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

            </div>

            {/* ── Divider ── */}
            <div
              ref={dividerRef}
              className="ft-divider"
              style={{ transformOrigin: "left" }}
            />

            {/* ── Bottom bar ── */}
            <div ref={bottomBarRef} className="ft-bottom">
              <p className="ft-copyright">
                © {CURRENT_YEAR} Kirols Manasa. All rights reserved.
              </p>
              <p className="ft-wordmark" aria-hidden="true">
                Kirols<span className="ft-wordmark-dot">.</span>
              </p>
            </div>

          </div>
        </Container>
      </footer>
    </>
  );
}
