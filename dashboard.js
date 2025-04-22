import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { auth } from './firebase.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

const db = getFirestore(getApp());

const calendarEl = document.getElementById("calendar");
const modal = document.getElementById("modal");
const selectedDaysSpan = document.getElementById("selected-days");
const confirmBtn = document.getElementById("confirm-request");
const cancelBtn = document.getElementById("cancel-request");

let selectedDates = [];

onAuthStateChanged(auth, (user) => {
  const loading = document.getElementById("loading");
  const content = document.querySelector(".dashboard-container");

  if (user && user.email === "sestra@test.cz") {
    loading.style.display = "none";
    content.style.display = "block";
    document.getElementById("username").innerText += ` (${user.email})`;
    loadCalendar(user);
  } else {
    window.location.href = "index.html";
  }
});

function loadCalendar(user) {
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    locale: 'cs',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    select: function(info) {
      selectedDates = getDateRange(info.start, info.end);
      selectedDaysSpan.textContent = selectedDates.join(", ");
      modal.classList.remove("hidden");
    }
  });
  calendar.render();
}

function getDateRange(start, end) {
  const dates = [];
  const current = new Date(start);
  while (current < end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

confirmBtn.addEventListener("click", async () => {
  const leaveType = document.querySelector('input[name="leave-type"]:checked').value;
  const user = auth.currentUser;
  if (!user) return;

  for (const day of selectedDates) {
    await addDoc(collection(db, "zadosti"), {
      datum: day,
      typ: leaveType,
      email: user.email,
      stav: "čeká"
    });
  }

  modal.classList.add("hidden");
  location.reload();
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});