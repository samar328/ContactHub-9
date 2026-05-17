let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editIndex = -1;
let imageName = "";

const contactModal = new bootstrap.Modal(
  document.getElementById("contactModal")
);

window.onload = () => {
  displayContacts(contacts);
};

window.addEventListener("DOMContentLoaded", () => {
  const imgInput = document.getElementById("userImage");

  if (imgInput) {
    imgInput.addEventListener("change", function () {
      imageName = this.files[0]?.name || "";
    });
  }

  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", submitContact);
  }

  const search = document.getElementById("searchInput");

  if (search) {
    search.addEventListener("input", searchContacts);
  }
});

function submitContact(e) {
  e.preventDefault();

  const contact = {
    id: editIndex !== -1 ? contacts[editIndex].id : Date.now(),
    name: document.getElementById("userName").value,
    phone: document.getElementById("userPhone").value,
    email: document.getElementById("userEmail").value || "",
    category: document.getElementById("userCategory").value,
    image: imageName ? "Images/" + imageName : "".files[0]?.name,

    isFav: editIndex !== -1 ? contacts[editIndex].isFav : false,
  };

  if (editIndex === -1) {
    contacts.push(contact);
  } else {
    contacts[editIndex] = contact;
  }

  saveData();

  contactModal.hide();

  document.getElementById("contactForm").reset();
  editIndex = -1;
  imageName = "";

  Swal.fire({
    icon: "success",
    title: "Saved!",
    timer: 1200,
    showConfirmButton: false,
  });
}

function displayContacts(data) {
  const container = document.getElementById("contactsContainer");
  const emptyState = document.getElementById("emptyState");

  container.innerHTML = "";

  if (data.length === 0) {
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");

    data.forEach((c) => {
      const idx = contacts.findIndex(item => item.id === c.id);

      container.innerHTML += `
        <div class="col-12">
          <div class="contact-card shadow-sm p-3 d-flex justify-content-between align-items-center">

            <div class="d-flex align-items-center gap-3">

              ${
                c.image
                  ? `<img src="${c.image}" class="rounded-circle" width="45" height="45" style="object-fit:cover;">`
                  : `<div class="avatar-circle">${c.name[0].toUpperCase()}</div>`
              }

              <div>
                <h6 class="mb-0 fw-bold">
                  ${c.name}
                  ${
                    c.category === "Emergency"
                      ? '<span class="badge bg-danger ms-1">Emergency</span>'
                      : ""
                  }
                </h6>
                <small class="text-muted">${c.phone}</small>
              </div>

            </div>

            <div class="d-flex gap-2">

              <a href="tel:${c.phone}" class="btn btn-sm btn-light">
                <i class="fa fa-phone"></i>
              </a>

              <button onclick="toggleFav(${idx})" class="btn btn-sm btn-light">
                <i class="fa fa-star ${c.isFav ? "text-warning" : ""}"></i>
              </button>

              <button onclick="editContact(${idx})" class="btn btn-sm btn-primary">
                <i class="fa fa-pen"></i>
              </button>

              <button onclick="deleteContact(${idx})" class="btn btn-sm btn-danger">
                <i class="fa fa-trash"></i>
              </button>

            </div>

          </div>
        </div>
      `;
    });
  }

  updateStats();
}

function deleteContact(i) {
  Swal.fire({
    title: "Delete this contact?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
  }).then((res) => {
    if (res.isConfirmed) {
      contacts.splice(i, 1);
      saveData();
    }
  });
}

function editContact(i) {
  editIndex = i;
  const c = contacts[i];

  document.getElementById("userName").value = c.name;
  document.getElementById("userPhone").value = c.phone;
  document.getElementById("userEmail").value = c.email;
  document.getElementById("userCategory").value = c.category;

  imageName = c.image ? c.image.replace("Images/", "") : "";

  document.getElementById("modalTitle").innerText = "Update Contact";
  document.getElementById("saveBtn").innerText = "Update Contact";

  contactModal.show();
}

function toggleFav(i) {
  contacts[i].isFav = !contacts[i].isFav;
  saveData();
}

function saveData() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContacts(contacts);
}

function updateStats() {
  document.getElementById("totalCount").innerText = contacts.length;

  const favs = contacts.filter(c => c.isFav);
  const emergencies = contacts.filter(c => c.category === "Emergency");

  document.getElementById("favCount").innerText = favs.length;
  document.getElementById("emergencyCount").innerText = emergencies.length;

  document.getElementById("contactsSubtitle").innerText =
    `Manage and organize your ${contacts.length} contacts`;

  document.getElementById("favList").innerHTML = favs.length
    ? favs.map(c => `<div class="py-1">${c.name}</div>`).join("")
    : "No favorites yet";

  document.getElementById("emergencyList").innerHTML = emergencies.length
    ? emergencies.map(c => `<div class="py-1 text-danger">${c.name}</div>`).join("")
    : "No emergency contacts";
}

function searchContacts(e) {
  const term = e.target.value.toLowerCase();

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      (c.email && c.email.toLowerCase().includes(term))
  );

  displayContacts(filtered);
}

function prepareAdd() {
  editIndex = -1;
  imageName = "";

  document.getElementById("contactForm").reset();

  document.getElementById("modalTitle").innerText = "Add New Contact";
  document.getElementById("saveBtn").innerText = "Save Contact";
}