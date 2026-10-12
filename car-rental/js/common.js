// =====================================================
// common.js  -> shared helper functions used on all pages
// Everything is saved in the browser's Local Storage
// =====================================================

// ---------- Read / write Local Storage ----------
function getUsers()    { return JSON.parse(localStorage.getItem("users"))    || []; }
function getCars()     { return JSON.parse(localStorage.getItem("cars"))     || []; }
function getBookings() { return JSON.parse(localStorage.getItem("bookings")) || []; }

function saveUsers(list)    { localStorage.setItem("users",    JSON.stringify(list)); }
function saveCars(list)     { localStorage.setItem("cars",     JSON.stringify(list)); }
function saveBookings(list) { localStorage.setItem("bookings", JSON.stringify(list)); }

function getCurrentUser() { return JSON.parse(localStorage.getItem("currentUser")); }

// ---------- First-time setup ----------
// Adds some sample cars the first time the site opens
function setupData() {
  if (getCars().length === 0) {
    saveCars([
      { id: 1, name: "Maruti Swift",   type: "Hatchback", seats: 5, fuel: "Petrol", price: 1500 },
      { id: 2, name: "Hyundai Creta",  type: "SUV",       seats: 5, fuel: "Diesel", price: 2800 },
      { id: 3, name: "Toyota Innova",  type: "MPV",       seats: 7, fuel: "Diesel", price: 3500 },
      { id: 4, name: "Honda City",     type: "Sedan",     seats: 5, fuel: "Petrol", price: 2400 }
    ]);
  }
}

// ---------- Is there already an admin? (only ONE admin is allowed) ----------
function hasAdmin() {
  return getUsers().some(function (u) { return u.role === "admin"; });
}

// ---------- Calculate age from date of birth ----------
function getAge(dob) {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  // birthday not yet came this year -> reduce 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// ---------- Protect pages (module-wise redirection) ----------
// Example: requireRole("admin") on admin.html
function requireRole(role) {
  const user = getCurrentUser();
  if (!user || user.role !== role) {
    location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  location.href = "login.html";
}

setupData();
