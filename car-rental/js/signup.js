// signup.js -> creates a new USER or ADMIN account (only one admin allowed)

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();   // stop page reload

  const name     = document.getElementById("name").value.trim();
  const email    = document.getElementById("email").value.trim().toLowerCase();
  const phone    = document.getElementById("phone").value.trim();
  const dob      = document.getElementById("dob").value;
  const role     = document.getElementById("role").value;
  const password = document.getElementById("password").value;
  const error    = document.getElementById("error");

  // Rule 1: age must be MORE than 18
  if (getAge(dob) <= 18) {
    error.textContent = "You must be above 18 years old to sign up.";
    return;
  }

  // Rule 2: only ONE admin is allowed
  if (role === "admin" && hasAdmin()) {
    error.textContent = "An admin already exists. Only one admin is allowed. Sign up as User.";
    return;
  }

  // Rule 3: email must not already exist
  const users = getUsers();
  const exists = users.some(function (u) { return u.email === email; });
  if (exists) {
    error.textContent = "This email is already registered. Please login.";
    return;
  }

  // Save the new user
  users.push({ name: name, email: email, phone: phone, dob: dob, password: password, role: role });
  saveUsers(users);

  alert("Signup successful! Please login.");
  location.href = "login.html";
});
