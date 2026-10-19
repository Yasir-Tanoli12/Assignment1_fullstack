// Task 1 - Part A: Core Features
var tickets = [];
var nextId = 1;

var form = document.getElementById("ticketForm");
var nameInput = document.getElementById("customerName");
var issueInput = document.getElementById("issue");
var priorityInput = document.getElementById("priority");
var statusInput = document.getElementById("status");
var resetBtn = document.getElementById("resetBtn");
var ticketList = document.getElementById("ticketList");
var emptyMsg = document.getElementById("emptyMsg");
var totalCount = document.getElementById("totalCount");
var openCount = document.getElementById("openCount");

var validPriorities = ["Low", "Medium", "High"];
var validStatuses = ["Open", "In Progress", "Closed"];

function showError(input, errorId, message) {
  document.getElementById(errorId).textContent = message;
  input.classList.add("is-invalid");
}

function clearErrors() {
  var fields = [nameInput, issueInput, priorityInput, statusInput];
  for (var i = 0; i < fields.length; i++) {
    fields[i].classList.remove("is-invalid");
  }
}

function validateForm() {
  clearErrors();
  var valid = true;
  var name = nameInput.value.trim();
  var issue = issueInput.value.trim();

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

  if (validPriorities.indexOf(priorityInput.value) === -1) {
    showError(priorityInput, "priorityError", "Choose a valid priority.");
    valid = false;
  }

  if (validStatuses.indexOf(statusInput.value) === -1) {
    showError(statusInput, "statusError", "Choose a valid status.");
    valid = false;
  }

  return valid;
}

function renderTickets() {
  ticketList.innerHTML = "";

  for (var i = 0; i < tickets.length; i++) {
    var t = tickets[i];
    var card = document.createElement("div");
    card.className = "ticket p-" + t.priority;
    card.innerHTML =
      '<span class="id">#' + t.id + "</span>" +
      "<h3></h3><p></p>" +
      '<div class="tags">' +
      '<span class="badge text-bg-secondary">' + t.priority + "</span>" +
      '<span class="badge text-bg-primary">' + t.status + "</span>" +
      "</div>";
    card.querySelector("h3").textContent = t.name;
    card.querySelector("p").textContent = t.issue;
    ticketList.appendChild(card);
  }

  updateCounts();
}

function updateCounts() {
  var open = 0;
  for (var i = 0; i < tickets.length; i++) {
    if (tickets[i].status === "Open") {
      open++;
    }
  }
  totalCount.textContent = tickets.length;
  openCount.textContent = open;
  emptyMsg.style.display = tickets.length === 0 ? "block" : "none";
}

function resetForm() {
  form.reset();
  nameInput.value = "";
  issueInput.value = "";
  priorityInput.value = "Medium";
  statusInput.value = "Open";
  clearErrors();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!validateForm()) {
    return;
  }

  tickets.push({
    id: nextId++,
    name: nameInput.value.trim(),
    issue: issueInput.value.trim(),
    priority: priorityInput.value,
    status: statusInput.value
  });

  renderTickets();
  resetForm();
});

resetBtn.addEventListener("click", resetForm);

renderTickets();
