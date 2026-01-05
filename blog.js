function initBlog() {
  protectUserPage();
  renderBlogFeed();

  // Admin-only floating button
  const btn = document.getElementById("newPostBtn");
  if (btn) btn.style.display = isAdmin() ? "block" : "none";
}

function renderBlogFeed() {
  const list = document.getElementById("blogList");
  list.innerHTML = "";

  const users = loadUsers();
  let allPosts = [];

  users.forEach(u => {
    if (u.blogPosts) {
      allPosts = allPosts.concat(
        u.blogPosts.map(p => ({ ...p, author: u.username }))
      );
    }
  });

  allPosts
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .forEach(post => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${post.author}</strong><br>
        ${post.text}<br>
        <span class="subtext">${new Date(post.time).toLocaleString()}</span><br>
        <button onclick="openPost('${post.author}', '${post.id}')">Open</button>
      `;
      list.appendChild(li);
    });
}

// ----------------------
// ADMIN POST CREATION
// ----------------------

function openPostModal() {
  document.getElementById("postModal").style.display = "flex";
}

function closePostModal() {
  document.getElementById("postModal").style.display = "none";
}

function createPost() {
  const text = document.getElementById("newPostText").value.trim();
  const status = document.getElementById("postStatus");

  if (!text) {
    status.textContent = "Write something first.";
    return;
  }

  const user = getCurrentUserObject();
  if (!user) return;

  const post = {
    id: crypto.randomUUID(),
    author: user.username,
    text,
    time: new Date().toISOString(),
    comments: []
  };

  const posts = user.blogPosts || [];
  posts.unshift(post);
  saveBlogPosts(posts);

  status.textContent = "Post published!";
  document.getElementById("newPostText").value = "";

  renderBlogFeed();
  closePostModal();
}

function openPost(author, id) {
  localStorage.setItem("fitflowCurrentPostAuthor", author);
  localStorage.setItem("fitflowCurrentPostId", id);
  window.location.href = "blog-post.html";
}

function goBack() {
  window.location.href = "dashboard.html";
}
