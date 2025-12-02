import { getData } from "./utils.js";
import { deleteData } from "./utils.js";

let allWorks = [];
let allCategories = [];
// Import des travaux et des catégories
const initData = async () => {
  try {
    return Promise.all([getData("works"), getData("categories")]).then(
      ([works, categories]) => {
        categories.unshift({ id: 0, name: "Tous" });
        allWorks = works;
        window.allWorks = works;
        allCategories = categories;
        window.allCategories = categories;
        return { works, categories };
      }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
};
const initShowModalButton = () => {
  const modalBtnCtn = document.getElementById("modalBtnCtn");
  const modalOpener = document.createElement("a");
  modalOpener.href = "#modal";
  modalOpener.classList.add("modal__opener");
  modalOpener.innerHTML =
    '<p><i class="fa-regular fa-pen-to-square"></i>modifier</p>';
  modalOpener.addEventListener("click", (event) => {
    event.preventDefault();
    const modal = document.querySelector(".modal");
    modal.style.display = "flex";
  });
  modalBtnCtn.appendChild(modalOpener);
  const filterCtn = document.querySelector(".filter");
  filterCtn.style.marginTop = "0px";
  filterCtn.style.marginBottom = "0px";
};
const generateAdminBanner = () => {
  const body = document.querySelector("body");
  const adminBanner = document.createElement("div");
  adminBanner.classList.add("edit__mode");
  adminBanner.innerHTML =
    '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>';
  body.insertAdjacentElement("afterbegin", adminBanner);
};

// Initialisation des données et génération du portfolio et des filtres
initData().then(({ works, categories }) => {
  generatePortfolio(works);

  if (checkToken()) {
    const logoutBtn = document.querySelector("nav a");
    getCategoryAdd(categories);

    initShowModalButton();
    generateAdminBanner();

    logoutBtn.addEventListener("click", (event) => {
      if (logoutBtn.textContent === "logout") {
        event.preventDefault();
        logout();
        checkToken();
        generateFilters(categories);
        const filterCtn = document.querySelector(".filter");
        filterCtn.style.marginTop = "0px";
        filterCtn.style.marginBottom = "0px";
      }
    });
    generateModalWorks(works);
  } else {
    generateFilters(allCategories);
  }
});

async function generateModalWorks(data) {
  try {
    const divModal = document.querySelector(".modal__works");
    divModal.innerHTML = "";
    data.forEach((work) => {
      const workElement = generateFigure(work, true);

      generateBtnTrash(work.id, workElement);

      divModal.appendChild(workElement);
    });

    //si il y a une erreur, je l'affiche
  } catch (error) {
    console.error(error.message);
  }
}
//je recup les categories pour les afficher dans le select
async function getCategoryAdd(categories) {
  try {
    const select = document.getElementById("category");

    categories.forEach((category) => {
      if (category.name.toLowerCase() !== "tous") {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      }
    });
  } catch (error) {
    console.error(error.message);
  }
}
const generateBtnTrash = (id, figure) => {
  const workDelete = document.createElement("i");
  workDelete.className = "fa-solid fa-trash-can";
  workDelete.classList.add("modal__works__delete");
  workDelete.addEventListener("click", async () => {
    try {
      await deleteData(`works/${id}`);

      if (response.ok) {
        // Supprimer la figure de la modale
        figure.remove();
        // Supprimer la figure de la galerie principale
        const mainGalleryFigure = document.querySelector(
          `.gallery figure[data-id='${id}']`
        );
        if (mainGalleryFigure) {
          mainGalleryFigure.remove();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du travail :", error);
    }
  });
  figure.appendChild(workDelete);
};

export const generateFigure = (work, context = false) => {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const caption = document.createElement("figcaption");
  figure.dataset.id = work.id;
  figure.dataset.category = work.categoryId;
  img.src = work.imageUrl;
  img.alt = work.title;
  !context
    ? (caption.textContent = work.title)
    : generateBtnTrash(work.id, figure);

  figure.appendChild(img);
  figure.appendChild(caption);
  return figure;
};

// Fonction pour afficher le portfolio
export function generatePortfolio(works) {
  try {
    const divPortfolio = document.querySelector(".gallery");
    works.forEach((work) => {
      const figure = generateFigure(work);
      divPortfolio.appendChild(figure);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

// Fonction pour afficher les filtres
async function generateFilters(categories) {
  try {
    // Parcourt les catégories pour créer les boutons de filtre
    categories.forEach((category) => {
      const navFilter = document.querySelector(".filter"); // Sélectionne le conteneur des filtres
      const button = document.createElement("button"); // Crée un bouton
      button.classList.add("filter__btn"); // Ajoute une classe CSS
      button.textContent = category.name; // Définit le texte du bouton
      button.dataset.id = category.id; // Ajoute l'ID de la catégorie
      button.type = "button"; // Définit le type du bouton
      if (category.id === 0) {
        button.classList.add("active"); // Ajoute une classe active pour la catégorie "Tous"
      }

      // Ajoute un événement pour filtrer les travaux
      button.addEventListener("click", () => {
        // Supprime la classe active de tous les boutons
        const allButtons = document.querySelectorAll(".filter__btn");
        allButtons.forEach((btn) => btn.classList.remove("active"));
        // Ajoute la classe active au bouton cliqué
        button.classList.add("active");
        const figures = document.querySelectorAll(".gallery figure"); // Sélectionne toutes les figures
        figures.forEach((figure) => {
          if (category.id === 0) {
            figure.style.display = "block"; // Affiche toutes les figures pour la catégorie "Tous"
          } else if (figure.dataset.category != category.id) {
            figure.style.display = "none"; // Cache les figures non correspondantes
          } else {
            figure.style.display = "block"; // Affiche les figures correspondantes
          }
        });
      });

      navFilter.appendChild(button); // Ajoute le bouton au conteneur
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

// je vérifie si le token est valide
function checkToken() {
  const token = localStorage.getItem("token");
  const body = document.querySelector("body");
  const logoutBtn = document.querySelector("nav a");

  const isLogged = Boolean(token);

  body.classList.toggle("edit_mode_on", isLogged);
  logoutBtn.classList.toggle("logout__btn", isLogged);
  logoutBtn.textContent = isLogged ? "logout" : "login";
  return isLogged;
}

//je fais une fonction pour se deconnecter
function logout() {
  localStorage.removeItem("token");
  const modalBtnCtn = document.getElementById("modalBtnCtn");
  modalBtnCtn.innerHTML = "";
  window.location.reload();
  checkToken();
}
