// blog.js — global blog with admin-only posting & deletion

const BLOG_POSTS_KEY = "fitflowBlogPosts";

function loadBlogPosts() {
  try {
    const raw = localStorage.getItem(BLOG_POSTS_KEY);
    const posts = raw ? JSON.parse(raw) : [];
    return Array.isArray(posts) ? posts : [];
  } catch (e) {
    return [];
  }
}

function saveBlogPosts(posts) {
  localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts || []));
}

function getCurrentUsernameSafe() {
  const user = getCurrentUser();
  return user ? user.username : "Unknown";
}

/* =============================
   INIT
   ============================= */

function initBlog() {
  // Require login
  if (typeof protectUserPage === "function") {
    protectUserPage();
  }

  // Show/hide admin-only floating button
  const newPostBtn = document.getElementById("newPostBtn");
  if (newPostBtn) {
    if (typeof isAdminUser === "function" && isAdminUser()) {
      newPostBtn.style.display = "flex";
    } else {
      newPostBtn.style.display = "none";
    }
  }

  renderBlogPosts();
}

/* =============================
   RENDER
   ============================= */

function renderBlogPosts() {
  const list = document.getElementById("blogList");
  if (!list) return;

  const posts = loadBlogPosts();
  list.innerHTML = "";

  if (!posts.length) {
    const li = document.createElement("li");
    li.className = "blog-empty";
    li.textContent = "No posts yet.";
    list.appendChild(li);
    return;
  }

  const admin = typeof isAdminUser === "function" && isAdminUser();

  posts.forEach(post => {
    const li = document.createElement("li");
    li.className = "blog-post-card";

    const date = new Date(post.date);

    let commentsHtml = "";
    (post.comments || []).forEach(comment => {
      const cDate = new Date(comment.date);
      commentsHtml += `
        <div class="blog-comment">
          <div class="blog-comment-meta">
            <span>${comment.author}</span> • 
            <span>${cDate.toLocaleString()}</span>
          </div>
          <div class="blog-comment-text">${comment.text}</div>
          ${
            admin
              ? `<button class="comment-delete-btn" data-post-id="${post.id}" data-comment-id="${comment.id}">Delete</button>`
              : ""
          }
        </div>
      `;
    });

    li.innerHTML = `
      <article>
        <div class="blog-post-header">
          <div class="blog-post-meta">
            <span class="blog-author">${post.author}</span> • 
            <span class="blog-date">
              ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          ${
            admin
              ? `<button class="post-delete-btn" data-post-id="${post.id}">Delete</button>`
              : ""
          }
        </div>
        <div class="blog-post-content">
          ${post.text.replace(/\n/g, "<br>")}
        </div>

        <div class="blog-comments">
          <h3>Comments</h3>
          ${commentsHtml || `<p class="subtext">No comments yet.</p>`}
          <div class="blog-comment-form">
            <textarea class="comment-input" data-post-id="${post.id}" placeholder="Leave a comment..."></textarea>
            <button class="comment-submit-btn" data-post-id="${post.id}">Comment</button>
          </div>
        </div>
      </article>
    `;

    list.appendChild(li);
  });

  wireBlogInteractions();
}

/* =============================
   INTERACTIONS
   ============================= */

function wireBlogInteractions() {
  const list = document.getElementById("blogList");
  if (!list) return;

  // Comment submit
  list.querySelectorAll(".comment-submit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      const textarea = list.querySelector(`.comment-input[data-post-id="${postId}"]`);
      if (!textarea) return;

      const text = textarea.value.trim();
      if (!text) return;

      addComment(postId, text);
      textarea.value = "";
    });
  });

  // Admin-only: delete post
  list.querySelectorAll(".post-delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      if (!postId) return;
      if (!confirm("Delete this post?")) return;
      deletePost(postId);
    });
  });

  // Admin-only: delete comment
  list.querySelectorAll(".comment-delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      const commentId = btn.getAttribute("data-comment-id");
      if (!postId || !commentId) return;
      if (!confirm("Delete this comment?")) return;
      deleteComment(postId, commentId);
    });
  });
}

/* =============================
   CREATE POST (ADMIN ONLY)
   ============================= */

function openPostModal() {
  if (!(typeof isAdminUser === "function" && isAdminUser())) return;
  const modal = document.getElementById("postModal");
  if (modal) modal.style.display = "flex";
  const status = document.getElementById("postStatus");
  if (status) status.textContent = "";
}

function closePostModal() {
  const modal = document.getElementById("postModal");
  if (modal) modal.style.display = "none";
}

function createPost() {
  if (!(typeof isAdminUser === "function" && isAdminUser())) return;

  const textarea = document.getElementById("newPostText");
  const status = document.getElementById("postStatus");
  if (!textarea) return;

  const text = textarea.value.trim();
  if (!text) {
    if (status) status.textContent = "Write something before publishing.";
    return;
  }

  const posts = loadBlogPosts();
  const post = {
    id: Date.now().toString(),
    author: getCurrentUsernameSafe(),
    text,
    date: new Date().toISOString(),
    comments: []
  };

  posts.unshift(post);
  saveBlogPosts(posts);

  textarea.value = "";
  if (status) status.textContent = "Post published.";
  setTimeout(closePostModal, 400);

  renderBlogPosts();
}

/* =============================
   COMMENTS
   ============================= */

function addComment(postId, text) {
  const posts = loadBlogPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  if (!Array.isArray(post.comments)) post.comments = [];

  post.comments.push({
    id: Date.now().toString(),
    author: getCurrentUsernameSafe(),
    text,
    date: new Date().toISOString()
  });

  saveBlogPosts(posts);
  renderBlogPosts();
}

/* =============================
   ADMIN DELETE
   ============================= */

function deletePost(postId) {
  if (!(typeof isAdminUser === "function" && isAdminUser())) return;

  let posts = loadBlogPosts();
  posts = posts.filter(p => p.id !== postId);
  saveBlogPosts(posts);

  renderBlogPosts();
}

function deleteComment(postId, commentId) {
  if (!(typeof isAdminUser === "function" && isAdminUser())) return;

  const posts = loadBlogPosts();
  const post = posts.find(p => p.id === postId);
  if (!post || !Array.isArray(post.comments)) return;

  post.comments = post.comments.filter(c => c.id !== commentId);
  saveBlogPosts(posts);

  renderBlogPosts();
}

/* =============================
   NAVIGATION
   ============================= */

function goBack() {
  window.location.href = "dashboard.html";
}
