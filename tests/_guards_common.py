"""Shared helpers for the project's guard tests (test_structure_law,
test_config_sections, test_docs_coverage, test_doc_links). Not a test module
itself — no `test_` prefix, pytest will not collect it.

This is a PHP + vanilla-JS + CSS website (no Python runtime code at all) —
the guards are Python because THE STRUCTURE LAW and the docs-coverage rules
are monorepo-wide (root CODE.md / DOCS.md), not tied to any one language.
`iter_source_files()` walks `.php` / `.js` / `.css` only, per this project's
migration brief.

Two deliberate exclusions beyond the standard vendored/build directories:

- `assets/libraries/` (pruned by directory name) — `page-flip.min.js` and
  `typed.min.js` are third-party vendored code, tracked in git (no package
  manager on this project — root Rule #21) but not authored logic; treated
  exactly like the fonts/images sitting beside them.
- `config.php` (excluded by file name) — the real, gitignored runtime config
  (admin IPs, admin password hash — this project's `.gitignore` excludes it
  from version control). It exists on THIS disk checkout but would not exist
  on a fresh clone, so no guard may depend on it being present. Its tracked
  twin `config.example.php` carries identical structure/logic with placeholder
  values and is what every guard and doc actually describes — see root
  CLAUDE.md's "docs must not reproduce secrets" instruction for this session.
"""

import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Directories never scanned by any guard.
EXCLUDE_DIR_NAMES = {
    ".git", ".claude", "UV", "__pycache__", ".pytest_cache",
    "node_modules", "vendor", "dist", "build",
    "libraries",  # assets/libraries/ — vendored third-party JS, see docstring
}

# Individual tracked/untracked files never scanned by any guard, by basename.
EXCLUDE_FILE_NAMES = {
    "config.php",  # gitignored real secrets — see docstring
}

SOURCE_EXTENSIONS = {".php", ".js", ".css"}


def _walk_files(suffixes: set[str]):
    for dirpath, dirnames, filenames in os.walk(PROJECT_ROOT):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIR_NAMES]
        for name in filenames:
            if name in EXCLUDE_FILE_NAMES:
                continue
            if Path(name).suffix in suffixes:
                yield Path(dirpath) / name


def iter_source_files(extensions=SOURCE_EXTENSIONS):
    """Yields every project source file with one of `extensions`, skipping
    vendored/build directories and files (pruned, not just filtered)."""
    yield from _walk_files(extensions)


def iter_doc_files():
    """Yields every project .md file, skipping vendored/build dirs and the
    owner's gitignored UV/ inbox."""
    yield from _walk_files({".md"})
