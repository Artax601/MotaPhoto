/* -------------------------------------------------------------------------- */
/*                                  lightbox                                  */
/* -------------------------------------------------------------------------- */

import { disableBodyScroll, enableBodyScroll } from "./body-scroll-lock.js";

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
