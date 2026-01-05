function initWater() {
  protectUserPage();
  renderWaterLogs();
}

function addWater() {
  const amount = parseInt(document.getElementById("waterAmount").value.trim(), 10);
  const status = document.getElementById("waterStatus");

  if (!amount || amount <= 0) {
    status.textContent = "Enter a valid amount.";
    return;
  }

  const entry = {
    amount,
    time: new Date().toISOString()
  };

  logWater(entry);
  status.textContent = "Water logged!";
  document.getElementById("waterAmount").value = "";

  renderWaterLogs();
}

function renderWaterLogs() {
  const list = document.getElementById("waterList");
  const logs = getLogs("water");

  list.innerHTML = "";

  logs.slice().reverse().forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.amount} ml — ${new Date(entry.time).toLocaleTimeString()}`;
    list.appendChild(li);
  });
}

function goBack() {
  window.location.href = "dashboard.html";
}
