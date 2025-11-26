export async function login(event) {
  event.preventDefault(); // Empêche le rechargement de la page
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.href = "index.html"; // Redirige vers la page d'accueil
    } else {
      const loginInputs = document.querySelectorAll(".login__form input");
      loginInputs.forEach((input) => {
        if (input.type !== "submit") {
          input.classList.add("form__input--error");
        }
      });
    }
  } catch (err) {
    console.error("Erreur lors de la requête de login:", err);
  }
}

const form = document.querySelector(".login__form");
if (form) form.addEventListener("submit", login);
