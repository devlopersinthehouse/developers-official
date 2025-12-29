// Tab switch
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('loginForm').style.display = tab.dataset.form === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = tab.dataset.form === 'register' ? 'block' : 'none';
    document.getElementById('forgotForm').style.display = 'none';
    clearMessages();
  });
});

// Links
document.getElementById('toRegister').addEventListener('click', () => document.querySelector('.tab[data-form="register"]').click());
document.getElementById('toLogin').addEventListener('click', () => document.querySelector('.tab[data-form="login"]').click());
document.getElementById('forgotLink').addEventListener('click', () => {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('forgotForm').style.display = 'block';
});
document.getElementById('backToLoginLink').addEventListener('click', () => {
  document.getElementById('forgotForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
});

// Password toggle
document.querySelectorAll('.show-pass').forEach(icon => {
  icon.addEventListener('click', () => {
    const target = document.getElementById(icon.dataset.target);
    target.type = target.type === 'password' ? 'text' : 'password';
  });
});

// Messages
function showMessage(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = `message ${type}`;
}

function clearMessages() {
  ['loginMessage', 'registerMessage', 'forgotMessage'].forEach(id => {
    document.getElementById(id).textContent = '';
    document.getElementById(id).className = 'message';
  });
}

// Login
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const loader = document.getElementById('loginLoader');
  loader.style.display = 'block';
  clearMessages();

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    loader.style.display = 'none';

    if (res.ok) {
      showMessage('loginMessage', 'Login successful! Redirecting to dashboard...', 'success');
      setTimeout(() => window.location.href = '/', 1500);
    } else {
      const data = await res.json();
      let msg = data.message || 'Invalid credentials';
      if (msg.includes('verify')) {
        msg = 'Please verify your email first. Check your inbox (and spam folder) for the verification link.';
      }
      showMessage('loginMessage', msg, 'error');
    }
  } catch (err) {
    loader.style.display = 'none';
    showMessage('loginMessage', 'Network error. Please try again.', 'error');
  }
});

// Register
document.getElementById('registerBtn').addEventListener('click', async () => {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const loader = document.getElementById('regLoader');
  loader.style.display = 'block';
  clearMessages();

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    loader.style.display = 'none';

    if (res.ok) {
      showMessage('registerMessage', 'Account created successfully! Please check your email for the verification link. You can login after verification.', 'success');
      // Redirect mat karo – user ko message dikhao
    } else {
      showMessage('registerMessage', data.message || 'Registration failed. Try again.', 'error');
    }
  } catch (err) {
    loader.style.display = 'none';
    showMessage('registerMessage', 'Network error. Please try again.', 'error');
  }
});

// Forgot Password
document.getElementById('forgotBtn').addEventListener('click', async () => {
  const email = document.getElementById('forgotEmail').value.trim();
  const loader = document.getElementById('forgotLoader');
  loader.style.display = 'block';
  clearMessages();

  if (!email) {
    loader.style.display = 'none';
    showMessage('forgotMessage', 'Please enter your email', 'error');
    return;
  }

  try {
    const res = await fetch('/api/auth/forgot', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    loader.style.display = 'none';

    showMessage('forgotMessage', data.message, res.ok ? 'success' : 'error');
  } catch (err) {
    loader.style.display = 'none';
    showMessage('forgotMessage', 'Network error. Please try again.', 'error');
  }
});