function initShop() {
  protectUserPage();
  renderShop();
}

function renderShop() {
  const list = document.getElementById("shopList");
  list.innerHTML = "";

  const user = getCurrentUserObject();
  if (!user.badges) user.badges = [];

  ALL_BADGES.forEach(name => {
    const owned = user.badges.includes(name);
    const icon = getBadgeIcon(name);

    const div = document.createElement("div");
    div.className = "badge-item";

    div.innerHTML = `
      <div class="badge-icon">${icon}</div>
      <div class="badge-name">${name}</div>
      ${owned ? "<span class='subtext'>Owned</span>" : "50 points"}
      <br>
      ${owned ? "" : `<button onclick="buyBadge('${name}')">Buy</button>`}
    `;

    list.appendChild(div);
  });
}

function buyBadge(name) {
  const user = getCurrentUserObject();
  if (!user.badges) user.badges = [];

  if (user.points < 50) {
    alert("Not enough points!");
    return;
  }

  user.points -= 50;
  user.badges.push(name);

  updateUser(user);
  renderShop();
}

function goBack() {
  window.location.href = "dashboard.html";
}
