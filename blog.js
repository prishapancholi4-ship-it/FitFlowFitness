function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("sidebarOverlay").classList.toggle("active");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarOverlay").classList.remove("active");
}

/* Comments */
function addComment() {
  const input = document.getElementById("commentInput");
  const text = input.value.trim();
  if (!text) return;

  const list = document.getElementById("commentsList");
  const div = document.createElement("div");
  div.className = "comment";
  div.textContent = text;

  list.appendChild(div);
  input.value = "";
}
