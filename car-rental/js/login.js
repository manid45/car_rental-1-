// login.js -> checks email + password, checks age, then redirects by role

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email    = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const error    = document.getElementById("error");

  // Find the user with this email and password
  const user = getUsers().find(function (u) {
    return u.email === email && u.password === password;
  });

  if (!user) {
    error.textContent = "Wrong email or password.";
    return;
  }

  // Age check: only people ABOVE 18 can login (user and admin)
  if (getAge(user.dob) <= 18) {
    error.textContent = "Login not allowed. You must be above 18 years old.";
    return;
  }

  // Remember who is logged in
  localStorage.setItem("currentUser", JSON.stringify(user));

  // Module-wise redirection
  if (user.role === "admin") {
    location.href = "admin.html";
  } else {
    location.href = "user.html";
  }
});
