// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4j1bO7JDbzUM-ca4AWUSkGYpmglWK_IQ",
  authDomain: "dochazka-app.firebaseapp.com",
  projectId: "dochazka-app",
  storageBucket: "dochazka-app.firebasestorage.app",
  messagingSenderId: "912220280247",
  appId: "1:912220280247:web:e0b27491b9234cba984432",
  measurementId: "G-G8PPKTK907"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);