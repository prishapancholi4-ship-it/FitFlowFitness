function initBlogAdmin() {
  protectAdminPage();
  renderAdminBlog();
}

function renderAdminBlog() {
  const list = document.getElementById("adminBlogList");
  list.innerHTML = "";

  const users = loadUsers();
  let allPosts = [];

  // Collect all posts from all users
  users.forEach(u => {
    if (u.blogPosts) {
      allPosts = allPosts.concat(
        u.blogPosts.map(p => ({ ...p, author: u.username }))
      );
    }
  });

  // Sort newest first
  allPosts.sort((a, b) => new Date(b.time) - new Date(a.time));

  // Render each post
  allPosts.forEach(post => {
    const li = document.createElement("li");

    let html = `
      <strong>${post.author}</strong><br>
      ${post.text}<br>
      <span class="subtext">${new Date(post.time).toLocaleString()}</span><br>
      <button onclick="deletePost('${post.author}', '${post.id}')">Delete Post</button>
      <br><br>
    `;

    // Render comments if any
    if (post.comments && post.comments.length > 0) {
      html += `<strong>Comments:</strong><br>`;

      post.comments.forEach(c => {
        html += `
          <div class="comment-admin">
            <strong>${c.author}</strong>: ${c.text}
            <br><span class="subtext">${new Date(c.time).toLocaleString()}</span>
            <button onclick="deleteComment('${post.author}', '${post.id}', '${c.id}')">Delete</button>
          </div>
        `;
      });
    }

    li.innerHTML = html;
    list.appendChild(li);
  });
}

function deletePost(author, id) {
  const user = findUser(author);
  if (!user || !user.blogPosts) return;

  user.blogPosts = user.blogPosts.filter(p => p.id !== id);
  updateUser(user);

  renderAdminBlog();
}

function deleteComment(author, postId, commentId) {
  const user = findUser(author);
  if (!user || !user.blogPosts) return;

  const post = user.blogPosts.find(p => p.id === postId);
  if (!post || !post.comments) return;

  post.comments = post.comments.filter(c => c.id !== commentId);
  updateUser(user);

  renderAdminBlog();
}

function goBack() {
  window.location.href = "admin.html";
}
