// Smooth scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70; // adjust if header has height
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Side navigation menu toggle
function openMenu() {
    const sideNav = document.getElementById("sideNav");
    sideNav.classList.add("active");

    // delay so click that opened menu doesn't instantly close it
    setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
    }, 0);
}

function closeMenu() {
    const sideNav = document.getElementById("sideNav");
    sideNav.classList.remove("active");

    document.removeEventListener("click", handleOutsideClick);
}

function handleOutsideClick(e) {
    const sideNav = document.getElementById("sideNav");

    // if click is NOT inside sideNav → close
    if (!sideNav.contains(e.target)) {
        closeMenu();
    }
}

// background grid and dots animation

const canvas = document.getElementById("bgDots");
const ctx = canvas.getContext("2d");

let dots = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createDots();
}

function createDots() {
    dots = [];
    const count = Math.floor((canvas.width * canvas.height) / 16000);

    for (let i = 0; i < count; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: Math.random() * 1.5 + 0.5
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(dot => {
        // Floating motion
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        // Mouse interaction
        let glow = 0;
        if (mouse.x !== null) {
            const dx = mouse.x - dot.x;
            const dy = mouse.y - dot.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                glow = (120 - dist) / 120;
                dot.x -= dx * 0.002;
                dot.y -= dy * 0.002;
            }
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.3 + glow})`;
        ctx.shadowBlur = glow * 14;
        ctx.shadowColor = "rgba(120,255,200,0.9)";
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    requestAnimationFrame(animate);
}

/* Mouse tracking */
window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

/* Resize */
window.addEventListener("resize", resizeCanvas);

/* Init */
resizeCanvas();
animate();

// background floating code symbols animation

/* ===============================
   SYMBOL CONFIG
================================ */

const SYMBOLS = [
    { html: '<i class="fa-brands fa-html5"></i>', glow: 'glow-html' },
    { html: '<i class="fa-brands fa-css3-alt"></i>', glow: 'glow-css' },
    { html: '<i class="fa-brands fa-js"></i>', glow: 'glow-js' },
    { html: '<i class="fa-brands fa-react"></i>', glow: 'glow-react' },
    { html: '<i class="fa-brands fa-node-js"></i>', glow: 'glow-node' },
    { html: '<i class="fa-brands fa-python"></i>', glow: 'glow-python' },
    { html: '<i class="fa-brands fa-github"></i>', glow: 'glow-github' }
];

const SYMBOL_COUNT = 12;
const CHANGE_INTERVAL = 5000;
const MOUSE_RADIUS = 180;

let symbolElements = [];

/* ===============================
   CREATE SYMBOLS
================================ */

function createSymbols() {
    symbolElements.forEach(el => el.remove());
    symbolElements = [];

    for (let i = 0; i < SYMBOL_COUNT; i++) {
        const item = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

        const el = document.createElement("div");
        el.className = `code-bg dynamic ${item.glow}`;
        el.innerHTML = item.html;

        el.style.top = Math.random() * 90 + "%";
        el.style.left = Math.random() * 90 + "%";
        el.style.fontSize = (60 + Math.random() * 80) + "px";
        el.style.animationDuration = (18 + Math.random() * 20) + "s";

        document.body.appendChild(el);
        symbolElements.push(el);
    }
}

/* ===============================
   CHANGE ICON (NO AUTO GLOW)
================================ */

function rotateSymbols() {
    symbolElements.forEach(el => {
        const item = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        el.className = `code-bg dynamic ${item.glow}`;
        el.innerHTML = item.html;
    });
}

/* ===============================
   MOUSE PROXIMITY DETECTION
================================ */

document.addEventListener("mousemove", e => {
    symbolElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

        if (dist < MOUSE_RADIUS) {
            el.classList.add("mouse-near");
        } else {
            el.classList.remove("mouse-near");
        }
    });
});

/* ===============================
   INIT
================================ */

createSymbols();
setInterval(rotateSymbols, CHANGE_INTERVAL);

window.addEventListener("resize", () => {
    clearTimeout(window.__symbolResize);
    window.__symbolResize = setTimeout(createSymbols, 300);
});