# Loader

**Script:** [Loader (script)](../loader.css)

## Purpose

Styles the full-screen loading overlay: centered pulsing "MV" logotype plus
a spinning ring, and the `.loaded` fade-out transition.

## Connections

### Uses

- [Root](root.md) — every custom property this file reads

### Used by

- [Includes (folder)](../../../includes/___includes.md) — `loader.php`
  (Trivial tier, no `__about/` doc of its own) is the partial whose markup
  this file styles; its inline `<script>` toggles the `.loaded` class this
  file's transition keys off

## Design Decisions

- **Loaded purely through the always-loaded base sheet set** — one of the
  five base stylesheets [Head](../../../includes/__about/head.md) links
  unconditionally on every page (see [CSS (folder)](../___css.md)'s Files
  table), since the loader itself appears before any page-specific styles
  would be ready.
