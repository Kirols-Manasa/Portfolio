 import gsap from "gsap";

export interface SkillsRefs {
  section: HTMLElement;
  headerLabel: HTMLElement;
  headerTitle: HTMLElement;
  headerDesc: HTMLElement;
  grid: HTMLElement;
}

export interface SkillsAnimation {
  destroy: () => void;
}

export function animateSkills({
  section,
  headerLabel,
  headerTitle,
  headerDesc,
  grid,
}: SkillsRefs): SkillsAnimation {
  // ─── Ink colour pairs per card index — exact values from the HTML reference ──
  const inkColors: string[] = [
    "#c9a55a",
    "#6b9bc4",
    "#c4865a",
    "#c9a84a",
    "#5a9070",
    "#d4946a",
  ];

  const inkColorsB: string[] = [
    "#ff9f68",
    "#6ec6ca",
    "#ffb703",
    "#83c5be",
    "#cdb4db",
    "#ff8fa3",
  ];

  // ─── SVG path data — exact values from the HTML reference ─────────────────
  const PATH_A =
    "M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262";

  const PATH_B =
    "M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012";

  // ─── Helper: create one ink SVG layer ─────────────────────────────────────
  function createInkLayer(
    pathD: string,
    viewBox: string,
    color: string,
    className: string
  ): { wrapper: HTMLDivElement; path: SVGPathElement } {
    const wrapper = document.createElement("div");
    wrapper.className = `ink ${className}`;
    wrapper.style.cssText =
      "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(1.5);width:100%;height:100%;pointer-events:none;";

    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("fill", "none");
    svg.setAttribute("xmlns", ns);
    svg.style.cssText = "width:100%;height:100%;object-fit:cover;";

    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", pathD);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", "200");
    path.setAttribute("stroke-linecap", "round");
    path.classList.add("ink-path");

    svg.appendChild(path);
    wrapper.appendChild(svg);
    return { wrapper, path };
  }

  // ─── Helper: create label overlay ─────────────────────────────────────────
  function createLabel(title: string, sub: string): HTMLDivElement {
    const label = document.createElement("div");
    label.className = "ink-label";
    label.style.cssText =
      "position:absolute;bottom:0;left:0;right:0;padding:1.5rem 1.25rem;display:flex;flex-direction:column;align-items:flex-start;gap:0.25rem;color:#1a1a1a;opacity:0;pointer-events:none;z-index:2;";

    const t = document.createElement("span");
    t.style.cssText = "font-size:1.125rem;font-weight:500;letter-spacing:0.02em;";
    t.textContent = title;

    const s = document.createElement("span");
    s.style.cssText = "font-size:0.8125rem;font-weight:400;color:rgba(26,26,26,0.7);";
    s.textContent = sub;

    label.appendChild(t);
    label.appendChild(s);
    return label;
  }

  // ─── Card metadata ─────────────────────────────────────────────────────────
  interface CardMeta {
    title: string;
    sub: string;
  }

  const cardMeta: CardMeta[] = [
    { title: "Frontend", sub: "React, TypeScript & modern CSS" },
    { title: "Architecture", sub: "Scalable, type-safe systems" },
    { title: "Backend", sub: "APIs, databases & auth flows" },
    { title: "Tools", sub: "The craft behind the craft" },
  ];

  // Fallback values used only if an index is somehow out of range
  // (keeps TS happy under `noUncheckedIndexedAccess` without changing behaviour,
  // since `i % array.length` can never actually be out of bounds here).
  const DEFAULT_COLOR_A = inkColors[0] ?? "#c9a55a";
  const DEFAULT_COLOR_B = inkColorsB[0] ?? "#ff9f68";
  const DEFAULT_META: CardMeta = cardMeta[0] ?? {
    title: "Frontend",
    sub: "React, TypeScript & modern CSS",
  };

  // ─── Inject ink layers into every card ────────────────────────────────────
  const cards = grid.querySelectorAll<HTMLElement>("[data-skill-card]");
  const cleanups: Array<() => void> = [];

  cards.forEach((card, i) => {
    const colorA = inkColors[i % inkColors.length] ?? DEFAULT_COLOR_A;
    const colorB = inkColorsB[i % inkColorsB.length] ?? DEFAULT_COLOR_B;
    const meta = cardMeta[i % cardMeta.length] ?? DEFAULT_META;

    // Make the card a positioning context
    card.style.position = "relative";
    card.style.overflow = "hidden";

    const { wrapper: wrapA, path: pathA } = createInkLayer(
      PATH_A,
      "0 0 2453 2273",
      colorA,
      "ink-a"
    );

    const { wrapper: wrapB, path: pathB } = createInkLayer(
      PATH_B,
      "0 0 2250 2535",
      colorB,
      "ink-b"
    );

    const label = createLabel(meta.title, meta.sub);

    card.appendChild(wrapA);
    card.appendChild(wrapB);
    card.appendChild(label);

    // Initialise dash array — exact same logic as the HTML reference
    const lenA = pathA.getTotalLength();
    pathA.style.strokeDasharray = String(lenA);
    pathA.style.strokeDashoffset = String(lenA);

    const lenB = pathB.getTotalLength();
    pathB.style.strokeDasharray = String(lenB);
    pathB.style.strokeDashoffset = String(lenB);

    // Hover handlers — exact same logic as the HTML reference:
    // both paths animate together in a single tween, dashoffset resolved per-index
    const paths = [pathA, pathB];
    const lens = [lenA, lenB];

    const onEnter = () => {
      gsap.killTweensOf([...paths, label]);
      gsap.to(paths, {
        strokeDashoffset: 0,
        attr: { "stroke-width": 700 },
        duration: 1.5,
        ease: "power2.out",
      });
      gsap.to(label, { opacity: 1, duration: 0.5, delay: 0.4, ease: "power2.out" });
    };

    const onLeave = () => {
      gsap.killTweensOf([...paths, label]);
      gsap.to(paths, {
        strokeDashoffset: (index: number) => lens[index] ?? 0,
        attr: { "stroke-width": 100 },
        duration: 1,
        ease: "power2.out",
      });
      gsap.to(label, { opacity: 0, duration: 0.3 });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);

    cleanups.push(() => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      wrapA.remove();
      wrapB.remove();
      label.remove();
    });
  });

  // ─── Destroy ───────────────────────────────────────────────────────────────
  return {
    destroy() {
      cleanups.forEach((fn) => fn());
    },
  };
}