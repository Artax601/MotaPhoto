const modal = document.getElementById("contactModal");
const overlay = document.getElementById("menu-overlay");
const menuItems = document.querySelectorAll(".menu-item-29 a, .contact-btn");

// Fonction pour ouvrir le menu
function openMenu() {
  modal.classList.remove("hidden-modal");
  modal.classList.add("show-modal");
  overlay.style.display = "block";
}

// Fonction pour fermer le menu
function closeMenu() {
  modal.classList.remove("show-modal");
  modal.classList.add("hidden-modal");
  overlay.style.display = "none";
}

// événements le lien du menu
menuItems.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.stopPropagation();
    openMenu();
  });
});

// événements pour le clic sur le body
document.body.addEventListener("click", (event) => {
  const isClickInsideMenu = modal.contains(event.target);

  if (!isClickInsideMenu) {
    closeMenu();
  }
});

// Ferme le menu lorsqu'on clique sur l'overlay
overlay.addEventListener("click", () => {
  closeMenu();
});
