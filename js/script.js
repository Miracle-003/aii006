const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll("[data-nav] a")];
const revealItems = [...document.querySelectorAll(".reveal")];

function setScrolledState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function setActiveNavLink() {
  if (!navLinks.length) return;

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    link.classList.toggle("is-active", linkPath === currentPath);
  });
}

function closeMobileNav() {
  if (!nav || !navToggle) return;
  nav.classList.remove("is-open");
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const willOpen = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", willOpen);
    navToggle.classList.toggle("is-open", willOpen);
    navToggle.setAttribute("aria-expanded", String(willOpen));
    document.body.classList.toggle("menu-open", willOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 760px)").matches) {
        closeMobileNav();
      }
    });
  });
}

window.addEventListener("scroll", setScrolledState, { passive: true });
window.addEventListener("resize", () => {
  if (!window.matchMedia("(max-width: 760px)").matches) {
    closeMobileNav();
  }
});

setScrolledState();
setActiveNavLink();

if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const form = document.querySelector("[data-contact-form]");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    if (status) {
      status.textContent = "Thanks. Your message is ready to be sent through your preferred contact method.";
    }
    form.reset();
  });
}

function setImageFallback(image) {
  if (!image) return;

  const fallback = image.closest(".hero-image, .media-frame, .gallery-frame")?.querySelector("[data-image-fallback]");
  image.addEventListener("error", () => {
    image.classList.add("is-missing");
    if (fallback) fallback.hidden = false;
  });
}

[...document.querySelectorAll("img[data-fallback]")].forEach(setImageFallback);
