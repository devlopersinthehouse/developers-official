/* =========================
   GLOBAL AUTH STATE
========================= */
let currentUser = null;
let isLoggedIn = false;

/* =========================
   CHECK AUTH ON PAGE LOAD
========================= */
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
});

/* =========================
   CHECK IF USER IS LOGGED IN
========================= */
async function checkAuth() {
    try {
        const res = await fetch('/api/auth/profile', {
            credentials: 'include'
        });

        if (res.ok) {
            currentUser = await res.json();
            isLoggedIn = true;
            renderAuthSection();
        } else {
            isLoggedIn = false;
            renderAuthSection();
        }
    } catch (err) {
        console.error('Auth check error:', err);
        isLoggedIn = false;
        renderAuthSection();
    }
}

/* =========================
   RENDER AUTH SECTION (DESKTOP)
========================= */
function renderAuthSection() {
    const authSection = document.getElementById('authSection');
    const mobileAuthSection = document.getElementById('mobileAuthSection');

    if (isLoggedIn && currentUser) {
        const firstLetter = currentUser.name.charAt(0).toUpperCase();

        // Desktop
        authSection.innerHTML = `
            <div class="profile-wrapper">
                <div class="profile-circle" id="profileCircle">${firstLetter}</div>
                <div class="profile-dropdown" id="profileDropdown">
                    <div class="profile-info">
                        <p class="profile-name">${currentUser.name}</p>
                        <p class="profile-email">${currentUser.email}</p>
                    </div>
                    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:10px 0;">
                    <button class="dropdown-btn" onclick="handleLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i> Logout
                    </button>
                </div>
            </div>
        `;

        // Mobile
        mobileAuthSection.innerHTML = `
            <div style="padding:15px;border-top:1px solid rgba(255,255,255,0.1);">
                <p style="color:#fff;margin-bottom:10px;">Hello, ${currentUser.name}!</p>
                <button class="login-btn show" onclick="handleLogout()" style="width:100%;">
                    Logout
                </button>
            </div>
        `;

        // Add click event for profile dropdown
        const profileCircle = document.getElementById('profileCircle');
        if (profileCircle) {
            profileCircle.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('profileDropdown').classList.toggle('show');
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('profileDropdown');
            const circle = document.getElementById('profileCircle');
            if (dropdown && !dropdown.contains(e.target) && circle && !circle.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

    } else {
        // Desktop
        authSection.innerHTML = `<a href="login.html" class="login-btn">Log In</a>`;
        
        // Mobile
        mobileAuthSection.innerHTML = `<a href="login.html" class="login-btn show">Log In</a>`;
    }
}

/* =========================
   LOGOUT WITH CONFIRMATION
========================= */
async function handleLogout() {
    const confirmed = confirm('Are you sure you want to logout?');
    
    if (!confirmed) return;

    try {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (res.ok) {
            currentUser = null;
            isLoggedIn = false;
            renderAuthSection();
            
            // Show success message
            showToast('Logged out successfully!', 'success');
            
            // Reload after short delay
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showToast('Logout failed. Please try again.', 'error');
        }
    } catch (err) {
        console.error('Logout error:', err);
        showToast('Network error. Please try again.', 'error');
    }
}

/* =========================
   ORDER MODAL PROTECTION
========================= */
function openOrder() {
    if (!isLoggedIn) {
        showToast('Please login or register to place an order', 'error');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1500);
        return;
    }

    const price = calculate(); // This function is in indexjs.js
    document.getElementById('finalPrice').innerText = price;
    document.getElementById('orderModal').classList.add('active');

    // Pre-fill user data
    if (currentUser) {
        document.getElementById('orderName').value = currentUser.name;
        document.getElementById('orderEmail').value = currentUser.email;
    }
}

function closeOrder() {
    document.getElementById('orderModal').classList.remove('active');
    
    // Clear form
    document.getElementById('orderName').value = '';
    document.getElementById('orderEmail').value = '';
    document.getElementById('orderDetails').value = '';
    
    const messageEl = document.getElementById('orderMessage');
    if (messageEl) {
        messageEl.innerHTML = '';
    }
}

/* =========================
   SUBMIT ORDER
========================= */
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitOrderBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitOrder);
    }
});

async function submitOrder() {
    if (!isLoggedIn) {
        showToast('Please login first', 'error');
        closeOrder();
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
        return;
    }

    const name = document.getElementById('orderName').value.trim();
    const email = document.getElementById('orderEmail').value.trim();
    const details = document.getElementById('orderDetails').value.trim();
    const price = document.getElementById('finalPrice').innerText;

    const messageEl = document.getElementById('orderMessage');

    // Validation
    if (!name || !email || !details) {
        messageEl.innerHTML = '<p style="color:#f87171;">Please fill in all fields</p>';
        return;
    }

    const submitBtn = document.getElementById('submitOrderBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        // For now, just show success (you can add backend endpoint later)
        setTimeout(() => {
            messageEl.innerHTML = '<p style="color:#4ade80;">Order submitted successfully! We will contact you soon.</p>';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Order';

            // Clear form after 2 seconds
            setTimeout(() => {
                closeOrder();
                showToast('Order placed successfully!', 'success');
            }, 2000);
        }, 1000);

        // TODO: Add backend endpoint for orders
        /*
        const orderData = {
            name,
            email,
            details,
            estimatedPrice: price,
            userId: currentUser._id || currentUser.id
        };

        const res = await fetch('/api/orders', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const data = await res.json();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Order';

        if (res.ok) {
            messageEl.innerHTML = '<p style="color:#4ade80;">Order submitted successfully!</p>';
            setTimeout(() => {
                closeOrder();
                showToast('Order placed successfully!', 'success');
            }, 2000);
        } else {
            messageEl.innerHTML = `<p style="color:#f87171;">${data.message || 'Order failed'}</p>`;
        }
        */

    } catch (err) {
        console.error('Order submission error:', err);
        messageEl.innerHTML = '<p style="color:#f87171;">Network error. Please try again.</p>';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Order';
    }
}

/* =========================
   TOAST NOTIFICATION
========================= */
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.getElementById('customToast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'customToast';
    toast.className = `custom-toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}