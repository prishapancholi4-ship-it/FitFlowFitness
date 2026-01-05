/* ============================================================
   FITFLOW GLOBAL ENGINE (MULTI-USER)
   - Multi-user database
   - Backward-compatible with old localStorage keys
   - Admin impersonation support
   ============================================================ */

/* -----------------------------
   Keys
----------------------------- */

const USERS_KEY = "fitflowUsers";
const CURRENT_USER_KEY = "fitflowCurrentUser";

// Backwards-compat single-user keys (for migration + mirroring)
const LEGACY_USERNAME_KEY = "fitflowUsername";
const LEGACY_POINTS_KEY = "fitflowPoints";
const LEGACY_STREAK_KEY = "fitflowStreak";
const LEGACY_LEVEL_KEY = "fitflowLevel";
const LEGACY_BADGE_KEY = "fitflowBadge";
const LEGACY_JOURNAL_KEY = "fitflowJournal";
const LEGACY_BLOG_KEY = "fitflowBlogPosts";
const LEGACY_WATER_KEY = "fitflowWaterLogs";
const LEGACY_SLEEP_KEY = "fitflowSleepLogs";
const LEGACY_WORKOUT_KEY = "fitflowWorkoutLogs";
const LEGACY_NUTRITION_KEY = "fitflowNutritionLogs";
const LEGACY_ONBOARD_KEY = "fitflowOnboardingComplete";

/* ============================================================
   CORE USER DATABASE
============================================================ */

// Load all users
function loadUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

// Save all users
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get current user username
function getCurrentUser() {
  const u = localStorage.getItem(CURRENT_USER_KEY);
  return u ? u.toLowerCase() : null;
}

// Set current user
function setCurrentUser(username) {
  if (!username) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, username.toLowerCase());
  }
}

// Find user by username (case-insensitive)
function findUser(username) {
  const users = loadUsers();
  return (
    users.find(
      (u) => u.username && u.username.toLowerCase() === username.toLowerCase()
    ) || null
  );
}

// Create a new user object
function createUser(username, password) {
  return {
    username: username.toLowerCase(),
    password: password,
    points: 0,
    streak: 0,
    level: 1,
    badge: "",
    logs: {
      water: [],
      sleep: [],
      workouts: [],
      nutrition: [],
      journal: [],
    },
    blogPosts: [], // local blog per user if you want
    onboardingComplete: false,
    created: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };
}

// Add a new user to the database
function addUser(username, password) {
  if (!username || !password) {
    return { success: false, message: "Username and password required." };
  }

  username = username.toLowerCase();

  if (findUser(username)) {
    return { success: false, message: "Username already exists." };
  }

  const users = loadUsers();
  users.push(createUser(username, password));
  saveUsers(users);

  return { success: true };
}

// Update a user object in the database
function updateUser(user) {
  if (!user || !user.username) return;

  const users = loadUsers();
  const index = users.findIndex(
    (u) => u.username.toLowerCase() === user.username.toLowerCase()
  );

  if (index !== -1) {
    users[index] = user;
    saveUsers(users);
  }
}

// Delete a user
function deleteUser(username) {
  if (!username) return;
  username = username.toLowerCase();

  let users = loadUsers();
  users = users.filter((u) => u.username.toLowerCase() !== username);
  saveUsers(users);

  // If we deleted the current user, unset
  if (getCurrentUser() === username) {
    setCurrentUser(null);
  }
}

// Get full user object for current user
function getCurrentUserObject() {
  const username = getCurrentUser();
  if (!username) return null;
  const user = findUser(username);
  return user || null;
}

// Save current user object
function saveCurrentUserObject(userObj) {
  if (!userObj) return;
  userObj.lastActive = new Date().toISOString();
  updateUser(userObj);
  mirrorToLegacy(userObj);
}

/* ============================================================
   MIGRATION FROM LEGACY SINGLE-USER
============================================================ */

function migrateLegacyToMultiUser() {
  const existingUsers = loadUsers();
  if (existingUsers && existingUsers.length > 0) {
    return; // already migrated
  }

  const legacyUsername = localStorage.getItem(LEGACY_USERNAME_KEY);

  if (!legacyUsername) {
    // No previous user; create default admin if not exists
    const users = [];
    users.push(createUser("admin", "fitflow"));
    saveUsers(users);
    setCurrentUser("admin");
    return;
  }

  const user = createUser(
    legacyUsername,
    legacyUsername.toLowerCase() === "admin" ? "fitflow" : "password"
  );

  user.points = parseInt(localStorage.getItem(LEGACY_POINTS_KEY) || "0", 10);
  user.streak = parseInt(localStorage.getItem(LEGACY_STREAK_KEY) || "0", 10);
  user.level = parseInt(localStorage.getItem(LEGACY_LEVEL_KEY) || "1", 10);
  user.badge = localStorage.getItem(LEGACY_BADGE_KEY) || "";

  user.logs.water = JSON.parse(localStorage.getItem(LEGACY_WATER_KEY)) || [];
  user.logs.sleep = JSON.parse(localStorage.getItem(LEGACY_SLEEP_KEY)) || [];
  user.logs.workouts =
    JSON.parse(localStorage.getItem(LEGACY_WORKOUT_KEY)) || [];
  user.logs.nutrition =
    JSON.parse(localStorage.getItem(LEGACY_NUTRITION_KEY)) || [];
  user.logs.journal =
    JSON.parse(localStorage.getItem(LEGACY_JOURNAL_KEY)) || [];

  user.blogPosts = JSON.parse(localStorage.getItem(LEGACY_BLOG_KEY)) || [];
  user.onboardingComplete =
    localStorage.getItem(LEGACY_ONBOARD_KEY) === "true";

  const users = [];
  users.push(user);

  // Ensure admin exists too
  if (legacyUsername.toLowerCase() !== "admin") {
    users.push(createUser("admin", "fitflow"));
  }

  saveUsers(users);
  setCurrentUser(legacyUsername);
}

// Mirror current user data back to legacy keys for old pages
function mirrorToLegacy(user) {
  if (!user) return;

  localStorage.setItem(LEGACY_USERNAME_KEY, user.username);
  localStorage.setItem(LEGACY_POINTS_KEY, String(user.points || 0));
  localStorage.setItem(LEGACY_STREAK_KEY, String(user.streak || 0));
  localStorage.setItem(LEGACY_LEVEL_KEY, String(user.level || 1));
  localStorage.setItem(LEGACY_BADGE_KEY, user.badge || "");
  localStorage.setItem(LEGACY_ONBOARD_KEY, user.onboardingComplete ? "true" : "false");

  localStorage.setItem(LEGACY_WATER_KEY, JSON.stringify(user.logs.water || []));
  localStorage.setItem(LEGACY_SLEEP_KEY, JSON.stringify(user.logs.sleep || []));
  localStorage.setItem(
    LEGACY_WORKOUT_KEY,
    JSON.stringify(user.logs.workouts || [])
  );
  localStorage.setItem(
    LEGACY_NUTRITION_KEY,
    JSON.stringify(user.logs.nutrition || [])
  );
  localStorage.setItem(
    LEGACY_JOURNAL_KEY,
    JSON.stringify(user.logs.journal || [])
  );
  localStorage.setItem(
    LEGACY_BLOG_KEY,
    JSON.stringify(user.blogPosts || [])
  );
}

/* ============================================================
   AUTH & PROTECTION HELPERS
============================================================ */

function isAdmin() {
  return getCurrentUser() === "admin";
}

// Ensure admin-only access
function protectAdminPage() {
  const user = getCurrentUser();
  if (!user || user !== "admin") {
    window.location.href = "dashboard.html";
  }
}

// Ensure user is logged in
function protectUserPage() {
  if (!getCurrentUser()) {
    window.location.href = "login.html";
  }
}

// Admin impersonation
function impersonateUser(username) {
  if (!isAdmin()) return;
  if (!findUser(username)) return;
  setCurrentUser(username.toLowerCase());
}

// Return to admin (from impersonation)
function returnToAdmin() {
  if (!findUser("admin")) return;
  setCurrentUser("admin");
}

/* ============================================================
   ONBOARDING HELPERS
============================================================ */

function markOnboardingComplete() {
  const user = getCurrentUserObject();
  if (!user) return;
  user.onboardingComplete = true;
  saveCurrentUserObject(user);
}

/* ============================================================
   USER DATA HELPERS (POINTS / STREAK / LEVEL / BADGE)
============================================================ */

function getUserStats() {
  const user = getCurrentUserObject();
  if (!user) {
    return {
      points: 0,
      streak: 0,
      level: 1,
      badge: "",
    };
  }
  return {
    points: user.points || 0,
    streak: user.streak || 0,
    level: user.level || 1,
    badge: user.badge || "",
  };
}

function setUserStats({ points, streak, level, badge }) {
  const user = getCurrentUserObject();
  if (!user) return;

  if (typeof points === "number") user.points = points;
  if (typeof streak === "number") user.streak = streak;
  if (typeof level === "number") user.level = level;
  if (typeof badge === "string") user.badge = badge;

  saveCurrentUserObject(user);
}

// Add points
function addPoints(amount) {
  const user = getCurrentUserObject();
  if (!user) return;
  user.points = (user.points || 0) + amount;
  saveCurrentUserObject(user);
}

// Increment streak
function incrementStreak() {
  const user = getCurrentUserObject();
  if (!user) return;
  user.streak = (user.streak || 0) + 1;
  saveCurrentUserObject(user);
}

// Set level
function setLevel(level) {
  const user = getCurrentUserObject();
  if (!user) return;
  user.level = level;
  saveCurrentUserObject(user);
}

// Set badge
function setBadge(badge) {
  const user = getCurrentUserObject();
  if (!user) return;
  user.badge = badge;
  saveCurrentUserObject(user);
}

/* ============================================================
   LOG HELPERS (WATER / SLEEP / WORKOUTS / NUTRITION / JOURNAL)
============================================================ */

function getLogs(type) {
  const user = getCurrentUserObject();
  if (!user || !user.logs) return [];
  return user.logs[type] || [];
}

function saveLogs(type, arr) {
  const user = getCurrentUserObject();
  if (!user) return;
  if (!user.logs) user.logs = {};
  user.logs[type] = arr;
  saveCurrentUserObject(user);
}

function logWater(entry) {
  const logs = getLogs("water");
  logs.push(entry);
  saveLogs("water", logs);
}

function logSleep(entry) {
  const logs = getLogs("sleep");
  logs.push(entry);
  saveLogs("sleep", logs);
}

function logWorkout(entry) {
  const logs = getLogs("workouts");
  logs.push(entry);
  saveLogs("workouts", logs);
}

function logNutrition(entry) {
  const logs = getLogs("nutrition");
  logs.push(entry);
  saveLogs("nutrition", logs);
}

function addJournalEntry(entry) {
  const logs = getLogs("journal");
  logs.unshift(entry);
  saveLogs("journal", logs);
}

/* ============================================================
   BLOG HELPERS
============================================================ */

function getBlogPosts() {
  const user = getCurrentUserObject();
  if (!user) return [];
  return user.blogPosts || [];
}

function saveBlogPosts(posts) {
  const user = getCurrentUserObject();
  if (!user) return;
  user.blogPosts = posts;
  saveCurrentUserObject(user);
}

/* ============================================================
   GLOBAL UI UPDATER
============================================================ */

function updateGlobalUI() {
  const stats = getUserStats();

  const pointsEl = document.getElementById("pointsDisplay");
  const streakEl = document.getElementById("streakDisplay");
  const levelEl = document.getElementById("levelDisplay");
  const badgeEl = document.getElementById("badgeDisplay");

  if (pointsEl) pointsEl.textContent = stats.points;
  if (streakEl) streakEl.textContent = stats.streak;
  if (levelEl) levelEl.textContent = stats.level;
  if (badgeEl) badgeEl.textContent = stats.badge || "—";
}

/* ============================================================
   INIT
============================================================ */

(function initFitFlowGlobal() {
  migrateLegacyToMultiUser();
})();
