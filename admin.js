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
   ADMIN ACTIONS
   ========================================================= */

// Open modal for new blog post
function openNewPostModal() {
  const modal = document.getElementById("newPostModal");
  if (modal) modal.style.display = "flex";
}

// Close modal
function closeNewPostModal() {
  const modal = document.getElementById("newPostModal");
  if (modal) modal.style.display = "none";
}

// Example: Reset all user progress
function resetAllProgress() {
  alert("All user progress has been reset.");
}

// Example: Add points (admin override)
function addPoints(amount = 10) {
  alert(`Added ${amount} points.`);
}

// Example: Reset day for all users
function resetDay() {
  alert("Daily progress reset for all users.");
}
