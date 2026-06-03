const config = window.MIRACLE_SUPABASE || {};
const isConfigured =
  config.url &&
  config.anonKey &&
  !config.url.includes("YOUR_PROJECT_ID") &&
  !config.anonKey.includes("YOUR_SUPABASE");

const client = isConfigured
  ? window.supabase.createClient(config.url, config.anonKey)
  : null;

const authPanel = document.querySelector("[data-auth-panel]");
const dashboard = document.querySelector("[data-dashboard]");
const loginForm = document.querySelector("[data-login-form]");
const projectForm = document.querySelector("[data-project-form]");
const authMessage = document.querySelector("[data-auth-message]");
const projectMessage = document.querySelector("[data-project-message]");
const projectList = document.querySelector("[data-admin-projects]");
const assignmentForm = document.querySelector("[data-assignment-form]");
const assignmentMessage = document.querySelector("[data-assignment-message]");
const assignmentList = document.querySelector("[data-admin-assignments]");

function setMessage(element, text, type = "") {
  element.textContent = text;
  element.dataset.type = type;
}

function escapeHTML(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function requireSupabase() {
  if (client) return true;
  setMessage(
    authMessage,
    "Add your Supabase URL and anon key in supabase-config.js before using the admin dashboard.",
    "error"
  );
  return false;
}

function showDashboard(isSignedIn) {
  authPanel.classList.toggle("is-hidden", isSignedIn);
  dashboard.classList.toggle("is-hidden", !isSignedIn);
}

async function getSession() {
  if (!requireSupabase()) return null;
  const { data } = await client.auth.getSession();
  return data.session;
}

async function loadProjects() {
  const { data, error } = await client
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    setMessage(projectMessage, error.message, "error");
    return;
  }

  projectList.innerHTML = "";

  if (!data.length) {
    projectList.innerHTML = "<p>No projects yet. Upload the first one above.</p>";
    return;
  }

  data.forEach((project) => {
    const item = document.createElement("article");
    item.className = "admin-project-item";
    item.innerHTML = `
      <div>
        <p class="card-kicker">${escapeHTML(project.category || "Project")}</p>
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.description)}</p>
      </div>
      <div class="admin-item-actions">
        ${project.file_url ? `<a class="text-link" href="${project.file_url}" download>Download</a>` : ""}
        <button class="text-link" type="button" data-edit="${project.id}">Edit</button>
        <button class="text-link danger" type="button" data-delete="${project.id}">Delete</button>
      </div>
    `;

    item.querySelector("[data-edit]").addEventListener("click", () => editProject(project));
    item.querySelector("[data-delete]").addEventListener("click", () => deleteProject(project));
    projectList.append(item);
  });
}

function editProject(project) {
  projectForm.elements.id.value = project.id;
  projectForm.elements.title.value = project.title || "";
  projectForm.elements.category.value = project.category || "";
  projectForm.elements.description.value = project.description || "";
  projectForm.elements.tags.value = (project.tags || []).join(", ");
  projectForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function uploadProjectFile(file) {
  const safeName = file.name.replace(/[^a-z0-9.\-_]+/gi, "-").toLowerCase();
  const path = `${Date.now()}-${safeName}`;
  const { error } = await client.storage
    .from(config.storageBucket)
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data } = client.storage.from(config.storageBucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

async function uploadAssignmentFile(file) {
  const safeName = file.name.replace(/[^a-z0-9.\-_]+/gi, "-").toLowerCase();
  const path = `assignments/${Date.now()}-${safeName}`;
  const { error } = await client.storage.from("assignment-files").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = client.storage.from("assignment-files").getPublicUrl(path);
  return { path, url: data.publicUrl };
}

async function loadAssignments() {
  const { data, error } = await client.from("assignments").select("*").order("slot_number", { ascending: true });
  if (error) {
    setMessage(assignmentMessage, error.message, "error");
    return;
  }

  assignmentList.innerHTML = "";
  if (!data || !data.length) {
    assignmentList.innerHTML = "<p>No assignments yet. Create one above.</p>";
    return;
  }

  data.forEach((a) => {
    const item = document.createElement("article");
    item.className = "admin-project-item";
    item.innerHTML = `
      <div>
        <p class="card-kicker">Slot ${a.slot_number}</p>
        <h3>${escapeHTML(a.title || `Assignment ${a.slot_number}`)}</h3>
        <p>${escapeHTML(a.subject || '')} — ${escapeHTML(a.description || '')}</p>
      </div>
      <div class="admin-item-actions">
        ${a.file_url ? `<a class="text-link" href="${a.file_url}" target="_blank">Open</a>` : ''}
        ${a.link_url ? `<a class="text-link" href="${a.link_url}" target="_blank">Link</a>` : ''}
        <button class="text-link" type="button" data-edit-assignment="${a.id}">Edit</button>
        <button class="text-link danger" type="button" data-delete-assignment="${a.id}">Delete</button>
      </div>
    `;

    item.querySelector("[data-edit-assignment]").addEventListener("click", () => editAssignment(a));
    item.querySelector("[data-delete-assignment]").addEventListener("click", () => deleteAssignment(a));
    assignmentList.append(item);
  });
}

function editAssignment(a) {
  assignmentForm.elements.id.value = a.id;
  assignmentForm.elements.slot_number.value = a.slot_number || "";
  assignmentForm.elements.title.value = a.title || "";
  assignmentForm.elements.subject.value = a.subject || "";
  assignmentForm.elements.description.value = a.description || "";
  assignmentForm.elements.link_url.value = a.link_url || "";
  assignmentForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function saveAssignment(event) {
  event.preventDefault();
  setMessage(assignmentMessage, "Saving assignment...");

  const formData = new FormData(assignmentForm);
  const id = formData.get("id");
  const file = assignmentForm.elements.file.files[0];
  const payload = {
    slot_number: parseInt(formData.get("slot_number"), 10),
    title: formData.get("title").trim(),
    subject: formData.get("subject").trim(),
    description: formData.get("description").trim(),
    link_url: formData.get("link_url").trim() || null
  };

  try {
    if (file) {
      const uploaded = await uploadAssignmentFile(file);
      payload.file_path = uploaded.path;
      payload.file_url = uploaded.url;
    }

    const query = id
      ? client.from("assignments").update(payload).eq("id", id)
      : client.from("assignments").insert(payload);

    const { error } = await query;
    if (error) throw error;

    assignmentForm.reset();
    assignmentForm.elements.id.value = "";
    setMessage(assignmentMessage, "Assignment saved.", "success");
    await loadAssignments();
  } catch (error) {
    setMessage(assignmentMessage, error.message, "error");
  }
}

async function deleteAssignment(a) {
  const confirmed = window.confirm(`Delete assignment slot ${a.slot_number}?`);
  if (!confirmed) return;

  if (a.file_path) {
    await client.storage.from("assignment-files").remove([a.file_path]);
  }

  const { error } = await client.from("assignments").delete().eq("id", a.id);
  if (error) {
    setMessage(assignmentMessage, error.message, "error");
    return;
  }

  setMessage(assignmentMessage, "Assignment deleted.", "success");
  await loadAssignments();
}

async function saveProject(event) {
  event.preventDefault();
  setMessage(projectMessage, "Saving project...");

  const formData = new FormData(projectForm);
  const id = formData.get("id");
  const file = projectForm.elements.file.files[0];
  const payload = {
    title: formData.get("title").trim(),
    category: formData.get("category").trim(),
    description: formData.get("description").trim(),
    tags: formData
      .get("tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  };

  try {
    if (file) {
      const uploaded = await uploadProjectFile(file);
      payload.file_path = uploaded.path;
      payload.file_url = uploaded.url;
    }

    const query = id
      ? client.from("projects").update(payload).eq("id", id)
      : client.from("projects").insert(payload);

    const { error } = await query;
    if (error) throw error;

    projectForm.reset();
    projectForm.elements.id.value = "";
    setMessage(projectMessage, "Project saved.", "success");
    await loadProjects();
  } catch (error) {
    setMessage(projectMessage, error.message, "error");
  }
}

async function deleteProject(project) {
  const confirmed = window.confirm(`Delete "${project.title}"?`);
  if (!confirmed) return;

  if (project.file_path) {
    await client.storage.from(config.storageBucket).remove([project.file_path]);
  }

  const { error } = await client.from("projects").delete().eq("id", project.id);

  if (error) {
    setMessage(projectMessage, error.message, "error");
    return;
  }

  setMessage(projectMessage, "Project deleted.", "success");
  await loadProjects();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireSupabase()) return;

  const formData = new FormData(loginForm);
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    setMessage(authMessage, "Enter both email and password.", "error");
    return;
  }

  const { error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      setMessage(
        authMessage,
        "Invalid email/password. Reset the password in Supabase Auth Users and try again.",
        "error"
      );
      return;
    }

    setMessage(authMessage, error.message, "error");
    return;
  }

  showDashboard(true);
  await loadProjects();
});

document.querySelector("[data-logout]").addEventListener("click", async () => {
  await client.auth.signOut();
  showDashboard(false);
});

document.querySelector("[data-clear-form]").addEventListener("click", () => {
  projectForm.elements.id.value = "";
});

projectForm.addEventListener("submit", saveProject);
if (document.querySelector("[data-clear-assignment]")) {
  document.querySelector("[data-clear-assignment]").addEventListener("click", () => {
    assignmentForm.elements.id.value = "";
  });
}

if (assignmentForm) assignmentForm.addEventListener("submit", saveAssignment);

(async function initAdmin() {
  if (!requireSupabase()) return;
  const session = await getSession();
  showDashboard(Boolean(session));
  if (session) await loadProjects();
  if (session && assignmentForm) await loadAssignments();
})();
