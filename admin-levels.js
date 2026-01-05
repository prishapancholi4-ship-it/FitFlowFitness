let levels = JSON.parse(localStorage.getItem("fitflowLevels")) || [];

function initAdminLevels() {
  protectAdminPage();
  renderLevels();
}

function addLevel() {
  const number = parseInt(document.getElementById("levelNumber").value, 10);
  const points = parseInt(document.getElementById("levelPoints").value, 10);
  const status = document.getElementById("levelStatus");

  if (!number || !points) {
    status.textContent = "Enter valid level details.";
    return;
  }

  levels.push({ number, points });
  levels.sort((a, b) => a.number - b.number);
  localStorage.setItem("fitflowLevels", JSON.stringify(levels));

  status.textContent = "Level added.";
  document.getElementById("levelNumber").value = "";
  document.getElementById("levelPoints").value = "";

  renderLevels();
}

function renderLevels() {
  const list = document.getElementById("levelList");
  list.innerHTML = "";

  levels.forEach(lv => {
    const li = document.createElement("li");
    li.innerHTML = `
      Level ${lv.number} — ${lv.points} pts
      <button onclick="deleteLevel(${lv.number})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteLevel(number) {
  levels = levels.filter(l => l.number !== number);
  localStorage.setItem("fitflowLevels", JSON.stringify(levels));
  renderLevels();
}

function goBack() {
  window.location.href = "admin.html";
}
