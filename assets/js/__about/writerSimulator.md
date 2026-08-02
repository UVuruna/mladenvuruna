# Writer Simulator

**Script:** [Writer Simulator (script)](../writerSimulator.js) ·
**Flow:** [diagram](../__flow/writerSimulator.md)

## Purpose

Drives the essay-writing animation: two modes (typewriter with a blinking
cursor, handwriting with a quill pen that tracks the last-typed character),
both built on Typed.js's character reveal, sequenced one-at-a-time across
however many essays are on the page via an `IntersectionObserver`-driven
queue.

## Connections

### Uses

- `Typed` — global from `assets/libraries/typed.min.js` (used for BOTH
  modes; see [Writer Simulator (flow)](../__flow/writerSimulator.md)'s
  Notes for why the legacy planning docs describe a different, abandoned
  library for handwriting)
- `config/site.json` (`breakpoints.mobile`), `config/writerSimulator.json`
  (`enabled`, `defaultMode`, per-mode speed/delay, pen geometry,
  `scrollTrigger.threshold`) — see [Config (folder)](../../../config/___config.md)
- [Writer Simulator CSS](../../css/__about/writer-simulator.md) — every
  class this file toggles is styled there
- `window.MV_IS_ADMIN` — gates config-load debug logging

### Used by

- [Eseji Index](../../../pages/eseji/__about/index.md) — loaded via
  `$scripts = ['writerSimulator']`
- [Essay Entry](../../../components/essays/__about/essay-entry.md) — one
  `WriterSimulator` instance per `.essay-entry` on the page

## Classes

### WriterSimulator

One instance per `.essay-entry`. State: `mode`, `isAnimating`,
`hasAnimated`, `typed` (Typed.js instance), `observer`,
`penTrackingInterval`.

- `mergeOptions(options)` — deep-merges fetched config over hardcoded
  defaults, per sub-object (`typewriter`, `handwriting`, `pen`,
  `scrollTrigger`).
- `parseMarkdownInline(text)` / `parseMarkdown(text)` — a small hand-rolled
  Markdown subset (`**bold**`, `*italic*`, paragraph/line breaks); the
  inline variant is used for the Typed.js source string (no block
  elements), the full variant replaces it once typing completes.
- `startTypewriter()` / `startHandwriting()` — construct the Typed.js
  instance per mode; handwriting additionally sizes/positions the pen and
  starts `startPenTracking()`.
- `startCursorTracking()` / `startPenTracking()` — `requestAnimationFrame`
  loops that keep the viewport auto-scrolled to the moving cursor/pen (see
  [Writer Simulator (flow)](../__flow/writerSimulator.md)).
- `disableScroll()` / `enableScroll()` — locks wheel/touch/keyboard scroll
  for the animation's duration.
- `skip()` / `onComplete()` / `destroy()` — cleanup paths; `onComplete()`
  notifies the module-level queue to start the next essay.

### WriterSimulatorQueue (module-level singleton)

`instances[]`, `currentIndex`, `isAnimating`, `observer`. Uses one shared
`IntersectionObserver` (threshold `[0.99, 1.0]`) across every essay's
`.essay-parchment` to start exactly one animation at a time, in the order
essays become fully visible.

## Design Decisions

See [Writer Simulator (flow)](../__flow/writerSimulator.md) for the full
init → observe → animate → queue-advance sequence and the drift this
migration caught against the legacy planning docs.
