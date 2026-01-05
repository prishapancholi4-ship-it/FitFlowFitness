function handleLogin() {
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const status = document.getElementById("loginStatus");

  if (!username || !password) {
    status.textContent = "Please enter your username and password.";
    return;
  }

  const user = findUser(username);

  if (!user) {
    status.textContent = "User not found.";
    return;
  }

  if (user.password !== password) {
    status.textContent = "Incorrect password.";
    return;
  }

  // Set current user
  setCurrentUser(username);

  // Save last active timestamp
  user.lastActive = new Date().toISOString();
  updateUser(user);

  // Redirect to onboarding flow
  window.location.href = "privacy.html";
}
