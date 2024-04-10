/******/ (() => {
  // webpackBootstrap
  var __webpack_exports__ = {};
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

  let hasPassiveEvents = false;
  if (typeof window !== "undefined") {
    const passiveTestOptions = {
      get passive() {
        hasPassiveEvents = true;
        return undefined;
      },
    };
    window.addEventListener("testPassive", null, passiveTestOptions);
    window.removeEventListener("testPassive", null, passiveTestOptions);
  }

  const isIosDevice =
    typeof window !== "undefined" &&
    window.navigator &&
    window.navigator.platform &&
    (/iP(ad|hone|od)/.test(window.navigator.platform) ||
      (window.navigator.platform === "MacIntel" &&
        window.navigator.maxTouchPoints > 1));

  let locks = /* unused pure expression or super */ null && [];
  let documentListenerAdded = false;
  let initialClientY = /* unused pure expression or super */ null && -1;
  let previousBodyOverflowSetting;
  let previousBodyPosition;
  let previousBodyPaddingRight;

  // returns true if `el` should be allowed to receive touchmove events.
  const allowTouchMove = (el) =>
    locks.some((lock) => {
      if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
        return true;
      }

      return false;
    });

  const preventDefault = (rawEvent) => {
    const e = rawEvent || window.event;

    // For the case whereby consumers adds a touchmove event listener to document.
    // Recall that we do document.addEventListener('touchmove', preventDefault, { passive: false })
    // in disableBodyScroll - so if we provide this opportunity to allowTouchMove, then
    // the touchmove event on document will break.
    if (allowTouchMove(e.target)) {
      return true;
    }

    // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
    if (e.touches.length > 1) return true;

    if (e.preventDefault) e.preventDefault();

    return false;
  };

  const setOverflowHidden = (options) => {
    // If previousBodyPaddingRight is already set, don't set it again.
    if (previousBodyPaddingRight === undefined) {
      const reserveScrollBarGap =
        !!options && options.reserveScrollBarGap === true;
      const scrollBarGap =
        window.innerWidth - document.documentElement.clientWidth;

      if (reserveScrollBarGap && scrollBarGap > 0) {
        const computedBodyPaddingRight = parseInt(
          window
            .getComputedStyle(document.body)
            .getPropertyValue("padding-right"),
          10
        );
        previousBodyPaddingRight = document.body.style.paddingRight;
        document.body.style.paddingRight = `${
          computedBodyPaddingRight + scrollBarGap
        }px`;
      }
    }

    // If previousBodyOverflowSetting is already set, don't set it again.
    if (previousBodyOverflowSetting === undefined) {
      previousBodyOverflowSetting = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
  };

  const restoreOverflowSetting = () => {
    if (previousBodyPaddingRight !== undefined) {
      document.body.style.paddingRight = previousBodyPaddingRight;

      // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
      // can be set again.
      previousBodyPaddingRight = undefined;
    }

    if (previousBodyOverflowSetting !== undefined) {
      document.body.style.overflow = previousBodyOverflowSetting;

      // Restore previousBodyOverflowSetting to undefined
      // so setOverflowHidden knows it can be set again.
      previousBodyOverflowSetting = undefined;
    }
  };

  const setPositionFixed = () =>
    window.requestAnimationFrame(() => {
      // If previousBodyPosition is already set, don't set it again.
      if (previousBodyPosition === undefined) {
        previousBodyPosition = {
          position: document.body.style.position,
          top: document.body.style.top,
          left: document.body.style.left,
        };

        // Update the dom inside an animation frame
        const { scrollY, scrollX, innerHeight } = window;
        document.body.style.position = "fixed";
        document.body.style.top = `${-scrollY}px`;
        document.body.style.left = `${-scrollX}px`;

        setTimeout(
          () =>
            window.requestAnimationFrame(() => {
              // Attempt to check if the bottom bar appeared due to the position change
              const bottomBarHeight = innerHeight - window.innerHeight;
              if (bottomBarHeight && scrollY >= innerHeight) {
                // Move the content further up so that the bottom bar doesn't hide it
                document.body.style.top = -(scrollY + bottomBarHeight);
              }
            }),
          300
        );
      }
    });

  const restorePositionSetting = () => {
    if (previousBodyPosition !== undefined) {
      // Convert the position from "px" to Int
      const y = -parseInt(document.body.style.top, 10);
      const x = -parseInt(document.body.style.left, 10);

      // Restore styles
      document.body.style.position = previousBodyPosition.position;
      document.body.style.top = previousBodyPosition.top;
      document.body.style.left = previousBodyPosition.left;

      // Restore scroll
      window.scrollTo(x, y);

      previousBodyPosition = undefined;
    }
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
  const isTargetElementTotallyScrolled = (targetElement) =>
    targetElement
      ? targetElement.scrollHeight - targetElement.scrollTop <=
        targetElement.clientHeight
      : false;

  const handleScroll = (event, targetElement) => {
    const clientY = event.targetTouches[0].clientY - initialClientY;

    if (allowTouchMove(event.target)) {
      return false;
    }

    if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
      // element is at the top of its scroll.
      return preventDefault(event);
    }

    if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
      // element is at the bottom of its scroll.
      return preventDefault(event);
    }

    event.stopPropagation();
    return true;
  };

  const body_scroll_lock_disableBodyScroll = (targetElement, options) => {
    // targetElement must be provided
    if (!targetElement) {
      // eslint-disable-next-line no-console
      console.error(
        "disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices."
      );
      return;
    }

    // disableBodyScroll must not have been called on this targetElement before
    if (locks.some((lock) => lock.targetElement === targetElement)) {
      return;
    }

    const lock = {
      targetElement,
      options: options || {},
    };

    locks = [...locks, lock];

    if (isIosDevice) {
      setPositionFixed();
    } else {
      setOverflowHidden(options);
    }

    if (isIosDevice) {
      targetElement.ontouchstart = (event) => {
        if (event.targetTouches.length === 1) {
          // detect single touch.
          initialClientY = event.targetTouches[0].clientY;
        }
      };
      targetElement.ontouchmove = (event) => {
        if (event.targetTouches.length === 1) {
          // detect single touch.
          handleScroll(event, targetElement);
        }
      };

      if (!documentListenerAdded) {
        document.addEventListener(
          "touchmove",
          preventDefault,
          hasPassiveEvents ? { passive: false } : undefined
        );
        documentListenerAdded = true;
      }
    }
  };

  const clearAllBodyScrollLocks = () => {
    if (isIosDevice) {
      // Clear all locks ontouchstart/ontouchmove handlers, and the references.
      locks.forEach((lock) => {
        lock.targetElement.ontouchstart = null;
        lock.targetElement.ontouchmove = null;
      });

      if (documentListenerAdded) {
        document.removeEventListener(
          "touchmove",
          preventDefault,
          hasPassiveEvents ? { passive: false } : undefined
        );
        documentListenerAdded = false;
      }

      // Reset initial clientY.
      initialClientY = -1;
    }

    if (isIosDevice) {
      restorePositionSetting();
    } else {
      restoreOverflowSetting();
    }

    locks = [];
  };

  const body_scroll_lock_enableBodyScroll = (targetElement) => {
    if (!targetElement) {
      // eslint-disable-next-line no-console
      console.error(
        "enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices."
      );
      return;
    }

    locks = locks.filter((lock) => lock.targetElement !== targetElement);

    if (isIosDevice) {
      targetElement.ontouchstart = null;
      targetElement.ontouchmove = null;

      if (documentListenerAdded && locks.length === 0) {
        document.removeEventListener(
          "touchmove",
          preventDefault,
          hasPassiveEvents ? { passive: false } : undefined
        );
        documentListenerAdded = false;
      }
    }

    if (isIosDevice) {
      restorePositionSetting();
    } else {
      restoreOverflowSetting();
    }
  }; // CONCATENATED MODULE: ./js/lightbox.js

  /* -------------------------------------------------------------------------- */
  /*                                  lightbox                                  */
  /* -------------------------------------------------------------------------- */

  class Lightbox {
    static async init() {
      try {
        await loadMoreImages(); // Attends que les images soient chargées

        const links = Array.from(
          document.querySelectorAll(".overlay__fullscreen-button")
        );
        const gallery = links.map((link) => link.dataset.src);
        const referenceAll = links.map((link) => link.dataset.reference);
        const categoryAll = links.map((link) => link.dataset.category);

        links.forEach((link) =>
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const imageURL = e.currentTarget.dataset.src;
            const reference = e.currentTarget.dataset.reference;
            const category = e.currentTarget.dataset.category;
            new Lightbox(
              imageURL,
              gallery,
              reference,
              category,
              referenceAll,
              categoryAll
            );
          })
        );
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors du chargement des images :",
          error
        );
      }
    }

    constructor(url, images, reference, category, referenceAll, categoryAll) {
      this.element = this.buildDOM(url, reference, category);
      this.images = images;
      this.referenceAll = referenceAll;
      this.categoryAll = categoryAll;
      this.loadImage(url, reference, category);
      this.onKeyUp = this.onKeyUp.bind(this);
      document.body.appendChild(this.element);
      disableBodyScroll(this.element);
      document.addEventListener("keyup", this.onKeyUp);
    }

    next(e) {
      e.preventDefault();
      let i = this.images.findIndex((image) => image === this.url);
      if (i === this.images.length - 1) {
        i = -1;
      }
      console.log(i);
      const nextReference = this.referenceAll[i + 1];
      const nextCategory = this.categoryAll[i + 1];
      this.loadImage(this.images[i + 1], nextReference, nextCategory);
    }

    prev(e) {
      e.preventDefault();
      let i = this.images.findIndex((image) => image === this.url);
      if (i === 0) {
        i = this.images.length;
      }
      console.log(i);
      const prevReference = this.referenceAll[i - 1];
      const prevCategory = this.categoryAll[i - 1];
      this.loadImage(this.images[i - 1], prevReference, prevCategory);
    }

    loadImage(url, reference, category) {
      this.url = null;
      const image = new Image();
      const container = this.element.querySelector(".lightbox__container");
      const loader = document.createElement("div");
      loader.classList.add("lightbox__loader");
      container.innerHTML = "";
      container.appendChild(loader);

      // référence & catégorie affichées
      const infoRef = this.element.querySelector(".lightbox__info-ref");
      const infoTitle = this.element.querySelector(".lightbox__info-title");
      infoRef.textContent = "#" + reference;
      infoTitle.textContent = category;

      image.onload = () => {
        console.log("CHARGER");
        container.removeChild(loader);
        container.appendChild(image);
        this.url = url;
      };
      image.src = url;
    }

    onKeyUp(e) {
      if (e.key === "Escape") {
        this.close(e);
      } else if (e.key === "ArrowRight") {
        this.next(e);
      } else if (e.key === "ArrowLeft") {
        this.prev(e);
      }
    }

    close(e) {
      e.preventDefault();
      this.element.classList.add("fadeOut");
      enableBodyScroll(this.element);
      window.setTimeout(() => {
        this.element.parentElement.removeChild(this.element);
      }, 500);
      document.removeEventListener("keyup", this.onKeyUp);
    }

    buildDOM(url, reference, category) {
      const imagePath = {
        close: "/wp-content/themes/motaphoto/assets/images/lightbox-close.svg",
        next: "/wp-content/themes/motaphoto/assets/images/arrow-right.svg",
        prev: "/wp-content/themes/motaphoto/assets/images/arrow-left.svg",
      };

      const dom = document.createElement("div");
      dom.classList.add("lightbox");
      dom.innerHTML = `<button class="lightbox__close"><img src="${imagePath.close}"></button>
      <button class="lightbox__next">Suivant<img src="${imagePath.next}"></button>
      <button class="lightbox__prev"><img src="${imagePath.prev}">Précédent</button>
      <div  class="lightbox__info">
      <p class="lightbox__info-ref">#${reference}</p>
      <p class="lightbox__info-title">${category}</p>
  </div>
      <div class="lightbox__container"></div>`;
      dom
        .querySelector(".lightbox__close")
        .addEventListener("click", this.close.bind(this));
      dom
        .querySelector(".lightbox__next")
        .addEventListener("click", this.next.bind(this));
      dom
        .querySelector(".lightbox__prev")
        .addEventListener("click", this.prev.bind(this));

      return dom;
    }
  }

  /******/
})();
