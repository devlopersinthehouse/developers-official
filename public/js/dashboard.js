const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

// Fetch posts
async function fetchPosts() {
  const res = await fetch("/api/posts", {
    headers: { "Authorization": token }
  });
  const data = await res.json();

  const postsList = document.getElementById("postsList");
  postsList.innerHTML = "";
  data.forEach(post => {
    const li = document.createElement("li");
    li.textContent = `${post.title}: ${post.content}`;
    postsList.appendChild(li);
  });
}

// Add new post
const postForm = document.getElementById("postForm");
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ title, content })
  });

  const data = await res.json();
  alert(data.message);
  fetchPosts();
  postForm.reset();
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// Initial fetch
fetchPosts();
