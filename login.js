function handleLogin() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const status = document.getElementById("loginStatus");

  const savedUser = localStorage.getItem("fitflowUsername");
  const savedPass = localStorage.getItem("fitflowPassword");

  if (!username || !password) {
    status.textContent = "Enter both fields.";
    return;
  }

  if (username === savedUser && password === savedPass) {
    localStorage.setItem("fitflowLoggedIn", "true");
    status.textContent = "Logging in...";
    setTimeout(() => window.location.href = "privacy.html", 500);
  } else {
    status.textContent = "Incorrect username or password.";
  }
}
