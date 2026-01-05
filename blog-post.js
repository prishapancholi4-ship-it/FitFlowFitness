let currentPost = null;
let currentAuthor = null;

function initPost() {
  protectUserPage();

  currentAuthor = localStorage.getItem("fitflowCurrentPostAuthor");
  const id = localStorage.getItem("fitflowCurrentPostId");

  const user = findUser(currentAuthor);
  if (!user || !user.blogPosts) return;

  currentPost = user.blogPosts.find(p => p.id === id);
  if (!currentPost) return;

  document.getElementById("postAuthor").textContent = `By ${currentPost.author}`;
  document.getElementById("postText").textContent = currentPost.text;
  document.getElementById("postTime").textContent = new Date(currentPost.time).toLocaleString();

  if (!currentPost.comments) currentPost.comments = [];
  renderComments();
}

function renderComments() {
  const list = document.getElementById("commentList");
  list.innerHTML = "";

  currentPost.comments.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${c.author}</strong>: ${c.text}
      <br><span class="subtext">${new Date(c.time).toLocaleString()}</span>
    `;
    list.appendChild(li);
  });
}

function addComment() {
  const text = document.getElementById("commentInput").value.trim();
  const status = document.getElementById("commentStatus");

  if (!text) {
    status.textContent = "Write something first.";
    return;
  }

  const user = getCurrentUserObject();

  const comment = {
    id: crypto.randomUUID(),
    author: user.username,
    text,
    time: new Date().toISOString()
  };

  currentPost.comments.push(comment);

  const authorUser = findUser(currentAuthor);
  updateUser(authorUser);

  document.getElementById("commentInput").value = "";
  status.textContent = "Comment posted!";
  renderComments();
}

function goBack() {
  window.location.href = "blog.html";
}
