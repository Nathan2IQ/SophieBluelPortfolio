import { postData } from "./utils.js";
export async function login(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const response = await postData("users/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.token);
    window.location.href = "index.html";
  } catch (e) {
    console.error("Erreur lors de la requête de login:", e);
  }
}
const form = document.querySelector(".login__form");
if (form) form.addEventListener("submit", login);
