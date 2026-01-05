function initDashboard() {
  protectUserPage();

  const user = getCurrentUserObject();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Welcome message
  const welcomeEl = document.getElementById("welcomeMessage");
  welcomeEl.textContent = `Hi ${user.username}, here’s your snapshot for today.`;

  // Stats
  updateGlobalUI();

  // Admin button visibility
  const adminBtn = document.getElementById("adminButton");
  if (adminBtn) adminBtn.style.display = isAdmin() ? "inline-block" : "none";

  // Sidebar admin link visibility
  const adminLink = document.getElementById("adminLink");
  if (adminLink) adminLink.style.display = isAdmin() ? "block" : "none";

  // Burger menu toggle
  document.getElementById("burgerMenu").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });
}

function goTo(path) {
  window.location.href = path;
}

function handleLogout() {
  setCurrentUser(null);
  window.location.href = "login.html";
}
