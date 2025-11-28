import { fetchJSON } from "./utils.js";
import { generateFigure } from "./script.js";
const toggleModal = () => {
  const modal = document.querySelector(".modal");
  const closeModalBtn = document.querySelector(".closer");

  // Ouvrir la modale
  document.querySelectorAll(".modal__opener").forEach((opener) => {
    opener.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex";
      console.log("Modale ouverte");
    });
  });

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

async function generateModalWorks() {
  try {
    const data = window.allWorks

    data.forEach((work) => {
      const divModal = document.querySelector(".modal__works");

      const workElement = document.createElement("figure");
      workElement.dataset.id = work.id;
      workElement.dataset.category = work.categoryId;

      const workImage = document.createElement("img");
      workImage.src = work.imageUrl;

      const workDelete = document.createElement("i");
      workDelete.className = "fa-solid fa-trash-can";
      workDelete.classList.add("modal__works__delete");

      divModal.appendChild(workElement);
      workElement.appendChild(workImage);
      workElement.appendChild(workDelete);
    });

    //si il y a une erreur, je l'affiche
  } catch (error) {
    console.error(error.message);
  }
}

// je lance la fonction
// generateModalWorks();

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

// Supprimer un travail
document.querySelector(".modal__works").addEventListener("click", async (e) => {
  // Vérifier si l'élément cliqué est une icône de suppression
  if (e.target.classList.contains("modal__works__delete")) {
    const workElement = e.target.closest("figure");
    const workId = workElement.dataset.id;

    const token = localStorage.getItem("token");

    try {
      // Appeler l'API pour supprimer l'élément
      const url = `http://localhost:5678/api/works/${workId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the work");
      }

      // Supprimer l'élément du DOM
      workElement.remove();

      // Supprimer l'élément correspondant dans la galerie principale
      const galleryElement = document.querySelector(
        `.gallery figure[data-id="${workId}"]`
      );
      if (galleryElement) {
        galleryElement.remove();
      }
    } catch (error) {
      console.error(error.message);
    }
  }
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
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

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
    // document.querySelector(".gallery").innerHTML = ""; // Vider la galerie
    const newWork = await response.json();
    window.allWorks.push(newWork);
    console.log("🚀 ~ window.allWorks:", window.allWorks)
    // TODO : Ajouter la fonction pour ajouter à la galerie principale et à la modale de nouveau travail
    const newFigure = generateFigure(newWork);
    const newFigureForModal = generateFigure(newWork, true);
    document.querySelector(".gallery").appendChild(newFigure);
    document.querySelector(".modal__works").appendChild(newFigureForModal);
    
    // await generatePortfolio(window.allWorks); // Regénérer la galerie principale
    // Mettre a jour les travaux de la modale
    // document.querySelector(".modal__works").innerHTML = ""; // Vider les travaux de la modale

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
