console.log("FAQ JS loaded");

// H1 words automatically change effect
document.addEventListener("DOMContentLoaded", () => {
    const words = [
        "Website & App",
        "SaaS Platform",
        "Startup",
        "Web App",
        "Mobile App"
    ];

    const textEl = document.getElementById("typing-text");
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let started = false;

    function typeEffect() {
        const currentWord = words[wordIndex];

        if (!isDeleting) {
            textEl.textContent = currentWord.slice(0, charIndex++);
            if (charIndex > currentWord.length) {
                setTimeout(() => isDeleting = true, 1200);
            }
        } else {
            textEl.textContent = currentWord.slice(0, charIndex--);
            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }

        setTimeout(typeEffect, isDeleting ? 60 : 90);
    }

    // 🔥 Scroll Trigger (Cursor AI style)
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                typeEffect();
            }
        });
    }, { threshold: 0.6 });

    observer.observe(document.querySelector(".hero-title"));
});

// pricing-calculator
function calculate() {
    const pages = document.getElementById('pages').value;
    const base = document.getElementById('projectType').value;
    const tech = document.getElementById('tech').value;

    const price = pages * base * tech;
    document.getElementById('price').innerText = price;
    return price;
}

document.querySelectorAll('#pages, #projectType, #tech')
    .forEach(el => el.addEventListener('input', calculate));

calculate();

function openOrder() {
    const p = calculate();
    document.getElementById('finalPrice').innerText = p;
    document.getElementById('orderModal').classList.add('active');
}

function closeOrder() {
    document.getElementById('orderModal').classList.remove('active');
}

// FAQ JS 
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-q");
    const answer = item.querySelector(".faq-a");

    // Reset on load
    answer.style.maxHeight = null;

    question.addEventListener("click", (e) => {
        e.stopPropagation(); // VERY IMPORTANT

        // Close all other FAQs
        faqItems.forEach(other => {
            if (other !== item) {
                other.classList.remove("active");
                other.querySelector(".faq-a").style.maxHeight = null;
            }
        });

        // Toggle current
        const isOpen = item.classList.contains("active");

        item.classList.toggle("active");

        if (!isOpen) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = null;
        }
    });
});

