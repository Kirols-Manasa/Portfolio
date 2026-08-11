export const LENIS_SCROLL_EVENT = "portfolio:lenis-scroll";

export type LenisScrollOptions = {
  duration?: number;
  easing?: (time: number) => number;
  offset?: number;
};

export function scrollWithLenis(
  target: string | number,
  options?: LenisScrollOptions,
) {
  window.dispatchEvent(
    new CustomEvent(LENIS_SCROLL_EVENT, { detail: { target, options } }),
  );
}
