# Writer Simulator — Flow

**About:** [description](../__about/writerSimulator.md)

## Algorithm — page load to first animation

```mermaid
%%{init: {'flowchart': {'subGraphTitleMargin': {'top': 0, 'bottom': 35}}}}%%
flowchart TB
    A["DOMContentLoaded"] --> B["fetch config/site.json (breakpoints)\nfetch config/writerSimulator.json (settings)"]
    B --> C{"settings.enabled === false?"}
    C -- yes --> Z1["RETURN — no instances created"]
    C -- no --> D["for each .essay-entry:\nnew WriterSimulator(el, settings)\nQueue.add(instance)"]
    D --> E["Queue.setupObserver():\nIntersectionObserver over every .essay-parchment\nthreshold [0.99, 1.0]"]
    E --> F{"a parchment reaches\n&gt;=99% visible?"}
    F -- yes, and Queue not animating --> G["instance.start()"]
    F -- no / already animating --> F
```

## Algorithm — instance.start() (mode branch)

```mermaid
%%{init: {'flowchart': {'subGraphTitleMargin': {'top': 0, 'bottom': 35}}}}%%
flowchart TB
    A["start()"] --> B["isAnimating = true\ndisableScroll()\nclass: waiting-to-animate -&gt; is-animating"]
    B --> C{"mode?"}
    C -- handwriting --> D["class: handwriting-mode\nstartHandwriting()"]
    C -- typewriter --> E["startTypewriter()"]
    D --> F["size/position pen (mobile-aware width)\nstartPenTracking() — RAF loop"]
    F --> G["new Typed(wrapper, {...})\nonComplete -&gt; stopPenTracking, render final HTML, onComplete()"]
    E --> H["startCursorTracking() — RAF loop"]
    H --> I["new Typed(wrapper, {...})\nonComplete -&gt; stopCursorTracking, render final HTML, onComplete()"]
    G --> J["onComplete(): enableScroll, removePen,\nhasAnimated=true, has-animated class"]
    I --> J
    J --> K{"mode == handwriting?"}
    K -- yes --> L["add cursive-text class\nshowFontToggle()"]
    K -- no --> M["Queue.onComplete(): isAnimating=false\n(observer triggers the next visible essay)"]
    L --> M
```

## Pen tracking (handwriting mode only)

    EVERY animation frame WHILE isAnimating:
        find LAST TEXT NODE inside the Typed.js wrapper
        range = Range at that node's end
        rects = range.getClientRects()
        IF rects exist:
            penX = rects.last.right - paperLeft + offsetX, clamped to [0, paperWidth - penWidth - 10]
            penY = rects.last.top - paperTop - penHeight + offsetY
            position pen at (penX, penY); reveal pen on first successful position
            scrollPenIntoView(): if pen bottom is within 80px of viewport bottom,
                                  smooth-scroll just enough to clear it

## Notes — drift caught against the legacy planning docs

- **The legacy brainstorming/plan docs (`docs/brainstorming/writer-simulator/003-*.md`,
  `docs/plans/writer-simulator/003-*.md`) describe handwriting mode built on
  Vara.js** (SVG stroke-by-stroke drawing, `getPointAtLength()` path
  tracking, a `assets/fonts/vara/*.json` font file, CDN-loaded). **None of
  that shipped.** The actual code uses Typed.js for BOTH modes and tracks
  the pen via the DOM `Range` API against Typed.js's own revealed text —
  simpler, and consistent with the project's later "no external CDN,
  download everything locally" rule (both libraries are vendored under
  `assets/libraries/`, not CDN-loaded). No `assets/fonts/vara/` directory
  exists on disk. This migration folded only the parts of those docs that
  still match reality (the two-mode concept, the config shape) and dropped
  the Vara.js-specific architecture.
- **`docs/reports/writer-simulator/004-writer-simulator-fixes.md` claims a
  `--cursive-line-height` CSS variable was added for font-size/line-height
  unification** — it was not; see
  [Writer Simulator CSS](../../css/__about/writer-simulator.md)'s Design
  Decisions. Flagged in [Open Questions](../../../OPEN-QUESTIONS.md).
- **`disableScroll()`/`enableScroll()` and the 100%-visibility
  `IntersectionObserver` threshold both match the legacy fix docs'
  proposals exactly** — that part of the drift-check confirmed rather than
  contradicted the historical record.
