<?php
/**
 * Essays Page - Uses WriterSimulator for animated text display
 */

$basePath = "../../";
require_once "{$basePath}config.php";
require_once "{$basePath}includes/db.php";

$currentPage = 'eseji';
$pageTitle = 'Eseji';
$pageDescription = 'Mladen Vuruna - Eseji. Razmišljanja o životu, umetnosti i pisanju.';

$styles = ['writer-simulator'];
$libraries = ['typed.min'];
$scripts = ['writerSimulator'];

// Placeholder essays for testing
// TODO: Replace with database query when ready
$essays = [
    [
        'id' => 1,
        'slug' => 'o-pisanju',
        'title' => 'O Pisanju',
        'mode' => 'typewriter', // Typewriter mode - blinking cursor
        'content' => 'Pisanje je kao disanje. Ponekad lako, ponekad teško, ali uvek neophodno.

Svaki pisac zna taj trenutak kada reči same teku, kada prsti jedva stižu za mislima. To su trenuci za koje živimo — kada prestajemo da budemo mi i postajemo samo kanal kroz koji prolazi priča.

Ali tu su i oni drugi trenuci. Kada svaka reč mora da se izvuče kao kamen iz duboke vode. Kada stranica ostaje prazna satima, a mi gledamo u nju tražeći nešto što kao da ne postoji.

**Pisanje je disciplina.** To je posao koji se radi svaki dan, bez obzira na inspiraciju. Jer inspiracija dolazi onima koji rade, ne onima koji čekaju.'
    ],
    [
        'id' => 2,
        'slug' => 'secanja-i-vreme',
        'title' => 'Sećanja i Vreme',
        'mode' => 'handwriting', // Handwriting mode - quill pen on parchment
        'content' => 'Vreme nije linija. To je reka koja teče u svim pravcima, vraćajući se nazad i jurcajući napred, stvarajući vrtloge od naših sećanja.

Kada se sećamo, ne gledamo u prošlost — mi je stvaramo iznova. Svako sećanje je nova priča, ispričana iz ugla koji danas imamo, sa znanjem koje smo stekli u medjuvremenu.

Zato naša sećanja nisu pouzdana. Ali nisu ni nepouzdana. Ona su nešto drugo — lična mitologija koju gradimo o sebi, priča koju pričamo da bismo razumeli ko smo i kako smo postali to.'
    ]
];
?>
<!DOCTYPE html>
<html lang="sr">
<?php include "{$basePath}includes/head.php"; ?>
<body>
    <?php include "{$basePath}includes/loader.php"; ?>
    <?php include "{$basePath}includes/header.php"; ?>

    <main id="main-content" class="essays-page">
        <section class="page-header">
            <div class="container">
                <h1 class="page-title">Eseji</h1>
                <p class="page-subtitle">Razmišljanja o životu, umetnosti i pisanju</p>
            </div>
        </section>

        <section class="essays-section">
            <div class="container">
                <?php foreach ($essays as $essay): ?>
                    <?php include "{$basePath}components/essays/essay-entry.php"; ?>
                <?php endforeach; ?>
            </div>
        </section>
    </main>

    <?php include "{$basePath}includes/footer.php"; ?>
</body>
</html>
