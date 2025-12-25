const API_BASE = "http://localhost:5001/api"; // ❌ Replaceable if backend PORT or path different
let token = ""; // JWT token after login/register

// Login
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  document.getElementById("login-msg").innerText = data.message || "Login success";
  if (data.token) token = data.token;
}

// Register
async function register() {
  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  document.getElementById("register-msg").innerText = data.message || "Register success";
}

// Create Post
async function createPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  const tags = document.getElementById("post-tags").value.split(",").map(t => t.trim());

  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // ❌ Replaceable if frontend uses JWT differently
    },
    body: JSON.stringify({ title, content, tags })
  });
  const data = await res.json();
  document.getElementById("post-msg").innerText = data.message || "Post created";
  getPosts();
}

// Get All Posts
async function getPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  const posts = await res.json();
  const container = document.getElementById("posts-container");
  container.innerHTML = "";
  posts.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${p.title}</strong><p>${p.content}</p><small>Tags: ${p.tags.join(", ")}</small>`;
    container.appendChild(div);
  });
}

// Make Payment
async function makePayment() {
  const amount = Number(document.getElementById("payment-amount").value);
  const method = document.getElementById("payment-method").value;

  const res = await fetch(`${API_BASE}/payment/create`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // ❌ Replaceable if frontend uses JWT differently
    },
    body: JSON.stringify({ amount, method })
  });
  const data = await res.json();
  document.getElementById("payment-msg").innerText = data.message || "Payment created";
}
