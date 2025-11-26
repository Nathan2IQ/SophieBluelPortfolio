import { fetchJSON } from "./utils.js";

export async function generatePortfolio() {
  try {
    const data = await fetchJSON("works");
    const divPortfolio = document.querySelector(".gallery");
    data.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const caption = document.createElement("figcaption");
      figure.dataset.id = work.id;
      figure.dataset.category = work.category.id;
      img.src = work.imageUrl;
      img.alt = work.title;
      caption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(caption);
      divPortfolio.appendChild(figure);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

// Fonction pour afficher les filtres
async function generateFilters() {
  try {
    const data = await fetchJSON("categories");

    // Parcourt les catégories pour créer les boutons de filtre
    data.forEach((category) => {
      const navFilter = document.querySelector(".filter"); // Sélectionne le conteneur des filtres
      const button = document.createElement("button"); // Crée un bouton
      button.classList.add("filter__btn"); // Ajoute une classe CSS
      button.textContent = category.name; // Définit le texte du bouton
      button.dataset.id = category.id; // Ajoute l'ID de la catégorie
      button.type = "button"; // Définit le type du bouton

      // Ajoute un événement pour filtrer les travaux
      button.addEventListener("click", () => {
        const figures = document.querySelectorAll(".gallery figure"); // Sélectionne toutes les figures
        figures.forEach((figure) => {
          if (figure.dataset.category != category.id) {
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

// Génère un bouton pour afficher tous les projets
const navFilter = document.querySelector(".filter");
const allButton = document.createElement("button");
allButton.classList.add("filter__btn", "filter__btn:focus");
allButton.textContent = "Tous";
allButton.type = "button";

allButton.addEventListener("click", () => {
  const figures = document.querySelectorAll(".gallery figure");
  figures.forEach((figure) => {
    figure.style.display = "block";
  });
});

navFilter.appendChild(allButton);

Promise.all([generatePortfolio(), generateFilters()])
  .then(() => {
    console.log("Modale works and filters generated");
  })
  .catch((error) => {
    console.error(
      "Erreur lors de la génération de la modale works ou des filtres :",
      error
    );
  });

// je vérifie si le token est valide
function checkToken() {
  const token = localStorage.getItem("token");
  const body = document.querySelector("body");
  const logoutBtn = document.querySelector("nav a");

  const isLogged = Boolean(token);

  body.classList.toggle("edit_mode_on", isLogged);
  logoutBtn.classList.toggle("logout__btn", isLogged);
  logoutBtn.textContent = isLogged ? "logout" : "login";
}

checkToken();

//je fais une fonction pour se deconnecter
function logout() {
  localStorage.removeItem("token");
}

const logoutBtn = document.querySelector("nav a");

//je fais un event listener sur le bouton de deconnexion pour se deconnecter
logoutBtn.addEventListener("click", (event) => {
  if (logoutBtn.textContent === "logout") {
    event.preventDefault();
    logout();
    checkToken();
    window.location.href = "index.html";
  }
});
