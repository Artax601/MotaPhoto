/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
/* -------------------------------------------------------------------------- */
/*                                 Burger-menu                                */
/* -------------------------------------------------------------------------- */
const image = document.getElementById("burgerImage");
const menu = document.getElementById("menu");
const menuOverlay = document.getElementById("menu-overlay");

document.querySelector(".burger-menu").addEventListener("click", function () {
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");
    menu.classList.add("inactive");
    menuOverlay.style.display = "none"; // Masque l'overlay
  } else {
    menu.classList.remove("inactive");
    menu.classList.add("active");
    menuOverlay.style.display = "block"; // Affiche l'overlay
  }

  // Vérifie quelle image est actuellement affichée et bascule vers l'autre
  if (image.src.includes("menu-open.svg")) {
    image.src =
      "http://localhost:10155/wp-content/themes/motaphoto/assets/images/menu-close.svg";
  } else {
    image.src =
      "http://localhost:10155/wp-content/themes/motaphoto/assets/images/menu-open.svg";
  }
});

/* -------------------------------------------------------------------------- */
/*                                   Select                                   */
/* -------------------------------------------------------------------------- */

jQuery(document).ready(function () {
  jQuery(".js-example-basic-single").select2();
  jQuery(".selector").select2({
    minimumResultsForSearch: Infinity,
    dropdownCssClass: "custom-dropdown",
    containerCssClass: "custom-container",
  });

  // Rotation au clic sur ".selector-container__select"
  jQuery(".selector-container__select").click(function (event) {
    jQuery(this).toggleClass("rotate").siblings().removeClass("rotate");
    event.stopPropagation(); // Empêcher la propagation de l'événement
  });

  // Ferme la liste déroulante Select2 lorsque l'utilisateur clique en dehors
  jQuery(document).on("click", function (e) {
    if (!jQuery(e.target).closest(".select2-container").length) {
      jQuery(".selector").select2("close");
    }
    jQuery(".selector-container__select").removeClass("rotate");
  });

  jQuery(".js-example-basic-single").on("change", function () {
    // Récupére les valeurs sélectionnées
    const selectedValues = jQuery(this).val();
    jQuery(".selector-container__select").removeClass("rotate");

    console.log(selectedValues);
  });
});
