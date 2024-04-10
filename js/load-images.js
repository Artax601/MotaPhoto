/* -------------------------------------------------------------------------- */
/*                                Requête AJAX                                */
/* -------------------------------------------------------------------------- */

let offset = 0; // Commence à partir du premier élément
let limit = 8; // Nombre d'images à charger à chaque fois
let args = {}; // Défini les arguments initiaux comme un objet vide

// Fonction pour charger les images via AJAX

function loadMoreImages() {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      url: ajax_object.ajax_url,
      type: "POST",
      data: {
        action: "load_more_images",
        offset: offset, // Envoie l'offset actuel
        limit: limit,
        args: args, // Envoie les arguments de filtre avec la requête AJAX
      },
      success: function (response) {
        jQuery("#image-container").append(response); // Ajoute les nouvelles images à l'élément avec l'ID 'image-container'
        offset += limit; // Met à jour l'offset pour les prochaines requêtes
        resolve();
        console.log(offset);
      },
      error: function (error) {
        reject(error); // Rejette la promesse en cas d'erreur
      },
    });
  });
}

jQuery(document).ready(function ($) {
  // Lancement de la fonction pour charger les images au chargement de la page
  Lightbox.init();

  // Attache un gestionnaire d'événement au clic sur le bouton
  $(".photo-list__button").on("click", function () {
    Lightbox.init();
  });

  // attache un gestionnaire d'événement au changement de sélection
  function getOrderByArguments(selectedOption) {
    if (selectedOption === "plus-recentes") {
      return localized_data.argsCroissant;
    } else if (selectedOption === "plus-anciennes") {
      return localized_data.argsDecroissant;
    } else {
      return {};
    }
  }

  function getTypeArguments(selectedOption) {
    if (selectedOption === "portrait") {
      return localized_data.argsTypePortrait;
    } else if (selectedOption === "paysage") {
      return localized_data.argsTypePaysage;
    } else {
      return {};
    }
  }

  function getCategoriesArguments(selectedOption) {
    if (selectedOption === "reception") {
      return localized_data.argsReception;
    } else if (selectedOption === "television") {
      return localized_data.argsTelevision;
    } else if (selectedOption === "concert") {
      return localized_data.argsConcert;
    } else if (selectedOption === "mariage") {
      return localized_data.argsMariage;
    } else {
      return {};
    }
  }
  // Gére le changement de sélection pour les filtres d'ordre et de type
  jQuery("#ordre, #formats, #categories").on("change", function () {
    const selectedOrdre = jQuery("#ordre").val();
    const selectedType = jQuery("#formats").val();
    const selectedCategories = jQuery("#categories").val();

    // Obtient les arguments pour l'ordre et le type
    const orderByArgs = getOrderByArguments(selectedOrdre);
    const typeArgs = getTypeArguments(selectedType);
    const categoriesArgs = getCategoriesArguments(selectedCategories);

    // Fusionne les arguments pour l'ordre, le type et les catégories
    if (selectedType) {
      args = {
        ...orderByArgs,
        ...typeArgs,
        ...categoriesArgs,
        formats: selectedType.split(","),
      };
    } else {
      args = {
        ...orderByArgs,
        ...typeArgs,
        ...categoriesArgs,
      };
    }

    // Réinitialise l'offset à 0 et charge les nouvelles images
    offset = 0;
    $("#image-container").empty(); // Vide le conteneur d'images existant
    Lightbox.init();
  });
});
