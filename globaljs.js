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
