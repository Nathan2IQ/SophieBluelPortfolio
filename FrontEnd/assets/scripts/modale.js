import { generateFigure } from "./script.js";
import { postData } from "./utils.js";

const toggleModal = () => {
  const modal = document.querySelector(".modal");
  const closeModalBtn = document.querySelector(".closer");

  // Fonction pour supprimer la prévisualisation d'image et réafficher '+ Ajouter photo'
  function removeImagePreview() {
    const previewContainer = document.querySelector(".file__label");
    if (previewContainer) {
      const existingPreview = previewContainer.querySelector("img");
      if (existingPreview) existingPreview.remove();
      // Supprimer aussi le message d'erreur éventuel
      const oldError = document.getElementById("imageError");
      if (oldError) oldError.remove();
      // Réafficher le bouton '+ Ajouter photo' si absent
      if (!previewContainer.querySelector(".add-photo-btn")) {
        const addBtn = document.createElement("span");
        addBtn.className = "add-photo-btn";
        addBtn.textContent = "+ Ajouter photo";
        previewContainer.appendChild(addBtn);
      }
    }
  }

  // Fermer la modale
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
    removeImagePreview();
  });

  // Fermer la modale en cliquant à l'extérieur de celle-ci
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      removeImagePreview();
    }
  });

  // Fermer la modale avec la touche "Echap"
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      e.preventDefault();
      modal.style.display = "none";
      removeImagePreview();
    }
  });
};

toggleModal();

function toggleView(showId, hideId) {
  const show = document.getElementById(showId);
  const hide = document.getElementById(hideId);
  show.classList.remove("display__none");
  show.classList.add("modal__container");
  hide.classList.add("display__none");
  hide.classList.remove("modal__container");
}

// Ouvrir la modale d'ajout
document.querySelector(".modal__add__btn").addEventListener("click", (e) => {
  e.preventDefault();
  toggleView("modal__add", "modal__works");
});

// Retour à la liste des travaux
document.querySelector(".backBtn").addEventListener("click", (e) => {
  e.preventDefault();
  toggleView("modal__works", "modal__add");
  // Supprimer la prévisualisation et réafficher '+ Ajouter photo' lors du retour à la galerie
  const previewContainer = document.querySelector(".file__label");
  if (previewContainer) {
    const existingPreview = previewContainer.querySelector("img");
    if (existingPreview) existingPreview.remove();
    const oldError = document.getElementById("imageError");
    if (oldError) oldError.remove();
    if (!previewContainer.querySelector(".add-photo-btn")) {
      const addBtn = document.createElement("span");
      addBtn.className = "add-photo-btn";
      addBtn.textContent = "+ Ajouter photo";
      previewContainer.appendChild(addBtn);
    }
  }
});

// Vérification dynamique du formulaire
function checkFormValidity() {
  const imageInput = document.getElementById("image");
  const titleInput = document.querySelector('[name="title"]');
  const submitBtn = document.querySelector("#formAdd .btn__form__input");
  let valid = true;

  // Vérification image
  const file = imageInput.files[0];
  if (
    !file ||
    file.size > 4 * 1024 * 1024 ||
    !["image/jpeg", "image/png"].includes(file.type)
  ) {
    valid = false;
  }

  // Vérification titre
  if (!titleInput.value.trim()) {
    valid = false;
  }

  if (!valid) {
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = "#cccccc";
  } else {
    submitBtn.disabled = false;
    submitBtn.style.backgroundColor = "#1d6154";
  }
}

// ce code est pour la prévisualisation de l'image avant de l'envoyer
document.getElementById("image").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const previewContainer = document.querySelector(".file__label");

  // Supprimer l'ancienne prévisualisation
  const existingPreview = previewContainer.querySelector("img");
  if (existingPreview) {
    existingPreview.remove();
  }
  // Supprimer l'ancien message d'erreur
  const oldError = document.getElementById("imageError");
  if (oldError) oldError.remove();
  // Réafficher '+ Ajouter photo' si aucune image
  if (!e.target.files[0]) {
    if (!previewContainer.querySelector(".add-photo-btn")) {
      const addBtn = document.createElement("span");
      addBtn.className = "add-photo-btn";
      addBtn.textContent = "+ Ajouter photo";
      previewContainer.appendChild(addBtn);
    }
  } else {
    // Si une image est sélectionnée, retirer le bouton
    const addBtn = previewContainer.querySelector(".add-photo-btn");
    if (addBtn) addBtn.remove();
  }

  // Vérification taille (max 4 Mo)
  if (file && file.size > 4 * 1024 * 1024) {
    const error = document.createElement("div");
    error.id = "imageError";
    error.style.color = "red";
    error.textContent = "L'image ne doit pas dépasser 4 Mo.";
    previewContainer.appendChild(error);
    e.target.value = "";
    checkFormValidity();
    return;
  }

  // Vérification format (jpg ou png)
  if (file && !["image/jpeg", "image/png"].includes(file.type)) {
    const error = document.createElement("div");
    error.id = "imageError";
    error.style.color = "red";
    error.textContent = "Le format doit être JPG ou PNG.";
    previewContainer.appendChild(error);
    e.target.value = "";
    checkFormValidity();
    return;
  }

  // Afficher la prévisualisation de l'image dans le label
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      previewContainer.innerHTML = "";
      const img = document.createElement("img");
      img.src = event.target.result;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
  checkFormValidity();
});

// Vérification dynamique sur le titre
document
  .querySelector('[name="title"]')
  .addEventListener("input", checkFormValidity);
// Initialisation au chargement
window.addEventListener("DOMContentLoaded", checkFormValidity);

document.getElementById("formAdd").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Supprimer l'ancien message d'erreur titre
  const oldTitleError = document.getElementById("titleError");
  if (oldTitleError) oldTitleError.remove();

  const form = e.target;
  const formData = new FormData(form);
  const title = form.querySelector('[name="title"]').value.trim();

  if (!title) {
    const error = document.createElement("div");
    error.id = "titleError";
    error.style.color = "red";
    error.textContent = "Veuillez renseigner un titre.";
    form.querySelector(".form__group--title").appendChild(error);
    return;
  }

  try {
    const response = await postData("works", formData, true, true);

    if (!response) {
      throw new Error(`Failed to add the work: ${response.status}`);
    }

    // Supprimer l'image de prévisualisation
    const previewImage = document.querySelector(".image__selector img");
    if (previewImage) {
      previewImage.remove();
    }

    // Réinitialiser le formulaire
    form.reset();

    // Mettre à jour la galerie principale
    window.allWorks.push(response);

    const newFigure = generateFigure(response);
    const newFigureForModal = generateFigure(response, true);
    document.querySelector(".gallery").appendChild(newFigure);
    document.querySelector(".modal__works").appendChild(newFigureForModal);

    // Afficher la modale de travaux
    const modalAdd = document.getElementById("modal__add");
    modalAdd.classList.add("display__none");
    modalAdd.classList.remove("modal__container");
    const modalWorks = document.getElementById("modal__works");
    modalWorks.classList.remove("display__none");
    modalWorks.classList.add("modal__container");
  } catch (error) {
    console.error(error.message);
  }
});
