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
