 import gsap from "gsap";

interface SmudgeConfig {
  smoothing: number;
  movementThreshold: number;
  sizeFromSpeed: number;
  expandMultiplier: number;
  expandTime: number;
  expandEase: string;
  dissolveStart: number;
  dissolveTime: number;
  dissolveEase: string;
  flashInterval: number;
  maxBlobs: number;
  smudgeBgColor: string;
}

const cfg: SmudgeConfig = {
  smoothing:         0.1,
  movementThreshold: 0.01,
  sizeFromSpeed:     0.2,
  expandMultiplier:  2,
  expandTime:        2,
  expandEase:        "power1.inOut",
  dissolveStart:     2,
  dissolveTime:      3,
  dissolveEase:      "power3.in",
  flashInterval:     500,
  maxBlobs:          60,
  smudgeBgColor:     "#555",
};

// دالة آمنة لقراءة قايمة الصور من data-attribute
// بتتحقق فعليًا إن القيمة Array of strings قبل ما ترجعها،
// بدل ما تعمل assign مباشر لناتج JSON.parse اللي نوعه any
function parseFlashImages(raw: string | undefined): string[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

// هذه الدالة بتتشغل بس على pointer: fine devices (mouse/trackpad)
// touch-only devices بتتجاهل الدالة دي من Hero.tsx
export function initHeroSmudge(section: HTMLElement): () => void {
  const svg           = section.querySelector<SVGSVGElement>(".smudge-revealer")!;
  const blobContainer = section.querySelector<SVGGElement>(".smudge-blobs")!;
  const flashLayer    = section.querySelector<HTMLElement>(".layer-flash")!;
  const bgLayer       = section.querySelector<HTMLElement>(".layer-bg")!;

  bgLayer.style.backgroundColor = cfg.smudgeBgColor;

  const flashImages: string[] = parseFlashImages(flashLayer.dataset.images);

  const pointer = { x: 0, y: 0 };
  const smooth  = { x: 0, y: 0 };
  let started    = false;
  let blobCount  = 0;
  let currentImg = 0;
  let lastFlash  = 0;
  let rafId      = 0;

  function syncSVGSize() {
    svg.style.width  = section.offsetWidth  + "px";
    svg.style.height = section.offsetHeight + "px";
  }
  syncSVGSize();
  const ro = new ResizeObserver(syncSVGSize);
  ro.observe(section);

  function handlePointer(x: number, y: number) {
    if (!started) {
      pointer.x = smooth.x = x;
      pointer.y = smooth.y = y;
      started = true;
      return;
    }
    pointer.x = x;
    pointer.y = y;
  }

  function onMouseMove(e: MouseEvent) {
    const r = section.getBoundingClientRect();
    handlePointer(e.clientX - r.left, e.clientY - r.top);
  }
  function onMouseLeave() { started = false; }

  // touch listeners محذوفة — لأن:
  // 1. الدالة دي بتتشغل بس على pointer: fine (mouse) devices
  // 2. touch listeners مع preventDefault كانت بتكسر الـ scroll على mobile

  section.addEventListener("mousemove",  onMouseMove);
  section.addEventListener("mouseleave", onMouseLeave);

  function stampBlob(x: number, y: number, radius: number) {
    if (blobCount >= cfg.maxBlobs) {
      blobContainer.lastChild?.remove();
      blobCount--;
    }

    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx",   String(x));
    c.setAttribute("cy",   String(y));
    c.setAttribute("r",    String(radius));
    c.setAttribute("fill", "#fff");
    blobContainer.prepend(c);
    blobCount++;

    const anim = { r: radius };
    const tl = gsap.timeline({
      onUpdate()   { c.setAttribute("r", String(Math.max(0, anim.r))); },
      onComplete() { tl.kill(); c.remove(); blobCount = Math.max(0, blobCount - 1); },
    });
    tl.to(anim, { r: radius * cfg.expandMultiplier, duration: cfg.expandTime,   ease: cfg.expandEase });
    tl.to(anim, { r: 0,                             duration: cfg.dissolveTime, ease: cfg.dissolveEase }, cfg.dissolveStart);
  }

  function advanceFlash(now: number) {
    if (now - lastFlash < cfg.flashInterval) return;
    lastFlash  = now;
    currentImg = (currentImg + 1) % flashImages.length;
    flashLayer.style.backgroundImage = `url(${flashImages[currentImg]})`;
  }

  function tick(now: number) {
    if (started) {
      smooth.x += (pointer.x - smooth.x) * cfg.smoothing;
      smooth.y += (pointer.y - smooth.y) * cfg.smoothing;

      const speed = Math.hypot(pointer.x - smooth.x, pointer.y - smooth.y);
      if (speed > cfg.movementThreshold) {
        stampBlob(smooth.x, smooth.y, speed * cfg.sizeFromSpeed);
        advanceFlash(now);
      }
    }
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  return function cleanup() {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    section.removeEventListener("mousemove",  onMouseMove);
    section.removeEventListener("mouseleave", onMouseLeave);
    gsap.killTweensOf("*");
    blobContainer.innerHTML = "";
  };
}