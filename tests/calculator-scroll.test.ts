import assert from "node:assert/strict";
import { test } from "node:test";
import { scheduleCalculatorStepScroll } from "../lib/calculator-scroll.ts";

function setup(headerHeight = 64, reducedMotion = false) {
  const calls: unknown[] = [];
  const frames = new Map<number, FrameRequestCallback>();
  let nextFrame = 0;
  const layout = { headingTop: 300, headerHeight };
  const heading = {
    focus: (options: FocusOptions) => calls.push(["focus", options]),
    getBoundingClientRect: () => ({ top: layout.headingTop }),
  } as unknown as HTMLElement;
  const header = {
    getBoundingClientRect: () => ({ height: layout.headerHeight }),
  } as unknown as HTMLElement;
  const viewport = {
    scrollY: 1000,
    requestAnimationFrame: (callback: FrameRequestCallback) => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: (id: number) => { frames.delete(id); },
    matchMedia: (query: string) => {
      assert.equal(query, "(prefers-reduced-motion: reduce)");
      return { matches: reducedMotion } as MediaQueryList;
    },
    scrollTo: (options: ScrollToOptions) => { calls.push(["scroll", options]); },
  };
  const flush = () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(0));
  };
  return { calls, layout, heading, header, viewport, flush };
}

for (const height of [57, 65, 92]) {
  test(`focus does not scroll; one smooth scroll clears a ${height}px header`, () => {
    const s = setup(height);
    scheduleCalculatorStepScroll(s.heading, s.header, s.viewport);
    assert.deepEqual(s.calls, [["focus", { preventScroll: true }]]);
    s.flush();
    s.flush();
    assert.deepEqual(s.calls, [
      ["focus", { preventScroll: true }],
      ["scroll", { top: 1300 - height - 16, behavior: "smooth" }],
    ]);
  });
}

test("measures the new layout rather than the old step height", () => {
  const s = setup();
  scheduleCalculatorStepScroll(s.heading, s.header, s.viewport);
  s.layout.headingTop = -200;
  s.layout.headerHeight = 80;
  s.viewport.scrollY = 900;
  s.flush();
  assert.deepEqual(s.calls.at(-1), ["scroll", { top: 604, behavior: "smooth" }]);
});

test("reduced motion is instant even when global CSS enables smooth scrolling", () => {
  const s = setup(57, true);
  scheduleCalculatorStepScroll(s.heading, s.header, s.viewport);
  s.flush();
  assert.deepEqual(s.calls.at(-1), ["scroll", { top: 1227, behavior: "instant" }]);
});

test("a superseded transition cancels its scroll; only the latest step scrolls", () => {
  const s = setup();
  const cancel = scheduleCalculatorStepScroll(s.heading, s.header, s.viewport);
  cancel();
  scheduleCalculatorStepScroll(s.heading, s.header, s.viewport);
  s.flush();
  assert.equal(s.calls.filter((call) => (call as unknown[])[0] === "scroll").length, 1);
});

test("unmount cancels a pending scroll", () => {
  const s = setup();
  scheduleCalculatorStepScroll(s.heading, s.header, s.viewport)();
  s.flush();
  assert.deepEqual(s.calls, [["focus", { preventScroll: true }]]);
});

test("missing header is safe and target never goes above the document", () => {
  const s = setup();
  s.layout.headingTop = -1200;
  scheduleCalculatorStepScroll(s.heading, null, s.viewport);
  s.flush();
  assert.deepEqual(s.calls.at(-1), ["scroll", { top: 0, behavior: "smooth" }]);
});
