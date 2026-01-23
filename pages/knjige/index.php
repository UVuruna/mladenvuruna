<?php
/**
 * Books Page - Uses StPageFlip library for realistic page turning
 */

$basePath = "../../";
require_once "{$basePath}config.php";
require_once "{$basePath}includes/db.php";

$currentPage = 'knjige';
$pageTitle = 'Knjige';
$pageDescription = 'Mladen Vuruna - Knjige. Pogledajte i čitajte odlomke iz mojih knjiga.';

$styles = ['books', 'book-reader'];
$scripts = ['bookReader'];

function getPlaceholderPages($count) {
    $pages = [];
    $colors = ['e8d5b7', 'f5e6d3', 'ebe0cc', 'f0e5d8', 'e5dcc8'];
    for ($i = 1; $i <= $count; $i++) {
        $color = $colors[$i % count($colors)];
        $pages[] = "https://placehold.co/400x600/{$color}/333?text=Str.+{$i}";
    }
    return $pages;
}

$publishedBooks = [
    [
        'id' => 1,
        'slug' => 'senke-proslosti',
        'title' => 'Senke Prošlosti',
        'description' => 'Roman o sećanjima koja nas progone i istinama koje skrivamo od sebe.',
        'review' => '„Vuruna piše sa izuzetnom osetljivošću." — Književni glasnik',
        'cover_front' => $basePath . 'assets/img/webp/example_front.jpg',
        'cover_back' => $basePath . 'assets/img/webp/example_back.jpg',
        'pages' => getPlaceholderPages(6),
        'buy_links' => [
            ['label' => 'Arhipelag', 'url' => '#'],
            ['label' => 'Delfi', 'url' => '#'],
        ]
    ],
    [
        'id' => 2,
        'slug' => 'nocna-strana-meseca',
        'title' => 'Noćna Strana Meseca',
        'description' => 'Zbirka priča koje istražuju tamne kutke ljudske prirode.',
        'review' => '„Priče koje ostaju sa vama." — Politika',
        'cover_front' => $basePath . 'assets/img/webp/example_front.jpg',
        'cover_back' => $basePath . 'assets/img/webp/example_back.jpg',
        'pages' => getPlaceholderPages(4),
        'buy_links' => [['label' => 'Laguna', 'url' => '#']]
    ],
];

$worksInProgress = [
    [
        'id' => 3,
        'slug' => 'poslednji-voz',
        'title' => 'Poslednji Voz',
        'description' => 'Roman u nastajanju o grupi stranaca na poslednjem vozu.',
        'review' => 'Očekivano: jesen 2026.',
        'cover_front' => $basePath . 'assets/img/webp/example_front.jpg',
        'cover_back' => $basePath . 'assets/img/webp/example_back.jpg',
        'pages' => getPlaceholderPages(4),
        'buy_links' => []
    ],
];
?>
<!DOCTYPE html>
<html lang="sr">
<?php include "{$basePath}includes/head.php"; ?>
<body>
    <?php include "{$basePath}includes/loader.php"; ?>
    <?php include "{$basePath}includes/header.php"; ?>

    <main id="main-content" class="books-page">
        <section class="page-header">
            <div class="container">
                <h1 class="page-title">Knjige</h1>
                <p class="page-subtitle">Odlomci iz mojih knjiga</p>
            </div>
        </section>

        <!-- Published Books -->
        <section class="books-section">
            <div class="container">
                <?php foreach ($publishedBooks as $book): ?>
                <article class="book-entry" id="<?php echo $book['slug']; ?>">
                    <!-- Book stage centers everything -->
                    <div class="book-stage">
                        <!-- Book wrapper handles translateX animation -->
                        <div class="book-wrapper">
                            <div class="book-container"
                                 data-id="<?php echo $book['id']; ?>"
                                 data-pages='<?php echo json_encode($book['pages']); ?>'
                                 data-front="<?php echo $book['cover_front']; ?>"
                                 data-back="<?php echo $book['cover_back']; ?>">

                                <!-- Cover (click to open) -->
                                <div class="book-cover">
                                    <img src="<?php echo $book['cover_front']; ?>"
                                         alt="<?php echo $book['title']; ?>">
                                    <span class="book-cover-hint">Klikni za čitanje</span>
                                </div>

                                <!-- Flipbook container (StPageFlip renders here) -->
                                <div class="book-flipbook"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Controls (outside stage for proper positioning) -->
                    <div class="book-controls">
                        <button class="btn-prev" aria-label="Prethodna">‹</button>
                        <button class="btn-close" aria-label="Zatvori">✕</button>
                        <button class="btn-next" aria-label="Sledeća">›</button>
                    </div>

                    <div class="book-info">
                        <h2><?php echo $book['title']; ?></h2>
                        <p><?php echo $book['description']; ?></p>
                        <blockquote><?php echo $book['review']; ?></blockquote>
                        <?php if ($book['buy_links']): ?>
                        <div class="book-links">
                            <?php foreach ($book['buy_links'] as $link): ?>
                            <a href="<?php echo $link['url']; ?>" class="btn btn-secondary"><?php echo $link['label']; ?></a>
                            <?php endforeach; ?>
                        </div>
                        <?php endif; ?>
                    </div>
                </article>
                <?php endforeach; ?>
            </div>
        </section>

        <!-- Works in Progress -->
        <section class="books-section books-wip">
            <div class="container">
                <h2 class="section-title">Radovi u Toku</h2>
                <?php foreach ($worksInProgress as $book): ?>
                <article class="book-entry" id="<?php echo $book['slug']; ?>">
                    <div class="book-stage">
                        <div class="book-wrapper">
                            <div class="book-container"
                                 data-id="<?php echo $book['id']; ?>"
                                 data-pages='<?php echo json_encode($book['pages']); ?>'
                                 data-front="<?php echo $book['cover_front']; ?>"
                                 data-back="<?php echo $book['cover_back']; ?>">
                                <div class="book-cover">
                                    <img src="<?php echo $book['cover_front']; ?>" alt="<?php echo $book['title']; ?>">
                                    <span class="book-cover-hint">Klikni za čitanje</span>
                                </div>
                                <div class="book-flipbook"></div>
                            </div>
                        </div>
                    </div>
                    <div class="book-controls">
                        <button class="btn-prev" aria-label="Prethodna">‹</button>
                        <button class="btn-close" aria-label="Zatvori">✕</button>
                        <button class="btn-next" aria-label="Sledeća">›</button>
                    </div>
                    <div class="book-info">
                        <h2><?php echo $book['title']; ?></h2>
                        <p><?php echo $book['description']; ?></p>
                        <p class="book-status"><?php echo $book['review']; ?></p>
                    </div>
                </article>
                <?php endforeach; ?>
            </div>
        </section>
    </main>

    <?php include "{$basePath}includes/footer.php"; ?>
</body>
</html>
