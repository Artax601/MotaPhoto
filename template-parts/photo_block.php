<?php
// Récupére la photo transmise
$photo = get_query_var("related_photo");
$categories = get_the_terms($photo, 'categorie');
if (!is_wp_error($categories) && $categories) {
    $category = $categories[0]->name;
} else {
    $category = 'Non renseigné';
}

$reference = get_field("Référence", $photo);

// Récupére les arguments de filtrage (condition)
$args = isset($args) ? $args : [];
?>

<div class="related-photo main">
    <!-- overlay -->
    <div class="overlay">
        <!-- fullscreen bouton -->
        <div class="overlay__fullscreen">
            <button class="overlay__fullscreen-button" data-src="<?=get_the_post_thumbnail_url($photo, [564, 495]);?>" data-reference="<?=$reference?>" data-category="<?=$category?>">
                <img src="<?=get_template_directory_uri() . "/assets/images/icon-fullscreen.svg"?>">
            </button>
        </div>
        <!-- eye bouton -->
        <div class="overlay__eye">
            <button>
                <a class="overlay__eye-link" href="<?=esc_url(get_permalink($photo));?>">
                    <img src="<?=get_template_directory_uri() . "/assets/images/icon-eye.svg"?>">
                </a>
            </button>
        </div>
        <!-- info -->
        <div class="overlay__info">
            <p class="overlay__info-ref">#<?=$reference?></p>
            <p class="overlay__info-title"><?=$category?></p>
        </div>
    </div>
    <a href="<?php echo esc_url(get_permalink($photo)); ?>">
        <img class="related-photo__img" src="<?=get_the_post_thumbnail_url($photo, [564, 495]);?>">
    </a>
</div>