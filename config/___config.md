# config/

Runtime configuration fetched over HTTP by client-side JS (`fetch('config/*.json')`)
— separate from the server-side `config.php`/`config.example.php` PHP
constant (see root [Config Example](../__about/config.example.md)). Every
file here is plain JSON data, outside the `.php`/`.js`/`.css` scope the four
guard tests classify — this folder doc is their whole documentation (no
`__about/`/`__flow/` subfolders).

## Files

| File | Fetched by | Purpose |
|------|-----------|---------|
| `bookReader.json` | [Book Reader](../assets/js/__about/bookReader.md) | flip/transition timing, page aspect-ratio + min/max size bounds, StPageFlip option overrides |
| `site.json` | [Book Reader](../assets/js/__about/bookReader.md), [Theme Switch](../assets/js/__about/themeSwitch.md), [Writer Simulator](../assets/js/__about/writerSimulator.md) | shared values: geolocation (for sunrise/sunset), responsive breakpoints, loader fade delay |
| `themeSwitch.json` | [Theme Switch](../assets/js/__about/themeSwitch.md) | night-SVG path, wipe-animation duration, sessionStorage key |
| `writerSimulator.json` | [Writer Simulator](../assets/js/__about/writerSimulator.md) | enabled flag, default mode, per-mode typing speed, pen geometry, scroll-trigger threshold |

## Connections

### Uses

- Nothing — static JSON served directly by the web server

### Used by

- [Assets — JS (subfolder)](../assets/js/___js.md) — `bookReader.js`,
  `themeSwitch.js` and `writerSimulator.js` each `fetch()` their own file
  (`writerSimulator.js` also reads `site.json` for the shared mobile
  breakpoint)

## Design Decisions

- **`site.json`'s `loader.fadeDelay` (500ms) is never actually read by
  code** — [Includes (folder)](../includes/___includes.md)'s `loader.php`
  inline script hardcodes the same `500` directly rather than fetching this
  file. The two values currently agree by coincidence, not by wiring — see
  [Open Questions](../OPEN-QUESTIONS.md).
- **Every config-consuming JS module merges fetched JSON over hardcoded
  in-file defaults** (`Object.assign`/spread), and treats a failed/absent
  fetch as non-fatal (`if (response.ok)` guards, `try`/`catch` around the
  whole load) — the site must render correctly even if `config/*.json` 404s
  or the network fails, so these are genuinely optional overrides, not a
  required config load.
