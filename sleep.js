function initSleep() {
  protectUserPage();
  renderSleepLogs();
}

function addSleep() {
  const hours = parseFloat(document.getElementById("sleepHours").value.trim());
  const status = document.getElementById("sleepStatus");

  if (!hours || hours <= 0) {
    status.textContent = "Enter valid hours.";
    return;
  }

  const entry = {
    hours,
    time: new Date().toISOString()
  };

  logSleep(entry);
  status.textContent = "Sleep logged!";
  document.getElementById("sleepHours").value = "";

  renderSleepLogs();
}

function renderSleepLogs() {
  const list = document.getElementById("sleepList");
  const logs = getLogs("sleep");

  list.innerHTML = "";

  logs.slice().reverse().forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.hours} hours — ${new Date(entry.time).toLocaleDateString()}`;
    list.appendChild(li);
  });
}

function goBack() {
  window.location.href = "dashboard.html";
}
