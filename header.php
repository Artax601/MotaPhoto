<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 */
?>
<!doctype html>
<html <?php language_attributes();?>>

<head>
	<meta charset="<?php bloginfo("charset");?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head();?>

</head>

<body <?php body_class();?>>
	<?php wp_body_open();?>

	<header class="site-header">
    <a href="<?php echo home_url(); ?>" class="site-header__logo">
        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo.png" alt="Logo Motaphoto">
    </a>
	<button class="burger-menu hidden-desktop" id="toggleButton">
            <img id="burgerImage" src="<?php echo get_template_directory_uri(); ?>/assets/images/menu-open.svg">
        </button>
		<div id="menu-overlay"></div>
		<div id="menu" class="hidden-menu">
            <!-- Liste de liens -->
            <nav class="main-navigation">
			<?php
wp_nav_menu(
    array(
        'theme_location' => 'primary-menu',
        'menu_id' => 'primary-menu',
    )
);
?>

    </nav>
        </div>
    <nav class="main-navigation">
        <?php
wp_nav_menu(
    array(
        'theme_location' => 'primary-menu',
        'menu_id' => 'primary-menu',
    )
);
?>
    </nav><!-- .site-header__main-navigation -->
</header><!-- .site-header -->


	</header><!-- #masthead -->