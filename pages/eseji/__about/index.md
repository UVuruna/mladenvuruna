# Eseji — Index

**Script:** [Eseji Index (script)](../index.php)

## Purpose

The `/pages/eseji/` route entry point. Sets page metadata, defines two
hardcoded placeholder essays (one `typewriter`-mode, one `handwriting`-mode
— see [Essay Entry](../../../components/essays/__about/essay-entry.md) for
what `mode` controls), and assembles the page shell around them.

## Connections

### Uses

- Root `config.php`, [Database](../../../includes/__about/db.md) (required
  but unused — see that doc's Design Decisions)
- [Includes (folder)](../../../includes/___includes.md) — `head.php`,
  `loader.php`, `header.php`, `footer.php`
- [Essay Entry](../../../components/essays/__about/essay-entry.md) — one
  `include` per essay in the `foreach` loop

## Design Decisions

- **`$libraries = ['typed.min']`** loads the vendored Typed.js library
  before `$scripts = ['writerSimulator']` runs — see
  [Footer](../../../includes/__about/footer.md)'s load-order note.
- **Placeholder content is real Serbian prose**, not lorem-ipsum — the two
  <!-- lang-ok: quoting the two essay titles by name, not writing Serbian prose -->
  essays ("O Pisanju", "Sećanja i Vreme") read as finished short pieces, not
  test filler, even though the `// TODO` marks them as pre-database.
