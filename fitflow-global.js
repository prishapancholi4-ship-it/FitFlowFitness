// -------------------------------
// FitFlow Global Access Control
// -------------------------------

// Pages that should NOT be protected (onboarding flow)
const openPages = [
  "login.html",
  "register.html",
  "privacy.html",
  "terms.html",
  "assessment.html"
];

// Pages that DO require login
const protectedPages = [
  "dashboard.html",
  "sleep.html",
  "water.html",
  "nutrition.html",
  "workouts.html",
  "activity-log.html",
  "meditation.html",
  "breathing.html",
  "affirmations.html",
  "journal.html",
  "profile.html",
  "goals.html",
  "badges.html",
  "weekly-summary.html",
  "challenges.html",
  "shop.html",
  "blog.html",
  "settings.html",
  "admin.html",
  "rewards.html",
  "progress.html"
];

// Get current page filename
const currentPage = location.pathname.split("/").pop();

// -------------------------------
// Enforce login ONLY on protected pages
// -------------------------------
if (protectedPages.includes(currentPage)) {
  const loggedIn = localStorage.getItem("fitflowLoggedIn") === "true";

  if (!loggedIn) {
    window.location.href = "login.html";
  }
}

// -------------------------------
// Logout helper (used in sidebar/menu)
// -------------------------------
function logout() {
  // Clear only login-related keys (keeps points, badges, etc.)
  localStorage.removeItem("fitflowLoggedIn");
  localStorage.removeItem("fitflowOnboardingComplete");

  // Redirect to login
  window.location.href = "login.html";
}
