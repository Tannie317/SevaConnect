
// Demo complaints
const complaints = [
  {
    id: "SC1024",
    category: "Streetlights",
    location: "Main Road",
    description: "Streetlight is not working.",
    status: "Pending"
  },
  {
    id: "SC1019",
    category: "Water Supply",
    location: "Sector 5",
    description: "Irregular water supply.",
    status: "In Progress"
  },
  {
    id: "SC1008",
    category: "Roads and Potholes",
    location: "Station Road",
    description: "Large pothole on the road.",
    status: "Resolved"
  }
];

const $ = id => document.getElementById(id);
const pages = document.querySelectorAll(".page");

let user = {
  name: "Citizen",
  email: "",
  city: "Mumbai, Maharashtra"
};

// Store submitted feedback during the current session
const feedbacks = [];

// Navigation
function showPage(id) {
  pages.forEach(page =>
    page.classList.toggle("hidden", page.id !== id)
  );

  render();
}

document.querySelectorAll("[data-page]").forEach(button =>
  button.addEventListener("click", () =>
    showPage(button.dataset.page)
  )
);

// Login
$("loginForm").addEventListener("submit", event => {
  event.preventDefault();

  user.email = $("email").value;
  $("profileEmail").value = user.email;
  $("welcome").textContent = user.name;

  $("login").classList.add("hidden");
  $("app").classList.remove("hidden");

  showPage("home");
});

// Logout and dark mode
$("logout").onclick = () => {
  $("app").classList.add("hidden");
  $("login").classList.remove("hidden");
};

$("theme").onclick = () =>
  document.body.classList.toggle("dark");

// Generate complaint ID
function makeId() {
  return "SC" + Math.floor(1000 + Math.random() * 9000);
}

// Submit complaint
$("complaintForm").addEventListener("submit", event => {
  event.preventDefault();

  complaints.unshift({
    id: makeId(),
    category: $("category").value,
    location: $("location").value,
    description: $("description").value,
    status: "Pending"
  });

  $("message").textContent =
    "Complaint submitted! ID: " + complaints[0].id;

  $("trackId").value = complaints[0].id;
  $("complaintForm").reset();

  render();
});

// Display complaint details
function showResult(c) {
  $("trackResult").classList.remove("hidden");

  $("trackResult").innerHTML = `
    <h2>${c.id}</h2>
    <p><b>Category:</b> ${c.category}</p>
    <p><b>Location:</b> ${c.location}</p>
    <p><b>Description:</b> ${c.description}</p>
    <p><b>Status:</b>
      <span class="status">${c.status}</span>
    </p>`;
}

// Track complaint by ID
$("trackForm").addEventListener("submit", event => {
  event.preventDefault();

  const id = $("trackId").value.trim().toLowerCase();

  const c = complaints.find(
    item => item.id.toLowerCase() === id
  );

  if (c) {
    showResult(c);
  } else {
    $("trackResult").classList.add("hidden");
    alert("Complaint ID not found.");
  }
});

// Create a complaint card
function complaintCard(c) {
  return `<article class="item">
    <h3>${c.category}</h3>
    <p><b>${c.id}</b> —
      <span class="status">${c.status}</span>
    </p>
    <p>${c.description}</p>
    <p>Location: ${c.location}</p>
    <button onclick="track('${c.id}')">Track</button>
  </article>`;
}

// Open a complaint for tracking
function track(id) {
  $("trackId").value = id;
  showPage("track");

  showResult(complaints.find(c => c.id === id));
}

// Update lists and dashboard
function render() {
  const q = $("search").value.toLowerCase();
  const status = $("filter").value;

  const mine = complaints.filter(c =>
    (c.id + c.category + c.location + c.description)
      .toLowerCase().includes(q) &&
    (status === "All" || c.status === status)
  );

  $("myList").innerHTML =
    mine.map(complaintCard).join("") ||
    "<p>No complaints found.</p>";

  const publicQuery =
    $("publicSearch").value.toLowerCase();

  const category = $("publicFilter").value;

  const community = complaints.filter(c =>
    (c.id + c.category + c.location + c.description)
      .toLowerCase().includes(publicQuery) &&
    (category === "All" || c.category === category)
  );

  $("publicList").innerHTML =
    community.map(complaintCard).join("") ||
    "<p>No community complaints found.</p>";

  $("total").textContent = complaints.length;

  $("open").textContent =
    complaints.filter(c => c.status !== "Resolved").length;

  $("resolved").textContent =
    complaints.filter(c => c.status === "Resolved").length;
}

// Search and filter
$("search").addEventListener("input", render);
$("filter").addEventListener("change", render);

$("publicSearch").addEventListener("input", render);
$("publicFilter").addEventListener("change", render);

// Submit feedback
$("feedbackForm").addEventListener("submit", event => {
  event.preventDefault();

  feedbacks.push({
    category: $("feedbackCategory").value,
    rating: $("feedbackRating").value,
    message: $("feedbackText").value,
    email: user.email
  });

  $("feedbackMessage").textContent =
    "Thank you! Your feedback has been submitted.";

  $("feedbackForm").reset();
});

// Save profile
$("profileForm").addEventListener("submit", event => {
  event.preventDefault();

  user.name = $("name").value;
  user.email = $("profileEmail").value;
  user.city = $("city").value;

  $("welcome").textContent = user.name;

  alert("Profile saved!");
});

// Initial display
render();
