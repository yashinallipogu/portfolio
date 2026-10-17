const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const contactEmail = "hello@example.com"; // Replace this with your email address.

document.documentElement.classList.add("has-js");

// The site starts in beige and white. Remember the visitor's choice for next time.
let savedTheme;
try { savedTheme = window.localStorage.getItem("portfolio-neutral-theme"); } catch {}
if (savedTheme === "light" || savedTheme === "dark") {
  document.documentElement.dataset.theme = savedTheme;
}

function updateThemeButton() {
  const isDark = document.documentElement.dataset.theme !== "light";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";
  themeToggle.setAttribute("aria-label", label);
  themeToggle.setAttribute("title", label);
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "☼" : "☾";
  document.querySelector('meta[name="theme-color"]').content = isDark ? "#29241f" : "#f7f2e9";
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  try { window.localStorage.setItem("portfolio-neutral-theme", nextTheme); } catch {}
  updateThemeButton();
});

// Keep the small-screen menu usable with a keyboard, too.
function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
  navLinks.classList.toggle("is-open", isOpen);
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

// Fade sections in only as they approach the viewport.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -28px 0px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Subtle card tilt is limited to mouse pointers to avoid fighting touch scrolling.
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || reduceMotion.matches) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.transform = `perspective(850px) translateY(-3px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

// A static site cannot send a message itself; use the visitor's email app.
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const details = new FormData(contactForm);
  const subject = encodeURIComponent(`A little hello from ${details.get("name")}`);
  const message = encodeURIComponent(
    `From: ${details.get("name")}\nEmail: ${details.get("email")}\n\n${details.get("message")}`,
  );

  formNote.textContent = "Opening your email app with your note…";
  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${message}`;
});

document.querySelector("#year").textContent = String(new Date().getFullYear());

// Miniature grass tufts: each one has exactly three pixel blades.
const kitten = document.querySelector('.cursor-kitten');
const grass = document.querySelector('.garden-grass');
[[4,24],[91,29],[16,61],[78,74],[6,91],[61,17],[45,88]].forEach(([x,y]) => {
  const tuft = document.createElement('span');
  tuft.className = 'grass-tuft';
  tuft.style.left = `${x}%`; tuft.style.top = `${y}%`;
  for (let i = 0; i < 3; i++) {
    const blade = document.createElement('span'); blade.className = 'grass-blade';
    blade.style.animationDelay = `${-(x+i)*.1}s`; tuft.append(blade);
  }
  grass.append(tuft);
});
// Every pursuit is a complete ballistic-style leap with takeoff and landing.
let kittenX = innerWidth / 2, kittenY = innerHeight - 100;
let targetX = kittenX, targetY = kittenY, kittenFrame = null;
let leapStart = null, leapFromX, leapFromY, leapToX, leapToY;
const finePointer = matchMedia('(pointer: fine)');
function chaseCursor(time) {
  if (leapStart === null) {
    leapStart = time; leapFromX = kittenX; leapFromY = kittenY;
    leapToX = targetX; leapToY = targetY;
  }
  const p = Math.min((time - leapStart) / 520, 1);
  const height = 4 * 48 * p * (1 - p);
  kittenX = leapFromX + (leapToX - leapFromX) * p;
  kittenY = leapFromY + (leapToY - leapFromY) * p;
  kitten.style.transform = `translate3d(${Math.round(kittenX)}px, ${Math.round(kittenY-height)}px, 0)`;
  kitten.querySelector('svg').style.transform = `scaleX(${leapToX >= leapFromX ? 1 : -1})`;
  if (p === 1) {
    leapStart = null;
    if (Math.hypot(targetX-kittenX,targetY-kittenY) < 8) { kittenFrame = null; return; }
  }
  kittenFrame = requestAnimationFrame(chaseCursor);
}
function restKitten() {
  if (kittenFrame !== null) cancelAnimationFrame(kittenFrame);
  kittenFrame = null; leapStart = null; kitten.classList.remove('is-awake');
}
window.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse' || reduceMotion.matches || !finePointer.matches) return;
  targetX = Math.max(4, Math.min(innerWidth-56, event.clientX+22));
  targetY = Math.max(54, Math.min(innerHeight-56, event.clientY+28));
  kitten.classList.add('is-awake');
  if (kittenFrame === null) kittenFrame = requestAnimationFrame(chaseCursor);
}, {passive:true});
document.documentElement.addEventListener('pointerleave', restKitten);
window.addEventListener('blur',restKitten);
reduceMotion.addEventListener('change',restKitten);
document.addEventListener('visibilitychange',()=>{if(document.hidden) restKitten();});
