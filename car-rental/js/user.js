// user.js -> user module: see cars, book a car, see own bookings

requireRole("user");                       // only logged-in users can open this page
const me = getCurrentUser();
document.getElementById("welcome").textContent = "Hi, " + me.name;

let selectedCar = null;                    // the car the user clicked

// ---------- Show all cars ----------
function showCars() {
  const grid = document.getElementById("carGrid");
  grid.innerHTML = "";

  getCars().forEach(function (car) {
    grid.innerHTML +=
      '<div class="car-card">' +
        '<div class="car-top">' + car.name + '</div>' +
        '<div class="car-body">' +
          '<span>' + car.type + ' | ' + car.seats + ' seats | ' + car.fuel + '</span>' +
          '<span class="price">Rs. ' + car.price + ' / day</span>' +
          '<button class="btn" onclick="openBooking(' + car.id + ')">Book now</button>' +
        '</div>' +
      '</div>';
  });
}

// ---------- Open booking popup ----------
function openBooking(carId) {
  selectedCar = getCars().find(function (c) { return c.id === carId; });

  document.getElementById("dialogTitle").textContent = "Book " + selectedCar.name;
  document.getElementById("cName").value  = me.name;     // pre-fill customer details
  document.getElementById("cPhone").value = me.phone;
  document.getElementById("cLicense").value = "";
  document.getElementById("fromDate").value = "";
  document.getElementById("toDate").value   = "";
  document.getElementById("totalText").textContent = "Total: Rs. 0";
  document.getElementById("bookError").textContent = "";

  // cannot choose a date before today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("fromDate").min = today;
  document.getElementById("toDate").min   = today;

  document.getElementById("bookDialog").showModal();
}

document.getElementById("cancelBtn").onclick = function () {
  document.getElementById("bookDialog").close();
};

// ---------- Calculate number of days ----------
function getDays() {
  const from = document.getElementById("fromDate").value;
  const to   = document.getElementById("toDate").value;
  if (!from || !to) return 0;
  const diff = new Date(to) - new Date(from);          // difference in milliseconds
  return Math.round(diff / (1000 * 60 * 60 * 24)) + 1; // +1 so same day = 1 day
}

function updateTotal() {
  const days = getDays();
  const total = days > 0 ? days * selectedCar.price : 0;
  document.getElementById("totalText").textContent = "Total: Rs. " + total + " (" + days + " days)";
}
document.getElementById("fromDate").onchange = updateTotal;
document.getElementById("toDate").onchange   = updateTotal;

// ---------- Save the booking ----------
document.getElementById("bookForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const days = getDays();
  if (days <= 0) {
    document.getElementById("bookError").textContent = "'To' date must be on or after 'From' date.";
    return;
  }

  const bookings = getBookings();
  bookings.push({
    id: Date.now(),
    userEmail: me.email,
    customerName: document.getElementById("cName").value.trim(),
    customerPhone: document.getElementById("cPhone").value.trim(),
    license: document.getElementById("cLicense").value.trim(),
    carName: selectedCar.name,
    from: document.getElementById("fromDate").value,
    to: document.getElementById("toDate").value,
    days: days,
    total: days * selectedCar.price,
    status: "Pending"
  });
  saveBookings(bookings);

  document.getElementById("bookDialog").close();
  showMyBookings();
});

// ---------- Show only MY bookings ----------
function showMyBookings() {
  const body = document.getElementById("myBookings");
  body.innerHTML = "";

  const mine = getBookings().filter(function (b) { return b.userEmail === me.email; });

  if (mine.length === 0) {
    body.innerHTML = '<tr><td colspan="6">No bookings yet. Pick a car above.</td></tr>';
    return;
  }

  mine.forEach(function (b) {
    const cls = b.status === "Confirmed" ? "tag ok" : "tag";
    body.innerHTML +=
      "<tr><td>" + b.carName + "</td><td>" + b.from + "</td><td>" + b.to + "</td><td>" +
      b.days + "</td><td>Rs. " + b.total + '</td><td><span class="' + cls + '">' + b.status + "</span></td></tr>";
  });
}

showCars();
showMyBookings();
