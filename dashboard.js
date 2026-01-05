/* =========================================================
   SIDEBAR TOGGLE
   ========================================================= */

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("sidebarOverlay").classList.toggle("active");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarOverlay").classList.remove("active");
}

/* =========================================================
   DASHBOARD LOGIC
   ========================================================= */

// Example progress system — adjust as needed
let dailyPoints = 0;
const maxPoints = 100;

function updateProgress() {
  const bar = document.getElementById("progressBar");
  const percent = Math.min((dailyPoints / maxPoints) * 100, 100);
  bar.style.width = percent + "%";
}

function addPoints(amount = 10) {
  dailyPoints += amount;
  updateProgress();
}

function resetDay() {
  dailyPoints = 0;
  updateProgress();
}

// Initialize on load
document.addEventListener("DOMContentLoaded", updateProgress);
