let challenges = JSON.parse(localStorage.getItem("fitflowChallenges")) || [];

function initAdminChallenges() {
  protectAdminPage();
  renderChallenges();
}

function addChallenge() {
  const name = document.getElementById("challengeName").value.trim();
  const points = parseInt(document.getElementById("challengePoints").value, 10);
  const status = document.getElementById("challengeStatus");

  if (!name || !points) {
    status.textContent = "Enter valid challenge details.";
    return;
  }

  challenges.push({ id: crypto.randomUUID(), name, points });
  localStorage.setItem("fitflowChallenges", JSON.stringify(challenges));

  status.textContent = "Challenge added.";
  document.getElementById("challengeName").value = "";
  document.getElementById("challengePoints").value = "";

  renderChallenges();
}

function renderChallenges() {
  const list = document.getElementById("challengeList");
  list.innerHTML = "";

  challenges.forEach(ch => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${ch.name}</strong> — ${ch.points} pts
      <button onclick="deleteChallenge('${ch.id}')">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteChallenge(id) {
  challenges = challenges.filter(c => c.id !== id);
  localStorage.setItem("fitflowChallenges", JSON.stringify(challenges));
  renderChallenges();
}

function goBack() {
  window.location.href = "admin.html";
}
