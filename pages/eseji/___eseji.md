# pages/eseji/

The `/pages/eseji/` route — the essays listing page.

## Files

| File | Tier | One line |
|------|------|----------|
| `index.php` | Standard | page assembly + 2 hardcoded placeholder essays — [about](__about/index.md) |

## Connections

### Uses

- [Includes (folder)](../../includes/___includes.md) — page shell
- [Essay Entry](../../components/essays/__about/essay-entry.md) — rendered
  once per essay in a loop
- [Writer Simulator](../../assets/js/__about/writerSimulator.md) /
  [Writer Simulator (flow)](../../assets/js/__flow/writerSimulator.md) —
  the animation that plays the essay content
- `config/writerSimulator.json` — see [Config (folder)](../../config/___config.md)

### Used by

- [Pages (folder)](../___pages.md) — sibling route
- [Includes (folder)](../../includes/___includes.md)'s header/footer nav —
  the "Eseji" link

## Design Decisions

- **Essays are a hardcoded PHP array, not a database query** — a
  `// TODO: Replace with database query when ready` comment marks the exact
  spot; [Database](../../includes/__about/db.md)'s `content`/`pages` tables
  exist in the schema but are never populated or read by this page today.
