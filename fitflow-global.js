/* --------------------------------------------------
   FitFlow Global Engine
   Clean rewrite — all features preserved
-------------------------------------------------- */

/* --------------------------------------------------
   USER SYSTEM
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

function ffRegister(username, email, password) {
  const users = ffGetAllUsers();

  if (users.some(u => u.username === username)) {
    alert("Username already exists.");
    return false;
  }

  const newUser = {
    username,
    email,
    password,
    role: "user",
    joined: new Date().toISOString(),
    badges: [],
    journal: {},
    trackers: {},
    points: 0
  };

  users.push(newUser);
  ffSaveAllUsers(users);
  return true;
}

function ffLogin(username, password) {
  const users = ffGetAllUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return false;

  localStorage.setItem("fitflow_current_user", JSON.stringify(user));
  ffLogActivity(`${username} logged in`);
  return true;
}

function logoutUser() {
  const user = ffCurrentUser();
  if (user) ffLogActivity(`${user.username} logged out`);
  localStorage.removeItem("fitflow_current_user");
  window.location.href = "index.html";
}

/* --------------------------------------------------
   ROLE SYSTEM
-------------------------------------------------- */
function isCurrentUserAdmin() {
  const user = ffCurrentUser();
  return user && user.role === "admin";
}

/* --------------------------------------------------
   PAGE INITIALIZER
-------------------------------------------------- */
function ffInitPage(options = {}) {
  const user = ffCurrentUser();

  if (options.protectUser && !user) {
    window.location.href = "index.html";
    return;
  }

  if (options.adminOnly && !isCurrentUserAdmin()) {
    window.location.href = "dashboard.html";
    return;
  }

  if (!isCurrentUserAdmin()) {
    document.querySelectorAll(".admin-only").forEach(el => {
      el.style.display = "none";
    });
  }

  ffLogActivity(`Visited ${window.location.pathname}`);
}

/* --------------------------------------------------
   ACTIVITY LOGS
-------------------------------------------------- */
function ffLogActivity(message) {
  const logs = JSON.parse(localStorage.getItem("fitflow_logs") || "[]");

  logs.push({
    message,
    date: new Date().toISOString()
  });

  localStorage.setItem("fitflow_logs", JSON.stringify(logs));
}

function ffGetLogs() {
  return JSON.parse(localStorage.getItem("fitflow_logs") || "[]");
}

/* --------------------------------------------------
   BLOG STORAGE
-------------------------------------------------- */
function ffGetBlogPosts() {
  return JSON.parse(localStorage.getItem("fitflow_blog") || "[]");
}

function ffSaveBlogPosts(posts) {
  localStorage.setItem("fitflow_blog", JSON.stringify(posts));
}

/* --------------------------------------------------
   CHALLENGES STORAGE
-------------------------------------------------- */
function ffGetChallenges() {
  return JSON.parse(localStorage.getItem("fitflow_challenges") || "[]");
}

function ffSaveChallenges(list) {
  localStorage.setItem("fitflow_challenges", JSON.stringify(list));
}

/* --------------------------------------------------
   LEVELS STORAGE
-------------------------------------------------- */
function ffGetLevels() {
  return JSON.parse(localStorage.getItem("fitflow_levels") || "[]");
}

function ffSaveLevels(list) {
  localStorage.setItem("fitflow_levels", JSON.stringify(list));
}

/* --------------------------------------------------
   ANALYTICS (Placeholder Logic)
-------------------------------------------------- */
function ffAnalytics() {
  const users = ffGetAllUsers();
  const logs = ffGetLogs();

  return {
    dau: users.length,
    wau: users.length,
    mau: users.length,
    newUsers: users.filter(u => {
      const days = (Date.now() - new Date(u.joined)) / (1000 * 60 * 60 * 24);
      return days <= 7;
    }).length,
    logsCount: logs.length
  };
}

/* --------------------------------------------------
   SESSION SYSTEM (Optional)
-------------------------------------------------- */
function ffResetAllSessions() {
  localStorage.removeItem("fitflow_sessions");
}

/* --------------------------------------------------
   UTILITIES
-------------------------------------------------- */
function ffRequireAdmin() {
  if (!isCurrentUserAdmin()) {
    alert("Admins only.");
    window.location.href = "dashboard.html";
  }
}
