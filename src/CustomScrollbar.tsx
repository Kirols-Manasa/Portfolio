 "use client";

import { useEffect } from "react";

export default function CustomScrollbar() {
  useEffect(() => {
    const track = document.createElement("div");
    Object.assign(track.style, {
      position: "fixed",
      top: "50%",
      right: "0px",
      transform: "translateY(-50%)",
      width: "20px",
      height: "40px",
      zIndex: "9999",
      opacity: "0",
      transition: "opacity 0.35s ease, top 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "grab",
    });

    const visibleLine = document.createElement("div");
    Object.assign(visibleLine.style, {
      width: "1px",
      height: "100%",
      background: "rgba(150,150,150,0.25)",
      position: "relative",
    });

    const visibleThumb = document.createElement("div");
    Object.assign(visibleThumb.style, {
      position: "absolute",
      top: "0",
      left: "-1px",
      width: "3px",
      height: "100%",
      background: "rgba(100,100,100,0.75)",
    });

    visibleLine.appendChild(visibleThumb);
    track.appendChild(visibleLine);
    document.body.appendChild(track);

    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;
    let currentTop = 5;
    let targetTop = 5;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function animate() {
      currentTop = lerp(currentTop, targetTop, 0.08);
      track.style.top = currentTop.toFixed(2) + "%";

      if (Math.abs(currentTop - targetTop) > 0.01) {
        rafId = requestAnimationFrame(animate);
      } else {
        currentTop = targetTop;
        track.style.top = targetTop + "%";
        rafId = null;
      }
    }

    function update() {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const max = Math.max(docH - winH, 1);
      const ratio = scrollTop / max;

      if (docH <= winH) return;

      targetTop = Math.min(Math.max(ratio * 90, 5), 90);

      rafId ??= requestAnimationFrame(animate);

      track.style.opacity = "1";

      clearTimeout(hideTimer!);
      hideTimer = setTimeout(() => {
        track.style.opacity = "0";
      }, 1800);
    }

    let isDragging = false;
    let dragStartY = 0;
    let dragStartScroll = 0;

    function onMouseDown(e: MouseEvent) {
      isDragging = true;
      dragStartY = e.clientY;
      dragStartScroll = window.scrollY;
      document.body.style.userSelect = "none";
      track.style.cursor = "grabbing";
      track.style.opacity = "1";
      clearTimeout(hideTimer!);
      e.preventDefault();
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const delta = e.clientY - dragStartY;
      const ratio = delta / winH;
      window.scrollTo(0, dragStartScroll + ratio * (docH - winH));
    }

    function onMouseUp() {
      isDragging = false;
      track.style.cursor = "grab";
      document.body.style.userSelect = "";
      hideTimer = setTimeout(() => {
        track.style.opacity = "0";
      }, 1800);
    }

    track.style.pointerEvents = "auto";
    track.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      track.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (hideTimer) clearTimeout(hideTimer);
      if (rafId) cancelAnimationFrame(rafId);
      document.body.removeChild(track);
    };
  }, []);

  return null;
}
