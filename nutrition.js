function initNutrition() {
  protectUserPage();
  renderNutritionLogs();
}

function addNutrition() {
  const item = document.getElementById("foodItem").value.trim();
  const calories = parseInt(document.getElementById("foodCalories").value.trim(), 10);
  const status = document.getElementById("nutritionStatus");

  if (!item || !calories || calories <= 0) {
    status.textContent = "Enter valid food details.";
    return;
  }

  const entry = {
    item,
    calories,
    time: new Date().toISOString()
  };

  logNutrition(entry);
  status.textContent = "Meal logged!";
  document.getElementById("foodItem").value = "";
  document.getElementById("foodCalories").value = "";

  renderNutritionLogs();
}

function renderNutritionLogs() {
  const list = document.getElementById("nutritionList");
  const logs = getLogs("nutrition");

  list.innerHTML = "";

  logs.slice().reverse().forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.item} — ${entry.calories} cal — ${new Date(entry.time).toLocaleDateString()}`;
    list.appendChild(li);
  });
}

function goBack() {
  window.location.href = "dashboard.html";
}
