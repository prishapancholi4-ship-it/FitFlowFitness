function initAdminTools() {
  protectAdminPage();
}

function resetAllLogs() {
  const users = loadUsers();
  users.forEach(u => {
    u.logs = {
      water: [],
      sleep: [],
      workouts: [],
      nutrition: [],
      journal: []
    };
  });
  saveUsers(users);
  document.getElementById("toolsStatus").textContent = "All logs reset.";
}

function resetAllPoints() {
  const users = loadUsers();
  users.forEach(u => u.points = 0);
  saveUsers(users);
  document.getElementById("toolsStatus").textContent = "All points reset.";
}

function resetAllStreaks() {
  const users = loadUsers();
  users.forEach(u => u.streak = 0);
  saveUsers(users);
  document.getElementById("toolsStatus").textContent = "All streaks reset.";
}

function goBack() {
  window.location.href = "admin.html";
}
