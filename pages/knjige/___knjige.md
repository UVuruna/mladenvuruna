# pages/knjige/

The `/pages/knjige/` route — the books listing + in-place page-flip reader.

## Files

| File | Tier | One line |
|------|------|----------|
| `index.php` | Standard | page assembly + 3 hardcoded placeholder books (2 published, 1 WIP) — [about](__about/index.md) |

## Connections

### Uses

- [Includes (folder)](../../includes/___includes.md) — page shell
- [Book Reader](../../assets/js/__about/bookReader.md) /
  [Book Reader (flow)](../../assets/js/__flow/bookReader.md) — the
  interactive reader every `.book-container` on this page becomes
- `config/bookReader.json`, `config/site.json` — see
  [Config (folder)](../../config/___config.md)

### Used by

- [Pages (folder)](../___pages.md) — sibling route
- [Includes (folder)](../../includes/___includes.md)'s header/footer nav —
  the "Knjige" link

## Design Decisions

- **Books are a hardcoded PHP array, not a database query** — same pattern
  and same TODO as [Eseji](../eseji/___eseji.md); `getPlaceholderPages()`
  generates `placehold.co` URLs for page images instead of real WebP pages
  (matches [ROADMAP.md](../../ROADMAP.md) Phase 4's PDF→WebP pipeline,
  which is not built yet).
