import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase config (nahraď svým)
const firebaseConfig = {
  // zde bude tvá konfigurace
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM prvky
const calendarEl = document.getElementById("calendar");
const modal = document.getElementById("modal");
const selectedDaysSpan = document.getElementById("selected-days");
const confirmBtn = document.getElementById("confirm-request");
const cancelBtn = document.getElementById("cancel-request");

let selectedDates = [];

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("username").innerText = "Moje směny a dovolená (" + user.email + ")";
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

// Pomocná funkce pro výběr více dní
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
  location.reload(); // dočasné obnovení pro zobrazení stavu
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});