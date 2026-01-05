function initAdminSecurity() {
  protectAdminPage();
}

function forceLogoutAll() {
  localStorage.removeItem("fitflowCurrentUser");
  document.getElementById("securityStatus").textContent = "All users logged out.";
}

function resetAdminPassword() {
  const users = loadUsers();
  const admin = users.find(u => u.username === "admin");
  if (admin) {
    admin.password = "fitflow";
    updateUser(admin);
  }
  document.getElementById("securityStatus").textContent = "Admin password reset.";
}

function goBack() {
  window.location.href = "admin.html";
}
