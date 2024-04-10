<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 */
?>
<?php get_template_part("template-parts/modal");?>
<?php get_template_part("template-parts/lightbox");?>

	<footer class="site-footer">

        <?php wp_nav_menu([
    "theme_location" => "footer_menu",
    "menu_id" => "footer-menu",
    "container" => "nav",
    "container_class" => "site-footer__menu",
]);?>


	</footer><!-- #colophon -->
</div><!-- #page -->


<?php wp_footer();?>



</body>
</html>
