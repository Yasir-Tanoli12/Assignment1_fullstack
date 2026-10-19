import { getTickets, findTicket, addTicket, updateTicket, deleteTicket } from "./tickets.js";
import { filterTickets } from "./filter.js";
import { getSummary } from "./summary.js";

const $ = (id) => document.getElementById(id);

const form = $("ticketForm");
const nameInput = $("customerName");
const issueInput = $("issue");
const priorityInput = $("priority");
const statusInput = $("status");
const submitBtn = $("submitBtn");
const formTitle = $("formTitle");
const ticketList = $("ticketList");
const emptyMsg = $("emptyMsg");

let editingId = null;

// ---------- Validation ----------
const showError = (input, errorId, message) => {
  $(errorId).textContent = message;
  input.classList.add("is-invalid");
};

const clearErrors = () => {
  [nameInput, issueInput].forEach((input) => input.classList.remove("is-invalid"));
};

const validateForm = () => {
  clearErrors();
  let valid = true;
  const name = nameInput.value.trim();
  const issue = issueInput.value.trim();

  if (name === "") {
    showError(nameInput, "nameError", "Customer name is required.");
    valid = false;
  } else if (name.length < 3 || name.length > 40) {
    showError(nameInput, "nameError", "Name must be 3 to 40 characters.");
    valid = false;
  } else if (/[0-9]/.test(name)) {
    showError(nameInput, "nameError", "Name must not contain numbers.");
    valid = false;
  }

  if (issue === "") {
    showError(issueInput, "issueError", "Issue description is required.");
    valid = false;
  } else if (issue.length < 10) {
    showError(issueInput, "issueError", "Issue must be at least 10 characters.");
    valid = false;
  }

  return valid;
};

// ---------- Render ----------
const getFilters = () => ({
  keyword: $("searchInput").value,
  status: $("filterStatus").value,
  priority: $("filterPriority").value
});

const render = () => {
  const all = getTickets();
  const visible = filterTickets(all, getFilters());

  ticketList.innerHTML = "";
  for (const { id, name, issue, priority, status } of visible) {
    const card = document.createElement("div");
    card.className = `ticket p-${priority}`;
    card.innerHTML = `
      <span class="id">#${id}</span>
      <h3></h3>
      <p></p>
      <div class="tags mb-2">
        <span class="badge text-bg-secondary">${priority}</span>
        <span class="badge text-bg-primary">${status}</span>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${id}">Edit</button>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${id}">Delete</button>
      </div>`;
    card.querySelector("h3").textContent = name;
    card.querySelector("p").textContent = issue;
    ticketList.appendChild(card);
  }

  emptyMsg.style.display = visible.length === 0 ? "block" : "none";
  $("shownCount").textContent = `Showing ${visible.length} of ${all.length}`;

  const summary = getSummary(all);
  $("sumOpen").textContent = summary["Open"];
  $("sumProgress").textContent = summary["In Progress"];
  $("sumClosed").textContent = summary["Closed"];
};

// ---------- Form actions ----------
const resetForm = () => {
  form.reset();
  priorityInput.value = "Medium";
  statusInput.value = "Open";
  clearErrors();
  editingId = null;
  submitBtn.textContent = "Add Ticket";
  formTitle.textContent = "Add Ticket";
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  const data = {
    name: nameInput.value.trim(),
    issue: issueInput.value.trim(),
    priority: priorityInput.value,
    status: statusInput.value
  };

  if (editingId === null) {
    addTicket(data);
  } else {
    updateTicket(editingId, data);
  }

  resetForm();
  render();
});

$("resetBtn").addEventListener("click", resetForm);

ticketList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.dataset.action === "delete") {
    deleteTicket(id);
    if (editingId === id) resetForm();
    render();
  }

  if (button.dataset.action === "edit") {
    const { name, issue, priority, status } = findTicket(id);
    nameInput.value = name;
    issueInput.value = issue;
    priorityInput.value = priority;
    statusInput.value = status;
    editingId = id;
    submitBtn.textContent = "Save Changes";
    formTitle.textContent = `Edit Ticket #${id}`;
    clearErrors();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

["searchInput", "filterStatus", "filterPriority"].forEach((id) => {
  $(id).addEventListener("input", render);
});

// ---------- Sample data ----------
[
  { name: "Yasir", issue: "Can't login in my account", priority: "High", status: "Open" },
  { name: "Sara Ahmed", issue: "Payment issue on checkout", priority: "Medium", status: "In Progress" },
  { name: "Ayesha Rana", issue: "Password reset email not received", priority: "Medium", status: "Closed" },
  { name: "Aazain Sadiq", issue: "Website loads very slowly", priority: "High", status: "Open" }
].forEach((ticket) => addTicket(ticket));

render();
