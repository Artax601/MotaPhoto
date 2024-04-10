const prev = document.querySelector(".prev-btn");
const next = document.querySelector(".next-btn");

const prevImage = document.querySelector(".photo-contact__images .prev-img");
const nextImage = document.querySelector(".photo-contact__images .next-img");

prev.addEventListener("mouseover", (event) => {
  prevImage.classList.remove("prev-img");
});

prev.addEventListener("mouseleave", (event) => {
  prevImage.classList.add("prev-img");
});

next.addEventListener("mouseover", (event) => {
  nextImage.classList.remove("next-img");
});

next.addEventListener("mouseleave", (event) => {
  nextImage.classList.add("next-img");
});
