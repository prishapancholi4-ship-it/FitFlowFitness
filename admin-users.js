let selectedUser = null;

function initAdminUsers() {
  protectAdminPage();
  renderUserList();
}

function renderUserList() {
  const list = document.getElementById("userList");
  list.innerHTML = "";

  const users = loadUsers();

  users.forEach(user => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${user.username}</strong><br>
      Points: ${user.points} | Streak: ${user.streak} | Level: ${user.level}<br>
      <button onclick="editUser('${user.username}')">Edit</button>
      <button onclick="impersonate('${user.username}')">Impersonate</button>
    `;
    list.appendChild(li);
  });
}

function editUser(username) {
  selectedUser = findUser(username);
  if (!selectedUser) return;

  document.getElementById("editSection").style.display = "block";
  document.getElementById("editUserLabel").textContent = `Editing: ${selectedUser.username}`;

  document.getElementById("editPoints").value = selectedUser.points;
  document.getElementById("editStreak").value = selectedUser.streak;
  document.getElementById("editLevel").value = selectedUser.level;
  document.getElementById("editBadge").value = selectedUser.badge;

  document.getElementById("editStatus").textContent = "";
}

function saveUserEdits() {
  if (!selectedUser) return;

  selectedUser.points = parseInt(document.getElementById("editPoints").value, 10);
  selectedUser.streak = parseInt(document.getElementById("editStreak").value, 10);
  selectedUser.level = parseInt(document.getElementById("editLevel").value, 10);
  selectedUser.badge = document.getElementById("editBadge").value.trim();

  updateUser(selectedUser);

  document.getElementById("editStatus").textContent = "Changes saved.";
  renderUserList();
}

function resetUserLogs() {
  if (!selectedUser) return;

  selectedUser.logs = {
    water: [],
    sleep: [],
    workouts: [],
    nutrition: [],
    journal: []
  };

  updateUser(selectedUser);
  document.getElementById("editStatus").textContent = "Logs reset.";
}

function deleteUserAccount() {
  if (!selectedUser) return;

  deleteUser(selectedUser.username);
  selectedUser = null;

  document.getElementById("editSection").style.display = "none";
  renderUserList();
}

function impersonate(username) {
  impersonateUser(username);
  window.location.href = "dashboard.html";
}

function cancelEdit() {
  selectedUser = null;
  document.getElementById("editSection").style.display = "none";
}

function goBack() {
  window.location.href = "admin.html";
}
