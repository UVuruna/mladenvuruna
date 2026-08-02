# Footer

**Script:** [Footer (script)](../footer.css)

## Purpose

Styles the `#kontakt` contact-form section and the site footer (brand,
nav links, copyright line), with a two-column form row and horizontal
footer layout on desktop.

## Connections

### Uses

- [Root](root.md) — every custom property this file reads

### Used by

- [Footer](../../../includes/__about/footer.md) — the PHP partial whose
  markup this file styles

## Design Decisions

- **Mobile-first**: the base rules stack the form row and center the
  footer content; the one `@media (min-width: 768px)` block switches the
  form row to two columns and the footer to a horizontal space-between
  layout — matches root `CLAUDE.md`'s mobile-first Project Delta.
