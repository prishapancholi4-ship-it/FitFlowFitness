let allEntries = [];
let filteredEntries = [];
let currentIndex = 0; // index in filteredEntries, each "page spread" = 2 entries

function initJournal() {
  protectUserPage?.(); // safe if you use this globally

  allEntries = loadJournalEntries();
  filteredEntries = [...allEntries];
  currentIndex = 0;

  setupBookmarks();
  renderSpread();
}

function setupBookmarks() {
  document.querySelectorAll(".bookmark").forEach(tab => {
    tab.addEventListener("click", () => {
      const section = tab.dataset.section;
      document.querySelectorAll(".bookmark").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      applyFilter(section);
    });
  });

  // default
  const allTab = document.querySelector('.bookmark[data-section="all"]');
  if (allTab) allTab.classList.add("active");
}

function applyFilter(section) {
  if (section === "all") {
    filteredEntries = [...allEntries];
  } else {
    filteredEntries = allEntries.filter(e => e.section === section);
  }
  currentIndex = 0;
  renderSpread(true);
}

function renderSpread(instant = false) {
  const left = filteredEntries[currentIndex] || null;
  const right = filteredEntries[currentIndex + 1] || null;

  setPage("left", left);
  setPage("right", right);

  if (!instant) triggerFlipAnimation();
}

function setPage(side, entry) {
  const dateEl = document.getElementById(side + "Date");
  const moodEl = document.getElementById(side + "Mood");
  const titleEl = document.getElementById(side + "Title");
  const bodyEl = document.getElementById(side + "Body");

  if (!entry) {
    dateEl.textContent = "";
    moodEl.textContent = "";
    titleEl.textContent = "Blank Page";
    bodyEl.textContent = "No entry here yet. Write something new!";
    return;
  }

  dateEl.textContent = entry.date;
  moodEl.textContent = entry.mood;
  titleEl.textContent = entry.title;
  bodyEl.textContent = entry.body;
}

function triggerFlipAnimation() {
  const flip = document.getElementById("pageFlip");
  if (!flip) return;

  flip.classList.add("flip");
  setTimeout(() => {
    flip.classList.remove("flip");
  }, 800);
}

function nextPages() {
  if (currentIndex + 2 < filteredEntries.length) {
    currentIndex += 2;
    renderSpread();
  }
}

function prevPages() {
  if (currentIndex - 2 >= 0) {
    currentIndex -= 2;
    renderSpread();
  }
}

function saveEntry() {
  const title = document.getElementById("entryTitle").value.trim();
  const mood = document.getElementById("entryMood").value;
  const section = document.getElementById("entrySection").value;
  const body = document.getElementById("entryBody").value.trim();

  if (!body) {
    alert("Write something in your entry first.");
    return;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const newEntry = {
    id: Date.now(),
    date: dateStr,
    title: title || "Untitled Entry",
    mood,
    section,
    body
  };

  allEntries.unshift(newEntry);
  saveJournalEntries(allEntries);

  // Reapply current filter
  const activeTab = document.querySelector(".bookmark.active");
  const sectionFilter = activeTab ? activeTab.dataset.section : "all";
  applyFilter(sectionFilter);

  // Clear form
  document.getElementById("entryTitle").value = "";
  document.getElementById("entryBody").value = "";
}

function goBack() {
  window.location.href = "dashboard.html";
}
