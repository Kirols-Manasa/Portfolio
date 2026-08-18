 "use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useHeader } from "./animations";
import { useIntro } from "@/intro";
import { useScrollTransition } from "@/LayoutContent";

const NAV_LINKS = ["about", "projects", "skills"] as const;

export default function Header() {
  const { introComplete } = useIntro();
  const { headerRef, nameRef, navRef, scrolled } = useHeader(40, introComplete);
  const { scrollTo } = useScrollTransition();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = NAV_LINKS.map((id) =>
      document.getElementById(id)
    ).filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          } else {
            setActiveSection((prev) =>
              prev === entry.target.id ? null : prev
            );
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleScroll = () => setMenuOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  const navBg = scrolled ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.08)";
  const navBlur = scrolled ? "blur(14px)" : "blur(6px)";
  const navTransition =
    "background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease";

  const getLinkColor = useCallback(
    (s: string) => {
      if (activeSection === null) return "rgba(28,25,23,0.5)";
      return activeSection === s ? "rgba(28,25,23,1)" : "rgba(28,25,23,0.3)";
    },
    [activeSection]
  );

  const getLinkWeight = useCallback(
    (s: string) => (activeSection === s ? 600 : 500),
    [activeSection]
  );

  const handleNavMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.color = "rgba(28,25,23,1)";
    },
    []
  );

  const handleMobileNavMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = "rgba(28,25,23,0.04)";
    },
    []
  );

  const handleMobileNavMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = "transparent";
    },
    []
  );

  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  const handleMobileLinkClick = useCallback(
    (id: string) => {
      scrollTo(id);
      setMenuOpen(false);
    },
    [scrollTo]
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-5 will-change-transform"
      style={{
        // ✅ الـ header يأخذ عرض الشاشة بالظبط — مش أكثر ومش أقل
        width: "100%",
        boxSizing: "border-box",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      {/* ===== DESKTOP NAV (md+) ===== */}
      <nav
        ref={navRef}
        className="hidden md:flex items-center justify-between rounded-full"
        style={{
          height: "52px",
          width: "480px",
          border: "1px solid rgba(28,25,23,0.06)",
          background: navBg,
          backdropFilter: navBlur,
          transition: navTransition,
          paddingLeft: "20px",
          paddingRight: "4px",
        }}
      >
        <span
          ref={nameRef}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "17px",
            letterSpacing: "-0.02em",
            color: "#1c1917",
          }}
        >
          Kirols Manasa
        </span>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className="capitalize relative"
              style={{
                fontSize: "14px",
                fontWeight: getLinkWeight(s),
                color: getLinkColor(s),
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "color 0.3s ease, font-weight 0.3s ease",
              }}
              onMouseEnter={handleNavMouseEnter}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = getLinkColor(s))
              }
            >
              {s}
            </button>
          ))}

          <button
            onClick={() => scrollTo("lets-talk")}
            className="rounded-full transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              color: "#ffffff",
              padding: "10px 22px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.01em",
              height: "44px",
              display: "flex",
              alignItems: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            LET&apos;S TALK
          </button>
        </div>
      </nav>

      {/* ===== MOBILE NAV (< md) ===== */}
      {/* ✅ w-full + min-w-0 يمنعان الـ flex child من الاتساع */}
      <div ref={menuRef} className="md:hidden flex flex-col" style={{ width: "100%", minWidth: 0 }}>
        <div
          className="flex items-center justify-between rounded-full"
          style={{
            height: "52px",
            // ✅ width: 100% صريحة — مش w-full من Tailwind عشان نضمن التطبيق
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid rgba(28,25,23,0.06)",
            background: navBg,
            backdropFilter: navBlur,
            transition: navTransition,
            paddingLeft: "20px",
            paddingRight: "6px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "17px",
              letterSpacing: "-0.02em",
              color: "#1c1917",
              // ✅ يمنع الاسم من تمديد الـ container لو الشاشة صغيرة جداً
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
          >
            Kirols Manasa
          </span>

          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="rounded-full flex items-center justify-center transition-colors duration-200"
            style={{
              width: "44px",
              height: "44px",
              // ✅ flexShrink: 0 يمنع الزرار من الانكماش
              flexShrink: 0,
              background: menuOpen ? "rgba(28,25,23,0.06)" : "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <line x1="3" y1="6" x2="17" y2="6" stroke="#1c1917" strokeWidth="1.75" strokeLinecap="round"
                style={{
                  transformOrigin: "10px 6px",
                  transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s",
                  transform: menuOpen ? "rotate(45deg) translate(0px, 4px)" : "none",
                }}
              />
              <line x1="3" y1="10" x2="17" y2="10" stroke="#1c1917" strokeWidth="1.75" strokeLinecap="round"
                style={{
                  transition: "opacity 0.2s",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <line x1="3" y1="14" x2="17" y2="14" stroke="#1c1917" strokeWidth="1.75" strokeLinecap="round"
                style={{
                  transformOrigin: "10px 14px",
                  transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s",
                  transform: menuOpen ? "rotate(-45deg) translate(0px, -4px)" : "none",
                }}
              />
            </svg>
          </button>
        </div>

        <div
          style={{
            overflow: "hidden",
            maxHeight: menuOpen ? "320px" : "0px",
            opacity: menuOpen ? 1 : 0,
            transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
            marginTop: menuOpen ? "8px" : "0px",
          }}
        >
          <div
            className="rounded-2xl flex flex-col p-2"
            style={{
              border: "1px solid rgba(28,25,23,0.06)",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
            }}
          >
            {NAV_LINKS.map((s) => {
              const isActive = activeSection === s;
              return (
                <button
                  key={s}
                  onClick={() => handleMobileLinkClick(s)}
                  className="capitalize rounded-xl transition-colors duration-150 text-left"
                  style={{
                    padding: "13px 16px",
                    fontSize: "15px",
                    fontWeight: isActive ? 600 : 500,
                    color:
                      activeSection === null
                        ? "rgba(28,25,23,0.6)"
                        : isActive
                        ? "rgba(28,25,23,1)"
                        : "rgba(28,25,23,0.3)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={handleMobileNavMouseEnter}
                  onMouseLeave={handleMobileNavMouseLeave}
                >
                  {s}
                </button>
              );
            })}

            <button
              onClick={() => handleMobileLinkClick("lets-talk")}
              className="rounded-xl text-center transition-all duration-200 hover:opacity-90"
              style={{
                marginTop: "4px",
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                color: "#ffffff",
                padding: "14px 16px",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.01em",
                border: "none",
                cursor: "pointer",
                display: "block",
                width: "100%",
              }}
            >
              LET&apos;S TALK
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}