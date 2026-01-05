function initBadges() {
  protectUserPage();
  renderBadges();
}

function renderBadges() {
  const grid = document.getElementById("badgeGrid");
  grid.innerHTML = "";

  const user = getCurrentUserObject();
  if (!user.badges) user.badges = [];

  // If user owns no badges
  if (user.badges.length === 0) {
    grid.innerHTML = "<p class='subtext'>You don't own any badges yet.</p>";
    return;
  }

  // Render each owned badge
  user.badges.forEach(name => {
    const icon = getBadgeIcon(name);

    const div = document.createElement("div");
    div.className = "badge-item";

    div.innerHTML = `
      <div class="badge-icon">${icon}</div>
      <div class="badge-name">${name}</div>
    `;

    grid.appendChild(div);
  });
}

function goBack() {
  window.location.href = "dashboard.html";
}
