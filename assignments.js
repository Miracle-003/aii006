const config = window.MIRACLE_SUPABASE || {};
const isConfigured =
  config.url &&
  config.anonKey &&
  !config.url.includes("YOUR_PROJECT_ID") &&
  !config.anonKey.includes("YOUR_SUPABASE") &&
  window.supabase;

const assignmentsGrid = document.querySelector("[data-assignments-grid]");
const statusText = document.querySelector("[data-assignments-status]");

function escapeHTML(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAssignments(rows = []) {
  if (!assignmentsGrid) return;

  const bySlot = new Map(rows.map((row) => [Number(row.slot_number), row]));
  assignmentsGrid.innerHTML = "";

  for (let slot = 1; slot <= 10; slot += 1) {
    const assignment = bySlot.get(slot);
    const card = document.createElement("article");
    card.className = `assignment-card${assignment ? "" : " empty"}`;

    const title = assignment?.title || `Assignment ${String(slot).padStart(2, "0")}`;
    const subject = assignment?.subject || "Waiting for content";
    const description = assignment?.description || "Connect Supabase and add this assignment to the table to display your real work here.";
    const link = assignment?.link_url || "#";
    const fileLink = assignment?.file_url || "";

    card.innerHTML = `
      <p class="card-kicker">Slot ${String(slot).padStart(2, "0")}</p>
      <h3>${escapeHTML(title)}</h3>
      <p class="assignment-subject">${escapeHTML(subject)}</p>
      <p>${escapeHTML(description)}</p>
      <div class="assignment-footer">
        <span class="assignment-badge">${assignment ? "Live in Supabase" : "Empty slot"}</span>
        <div class="assignment-links">
          ${assignment?.link_url ? `<a class="text-link" href="${link}" target="_blank" rel="noreferrer">Open link</a>` : ""}
          ${fileLink ? `<a class="text-link" href="${fileLink}" target="_blank" rel="noreferrer">Download file</a>` : ""}
        </div>
      </div>
    `;

    assignmentsGrid.append(card);
  }
}

async function loadAssignments() {
  if (!assignmentsGrid) return;

  if (window.location.protocol === "file:") {
    if (statusText) {
      statusText.textContent = "Open the page from a web server or deploy it to load assignment rows from Supabase.";
    }
    renderAssignments();
    return;
  }

  if (!isConfigured) {
    if (statusText) {
      statusText.textContent = "Supabase is not configured yet. The 10 assignment slots are shown as placeholders.";
    }
    renderAssignments();
    return;
  }

  const client = window.supabase.createClient(config.url, config.anonKey);
  const { data, error } = await client
    .from("assignments")
    .select("*")
    .order("slot_number", { ascending: true })
    .limit(10);

  if (error) {
    if (statusText) {
      statusText.textContent = "Assignments could not be loaded right now. Check the Supabase table and policies.";
    }
    renderAssignments();
    return;
  }

  if (statusText) {
    statusText.textContent = data.length
      ? "Loaded from Supabase. Fill all 10 slots to complete the assignment board."
      : "No assignments found yet. Add 10 rows to the Supabase table.";
  }

  renderAssignments(data);
}

loadAssignments();
