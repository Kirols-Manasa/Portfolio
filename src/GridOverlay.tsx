 "use client";
import { useEffect, useState } from "react";

// ✏️ عدّل هنا بس
 const BREAKPOINTS = {
  mobile:  { maxWidth: 767,      margin: 20,  columns: 4,  gutter: 16, label: "Mobile"  },
  tablet:  { maxWidth: 1023,     margin: 34,  columns: 8,  gutter: 16, label: "Tablet"  },
  desktop: { maxWidth: 1279,     margin: 48,  columns: 12, gutter: 24, label: "Desktop" },
  large:   { maxWidth: Infinity, margin: 70,  columns: 12, gutter: 24, label: "Large"   },
};

function getBreakpoint(width: number) {
  if (width <= BREAKPOINTS.mobile.maxWidth)  return BREAKPOINTS.mobile;
  if (width <= BREAKPOINTS.tablet.maxWidth)  return BREAKPOINTS.tablet;
  if (width <= BREAKPOINTS.desktop.maxWidth) return BREAKPOINTS.desktop;
  return BREAKPOINTS.large;
}

export default function GridOverlay() {
  const [visible, setVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "g") setVisible((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (!visible || windowWidth === 0) return null;

  const { margin, columns, gutter, label } = getBreakpoint(windowWidth);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", display: "flex", pointerEvents: "none", zIndex: 9999 }}>
      <div style={{ width: `${margin}px`, height: "100%", background: "rgba(0, 200, 255, 0.2)", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", gap: `${gutter}px`, height: "100%" }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: "100%", background: "rgba(255, 0, 80, 0.12)" }} />
        ))}
      </div>
      <div style={{ width: `${margin}px`, height: "100%", background: "rgba(0, 200, 255, 0.2)", flexShrink: 0 }} />
      <div style={{ position: "fixed", bottom: 16, left: 16, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 12, fontFamily: "monospace", padding: "6px 10px", borderRadius: 6 }}>
        {label} — {windowWidth}px — {columns} cols — {margin}px margin
      </div>
    </div>
  );
}