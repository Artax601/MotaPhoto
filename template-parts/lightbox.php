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

// Récupére les arguments de filtrage
$args = isset($args) ? $args : [];
?>
<script>

</script>
