function initWorkouts() {
  protectUserPage();
  renderWorkoutLogs();
}

function addWorkout() {
  const type = document.getElementById("workoutType").value.trim();
  const duration = parseInt(document.getElementById("workoutDuration").value.trim(), 10);
  const status = document.getElementById("workoutStatus");

  if (!type || !duration || duration <= 0) {
    status.textContent = "Enter valid workout details.";
    return;
  }

  const entry = {
    type,
    duration,
    time: new Date().toISOString()
  };

  logWorkout(entry);
  status.textContent = "Workout logged!";
  document.getElementById("workoutType").value = "";
  document.getElementById("workoutDuration").value = "";

  renderWorkoutLogs();
}

function renderWorkoutLogs() {
  const list = document.getElementById("workoutList");
  const logs = getLogs("workouts");

  list.innerHTML = "";

  logs.slice().reverse().forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.type} — ${entry.duration} min — ${new Date(entry.time).toLocaleDateString()}`;
    list.appendChild(li);
  });
}

function goBack() {
  window.location.href = "dashboard.html";
}
