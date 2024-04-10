<?php

get_header();
?>
<div class="hero-header">
    <div class="hero-header__image"> <?php

$args = array(
    'posts_per_page' => -1,
    'post_type' => 'photos',
    'post_status' => 'publish',
    'order' => 'ASC', // par ordre croissant
);

$posts = get_posts($args);

// sélectionne post aléatoire
$random_post = $posts[array_rand($posts)];

// récupére l'image aléatoire
echo get_the_post_thumbnail($random_post->ID, 'full');
?></div>
    <h1 class="hero-header__title">PHOTOGRAPHE EVENT</h1>
</div>
<!-- selecteur de trie -->
<div class="selector-container">
    <div class="selector-container__group">
    <div class="selector-container__select">
        <select name="categories" id="categories" class="selector js-example-basic-single">
          <option selected disabled>Catégories</option>
          <option value="reception">Réception</option>
          <option value="television">Télévision</option>
          <option value="concert">Concert</option>
          <option value="mariage">Mariage</option>
        </select>
    </div>
    <div class="selector-container__select">
          <select name="formats" id="formats" class="selector js-example-basic-single">
            <option selected disabled>Formats</option>
            <option value="portrait">Portrait</option>
            <option value="paysage">Paysage</option>
          </select>
        </div>
    </div>
    <div class="selector-container__select">
    <select name="ordre" id="ordre" class="selector js-example-basic-single">
        <option selected disabled>Ordre</option>
        <option value="plus-recentes">A partir des plus récentes</option>

        <option value="plus-anciennes">A partir des plus anciennes</option>
    </select>
</div>

</div>
<div class="photo-list">
    <div id="image-container" class="photo-list__container">
        <!-- images chargées via AJAX ici -->
    </div>
    <button class="photo-list__button">Charger plus</button>
</div>


<?php
get_footer();
