const API_BASE = "http://localhost:5001/api"; // ❌ Replace if backend port/path different

const registerForm = document.getElementById("registerForm");
const registerBtn = document.getElementById("registerBtn");
const registerMsg = document.getElementById("registerMsg");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const terms = document.getElementById("terms").checked;

  if (!terms) {
    registerMsg.style.color = "#d9534f";
    registerMsg.innerText = "You must agree to terms";
    return;
  }

  registerBtn.disabled = true;
  registerMsg.style.color = "#333";
  registerMsg.innerText = "Registering...";

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }) // ❌ Match backend schema
    });

    const data = await res.json();

    if (res.ok) {
      registerMsg.style.color = "green";
      registerMsg.innerText = "Registration successful! Redirecting to login...";
      setTimeout(() => { window.location.href = "login.html"; }, 1500);
    } else {
      registerMsg.style.color = "#d9534f";
      registerMsg.innerText = data.message || "Registration failed";
    }

  } catch (err) {
    registerMsg.style.color = "#d9534f";
    registerMsg.innerText = "Server error. Please try again.";
    console.error(err);
  } finally {
    registerBtn.disabled = false;
  }
});
