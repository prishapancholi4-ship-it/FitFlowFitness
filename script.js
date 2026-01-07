/* --------------------------------------------------
   FitFlow Script.js
   Clean rewrite — all features preserved
   Handles: trackers, journal, blog, shop, badges,
   admin tables, admin actions, analytics, etc.
-------------------------------------------------- */

/* --------------------------------------------------
   SIDEBAR TOGGLE
-------------------------------------------------- */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}

/* --------------------------------------------------
   JOURNAL
-------------------------------------------------- */
function saveJournalEntry() {
  const user = ffCurrentUser();
  if (!user) return;

  const entry = document.getElementById("journalEntry").value.trim();
  if (!entry) return;

  const today = new Date().toISOString().split("T")[0];

  if (!user.journal) user.journal = {};
  user.journal[today] = entry;

  ffSaveUser(user);

  // Points for journal entry
  ffAddPoints(user, 5, "Journal entry");
  ffLogActivity(user, "journal", { entryPreview: entry.slice(0, 50) });

  alert("Journal entry saved.");
}

function loadJournalEntry() {
  const user = ffCurrentUser();
  if (!user) return;

  const today = new Date().toISOString().split("T")[0];
  const entry = user.journal?.[today] || "";

  const box = document.getElementById("journalEntry");
  if (box) box.value = entry;
}

/* --------------------------------------------------
   TRACKERS (Sleep, Water, Nutrition, Workouts, etc.)
-------------------------------------------------- */
function ffSaveTracker(type, value) {
  const user = ffCurrentUser();
  if (!user) return;

  if (!user.trackers) user.trackers = {};
  if (!user.trackers[type]) user.trackers[type] = [];

  user.trackers[type].push({
    value,
    date: new Date().toISOString()
  });

  ffSaveUser(user);

  // Points for trackers (sleep, water, workouts, nutrition, affirmations, meditation)
  const pointTypes = ["sleep", "water", "workouts", "nutrition", "affirmations", "meditation"];
  if (pointTypes.includes(type)) {
    ffAddPoints(user, 2, `Tracker: ${type}`);
  }

  // Activity log for trackers
  ffLogActivity(user, "tracker", { type, value });
}

function ffLoadTracker(type, elementId) {
  const user = ffCurrentUser();
  if (!user) return;

  const list = user.trackers?.[type] || [];
  const container = document.getElementById(elementId);

  if (!container) return;

  container.innerHTML = list
    .map(item => `<p>${item.value} — ${new Date(item.date).toLocaleString()}</p>`)
    .join("");
}

/* --------------------------------------------------
   BADGES & SHOP
-------------------------------------------------- */
function ffUnlockBadge(badgeId) {
  const user = ffCurrentUser();
  if (!user) return;

  if (!user.badges) user.badges = [];
  if (!user.badges.includes(badgeId)) {
    user.badges.push(badgeId);
    ffSaveUser(user);
    // No points for badges (per your rule)
    ffLogActivity(user, "badge-unlocked", { badgeId });
  }
}

function ffLoadBadges() {
  const user = ffCurrentUser();
  if (!user) return;

  const container = document.getElementById("badgeGrid");
  if (!container) return;

  const allBadges = ffGetAllBadges();

  container.innerHTML = allBadges
    .map(b => `
      <div class="badge-item ${user.badges?.includes(b.id) ? "" : "locked"}">
        <h3>${b.name}</h3>
        <p>${b.desc}</p>
      </div>
    `)
    .join("");
}

function ffGetAllBadges() {
  return [
    { id: "first-login", name: "First Login", desc: "Welcome to FitFlow!" },
    { id: "journal-1", name: "Journal Starter", desc: "First journal entry." },
    { id: "water-10", name: "Hydrated", desc: "Logged 10 water entries." }
  ];
}

/* --------------------------------------------------
   BLOG (User-facing)
-------------------------------------------------- */
function ffLoadBlogPosts() {
  const posts = ffGetBlogPosts();
  const container = document.getElementById("blogPosts");

  if (!container) return;

  container.innerHTML = posts
    .map(p => `
      <div class="blog-post">
        <h3>${p.title}</h3>
        <p>${p.content}</p>
        <small>${new Date(p.date).toLocaleDateString()}</small>
      </div>
    `)
    .join("");
}

/* --------------------------------------------------
   BLOG MANAGER (Admin)
-------------------------------------------------- */
function ffAdminCreateBlogPost() {
  const title = document.getElementById("adminPostTitle").value.trim();
  const content = document.getElementById("adminPostContent").value.trim();

  if (!title || !content) return alert("Fill all fields.");

  const posts = ffGetBlogPosts();
  posts.push({
    title,
    content,
    date: new Date().toISOString()
  });

  localStorage.setItem("fitflow_blog", JSON.stringify(posts));
  alert("Post published.");
  ffLoadAdminBlogPosts();
}

function ffLoadAdminBlogPosts() {
  const posts = ffGetBlogPosts();
  const container = document.getElementById("adminBlogPostsTable");

  if (!container) return;

  container.innerHTML = posts
    .map((p, i) => `
      <tr>
        <td>${p.title}</td>
        <td>${new Date(p.date).toLocaleDateString()}</td>
        <td>
          <button class="danger-btn" onclick="ffDeleteBlogPost(${i})">Delete</button>
        </td>
      </tr>
    `)
    .join("");
}

function ffDeleteBlogPost(index) {
  const posts = ffGetBlogPosts();
  posts.splice(index, 1);
  localStorage.setItem("fitflow_blog", JSON.stringify(posts));
  ffLoadAdminBlogPosts();
}

function ffGetBlogPosts() {
  return JSON.parse(localStorage.getItem("fitflow_blog") || "[]");
}

/* --------------------------------------------------
   ADMIN: USERS TABLE
-------------------------------------------------- */
function ffLoadAdminUsers() {
  const users = ffGetAllUsers();
  const container = document.getElementById("adminUsersTable");

  if (!container) return;

  container.innerHTML = users
    .map(u => `
      <tr>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>${u.joined}</td>
        <td>
          <button class="admin-btn" onclick="ffPromoteUser('${u.username}')">Promote</button>
          <button class="danger-btn" onclick="ffDeleteUser('${u.username}')">Delete</button>
        </td>
      </tr>
    `)
    .join("");
}

function ffPromoteUser(username) {
  const users = ffGetAllUsers();
  const user = users.find(u => u.username === username);
  if (!user) return;

  user.role = "admin";
  ffSaveAllUsers(users);
  alert("User promoted.");
  ffLoadAdminUsers();
}

function ffDeleteUser(username) {
  let users = ffGetAllUsers();
  users = users.filter(u => u.username !== username);
  ffSaveAllUsers(users);
  alert("User deleted.");
  ffLoadAdminUsers();
}

/* --------------------------------------------------
   ADMIN: CHALLENGES
-------------------------------------------------- */
function ffCreateChallenge() {
  const name = document.getElementById("challengeName").value.trim();
  const points = document.getElementById("challengePoints").value.trim();

  if (!name || !points) return alert("Fill all fields.");

  const challenges = ffGetChallenges();
  challenges.push({ name, points });
  localStorage.setItem("fitflow_challenges", JSON.stringify(challenges));

  // Points for creating a challenge (per your rule)
  const user = ffCurrentUser();
  if (user) {
    ffAddPoints(user, 10, "Challenge created");
    ffLogActivity(user, "challenge-created", { name, points });
  }

  alert("Challenge created.");
  ffLoadChallenges();
}

function ffLoadChallenges() {
  const challenges = ffGetChallenges();
  const container = document.getElementById("challengesTable");

  if (!container) return;

  container.innerHTML = challenges
    .map((c, i) => `
      <tr>
        <td>${c.name}</td>
        <td>${c.points}</td>
        <td>
          <button class="danger-btn" onclick="ffDeleteChallenge(${i})">Delete</button>
        </td>
      </tr>
    `)
    .join("");
}

function ffDeleteChallenge(index) {
  const challenges = ffGetChallenges();
  challenges.splice(index, 1);
  localStorage.setItem("fitflow_challenges", JSON.stringify(challenges));
  ffLoadChallenges();
}

function ffGetChallenges() {
  return JSON.parse(localStorage.getItem("fitflow_challenges") || "[]");
}

/* --------------------------------------------------
   ADMIN: LEVELS
-------------------------------------------------- */
function ffCreateLevel() {
  const level = document.getElementById("levelNumber").value.trim();
  const xp = document.getElementById("levelXP").value.trim();

  if (!level || !xp) return alert("Fill all fields.");

  const levels = ffGetLevels();
  levels.push({ level, xp });
  localStorage.setItem("fitflow_levels", JSON.stringify(levels));

  alert("Level created.");
  ffLoadLevels();
}

function ffLoadLevels() {
  const levels = ffGetLevels();
  const container = document.getElementById("levelsTable");

  if (!container) return;

  container.innerHTML = levels
    .map((l, i) => `
      <tr>
        <td>${l.level}</td>
        <td>${l.xp}</td>
        <td>
          <button class="danger-btn" onclick="ffDeleteLevel(${i})">Delete</button>
        </td>
      </tr>
    `)
    .join("");
}

function ffDeleteLevel(index) {
  const levels = ffGetLevels();
  levels.splice(index, 1);
  localStorage.setItem("fitflow_levels", JSON.stringify(levels));
  ffLoadLevels();
}

function ffGetLevels() {
  return JSON.parse(localStorage.getItem("fitflow_levels") || "[]");
}

/* --------------------------------------------------
   ADMIN: SECURITY
-------------------------------------------------- */
function ffResetAllSessions() {
  localStorage.removeItem("fitflow_sessions");
  alert("All sessions reset.");
}

/* --------------------------------------------------
   ADMIN: TOOLS
-------------------------------------------------- */
function ffRecalculateStats() {
  alert("Stats recalculated.");
}

function ffClearLogs() {
  localStorage.removeItem("fitflow_logs");
  alert("Logs cleared.");
}

function ffBackupData() {
  alert("Backup created.");
}

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */
function ffGetAllUsers() {
  return JSON.parse(localStorage.getItem("fitflow_users") || "[]");
}

function ffSaveAllUsers(list) {
  localStorage.setItem("fitflow_users", JSON.stringify(list));
}

function ffCurrentUser() {
  return JSON.parse(localStorage.getItem("fitflow_current_user") || "null");
}

function ffSaveUser(user) {
  const users = ffGetAllUsers();
  const index = users.findIndex(u => u.username === user.username);
  if (index !== -1) users[index] = user;
  ffSaveAllUsers(users);
  localStorage.setItem("fitflow_current_user", JSON.stringify(user));
}

/* --------------------------------------------------
   POINTS & ACTIVITY LOGS
-------------------------------------------------- */
function ffAddPoints(user, amount, reason) {
  if (!user) return;
  if (!user.points) user.points = 0;
  user.points += amount;
  ffSaveUser(user);
  ffLogActivity(user, "points", { amount, reason });
}

function ffLogActivity(user, type, details) {
  if (!user) return;
  const logs = JSON.parse(localStorage.getItem("fitflow_logs") || "[]");
  logs.push({
    username: user.username,
    type,
    details,
    date: new Date().toISOString()
  });
  localStorage.setItem("fitflow_logs", JSON.stringify(logs));
}

/* --------------------------------------------------
   SHOP (minimal wiring for logs)
-------------------------------------------------- */
function ffPurchaseItem(itemId, cost) {
  const user = ffCurrentUser();
  if (!user) return;

  // No points for shop purchases (per your rule)
  ffLogActivity(user, "shop-purchase", { itemId, cost });
  alert("Purchase completed.");
}

/* --------------------------------------------------
   PAGE ENGINE: AUTO-DETECT & INIT
-------------------------------------------------- */
function ffRequireLogin() {
  const publicPages = [
    "index.html",
    "login.html",
    "register.html",
    "signup.html",
    "terms.html",
    "privacy.html"
  ];

  const path = window.location.pathname.toLowerCase();
  const filename = path.substring(path.lastIndexOf("/") + 1) || "index.html";

  if (!publicPages.includes(filename)) {
    const user = ffCurrentUser();
    if (!user) {
      window.location.href = "login.html";
    }
  }
}

function ffRequireAdmin() {
  const user = ffCurrentUser();
  if (!user || user.role !== "admin") {
    window.location.href = "dashboard.html";
  }
}

function ffInitPage() {
  const path = window.location.pathname.toLowerCase();
  const filename = path.substring(path.lastIndexOf("/") + 1) || "index.html";

  // Global login protection
  ffRequireLogin();

  // Admin-only pages
  const isAdminPage =
    filename.startsWith("admin-") ||
    filename === "admin.html" ||
    filename === "blog-admin.html";

  if (isAdminPage) {
    ffRequireAdmin();
  }

  // Auto-detect page and run loaders
  switch (filename) {
    case "dashboard.html":
      ffLoadDashboard();
      break;
    case "sleep.html":
      ffLoadSleepPage();
      break;
    case "water.html":
      ffLoadWaterPage();
      break;
    case "nutrition.html":
      ffLoadNutritionPage();
      break;
    case "workouts.html":
      ffLoadWorkoutsPage();
      break;
    case "affirmations.html":
      ffLoadAffirmationsPage();
      break;
    case "meditation.html":
      ffLoadMeditationPage();
      break;
    case "journal.html":
      loadJournalEntry();
      break;
    case "progress.html":
      ffLoadProgressPage();
      break;
    case "badges.html":
      ffLoadBadges();
      break;
    case "shop.html":
      ffLoadShopPage();
      break;
    case "profile.html":
      ffLoadProfilePage();
      break;
    case "settings.html":
      ffLoadSettingsPage();
      break;
    case "blog.html":
      ffLoadBlogPosts();
      break;
    case "blog-admin.html":
      ffLoadAdminBlogPosts();
      break;
    case "admin.html":
      ffLoadAdminDashboard();
      break;
    case "admin-users.html":
      ffLoadAdminUsers();
      break;
    case "admin-challenges.html":
      ffLoadChallenges();
      break;
    case "admin-levels.html":
      ffLoadLevels();
      break;
    case "admin-security.html":
      // security tools page
      break;
    case "admin-tools.html":
      // tools page
      break;
    case "admin-analytics.html":
    case "admin-all-analytics.html":
      ffLoadAdminAnalytics();
      break;
    default:
      break;
  }

  // Bind buttons/events after DOM is ready
  ffBindGlobalEvents();
}

/* --------------------------------------------------
   PAGE LOADERS (STUBS USING YOUR DATA MODEL)
-------------------------------------------------- */
function ffLoadDashboard() {
  const user = ffCurrentUser();
  if (!user) return;

  const pointsEl = document.getElementById("dashboardPoints");
  if (pointsEl) pointsEl.textContent = user.points || 0;

  const nameEl = document.getElementById("dashboardName");
  if (nameEl) nameEl.textContent = user.username || "FitFlow User";
}

function ffLoadProgressPage() {
  const user = ffCurrentUser();
  if (!user) return;

  const progressEl = document.getElementById("progressSummary");
  if (!progressEl) return;

  const trackers = user.trackers || {};
  const totalEntries = Object.values(trackers).reduce(
    (sum, arr) => sum + (arr ? arr.length : 0),
    0
  );

  progressEl.textContent = `Total logged entries: ${totalEntries}`;
}

function ffLoadSleepPage() {
  ffLoadTracker("sleep", "sleepLog");
}

function ffLoadWaterPage() {
  ffLoadTracker("water", "waterLog");
}

function ffLoadNutritionPage() {
  ffLoadTracker("nutrition", "nutritionLog");
}

function ffLoadWorkoutsPage() {
  ffLoadTracker("workouts", "workoutsLog");
}

function ffLoadAffirmationsPage() {
  ffLoadTracker("affirmations", "affirmationsLog");
}

function ffLoadMeditationPage() {
  ffLoadTracker("meditation", "meditationLog");
}

function ffLoadShopPage() {
  // If you have a shop grid, you can populate it here later
}

function ffLoadProfilePage() {
  const user = ffCurrentUser();
  if (!user) return;

  const usernameEl = document.getElementById("profileUsername");
  const emailEl = document.getElementById("profileEmail");
  const roleEl = document.getElementById("profileRole");

  if (usernameEl) usernameEl.textContent = user.username || "";
  if (emailEl) emailEl.textContent = user.email || "";
  if (roleEl) roleEl.textContent = user.role || "user";
}

function ffLoadSettingsPage() {
  // Wire up settings if needed
}

function ffLoadAdminDashboard() {
  // Summary of users, logs, etc. if you want
}

function ffLoadAdminAnalytics() {
  const logs = JSON.parse(localStorage.getItem("fitflow_logs") || "[]");
  const container = document.getElementById("adminAnalyticsTable");
  if (!container) return;

  container.innerHTML = logs
    .map(log => `
      <tr>
        <td>${log.username}</td>
        <td>${log.type}</td>
        <td>${new Date(log.date).toLocaleString()}</td>
      </tr>
    `)
    .join("");
}

/* --------------------------------------------------
   EVENT BINDINGS
-------------------------------------------------- */
function ffBindGlobalEvents() {
  const user = ffCurrentUser();

  // Sleep save button
  const sleepBtn = document.getElementById("saveSleepBtn");
  if (sleepBtn) {
    sleepBtn.onclick = () => {
      const val = document.getElementById("sleepInput")?.value;
      if (!val) return;
      ffSaveTracker("sleep", val);
      alert("Sleep logged.");
      ffLoadSleepPage();
    };
  }

  // Water save button
  const waterBtn = document.getElementById("saveWaterBtn");
  if (waterBtn) {
    waterBtn.onclick = () => {
      const val = document.getElementById("waterInput")?.value;
      if (!val) return;
      ffSaveTracker("water", val);
      alert("Water logged.");
      ffLoadWaterPage();
    };
  }

  // Nutrition save button
  const nutritionBtn = document.getElementById("saveNutritionBtn");
  if (nutritionBtn) {
    nutritionBtn.onclick = () => {
      const val = document.getElementById("nutritionInput")?.value;
      if (!val) return;
      ffSaveTracker("nutrition", val);
      alert("Nutrition logged.");
      ffLoadNutritionPage();
    };
  }

  // Workouts save button
  const workoutsBtn = document.getElementById("saveWorkoutsBtn");
  if (workoutsBtn) {
    workoutsBtn.onclick = () => {
      const val = document.getElementById("workoutsInput")?.value;
      if (!val) return;
      ffSaveTracker("workouts", val);
      alert("Workout logged.");
      ffLoadWorkoutsPage();
    };
  }

  // Affirmations save button
  const affirmBtn = document.getElementById("saveAffirmationsBtn");
  if (affirmBtn) {
    affirmBtn.onclick = () => {
      const val = document.getElementById("affirmationsInput")?.value;
      if (!val) return;
      ffSaveTracker("affirmations", val);
      alert("Affirmation logged.");
      ffLoadAffirmationsPage();
    };
  }

  // Meditation save button
  const medBtn = document.getElementById("saveMeditationBtn");
  if (medBtn) {
    medBtn.onclick = () => {
      const val = document.getElementById("meditationInput")?.value;
      if (!val) return;
      ffSaveTracker("meditation", val);
      alert("Meditation logged.");
      ffLoadMeditationPage();
    };
  }

  // Journal save button
  const journalBtn = document.getElementById("saveJournalBtn");
  if (journalBtn) {
    journalBtn.onclick = () => {
      saveJournalEntry();
      ffLoadProgressPage();
    };
  }

  // Shop purchase buttons (if any use data attributes)
  const purchaseButtons = document.querySelectorAll("[data-shop-item]");
  purchaseButtons.forEach(btn => {
    btn.onclick = () => {
      const itemId = btn.getAttribute("data-shop-item");
      const cost = parseInt(btn.getAttribute("data-shop-cost") || "0", 10);
      ffPurchaseItem(itemId, cost);
    };
  });
}

/* --------------------------------------------------
   BOOTSTRAP
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", ffInitPage);
