function initAdmin() {
  protectAdminPage();

  const welcome = document.getElementById("adminWelcome");
  welcome.textContent = "Logged in as admin. Choose a tool to begin.";

  // Admin link always visible
  const adminLink = document.getElementById("adminLink");
  if (adminLink) adminLink.style.display = "block";

  // Burger menu toggle
  document.getElementById("burgerMenu").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });
}

function goTo(path) {
  window.location.href = path;
}

function goBack() {
  window.location.href = "dashboard.html";
}

function handleLogout() {
  setCurrentUser(null);
  window.location.href = "login.html";
}
