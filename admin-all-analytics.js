function initGlobalAnalytics() {
  protectAdminPage();

  const users = loadUsers();
  if (!users.length) return;

  // Totals
  document.getElementById("totalUsers").textContent = users.length;

  const totalPoints = users.reduce((sum, u) => sum + (u.points || 0), 0);
  document.getElementById("totalPoints").textContent = totalPoints;

  const avgStreak =
    users.reduce((sum, u) => sum + (u.streak || 0), 0) / users.length;
  document.getElementById("avgStreak").textContent = avgStreak.toFixed(1);

  // Total logs across all users
  let totalLogs = 0;
  users.forEach(u => {
    if (u.logs) {
      totalLogs +=
        (u.logs.water?.length || 0) +
        (u.logs.sleep?.length || 0) +
        (u.logs.workouts?.length || 0) +
        (u.logs.nutrition?.length || 0) +
        (u.logs.journal?.length || 0);
    }
  });
  document.getElementById("totalLogs").textContent = totalLogs;

  // Leaderboard (sorted by points)
  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";

  const sorted = [...users].sort((a, b) => b.points - a.points);

  sorted.forEach(u => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${u.username}</strong> — ${u.points} pts
    `;
    leaderboard.appendChild(li);
  });

  // Activity insights
  const mostActiveUser = sorted[0];
  const leastActiveUser = sorted[sorted.length - 1];

  document.getElementById("mostActive").textContent = mostActiveUser.username;
  document.getElementById("leastActive").textContent = leastActiveUser.username;
}

function goBack() {
  window.location.href = "admin.html";
}
