const header = document.querySelector("[data-header]");
const navLinks = [...document.querySelectorAll(".nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function updateActiveLink() {
  const current = sections.findLast((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 140;
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      current && link.getAttribute("href") === `#${current.id}`
    );
  });
}

window.addEventListener("scroll", () => {
  updateHeader();
  updateActiveLink();
});

updateHeader();
updateActiveLink();

const projectGrid = document.querySelector("[data-project-grid]");

function escapeHTML(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderProjectEmptyState(message = "Use the admin dashboard to upload Miracle's real project files, descriptions, and technology tags.") {
  if (!projectGrid) return;

  projectGrid.innerHTML = `
    <article class="empty-projects" data-project-empty>
      <p class="card-kicker">Awaiting Projects</p>
      <h3>Published work will appear here.</h3>
      <p>${escapeHTML(message)}</p>
    </article>
  `;
}

async function loadPublishedProjects() {
  const config = window.MIRACLE_SUPABASE || {};
  const isConfigured =
    config.url &&
    config.anonKey &&
    !config.url.includes("YOUR_PROJECT_ID") &&
    !config.anonKey.includes("YOUR_SUPABASE") &&
    window.supabase;

  if (!projectGrid) return;
  if (window.location.protocol === "file:") {
    renderProjectEmptyState("Open the portfolio from a web server or deploy it to load projects from Supabase.");
    return;
  }
  if (!isConfigured) {
    renderProjectEmptyState("Connect Supabase in js/supabase-config.js, then publish projects from the admin dashboard.");
    return;
  }

  const client = window.supabase.createClient(config.url, config.anonKey);
  const { data, error } = await client
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    renderProjectEmptyState("Projects could not be loaded right now. Please check the Supabase setup.");
    return;
  }

  if (!data.length) {
    renderProjectEmptyState();
    return;
  }

  projectGrid.innerHTML = "";

  data.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = `work-card${index === 0 ? " featured" : ""}`;
    const tags = (project.tags || [])
      .map((tag) => `<span>${escapeHTML(tag)}</span>`)
      .join("");

    card.innerHTML = `
      <div>
        <p class="card-kicker">${escapeHTML(project.category || "Project")}</p>
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.description)}</p>
      </div>
      ${tags ? `<div class="tag-row">${tags}</div>` : ""}
      ${project.file_url ? `<a href="${project.file_url}" class="text-link" download>Download project</a>` : ""}
    `;

    projectGrid.append(card);
  });
}

loadPublishedProjects();
