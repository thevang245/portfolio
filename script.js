// === I. HIỆU ỨNG NỀN CANVAS PARTICLES ===
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 65;
    const mouse = { x: null, y: null, radius: 160 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function initCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    initCanvasSize();
    window.addEventListener('resize', () => {
        initCanvasSize();
        initParticles();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    this.x -= dx * 0.015;
                    this.y -= dy * 0.015;
                }
            }
        }
        draw(color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    function connectParticles(colorLine) {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 130) {
                    let opacity = (1 - (distance / 130)) * 0.15;
                    ctx.strokeStyle = colorLine.replace('OPACITY', opacity);
                    ctx.lineWidth = 0.7;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isDark = document.documentElement.classList.contains('dark');
        const particleColor = isDark ? 'rgba(96, 165, 250, 0.35)' : 'rgba(37, 99, 235, 0.2)';
        const lineColor = isDark ? 'rgba(129, 140, 248, OPACITY)' : 'rgba(37, 99, 235, OPACITY)';

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw(particleColor);
        }
        connectParticles(lineColor);
        requestAnimationFrame(animateBackground);
    }
    animateBackground();
}

// === II. CÁC HIỆU ỨNG GSAP & TYPING (GOM CHUNG VÀO MỘT DOMCONTENTLOADED) ===
window.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Hiệu ứng cho trang chủ (Index) ---
    if (document.getElementById('hero-text')) {
        gsap.to("#hero-text", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            delay: 0.2
        });
        startTyping();
    }

    // --- 2. Hiệu ứng cho trang chi tiết (Project Detail) ---
    if (document.getElementById('detail-header')) {
        gsap.from("#detail-header", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" });
        gsap.from("#detail-meta", { opacity: 0, y: 20, duration: 0.8, delay: 0.2, ease: "power3.out" });
        gsap.from("#detail-content", { opacity: 0, y: 20, duration: 0.8, delay: 0.4, ease: "power3.out" });
        gsap.from("#detail-gallery", { opacity: 0, y: 20, duration: 0.8, delay: 0.6, ease: "power3.out" });
    }

    // --- 3. Kích hoạt ScrollTrigger toàn trang nếu có sử dụng ---
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        if (document.querySelector(".reveal-left")) {
            gsap.from(".reveal-left", {
                scrollTrigger: { trigger: ".reveal-left", start: "top 85%" },
                opacity: 0, x: -40, duration: 0.8
            });
        }

        if (document.querySelector(".reveal-right")) {
            gsap.from(".reveal-right", {
                scrollTrigger: { trigger: ".reveal-right", start: "top 85%" },
                opacity: 0, x: 40, duration: 0.8
            });
        }

        document.querySelectorAll(".project-card").forEach((card) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 0, y: 40, duration: 0.7
            });
        });

        if (document.getElementById("contact")) {
            gsap.from(".contact-content", {
                scrollTrigger: { trigger: "#contact", start: "top 85%" },
                opacity: 0, y: 25, duration: 0.7
            });
        }
    }
});

// === LOGIC HIỆU ỨNG CHỮ CHẠY (TYPING EFFECT) ===
const words = ["nhà thất nghiệp học.", "Developer.", "UI/UX Designer."];
let i = 0, timer;

function typingEffect() {
    const typingEl = document.getElementById('typing');
    if (!typingEl) return;
    
    let word = words[i].split("");
    var loopTyping = function () {
        if (word.length > 0) {
            typingEl.innerHTML += word.shift();
        } else {
            setTimeout(deletingEffect, 2000);
            return false;
        }
        timer = setTimeout(loopTyping, 100);
    };
    loopTyping();
}

function deletingEffect() {
    const typingEl = document.getElementById('typing');
    if (!typingEl) return;

    let word = words[i].split("");
    var loopDeleting = function () {
        if (word.length > 0) {
            word.pop();
            typingEl.innerHTML = word.join("");
        } else {
            if (words.length > (i + 1)) i++;
            else i = 0;
            setTimeout(typingEffect, 500);
            return false;
        }
        timer = setTimeout(loopDeleting, 50);
    };
    loopDeleting();
}
function startTyping() { setTimeout(typingEffect, 1000); }


// === III. XỬ LÝ DARK MODE ĐỒNG BỘ (ĐÃ RÚT GỌN & KHÔNG TRÙNG LẶP) ===
const toggleBtn = document.getElementById('theme-toggle');

function applyTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        if (toggleBtn) toggleBtn.innerHTML = '☀️';
    } else {
        document.documentElement.classList.remove('dark');
        if (toggleBtn) toggleBtn.innerHTML = '🌙';
    }
}

applyTheme();

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            toggleBtn.innerHTML = '🌙';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            toggleBtn.innerHTML = '☀️';
        }
    });
}

const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {

        const isOpen = mobileMenu.classList.contains("h-auto");

        if (isOpen) {
            mobileMenu.classList.remove(
                "h-auto",
                "opacity-100",
                "pointer-events-auto",
                "py-4"
            );

            mobileMenu.classList.add(
                "h-0",
                "opacity-0",
                "pointer-events-none",
                "py-0"
            );

        } else {
            mobileMenu.classList.remove(
                "h-0",
                "opacity-0",
                "pointer-events-none",
                "py-0"
            );

            mobileMenu.classList.add(
                "h-auto",
                "opacity-100",
                "pointer-events-auto",
                "py-4"
            );
        }
    });
}
const mobileLinks = document.querySelectorAll(".mobile-nav-link");

mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove(
            "h-auto",
            "opacity-100",
            "pointer-events-auto",
            "py-4"
        );

        mobileMenu.classList.add(
            "h-0",
            "opacity-0",
            "pointer-events-none",
            "py-0"
        );
    });
});