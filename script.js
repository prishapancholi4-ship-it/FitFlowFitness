// --------------------------------------------------
// FitFlow Core Script
// Points • Levels • Habits • Daily Challenges
// Seasonal System • Wellness Tracking
// --------------------------------------------------

// ---------- Constants & Config ----------

const LEVEL_RULES = [
    { level: 1, minPoints: 0 },
    { level: 2, minPoints: 100 },
    { level: 3, minPoints: 300 },
    { level: 4, minPoints: 600 },
    { level: 5, minPoints: 1000 }
];

// Base shop items
const SHOP_ITEMS = [];
for (let i = 1; i <= 20; i++) {
    SHOP_ITEMS.push({
        id: `icon_${i}`,
        name: `Profile Icon ${i}`,
        type: "icon",
        cost: 10 + i
    });
}
for (let i = 1; i <= 10; i++) {
    SHOP_ITEMS.push({
        id: `theme_${i}`,
        name: `Theme Variant ${i}`,
        type: "theme",
        cost: 30 + i * 2
    });
}
for (let i = 1; i <= 20; i++) {
    SHOP_ITEMS.push({
        id: `title_${i}`,
        name: `Title: Challenger ${i}`,
        type: "title",
        cost: 15 + i
    });
}

// --------------------------------------------------
// Seasonal System
// --------------------------------------------------

let CURRENT_SEASON = localStorage.getItem("currentSeason") || "spring";

const SEASON_DATES = {
    spring: { start: "03-01", end: "05-31" },
    summer: { start: "06-01", end: "08-31" },
    autumn: { start: "09-01", end: "11-30" },
    winter: { start: "12-01", end: "02-28" }
};

function getSeasonEndDate(season) {
    const year = new Date().getFullYear();
    const end = SEASON_DATES[season].end;
    return new Date(`${year}-${end}T23:59:59`);
}

function getDaysUntilSeasonEnds() {
    if (CURRENT_SEASON === "all") return null;
    const now = new Date();
    const end = getSeasonEndDate(CURRENT_SEASON);
    const diff = end - now;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function setSeason(season) {
    const valid = ["spring", "summer", "autumn", "winter", "all"];
    if (!valid.includes(season)) {
        alert("Invalid season");
        return;
    }
    CURRENT_SEASON = season;
    localStorage.setItem("currentSeason", season);
    alert("Season updated to: " + season);

    renderSeasonBanner();
    renderDashboardSeasonHeader();
    loadShop();
}

// --------------------------------------------------
// Seasonal Shop Items (20 icons)
// --------------------------------------------------

SHOP_ITEMS.push(
    // SPRING
    { id: "icon_spring_1", name: "Bloom Petal Spark", type: "icon", cost: 15, season: "spring" },
    { id: "icon_spring_2", name: "Mint Garden Whisper", type: "icon", cost: 15, season: "spring" },
    { id: "icon_spring_3", name: "Peach Blossom Drop", type: "icon", cost: 15, season: "spring" },
    { id: "icon_spring_4", name: "Lavender Breeze Bud", type: "icon", cost: 15, season: "spring" },
    { id: "icon_spring_5", name: "Honeydew Morning Glow", type: "icon", cost: 15, season: "spring" },

    // SUMMER
    { id: "icon_summer_1", name: "Coconut Splash Pop", type: "icon", cost: 15, season: "summer" },
    { id: "icon_summer_2", name: "Sunbeam Citrus Burst", type: "icon", cost: 15, season: "summer" },
    { id: "icon_summer_3", name: "Tropical Wave Drift", type: "icon", cost: 15, season: "summer" },
    { id: "icon_summer_4", name: "Mango Sunset Pulse", type: "icon", cost: 15, season: "summer" },
    { id: "icon_summer_5", name: "Ocean Breeze Pearl", type: "icon", cost: 15, season: "summer" },

    // AUTUMN
    { id: "icon_autumn_1", name: "Cinnamon Ember Dot", type: "icon", cost: 15, season: "autumn" },
    { id: "icon_autumn_2", name: "Pumpkin Spice Puff", type: "icon", cost: 15, season: "autumn" },
    { id: "icon_autumn_3", name: "Maple Glow Leaf", type: "icon", cost: 15, season: "autumn" },
    { id: "icon_autumn_4", name: "Caramel Cozy Drop", type: "icon", cost: 15, season: "autumn" },
    { id: "icon_autumn_5", name: "Harvest Moon Mist", type: "icon", cost: 15, season: "autumn" },

    // WINTER
    { id: "icon_winter_1", name: "Frost Crystal Bloom", type: "icon", cost: 15, season: "winter" },
    { id: "icon_winter_2", name: "Snowflake Whisper Dot", type: "icon", cost: 15, season: "winter" },
    { id: "icon_winter_3", name: "Icy Mint Shimmer", type: "icon", cost: 15, season: "winter" },
    { id: "icon_winter_4", name: "Winterberry Frost Pop", type: "icon", cost: 15, season: "winter" },
    { id: "icon_winter_5", name: "Arctic Glow Star", type: "icon", cost: 15, season: "winter" }
);

// --------------------------------------------------
// Daily Challenges
// --------------------------------------------------

const DAILY_CHALLENGES = {
    1: [
        { id: "l1_walk_10", title: "Walk 10 minutes", points: 10 },
        { id: "l1_water_2", title: "Drink 2 glasses of water", points: 10 }
    ],
    2: [
        { id: "l2_walk_20", title: "Walk 20 minutes", points: 10 },
        { id: "l2_stretch_10", title: "Stretch for 10 minutes", points: 10 }
    ],
    3: [
        { id: "l3_workout_20", title: "Do a 20-minute workout", points: 10 },
        { id: "l3_water_5", title: "Drink 5 glasses of water", points: 10 }
    ],
    4: [
        { id: "l4_workout_30", title: "Do a 30-minute workout", points: 10 },
        { id: "l4_run_20", title: "Run/Jog 20 minutes", points: 10 }
    ],
    5: [
        { id: "l5_workout_45", title: "Do a 45-minute workout", points: 10 },
        { id: "l5_habit_5", title: "Complete 5 habits today", points: 10 }
    ]
};

// --------------------------------------------------
// Badges & Achievements
// --------------------------------------------------

const BADGE_RULES = [
    {
        id: "badge_first_journal",
        name: "First Reflection",
        description: "Write your first journal entry.",
        condition: user => (user.journal || []).length >= 1
    },
    {
        id: "badge_10_journals",
        name: "Thoughtful",
        description: "Write 10 journal entries.",
        condition: user => (user.journal || []).length >= 10
    },
    {
        id: "badge_10_habit_completions",
        name: "Habit Newbie",
        description: "Complete any habit 10 times.",
        condition: user => (user.habits || []).some(h => h.count >= 10)
    },
    {
        id: "badge_50_points",
        name: "Getting Started",
        description: "Reach 50 points.",
        condition: user => (user.points || 0) >= 50
    },
    {
        id: "badge_200_points",
        name: "Committed",
        description: "Reach 200 points.",
        condition: user => (user.points || 0) >= 200
    }
];

const ACHIEVEMENT_RULES = [
    {
        id: "ach_level_2",
        name: "Level 2 Achieved",
        description: "Reach level 2.",
        condition: user => (user.level || 1) >= 2
    },
    {
        id: "ach_level_3",
        name: "Level 3 Achieved",
        description: "Reach level 3.",
        condition: user => (user.level || 1) >= 3
    },
    {
        id: "ach_20_challenges",
        name: "Challenge Finisher",
        description: "Complete 20 daily challenges.",
        condition: user => (user.completedChallengesCount || 0) >= 20
    }
];

// --------------------------------------------------
// Storage Helpers
// --------------------------------------------------

function getUsers() {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUsername() {
    return localStorage.getItem("currentUser");
}

function setCurrentUsername(username) {
    localStorage.setItem("currentUser", username);
}

function getCurrentUser() {
    const username = getCurrentUsername();
    if (!username) return null;
    const users = getUsers();
    return users.find(u => u.username === username) || null;
}

function saveCurrentUser(user) {
    const users = getUsers();
    const idx = users.findIndex(u => u.username === user.username);
    if (idx !== -1) {
        users[idx] = user;
        saveUsers(users);
    }
}

// --------------------------------------------------
// Auth
// --------------------------------------------------

function registerUser() {
    const username = document.getElementById("regUsername").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value;

    if (!username || !password) {
        alert("Please enter a username and password.");
        return;
    }

    const users = getUsers();
    const existing = users.find(u => u.username === username);
    if (existing) {
        alert("Username already exists.");
        return;
    }

    const newUser = {
        username,
        password,
        points: 0,
        level: 1,
        assessmentCompleted: false,
        habits: [],
        journal: [],
        dailyChallenges: [],
        lastChallengeDate: null,
        badges: [],
        achievements: [],
        inventory: [],
        equippedItem: null,
        completedChallengesCount: 0,

        // Wellness tracking
        sleepLog: [],          // { date, hours, quality }
        waterToday: 0,         // cups
        waterGoal: 8,          // default
        meditationLog: [],     // { date, minutes }
        affirmationFavorites: []
    };

    users.push(newUser);
    saveUsers(users);

    alert("Registration successful. You can now log in.");
    window.location.href = "login.html";
}

function loginUser() {
    const username = document.getElementById("loginUsername").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert("Invalid username or password.");
        return;
    }

    setCurrentUsername(user.username);

    generateDailyChallenges(user);
    updateLevel(user);
    updateBadges(user);
    updateAchievements(user);
    saveCurrentUser(user);

    if (!user.assessmentCompleted) {
        window.location.href = "assessment.html";
    } else {
        window.location.href = "dashboard.html";
    }
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// --------------------------------------------------
// Points / Levels / Badges / Achievements
// --------------------------------------------------

function addPoints(user, amount) {
    user.points = (user.points || 0) + amount;
    updateLevel(user);
    updateBadges(user);
    updateAchievements(user);
    saveCurrentUser(user);
}

function updateLevel(user) {
    const points = user.points || 0;
    let newLevel = user.level || 1;
    LEVEL_RULES.forEach(rule => {
        if (points >= rule.minPoints) {
            newLevel = rule.level;
        }
    });
    user.level = newLevel;
}

function updateBadges(user) {
    if (!user.badges) user.badges = [];
    BADGE_RULES.forEach(rule => {
        const has = user.badges.includes(rule.id);
        if (!has && rule.condition(user)) {
            user.badges.push(rule.id);
        }
    });
}

function updateAchievements(user) {
    if (!user.achievements) user.achievements = [];
    ACHIEVEMENT_RULES.forEach(rule => {
        const has = user.achievements.includes(rule.id);
        if (!has && rule.condition(user)) {
            user.achievements.push(rule.id);
        }
    });
}
// --------------------------------------------------
// Daily Challenges
// --------------------------------------------------

function generateDailyChallenges(user) {
    const today = new Date().toISOString().slice(0, 10);
    if (user.lastChallengeDate === today && user.dailyChallenges?.length) return;

    const level = user.level || 1;
    const pool = DAILY_CHALLENGES[level] || DAILY_CHALLENGES[1];

    user.dailyChallenges = pool.map(ch => ({
        id: ch.id,
        title: ch.title,
        points: ch.points,
        completed: false
    }));

    user.lastChallengeDate = today;
}

function completeDailyChallenge(challengeId) {
    const user = getCurrentUser();
    if (!user) return;

    const challenge = user.dailyChallenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed) return;

    challenge.completed = true;
    user.completedChallengesCount++;

    addPoints(user, challenge.points);
    alert(`Challenge completed! +${challenge.points} points.`);

    saveCurrentUser(user);
    renderChallengesPage();
    renderDashboard();
}

// --------------------------------------------------
// Habits
// --------------------------------------------------

function addHabit() {
    const user = getCurrentUser();
    if (!user) return;

    const input = document.getElementById("habitInput");
    const title = input.value.trim();
    if (!title) return;

    user.habits.push({
        id: `habit_${Date.now()}`,
        title,
        count: 0,
        lastCompleted: null
    });

    saveCurrentUser(user);
    input.value = "";
    renderHabitsPage();
}

function completeHabit(habitId) {
    const user = getCurrentUser();
    if (!user) return;

    const habit = user.habits.find(h => h.id === habitId);
    if (!habit) return;

    habit.count++;
    habit.lastCompleted = new Date().toISOString().slice(0, 10);

    saveCurrentUser(user);
    renderHabitsPage();
}

// --------------------------------------------------
// Journal
// --------------------------------------------------

function addJournal() {
    const user = getCurrentUser();
    if (!user) return;

    const textarea = document.getElementById("journalInput");
    const text = textarea.value.trim();
    if (!text) return;

    user.journal.push({
        id: `journal_${Date.now()}`,
        date: new Date().toISOString(),
        text
    });

    addPoints(user, 5);
    textarea.value = "";

    saveCurrentUser(user);
    renderJournalPage();
}

// --------------------------------------------------
// Shop (with seasonal filtering)
// --------------------------------------------------

function loadShop() {
    const user = getCurrentUser();
    if (!user) return;

    const container = document.getElementById("shopList");
    if (!container) return;

    container.innerHTML = "";

    SHOP_ITEMS.forEach(item => {
        if (item.season && item.season !== CURRENT_SEASON && CURRENT_SEASON !== "all") return;

        const owned = user.inventory.includes(item.id);

        const div = document.createElement("div");
        div.innerHTML = `
            <strong>${item.name}</strong><br>
            <small>${item.cost} pts</small><br>
            ${owned
                ? "<span>Owned</span>"
                : `<button onclick="buyItem('${item.id}')">Buy</button>`}
        `;
        container.appendChild(div);
    });
}

function buyItem(itemId) {
    const user = getCurrentUser();
    if (!user) return;

    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (user.inventory.includes(itemId)) {
        alert("You already own this item.");
        return;
    }

    if (user.points < item.cost) {
        alert("Not enough points.");
        return;
    }

    user.points -= item.cost;
    user.inventory.push(itemId);

    saveCurrentUser(user);
    loadShop();
    loadInventory();
    renderDashboard();
}

// --------------------------------------------------
// Inventory (STRICT seasonal equip)
// --------------------------------------------------

function loadInventory() {
    const user = getCurrentUser();
    if (!user) return;

    const container = document.getElementById("inventoryList");
    if (!container) return;

    container.innerHTML = "";

    user.inventory.forEach(id => {
        const item = SHOP_ITEMS.find(i => i.id === id);
        if (!item) return;

        const div = document.createElement("div");
        const isEquipped = user.equippedItem === id;

        div.innerHTML = `
            <strong>${item.name}</strong>
            ${item.season ? `<br><small>Season: ${item.season}</small>` : ""}
            <br>
            ${isEquipped
                ? "<span>Equipped</span>"
                : `<button onclick="equipItem('${id}')">Equip</button>`}
        `;

        container.appendChild(div);
    });
}

function equipItem(itemId) {
    const user = getCurrentUser();
    if (!user) return;

    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (item.season && item.season !== CURRENT_SEASON && CURRENT_SEASON !== "all") {
        alert(`You can only equip ${CURRENT_SEASON} items right now.`);
        return;
    }

    user.equippedItem = itemId;
    saveCurrentUser(user);
    loadInventory();
}

// --------------------------------------------------
// WELLNESS SYSTEMS
// --------------------------------------------------

// --------------------------------------------------
// Sleep Tracking
// --------------------------------------------------

function logSleep() {
    const user = getCurrentUser();
    if (!user) return;

    const hours = Number(document.getElementById("sleepHours").value);
    const quality = document.getElementById("sleepQuality").value;

    if (!hours || hours <= 0) {
        alert("Enter valid hours.");
        return;
    }

    user.sleepLog.push({
        date: new Date().toISOString().slice(0, 10),
        hours,
        quality
    });

    addPoints(user, 5);
    saveCurrentUser(user);
    renderSleepPage();
}

function renderSleepPage() {
    const user = getCurrentUser();
    if (!user) return;

    const container = document.getElementById("sleepContainer");
    if (!container) return;

    container.innerHTML = `
        <h2>Log Sleep</h2>
        <input id="sleepHours" type="number" placeholder="Hours slept">
        <select id="sleepQuality">
            <option value="great">Great</option>
            <option value="good">Good</option>
            <option value="okay">Okay</option>
            <option value="poor">Poor</option>
        </select>
        <button onclick="logSleep()">Save</button>

        <h3>History</h3>
        ${user.sleepLog.map(s => `
            <div>
                <strong>${s.date}</strong> — ${s.hours} hrs (${s.quality})
            </div>
        `).join("")}
    `;
}

// --------------------------------------------------
// Water Tracking
// --------------------------------------------------

function addWaterCup() {
    const user = getCurrentUser();
    if (!user) return;

    user.waterToday++;
    if (user.waterToday === user.waterGoal) {
        addPoints(user, 10);
        alert("Water goal reached! +10 points");
    }

    saveCurrentUser(user);
    renderWaterPage();
}

function resetWater() {
    const user = getCurrentUser();
    if (!user) return;

    user.waterToday = 0;
    saveCurrentUser(user);
    renderWaterPage();
}

function renderWaterPage() {
    const user = getCurrentUser();
    if (!user) return;

    const container = document.getElementById("waterContainer");
    if (!container) return;

    const progress = Math.min(100, (user.waterToday / user.waterGoal) * 100);

    container.innerHTML = `
        <h2>Water Intake</h2>
        <p>${user.waterToday} / ${user.waterGoal} cups</p>

        <div style="background:#ddd;height:20px;width:100%;border-radius:10px;">
            <div style="height:20px;width:${progress}%;background:#4ac;border-radius:10px;"></div>
        </div>

        <button onclick="addWaterCup()">+1 Cup</button>
        <button onclick="resetWater()">Reset</button>
    `;
}

// --------------------------------------------------
// Affirmations
// --------------------------------------------------

const AFFIRMATIONS = [
    "I am growing stronger every day.",
    "I choose peace and clarity.",
    "I am capable of amazing things.",
    "My body deserves care and love.",
    "I am becoming the best version of myself."
];

function newAffirmation() {
    const index = Math.floor(Math.random() * AFFIRMATIONS.length);
    return AFFIRMATIONS[index];
}

function saveAffirmation() {
    const user = getCurrentUser();
    if (!user) return;

    const text = document.getElementById("affirmationText").textContent;
    if (!text) return;

    if (!user.affirmationFavorites.includes(text)) {
        user.affirmationFavorites.push(text);
        addPoints(user, 2);
    }

    saveCurrentUser(user);
    renderAffirmationsPage();
}

function renderAffirmationsPage() {
    const user = getCurrentUser();
    if (!user) return;

    const container = document.getElementById("affirmationsContainer");
    if (!container) return;

    const affirmation = newAffirmation();

    container.innerHTML = `
        <h2>Daily Affirmation</h2>
        <p id="affirmationText">${affirmation}</p>

        <button onclick="renderAffirmationsPage()">New</button>
        <button onclick="saveAffirmation()">Save</button>

        <h3>Favorites</h3>
        ${user.affirmationFavorites.map(a => `<div>${a}</div>`).join("")}
    `;
}

// --------------------------------------------------
// Meditation Tracking
// --------------------------------------------------

function logMeditation() {
    const user = getCurrentUser();
    if (!user) return;

    const minutes = Number(document.getElementById("meditationMinutes").value);
    if (!minutes || minutes <= 0) {
        alert("Enter valid minutes.");
        return;
    }

    user.meditationLog.push({
        date: new Date().toISOString().slice(0, 10),
        minutes
    });

    addPoints(user, 5);
    saveCurrentUser(user);
    renderMeditationPage();
}

function renderMeditationPage() {
    const user = getCurrentUser();
    if (!user) return;

    const container = document.getElementById("meditationContainer");
    if (!container) return;

    container.innerHTML = `
        <h2>Meditation</h2>
        <input id="meditationMinutes" type="number" placeholder="Minutes">
        <button onclick="logMeditation()">Save</button>

        <h3>History</h3>
        ${user.meditationLog.map(m => `
            <div>
                <strong>${m.date}</strong> — ${m.minutes} min
            </div>
        `).join("")}
    `;
}

// --------------------------------------------------
// Rewards / Badges / Achievements Rendering
// --------------------------------------------------

function renderRewardsPage() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById("rewardLevel").textContent = user.level;
    document.getElementById("rewardPoints").textContent = user.points;
    document.getElementById("rewardBadgesCount").textContent = user.badges.length;
    document.getElementById("rewardAchievementsCount").textContent = user.achievements.length;
}

function renderBadgesPage() {
    const user = getCurrentUser();
    if (!user) return;

    const container = document.getElementById("badgeList");
    container.innerHTML = "";

    BADGE_RULES.forEach(rule => {
        const unlocked = user.badges.includes(rule.id);
        container.innerHTML += `
            <div>
                <strong>${rule.name}</strong> ${unlocked ? "✅" : "🔒"}
                <br><small>${rule.description}</small>
            </div>
        `;
    });
}

function renderAchievementsPage() {
    const user = getCurrentUser();
    if (!user) return;

    const container = document.getElementById("achievementList");
    container.innerHTML = "";

    ACHIEVEMENT_RULES.forEach(rule => {
        const unlocked = user.achievements.includes(rule.id);
        container.innerHTML += `
            <div>
                <strong>${rule.name}</strong> ${unlocked ? "🏆" : "🔒"}
                <br><small>${rule.description}</small>
            </div>
        `;
    });
}
