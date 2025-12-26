const API_BASE = "http://localhost:5001/api"; // ❌ Replace if backend port/path different
let token = "";

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  loginBtn.disabled = true;
  loginMsg.style.color = "#333";
  loginMsg.innerText = "Logging in...";

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }) // ❌ Replace field names if backend different
    });

    const data = await res.json();

    if (res.ok) {
      token = data.token;
      loginMsg.style.color = "green";
      loginMsg.innerText = "Login successful! Redirecting...";
      console.log("JWT Token:", token); // ❌ Optional

      // Example: store token in localStorage if rememberMe
      if (rememberMe) localStorage.setItem("jwtToken", token);

      // Redirect after 1.5s (example)
      setTimeout(() => { window.location.href = "index.html"; }, 1500);

    } else {
      loginMsg.style.color = "#d9534f";
      loginMsg.innerText = data.message || "Invalid email or password";
    }

  } catch (err) {
    loginMsg.style.color = "#d9534f";
    loginMsg.innerText = "Server error. Please try again.";
    console.error(err);
  } finally {
    loginBtn.disabled = false;
  }
});
