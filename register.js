function handleRegister() {
  const email = document.getElementById("regEmail").value.trim();
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const status = document.getElementById("registerStatus");

  if (!email || !username || !password) {
    status.textContent = "Please fill out all fields.";
    return;
  }

  localStorage.setItem("fitflowEmail", email);
  localStorage.setItem("fitflowUsername", username);
  localStorage.setItem("fitflowPassword", password);

  status.textContent = "Account created! Redirecting...";
  setTimeout(() => window.location.href = "login.html", 600);
}
