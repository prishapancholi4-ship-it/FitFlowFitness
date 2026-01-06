/* =========================================================
   FitFlow Engine (script.js)
   Multi-user, debug-friendly, auto-detecting
   Requires: users.js
   ========================================================= */

/* =========================================================
   Debug helper
   ========================================================= */

function ffWarn(message) {
  console.warn("FitFlow ⚠️", message);
}

/* =========================================================
   Safe DOM helpers (auto-detect mode)
   ========================================================= */

function ffFindInput(possibleIds = [], placeholderKeywords = []) {
  // Try direct IDs first
  for (const id of possibleIds) {
    const el = document.getElementById(id);
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return el;
  }
  // Fallback: search by placeholder keyword
  if (placeholderKeywords.length) {
    const inputs = document.querySelectorAll("input, textarea");
    for (const el of inputs) {
      const ph = (el.placeholder || "").toLowerCase();
      if (!ph) continue;
      if (placeholderKeywords.some(k => ph.includes(k.toLowerCase()))) {
        return el;
      }
    }
  }
  return null;
}

function ffFindButton(possibleIds = [], textKeywords = []) {
  // Try IDs first
  for (const id of possibleIds) {
    const el = document.getElementById(id);
    if (el && el.tagName === "BUTTON") return el;
  }
  // Fallback: search by text
  if (textKeywords.length) {
    const buttons = document.querySelectorAll("button");
    for (const btn of buttons) {
      const txt = (btn.textContent || "").toLowerCase().trim();
      if (!txt) continue;
      if (textKeywords.some(k => txt.includes(k.toLowerCase()))) {
        return btn;
      }
    }
  }
  return null;
}

/* =========================================================
   Core: Points, Level, Streak, Badges for current user
   (via users.js)
   ========================================================= */

function ffGetCurrentUserOrWarn(context) {
  if (typeof getCurrentUser !== "function") {
    ffWarn(`users.js not loaded before script.js — ${context} cannot access user.`);
    return null;
  }
  const user = getCurrentUser();
  if (!user) {
    ffWarn(`No logged-in user in ${context} — user is null.`);
  }
  return user;
}

/* -------- Points & Level -------- */

function ffGetPoints() {
  const user = ffGetCurrentUserOrWarn("ffGetPoints");
  return user ? (user.points || 0) : 0;
}

function ffSetPoints(value) {
  if (typeof updateCurrentUser !== "function") {
    ffWarn("updateCurrentUser not available — ffSetPoints skipped.");
    return;
  }
  updateCurrentUser(u => {
    u.points = Math.max(0, value || 0);
  });
  ffUpdatePointsUI();
  ffUpdateLevel();
}

function ffAddPoints(amount, reason) {
  if (!amount || typeof addPointsToCurrentUser !== "function") return;
  addPointsToCurrentUser(amount);
  if (reason) ffLogActivity(`${reason} (+${amount} pts)`);
  ffUpdatePointsUI();
  ffUpdateLevel();
  ffUpdateRewards();
}

function ffDeductPoints(amount, reason) {
  if (!amount || typeof deductPointsFromCurrentUser !== "function") return;
  deductPointsFromCurrentUser(amount);
  if (reason) ffLogActivity(`${reason} (-${amount} pts)`);
  ffUpdatePointsUI();
  ffUpdateLevel();
  ffUpdateRewards();
}

function ffGetLevel() {
  const user = ffGetCurrentUserOrWarn("ffGetLevel");
  return user ? (user.level || 1) : 1;
}

function ffSetLevel(value) {
  if (typeof updateCurrentUser !== "function") {
    ffWarn("updateCurrentUser not available — ffSetLevel skipped.");
    return;
  }
  updateCurrentUser(u => {
    u.level = Math.max(1, value || 1);
  });
  ffUpdateLevelUI();
}

function ffUpdateLevel() {
  const points = ffGetPoints();
  const newLevel = Math.max(1, Math.floor(points / 100) + 1);
  const oldLevel = ffGetLevel();
  if (newLevel !== oldLevel) {
    ffSetLevel(newLevel);
    ffLogActivity(`Leveled up to level ${newLevel}!`);
  }
}

/* -------- Streak -------- */

function ffTodayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function ffUpdateStreak() {
  if (typeof updateCurrentUser !== "function") {
    ffWarn("updateCurrentUser not available — ffUpdateStreak skipped.");
    return;
  }

  updateCurrentUser(u => {
    const today = ffTodayStr();
    const lastActive = u.lastActiveDate;
    let streak = u.streak || 0;

    if (!lastActive) {
      streak = 1;
    } else {
      const last = new Date(lastActive);
      const now = new Date(today);
      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) streak += 1;
      else if (diffDays > 1) streak = 1;
    }

    u.streak = streak;
    u.lastActiveDate = today;

    if (streak === 7) ffAwardBadge("7 Day Streak");
    if (streak === 30) ffAwardBadge("30 Day Streak");
  });

  ffUpdateStreakUI();
}

/* -------- Badges -------- */

function ffGetBadges() {
  const user = ffGetCurrentUserOrWarn("ffGetBadges");
  return user && Array.isArray(user.badges) ? user.badges : [];
}

function ffAwardBadge(name) {
  if (!name || typeof addBadgeToCurrentUser !== "function") return;
  addBadgeToCurrentUser(name);
  ffLogActivity(`Unlocked badge: ${name}`);
  ffUpdateBadgeUI();
}

/* =========================================================
   Activity Log (per user, logs.activity)
   ========================================================= */

function ffGetActivityLog() {
  if (typeof getCurrentUserLog !== "function") {
    ffWarn("getCurrentUserLog not available — ffGetActivityLog returning empty list.");
    return [];
  }
  return getCurrentUserLog("activity");
}

function ffLogActivity(description) {
  if (!description || typeof pushCurrentUserLog !== "function") return;
  pushCurrentUserLog("activity", {
    description,
    date: new Date().toISOString()
  });
  ffUpdateActivityUI();
  ffUpdateStreak();
}

/* =========================================================
   UI Updaters (Dashboard / Progress / Badges / Streak)
   ========================================================= */

function ffUpdatePointsUI() {
  const pts = ffGetPoints();
  const d1 = document.getElementById("dashboardPoints");
  const d2 = document.getElementById("pointsDisplay");
  const d3 = document.getElementById("progressPoints");
  if (d1) d1.textContent = pts;
  if (d2) d2.textContent = pts;
  if (d3) d3.textContent = pts;
}

function ffUpdateLevelUI() {
  const lvl = ffGetLevel();
  const d1 = document.getElementById("dashboardLevel");
  const d2 = document.getElementById("progressLevel");
  if (d1) d1.textContent = lvl;
  if (d2) d2.textContent = lvl;
}

function ffUpdateStreakUI() {
  const user = ffGetCurrentUserOrWarn("ffUpdateStreakUI");
  const streak = user ? (user.streak || 0) : 0;
  const d1 = document.getElementById("dashboardStreak");
  const d2 = document.getElementById("progressStreak");
  if (d1) d1.textContent = streak;
  if (d2) d2.textContent = streak;
}

function ffUpdateBadgeUI() {
  const badges = ffGetBadges();
  const user = ffGetCurrentUserOrWarn("ffUpdateBadgeUI");
  const purchased = user && Array.isArray(user.purchasedBadges)
    ? user.purchasedBadges
    : [];

  const currentBadgeEl = document.getElementById("dashboardBadge");
  const badgeList = document.getElementById("badgeList");
  const pCount = document.getElementById("progressBadgesCount");
  const purchasedList = document.getElementById("purchasedBadgesList");

  if (currentBadgeEl) {
    currentBadgeEl.textContent = badges.length ? badges[badges.length - 1] : "No badge yet";
  }

  if (pCount) pCount.textContent = badges.length;

  if (badgeList) {
    badgeList.innerHTML = "";
    badges.forEach(b => {
      const li = document.createElement("li");
      li.className = "badge-item badge-unlocked";
      li.textContent = b;
      badgeList.appendChild(li);
    });
  }

  if (!purchasedList && purchased.length) {
    ffWarn("purchasedBadgesList not found — cannot render purchased badges.");
  }

  if (purchasedList) {
    purchasedList.innerHTML = "";
    if (!purchased.length) {
      const li = document.createElement("li");
      li.className = "badge-item badge-empty";
      li.textContent = "No badges purchased yet.";
      purchasedList.appendChild(li);
    } else {
      purchased.forEach(b => {
        const li = document.createElement("li");
        li.className = "badge-item badge-purchased";
        li.textContent = b;
        purchasedList.appendChild(li);
      });
    }
  }
}

function ffUpdateActivityUI() {
  const dashboardList = document.getElementById("dashboardActivityList");
  const fullList = document.getElementById("activityLogList");
  const log = ffGetActivityLog();

  if (dashboardList) {
    dashboardList.innerHTML = "";
    log.slice(0, 5).forEach(entry => {
      const date = new Date(entry.date);
      const div = document.createElement("div");
      div.className = "activity-item";
      div.innerHTML = `
        <div>${entry.description}</div>
        <div class="activity-meta">${date.toLocaleString()}</div>
      `;
      dashboardList.appendChild(div);
    });
  }

  if (fullList) {
    fullList.innerHTML = "";
    log.forEach(entry => {
      const date = new Date(entry.date);
      const div = document.createElement("div");
      div.className = "activity-item";
      div.innerHTML = `
        <div>${entry.description}</div>
        <div class="activity-meta">${date.toLocaleString()}</div>
      `;
      fullList.appendChild(div);
    });
  }
}

/* =========================================================
   Journal (logs.journal)
   ========================================================= */

function ffGetJournalEntries() {
  if (typeof getCurrentUserLog !== "function") {
    ffWarn("getCurrentUserLog not available — ffGetJournalEntries returning empty list.");
    return [];
  }
  return getCurrentUserLog("journal");
}

function ffSaveJournalEntry() {
  const textInput = ffFindInput(
    ["journalText"],
    ["journal", "write", "reflection", "thought"]
  );
  if (!textInput) {
    ffWarn("Journal textarea not found — skipping journal save.");
    return;
  }

  const text = textInput.value.trim();
  if (!text) return;

  if (typeof updateCurrentUser !== "function") {
    ffWarn("updateCurrentUser not available — cannot save journal entry.");
    return;
  }

  updateCurrentUser(user => {
    if (!user.logs) user.logs = createEmptyLogs();
    if (!Array.isArray(user.logs.journal)) user.logs.journal = [];
    user.logs.journal.unshift({
      text,
      date: new Date().toISOString()
    });
  });

  textInput.value = "";
  ffAddPoints(5, "Journaled");
  ffLogActivity("Wrote a journal entry");
  ffRenderJournalEntries();
}

function ffRenderJournalEntries() {
  const list = document.getElementById("journalEntriesList");
  if (!list) {
    ffWarn("journalEntriesList not found — cannot render journal entries.");
    return;
  }

  const entries = ffGetJournalEntries();
  list.innerHTML = "";
  entries.forEach(entry => {
    const date = new Date(entry.date);
    const div = document.createElement("div");
    div.className = "journal-entry-card";
    div.innerHTML = `
      <div class="journal-entry-date">
        ${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div class="journal-entry-text">
        ${entry.text.replace(/\n/g, "<br>")}
      </div>
    `;
    list.appendChild(div);
  });
}

function ffInitJournal() {
  const saveBtn = ffFindButton(
    ["saveJournalBtn"],
    ["save journal", "save entry", "add entry", "log journal"]
  );
  if (!saveBtn) {
    const txt = document.getElementById("journalText");
    if (txt) ffWarn("saveJournalBtn not found — journal save button missing.");
  } else {
    saveBtn.addEventListener("click", ffSaveJournalEntry);
  }

  ffRenderJournalEntries();
}

/* =========================================================
   Meditation (logs.meditation)
   ========================================================= */

let ffMeditationTimerId = null;
let ffMeditationRemainingSeconds = 0;

function ffUpdateMeditationDisplay() {
  const display = document.getElementById("meditationTimerDisplay");
  if (!display) return;
  const m = Math.floor(ffMeditationRemainingSeconds / 60);
  const s = ffMeditationRemainingSeconds % 60;
  display.textContent = `${m}:${s.toString().padStart(2, "0")}`;
}

function ffStartMeditation() {
  const minutesInput = ffFindInput(
    ["meditationMinutes"],
    ["meditation", "minutes", "time"]
  );
  const display = document.getElementById("meditationTimerDisplay");

  if (!minutesInput || !display) {
    ffWarn("Meditation elements missing — skipping ffStartMeditation.");
    return;
  }

  const mins = parseInt(minutesInput.value, 10);
  if (isNaN(mins) || mins <= 0) return;

  ffMeditationRemainingSeconds = mins * 60;
  ffUpdateMeditationDisplay();

  if (ffMeditationTimerId) clearInterval(ffMeditationTimerId);

  ffMeditationTimerId = setInterval(() => {
    ffMeditationRemainingSeconds--;
    ffUpdateMeditationDisplay();

    if (ffMeditationRemainingSeconds <= 0) {
      clearInterval(ffMeditationTimerId);
      ffMeditationTimerId = null;
      display.textContent = "Done";

      ffAddPoints(mins, `Meditation (${mins} mins)`);
      ffLogActivity(`Completed ${mins} minutes of meditation`);

      if (typeof pushCurrentUserLog === "function") {
        pushCurrentUserLog("meditation", {
          minutes: mins,
          date: new Date().toISOString()
        });
      }

      if (mins >= 10) ffAwardBadge("Mindful 10+");
      if (mins >= 20) ffAwardBadge("Deep Calm 20+");
    }
  }, 1000);
}

function ffInitMeditation() {
  const btn = ffFindButton(
    ["startMeditationBtn"],
    ["start", "begin", "meditation"]
  );
  if (!btn) {
    const input = document.getElementById("meditationMinutes");
    if (input) ffWarn("startMeditationBtn not found — meditation button missing.");
    return;
  }
  btn.addEventListener("click", ffStartMeditation);
}

/* =========================================================
   Trackers (logs.water/sleep/workouts/nutrition/breathing/affirmations)
   ========================================================= */

function ffSaveSleep() {
  const input = ffFindInput(
    ["sleepHours"],
    ["sleep", "hours"]
  );
  if (!input) {
    ffWarn("Sleep input not found — skipping sleep tracker.");
    return;
  }

  const hours = parseFloat(input.value);
  if (isNaN(hours) || hours <= 0) return;

  if (typeof pushCurrentUserLog === "function") {
    pushCurrentUserLog("sleep", { hours, date: new Date().toISOString() });
  }
  ffAddPoints(Math.round(hours), `Sleep (${hours} hrs)`);
  ffLogActivity(`Logged ${hours} hours of sleep`);
}

function ffSaveWater() {
  const input = ffFindInput(
    ["waterCups"],
    ["water", "cups"]
  );
  if (!input) {
    ffWarn("Water input not found — skipping water tracker.");
    return;
  }

  const cups = parseInt(input.value, 10);
  if (isNaN(cups) || cups <= 0) return;

  if (typeof pushCurrentUserLog === "function") {
    pushCurrentUserLog("water", {
      cups,
      date: new Date().toISOString() // FIXED: correct method
    });
  }
  ffAddPoints(cups, `Water (${cups} cups)`);
  ffLogActivity(`Drank ${cups} cups of water`);
}

function ffSaveNutrition() {
  const input = ffFindInput(
    ["nutritionNotes"],
    ["meal", "food", "nutrition"]
  );
  if (!input) {
    ffWarn("Nutrition textarea not found — skipping nutrition tracker.");
    return;
  }

  const text = input.value.trim();
  if (!text) return;

  if (typeof pushCurrentUserLog === "function") {
    pushCurrentUserLog("nutrition", {
      notes: text,
      date: new Date().toISOString()
    });
  }
  ffAddPoints(5, "Nutrition logged");
  ffLogActivity("Logged a meal");
  input.value = "";
}

function ffSaveWorkout() {
  const typeInput = ffFindInput(
    ["workoutType"],
    ["workout", "exercise", "type"]
  );
  const minutesInput = ffFindInput(
    ["workoutMinutes"],
    ["minutes", "duration", "time"]
  );

  if (!typeInput || !minutesInput) {
    ffWarn("Workout inputs missing — skipping workout tracker.");
    return;
  }

  const wtype = typeInput.value.trim() || "Workout";
  const mins = parseInt(minutesInput.value, 10);
  if (isNaN(mins) || mins <= 0) return;

  if (typeof pushCurrentUserLog === "function") {
    pushCurrentUserLog("workouts", {
      type: wtype,
      minutes: mins,
      date: new Date().toISOString()
    });
  }
  ffAddPoints(mins, `${wtype} (${mins} mins)`);
  ffLogActivity(`Logged workout: ${wtype} for ${mins} minutes`);

  typeInput.value = "";
  minutesInput.value = "";
}

function ffSaveBreathing() {
  const input = ffFindInput(
    ["breathingMinutes"],
    ["breath", "breathing", "minutes"]
  );
  if (!input) {
    ffWarn("Breathing minutes input not found — skipping breathing tracker.");
    return;
  }

  const mins = parseInt(input.value, 10);
  if (isNaN(mins) || mins <= 0) return;

  if (typeof pushCurrentUserLog === "function") {
    pushCurrentUserLog("breathing", {
      minutes: mins,
      date: new Date().toISOString()
    });
  }
  ffAddPoints(mins, `Breathing (${mins} mins)`);
  ffLogActivity(`Completed ${mins} minutes of breathing`);
}

function ffSaveAffirmations() {
  const input = ffFindInput(
    ["affirmationsCount"],
    ["affirmations", "mantra", "count"]
  );
  if (!input) {
    ffWarn("Affirmations input not found — skipping affirmations tracker.");
    return;
  }

  const count = parseInt(input.value, 10);
  if (isNaN(count) || count <= 0) return;

  if (typeof pushCurrentUserLog === "function") {
    pushCurrentUserLog("affirmations", {
      count,
      date: new Date().toISOString()
    });
  }
  ffAddPoints(count, `Affirmations (${count})`);
  ffLogActivity(`Completed ${count} affirmations`);
}

/* -------- Trackers init (wires buttons) -------- */

function ffInitTrackers() {
  // Sleep
  const sleepBtn = ffFindButton(
    ["sleepSaveBtn"],
    ["save sleep", "log sleep", "add sleep"]
  );
  if (sleepBtn) {
    sleepBtn.addEventListener("click", ffSaveSleep);
  } else if (document.getElementById("sleepHours")) {
    ffWarn("Sleep save button not found — sleep tracker disabled on this page.");
  }

  // Water
  const waterBtn = ffFindButton(
    ["waterSaveBtn"],
    ["save water", "log water", "add water"]
  );
  if (waterBtn) {
    waterBtn.addEventListener("click", ffSaveWater);
  } else if (document.getElementById("waterCups")) {
    ffWarn("Water save button not found — water tracker disabled on this page.");
  }

  // Nutrition
  const nutritionBtn = ffFindButton(
    ["nutritionSaveBtn"],
    ["save meal", "log meal", "save nutrition", "log food"]
  );
  if (nutritionBtn) {
    nutritionBtn.addEventListener("click", ffSaveNutrition);
  } else if (document.getElementById("nutritionNotes")) {
    ffWarn("Nutrition save button not found — nutrition tracker disabled on this page.");
  }

  // Workout
  const workoutBtn = ffFindButton(
    ["workoutSaveBtn"],
    ["save workout", "log workout", "add workout", "save exercise"]
  );
  if (workoutBtn) {
    workoutBtn.addEventListener("click", ffSaveWorkout);
  } else if (document.getElementById("workoutMinutes") || document.getElementById("workoutType")) {
    ffWarn("Workout save button not found — workout tracker disabled on this page.");
  }

  // Breathing
  const breathingBtn = ffFindButton(
    ["breathingSaveBtn"],
    ["save breathing", "log breathing", "breath"]
  );
  if (breathingBtn) {
    breathingBtn.addEventListener("click", ffSaveBreathing);
  } else if (document.getElementById("breathingMinutes")) {
    ffWarn("Breathing save button not found — breathing tracker disabled on this page.");
  }

  // Affirmations
  const affirmBtn = ffFindButton(
    ["affirmationsSaveBtn"],
    ["save affirmations", "log affirmations", "affirmations"]
  );
  if (affirmBtn) {
    affirmBtn.addEventListener("click", ffSaveAffirmations);
  } else if (document.getElementById("affirmationsCount")) {
    ffWarn("Affirmations save button not found — affirmations tracker disabled on this page.");
  }
}

/* =========================================================
   Shop & badge purchases (uses purchasedBadges)
   ========================================================= */

function ffInitShop() {
  if (typeof purchaseBadgeForCurrentUser !== "function") {
    ffWarn("purchaseBadgeForCurrentUser not available — shop disabled.");
    return;
  }

  const user = ffGetCurrentUserOrWarn("ffInitShop");
  if (!user) return;

  const buttons = document.querySelectorAll("[data-badge-name][data-badge-cost]");
  if (!buttons.length) {
    // It might be a non-shop page; no warning needed.
    return;
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const badgeName = btn.getAttribute("data-badge-name");
      const costStr = btn.getAttribute("data-badge-cost");
      const cost = parseInt(costStr, 10);

      if (!badgeName || isNaN(cost)) {
        ffWarn("Badge purchase button missing valid name or cost.");
        return;
      }

      const currentPoints = ffGetPoints();
      if (currentPoints < cost) {
        ffWarn(`Not enough points to purchase badge "${badgeName}".`);
        return;
      }

      ffDeductPoints(cost, `Purchased badge: ${badgeName}`);
      purchaseBadgeForCurrentUser(badgeName);
      ffUpdateBadgeUI();
    });
  });
}

/* =========================================================
   Dashboard & Progress / Weekly Summary
   ========================================================= */

function ffGetLogs(category) {
  if (typeof getCurrentUserLog !== "function") return [];
  return getCurrentUserLog(category) || [];
}

function ffInitDashboard() {
  ffUpdatePointsUI();
  ffUpdateLevelUI();
  ffUpdateStreakUI();
  ffUpdateBadgeUI();
  ffUpdateActivityUI();
}

function ffInitProgress() {
  const sleepLogs = ffGetLogs("sleep");
  const waterLogs = ffGetLogs("water");
  const workoutLogs = ffGetLogs("workouts");

  const totalSleep = sleepLogs.reduce((sum, e) => sum + (e.hours || 0), 0);
  const totalWater = waterLogs.reduce((sum, e) => sum + (e.cups || 0), 0);
  const totalWorkoutMinutes = workoutLogs.reduce((sum, e) => sum + (e.minutes || 0), 0);

  const sleepEl = document.getElementById("progressSleepTotal");
  const waterEl = document.getElementById("progressWaterTotal");
  const workoutEl = document.getElementById("progressWorkoutTotal");

  if (sleepEl) sleepEl.textContent = totalSleep.toFixed(1);
  if (waterEl) waterEl.textContent = totalWater;
  if (workoutEl) workoutEl.textContent = totalWorkoutMinutes;

  ffUpdatePointsUI();
  ffUpdateLevelUI();
  ffUpdateStreakUI();
  ffUpdateBadgeUI();
}

/* Simple weekly summary: last 7 days */
function ffInitWeeklySummary() {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  function filterRecent(logs) {
    return logs.filter(e => {
      const d = new Date(e.date);
      return d >= cutoff;
    });
  }

  const sleepLogs = filterRecent(ffGetLogs("sleep"));
  const waterLogs = filterRecent(ffGetLogs("water"));
  const workoutLogs = filterRecent(ffGetLogs("workouts"));

  const weeklySleep = sleepLogs.reduce((sum, e) => sum + (e.hours || 0), 0);
  const weeklyWater = waterLogs.reduce((sum, e) => sum + (e.cups || 0), 0);
  const weeklyWorkout = workoutLogs.reduce((sum, e) => sum + (e.minutes || 0), 0);

  const sleepEl = document.getElementById("weeklySleepTotal");
  const waterEl = document.getElementById("weeklyWaterTotal");
  const workoutEl = document.getElementById("weeklyWorkoutTotal");

  if (sleepEl) sleepEl.textContent = weeklySleep.toFixed(1);
  if (waterEl) waterEl.textContent = weeklyWater;
  if (workoutEl) workoutEl.textContent = weeklyWorkout;
}

/* =========================================================
   Global Init Helper (optional)
   Call this from each page if you want auto-wiring.
   ========================================================= */

function ffInitPage(options = {}) {
  // Ensure user is logged in for protected pages
  if (options.protectUser && typeof protectUserPage === "function") {
    protectUserPage();
  }
  if (options.protectAdmin && typeof protectAdminPage === "function") {
    protectAdminPage();
  }

  if (options.dashboard) ffInitDashboard();
  if (options.journal) ffInitJournal();
  if (options.meditation) ffInitMeditation();
  if (options.trackers) ffInitTrackers();
  if (options.shop) ffInitShop();
  if (options.progress) ffInitProgress();
  if (options.weekly) ffInitWeeklySummary();
}

/*
Example usage on a page:

<body onload="ffInitPage({ protectUser: true, dashboard: true });">

or

<body onload="ffInitPage({ protectUser: true, journal: true });">

or manually:
- ffInitTrackers();
- ffInitMeditation();
- ffInitShop();
etc.
*/
