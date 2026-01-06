/* =========================================================
   FitFlow Multi-User Database & Auth (users.js)
   ========================================================= */

// LocalStorage keys
const USERS_KEY = "fitflowUsers";
const CURRENT_USER_KEY = "fitflowCurrentUser"; // username string

/* =========================================================
   Core Helpers
   ========================================================= */

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users = raw ? JSON.parse(raw) : [];
    return Array.isArray(users) ? users : [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users || []));
}

function findUser(username) {
  const users = loadUsers();
  return users.find(u => u.username === username) || null;
}

function updateUser(updatedUser) {
  const users = loadUsers();
  const idx = users.findIndex(u => u.username === updatedUser.username);
  if (idx === -1) return;
  users[idx] = updatedUser;
  saveUsers(users);
}

function deleteUser(username) {
  const users = loadUsers().filter(u => u.username !== username);
  saveUsers(users);

  // If the deleted user was logged in, log them out.
  const current = localStorage.getItem(CURRENT_USER_KEY);
  if (current === username) {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

/* =========================================================
   User Object Shape
   ========================================================= */

function createEmptyLogs() {
  return {
    water: [],
    sleep: [],
    workouts: [],
    nutrition: [],
    journal: [],
    meditation: [],
    breathing: [],
    affirmations: [],
    activity: []
  };
}

function createNewUser(username, password, role = "user") {
  return {
    username,
    password,
    role,          // "user" or "admin"
    points: 0,
    level: 1,
    streak: 0,
    badges: [],
    logs: createEmptyLogs(),
    purchasedBadges: [],
    blogComments: [],
    blogPosts: []   // used for admin-created posts if you want to track
  };
}

/* =========================================================
   Initial Admin Seeding
   ========================================================= */

function ensureAdminUser() {
  let users = loadUsers();
  const hasAdmin = users.some(u => u.username === "admin");

  if (!hasAdmin) {
    const admin = createNewUser("admin", "fitflow", "admin");
    users.push(admin);
    saveUsers(users);
  }
}

// Run on script load to guarantee there is always an admin
ensureAdminUser();

/* =========================================================
   Current User Helpers
   ========================================================= */

function getCurrentUsername() {
  return localStorage.getItem(CURRENT_USER_KEY) || null;
}

function setCurrentUsername(username) {
  if (username) {
    localStorage.setItem(CURRENT_USER_KEY, username);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

function getCurrentUser() {
  const username = getCurrentUsername();
  if (!username) return null;
  return findUser(username);
}

function isLoggedIn() {
  return !!getCurrentUser();
}

function isAdminUser() {
  const user = getCurrentUser();
  return !!user && user.role === "admin";
}

/* =========================================================
   Auth: Register, Login, Logout
   ========================================================= */

function registerUser(username, password) {
  username = (username || "").trim();
  password = (password || "").trim();

  if (!username || !password) {
    return { success: false, message: "Username and password are required." };
  }

  const existing = findUser(username);
  if (existing) {
    return { success: false, message: "Username already exists." };
  }

  const users = loadUsers();
  const newUser = createNewUser(username, password, "user");
  users.push(newUser);
  saveUsers(users);

  return { success: true, message: "Account created. You can now log in." };
}

function loginUser(username, password) {
  username = (username || "").trim();
  password = (password || "").trim();

  if (!username || !password) {
    return { success: false, message: "Username and password are required." };
  }

  const user = findUser(username);
  if (!user || user.password !== password) {
    return { success: false, message: "Invalid credentials." };
  }

  setCurrentUsername(user.username);
  return { success: true, message: "Login successful.", user };
}

function logoutUser() {
  setCurrentUsername(null);
}

/* =========================================================
   Impersonation (used by admin-users.js)
   ========================================================= */

function impersonateUser(username) {
  // Only allow impersonation if current user is admin
  const current = getCurrentUser();
  if (!current || current.role !== "admin") return;

  const target = findUser(username);
  if (!target) return;

  setCurrentUsername(target.username);
}

/* =========================================================
   Protection for Pages
   ========================================================= */

function protectUserPage() {
  const user = getCurrentUser();
  if (!user) {
    // No logged in user → send to login
    window.location.href = "login.html";
  }
}

function protectAdminPage() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    // Not logged in or not admin → send to login
    window.location.href = "login.html";
  }
}

/* =========================================================
   High-Level Helpers for Scripts
   ========================================================= */

/**
 * Safely update current user with a mutator function.
 * Example:
 *   updateCurrentUser(u => { u.points += 10; });
 */
function updateCurrentUser(mutator) {
  const user = getCurrentUser();
  if (!user) return;
  mutator(user);
  updateUser(user);
}

/**
 * Get a safe copy of current user logs for a given category.
 * Category: "water", "sleep", "workouts", "nutrition", "journal", 
 *           "meditation", "breathing", "affirmations", "activity"
 */
function getCurrentUserLog(category) {
  const user = getCurrentUser();
  if (!user || !user.logs || !user.logs[category]) return [];
  return user.logs[category];
}

function pushCurrentUserLog(category, entry) {
  updateCurrentUser(user => {
    if (!user.logs) user.logs = createEmptyLogs();
    if (!Array.isArray(user.logs[category])) {
      user.logs[category] = [];
    }
    user.logs[category].push(entry);
  });
}

/**
 * Add points to the current user.
 */
function addPointsToCurrentUser(amount) {
  updateCurrentUser(user => {
    user.points = Math.max(0, (user.points || 0) + amount);
  });
}

/**
 * Deduct points from the current user.
 */
function deductPointsFromCurrentUser(amount) {
  updateCurrentUser(user => {
    user.points = Math.max(0, (user.points || 0) - amount);
  });
}

/**
 * Add a badge to the current user.
 */
function addBadgeToCurrentUser(badgeName) {
  updateCurrentUser(user => {
    if (!Array.isArray(user.badges)) user.badges = [];
    if (!user.badges.includes(badgeName)) {
      user.badges.push(badgeName);
    }
  });
}

/**
 * Mark a badge as purchased for the current user.
 */
function purchaseBadgeForCurrentUser(badgeName) {
  updateCurrentUser(user => {
    if (!Array.isArray(user.purchasedBadges)) user.purchasedBadges = [];
    if (!user.purchasedBadges.includes(badgeName)) {
      user.purchasedBadges.push(badgeName);
    }
  });
}

/* =========================================================
   Utility: Force Logout All (used by admin-security.js)
   ========================================================= */

function forceLogoutAllUsers() {
  // In this localStorage-only model, "all users logged out"
  // just means clearing the current user.
  localStorage.removeItem(CURRENT_USER_KEY);
}
