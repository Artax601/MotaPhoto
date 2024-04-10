<?php

if (!defined("_S_VERSION")) {
    // Replace the version number of the theme on each release.
    define("_S_VERSION", "1.6.3");
}

function theme_enqueue_styles()
{
    // Enqueue Google Fonts
    wp_enqueue_style(
        "space-mono-font",
        "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
        [],
        null
    );

    // Enqueue Poppins font
    wp_enqueue_style(
        "poppins-font",
        "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
        [],
        null
    );

    // Enqueue main stylesheet
    wp_enqueue_style(
        "main-style",
        get_template_directory_uri() . "/style.css",
        [],
        "1.0",
        "all"
    );
    // Enqueue navigation script
    wp_enqueue_script(
        "navigation-script",
        get_stylesheet_directory_uri() . "/js/navigation.js",
        [],
        null,
        true
    );
    // si c'est une page photo
    if (is_singular("photos")) {
        wp_enqueue_script(
            "photo-script",
            get_stylesheet_directory_uri() . "/js/photo.js",
            [],
            null,
            true
        );
    }
    // Enqueue global script
    wp_enqueue_script(
        "global-script",
        get_stylesheet_directory_uri() . "/js/scripts.js",
        [],
        null,
        true
    );

    // Enqueue Select2
    wp_enqueue_style(
        "select2",
        "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css",
        [],
        null
    );
    wp_enqueue_script(
        "select2",
        "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js",
        [],
        null,
        true
    );
}

add_action("wp_enqueue_scripts", "theme_enqueue_styles");

function theme_register_menus()
{
    register_nav_menus([
        "primary-menu" => esc_html__("Primary Menu", "mota-photo"),
    ]);
}
add_action("after_setup_theme", "theme_register_menus");

function register_footer_menu()
{
    register_nav_menu("footer_menu", __("Footer Menu", "textdomain"));
}
add_action("after_setup_theme", "register_footer_menu");

/* -------------------------------------------------------------------------- */
/*                                    Ajax                                    */
/* -------------------------------------------------------------------------- */

// Fonction pour récupérer les arguments de requête communs
function get_common_args()
{
    return [
        "posts_per_page" => 8,
        "post_type" => "photos",
        "post_status" => "publish",
    ];
}

// Fonction pour récupérer les arguments de requête basés sur la taxonomie
function get_taxonomy_args($taxonomy, $term)
{
    $args = get_common_args();
    $args["tax_query"] = [
        [
            "taxonomy" => $taxonomy,
            "field" => "slug",
            "terms" => $term,
        ],
    ];
    return $args;
}

// Fonction pour récupérer les arguments de requête basés sur l'ordre
function get_order_args($order)
{
    $args = get_common_args();
    $args["order"] = $order;
    return $args;
}

// Définition des arguments de requête
$argsCroissant = get_order_args("ASC");
$argsDecroissant = get_order_args("DESC");
$argsTypePortrait = get_taxonomy_args("formats", "Portrait");
$argsTypePaysage = get_taxonomy_args("formats", "Paysage");
$argsReception = get_taxonomy_args("categorie", "reception");
$argsTelevision = get_taxonomy_args("categorie", "television");
$argsConcert = get_taxonomy_args("categorie", "concert");
$argsMariage = get_taxonomy_args("categorie", "mariage");

// Fonction pour charger les images
function load_more_images()
{
    $offset = isset($_POST["offset"]) ? intval($_POST["offset"]) : 0;
    $limit = isset($_POST["limit"]) ? intval($_POST["limit"]) : 8;
    $args = isset($_POST["args"]) ? $_POST["args"] : [];

    $args = array_merge(get_common_args(), $args);
    $args["offset"] = $offset;
    $args["posts_per_page"] = $limit;

    $posts = get_posts($args);

    ob_start();
    foreach ($posts as $post) {
        setup_postdata($post);
        set_query_var("related_photo", $post);
        get_template_part("template-parts/photo_block");
    }
    $output = ob_get_clean();

    echo $output;
    wp_die();
}

// Enregistrement et chargement des scripts et styles
function enqueue_my_scripts()
{
    wp_enqueue_script(
        "ajax-script",
        get_stylesheet_directory_uri() . "/dist/main.bundle.js",
        ["jquery"],
        "",
        true
    );

    wp_localize_script("ajax-script", "ajax_object", [
        "ajax_url" => admin_url("admin-ajax.php"),
    ]);

    wp_enqueue_script(
        "navigation-script",
        get_stylesheet_directory_uri() . "/js/navigation.js",
        [],
        null,
        true
    );

    global $argsCroissant,
    $argsDecroissant,
    $argsTypePortrait,
    $argsTypePaysage,
    $argsReception,
    $argsTelevision,
    $argsConcert,
        $argsMariage;
    $localized_data = compact(
        "argsCroissant",
        "argsDecroissant",
        "argsTypePortrait",
        "argsTypePaysage",
        "argsReception",
        "argsTelevision",
        "argsConcert",
        "argsMariage"
    );

    wp_localize_script("navigation-script", "localized_data", $localized_data);
}
add_action("wp_enqueue_scripts", "enqueue_my_scripts");
add_action("wp_ajax_load_more_images", "load_more_images");
add_action("wp_ajax_nopriv_load_more_images", "load_more_images");
