<?php
/**
 * Essay Entry Component
 * Used with WriterSimulator for animated text display
 *
 * Expected variables:
 * - $essay: array with keys: id, slug, title, content, (optional) author, (optional) mode
 * - $basePath: path to root directory
 *
 * Optional $essay['mode']:
 * - 'typewriter' = force typewriter mode (no toggle shown)
 * - 'handwriting' = force handwriting mode (no toggle shown)
 * - null/unset = show toggle, user can choose
 */

// Sanitize content for data attribute (escape special chars)
$contentEscaped = htmlspecialchars($essay['content'] ?? '', ENT_QUOTES, 'UTF-8');
$titleEscaped = htmlspecialchars($essay['title'] ?? '', ENT_QUOTES, 'UTF-8');
$essayMode = $essay['mode'] ?? null;
$showToggle = empty($essayMode);
?>

<article class="essay-entry"
         id="<?php echo htmlspecialchars($essay['slug'] ?? 'essay-' . ($essay['id'] ?? '0')); ?>"
         <?php if ($essayMode): ?>data-mode="<?php echo htmlspecialchars($essayMode); ?>"<?php endif; ?>>
    <div class="essay-parchment">
        <?php if ($showToggle): ?>
        <!-- Mode Toggle (only shown if mode not preset) -->
        <div class="essay-mode-toggle">
            <button type="button" data-mode="typewriter" class="active" aria-label="Režim kucanja">
                Kucanje
            </button>
            <button type="button" data-mode="handwriting" aria-label="Režim rukopisa">
                Rukopis
            </button>
        </div>
        <?php endif; ?>

        <!-- Paper -->
        <div class="essay-paper">
            <!-- Title -->
            <h2 class="essay-title" data-text="<?php echo $titleEscaped; ?>">
                <?php echo $titleEscaped; ?>
            </h2>

            <!-- Content - JS will animate this -->
            <div class="essay-content" data-text="<?php echo $contentEscaped; ?>">
                <!-- WriterSimulator renders content here -->
            </div>

            <!-- Skip Button -->
            <button type="button" class="essay-skip" aria-label="Preskoči animaciju">
                Preskoči <span aria-hidden="true">›</span>
            </button>

            <!-- Quill Pen (for handwriting mode) -->
            <img src="<?php echo $basePath; ?>assets/img/svg/quill.svg"
                 class="essay-pen"
                 alt=""
                 aria-hidden="true">
        </div>
    </div>

    <?php if (!empty($essay['author'])): ?>
    <div class="essay-meta">
        <span class="essay-author"><?php echo htmlspecialchars($essay['author']); ?></span>
    </div>
    <?php endif; ?>
</article>
