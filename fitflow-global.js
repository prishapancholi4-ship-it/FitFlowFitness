// Pages that require login
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

const currentPage = location.pathname.split("/").pop();

// If the page is protected, enforce login
if (protectedPages.includes(currentPage)) {
  if (localStorage.getItem("fitflowLoggedIn") !== "true") {
    window.location.href = "login.html";
  }
}
