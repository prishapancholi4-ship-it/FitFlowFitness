function handleSignup() {
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const status = document.getElementById("signupStatus");

  // Validation
  if (!username || !password || !confirmPassword) {
    status.textContent = "All fields are required.";
    return;
  }

  if (password.length < 4) {
    status.textContent = "Password must be at least 4 characters.";
    return;
  }

  if (password !== confirmPassword) {
    status.textContent = "Passwords do not match.";
    return;
  }

  // Add user
  const result = addUser(username, password);

  if (!result.success) {
    status.textContent = result.message;
    return;
  }

  // Success
  status.textContent = "Account created! Redirecting to login...";
  setTimeout(() => {
    window.location.href = "login.html";
  }, 800);
}
