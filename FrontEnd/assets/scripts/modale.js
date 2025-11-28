import { generateFigure } from "./script.js";
import { postData } from "./utils.js";

const toggleModal = () => {
  const modal = document.querySelector(".modal");
  const closeModalBtn = document.querySelector(".closer");

  // Fermer la modale
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Fermer la modale en cliquant à l'extérieur de celle-ci
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Fermer la modale avec la touche "Echap"
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      e.preventDefault();
      modal.style.display = "none";
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
});

// ce code est pour la prévisualisation de l'image avant de l'envoyer
document.getElementById("image").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const previewContainer = document.querySelector(".image__selector");

  const existingPreview = previewContainer.querySelector("img");
  if (existingPreview) {
    previewContainer.remove();
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target.result;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      previewContainer.appendChild(img);

      document.getElementById("addImage").style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("formAdd").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await postData("works", formData, true, true);

    if (!response.ok) {
      throw new Error(`Failed to add the work: ${response.status}`);
    }

    // Réinitialiser le formulaire
    form.reset();

    // Supprimer l'image de prévisualisation
    const previewImage = document.querySelector(".image__selector img");
    if (previewImage) {
      previewImage.remove();
    }

    // Mettre à jour la galerie principale

    const newWork = await response.json();
    window.allWorks.push(newWork);

    const newFigure = generateFigure(newWork);
    const newFigureForModal = generateFigure(newWork, true);
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
