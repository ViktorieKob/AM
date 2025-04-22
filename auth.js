// auth.js
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { auth } from "./firebase.js";

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorP = document.getElementById("error");

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      if (email.toLowerCase() === "vedouci@test.cz") {
        window.location.href = "zadosti.html";
      } else {
        window.location.href = "dashboard.html";
      }
    })
    .catch((error) => {
      errorP.textContent = "Chyba přihlášení: " + error.message;
    });
};
