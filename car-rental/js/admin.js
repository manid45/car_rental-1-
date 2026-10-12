// admin.js -> admin module: add / delete cars, see and confirm bookings

requireRole("admin");                      // only admin can open this page
document.getElementById("welcome").textContent = "Hi, " + getCurrentUser().name;

// ---------- Add a car ----------
document.getElementById("carForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const cars = getCars();
  cars.push({
    id: Date.now(),
    name: document.getElementById("carName").value.trim(),
    type: document.getElementById("carType").value,
    seats: Number(document.getElementById("carSeats").value),
    fuel: document.getElementById("carFuel").value,
    price: Number(document.getElementById("carPrice").value)
  });
  saveCars(cars);

  this.reset();
  showAll();
});

// ---------- Delete a car ----------
function deleteCar(id) {
  if (!confirm("Delete this car?")) return;
  const left = getCars().filter(function (c) { return c.id !== id; });
  saveCars(left);
  showAll();
}

// ---------- Confirm a booking ----------
function confirmBooking(id) {
  const bookings = getBookings();
  bookings.forEach(function (b) {
    if (b.id === id) b.status = "Confirmed";
  });
  saveBookings(bookings);
  showAll();
}

// ---------- Delete a booking ----------
function deleteBooking(id) {
  const left = getBookings().filter(function (b) { return b.id !== id; });
  saveBookings(left);
  showAll();
}

// ---------- Show everything on the page ----------
function showAll() {
  const cars = getCars();
  const bookings = getBookings();
  const customers = getUsers().filter(function (u) { return u.role === "user"; });

  // Top numbers
  let income = 0;
  bookings.forEach(function (b) { if (b.status === "Confirmed") income += b.total; });
  document.getElementById("statCars").textContent = cars.length;
  document.getElementById("statUsers").textContent = customers.length;
  document.getElementById("statBookings").textContent = bookings.length;
  document.getElementById("statIncome").textContent = income;

  // Cars table
  const carTable = document.getElementById("carTable");
  carTable.innerHTML = "";
  cars.forEach(function (c) {
    carTable.innerHTML +=
      "<tr><td>" + c.name + "</td><td>" + c.type + "</td><td>" + c.seats + "</td><td>" + c.fuel +
      "</td><td>Rs. " + c.price + '</td><td><button class="btn red small" onclick="deleteCar(' + c.id + ')">Delete</button></td></tr>';
  });

  // Bookings table
  const bookingTable = document.getElementById("bookingTable");
  bookingTable.innerHTML = "";
  if (bookings.length === 0) {
    bookingTable.innerHTML = '<tr><td colspan="9">No bookings yet.</td></tr>';
  }
  bookings.forEach(function (b) {
    const cls = b.status === "Confirmed" ? "tag ok" : "tag";
    const confirmBtn = b.status === "Pending"
      ? '<button class="btn small" onclick="confirmBooking(' + b.id + ')">Confirm</button> ' : "";
    bookingTable.innerHTML +=
      "<tr><td>" + b.customerName + "</td><td>" + b.customerPhone + "</td><td>" + b.license +
      "</td><td>" + b.carName + "</td><td>" + b.from + "</td><td>" + b.to + "</td><td>Rs. " + b.total +
      '</td><td><span class="' + cls + '">' + b.status + "</span></td><td>" + confirmBtn +
      '<button class="btn red small" onclick="deleteBooking(' + b.id + ')">Delete</button></td></tr>';
  });
}

showAll();
