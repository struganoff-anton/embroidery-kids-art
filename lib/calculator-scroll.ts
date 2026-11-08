/** Run after the new step is committed, with no competing focus scroll. */
export function scheduleCalculatorStepScroll(
  heading: HTMLElement,
  header: HTMLElement | null,
  viewport: Pick<Window, "requestAnimationFrame" | "cancelAnimationFrame" | "matchMedia" | "scrollTo" | "scrollY"> = window,
): () => void {
  heading.focus({ preventScroll: true });
  const frame = viewport.requestAnimationFrame(() => {
    // Measure after layout, including responsive header height and content shrinkage.
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const top = Math.max(0, viewport.scrollY + heading.getBoundingClientRect().top - headerHeight - 16);
    viewport.scrollTo({
      top,
      behavior: viewport.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  });
  return () => viewport.cancelAnimationFrame(frame);
}
