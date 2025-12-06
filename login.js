document.addEventListener("DOMContentLoaded", () => {
  // ========================
  // ELEMENT SELECTION
  // ========================
  const loginForm = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");
  const loginBtn = document.getElementById("loginBtn");
  const loginText = document.getElementById("loginText");
  const loginSpinner = document.getElementById("loginSpinner");
  const togglePassword = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  // ========================
  // TOGGLE PASSWORD VISIBILITY
  // ========================
  if (togglePassword && passwordField) {
    togglePassword.addEventListener("click", () => {
      passwordField.type = passwordField.type === "password" ? "text" : "password";
      togglePassword.classList.toggle("bi-eye");
      togglePassword.classList.toggle("bi-eye-slash-fill");
    });
  }

  // ========================
  // FUNCTION: Show toast
  // ========================
  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");
    toast.classList.remove("d-none");

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("d-none"), 400);
    }, 2000);
  }

  // ========================
  // LOGIN LOGIC
  // ========================
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username")?.value.trim() || "";
      const password = passwordField?.value.trim() || "";

      if (!username || !password) {
        alert("Username dan password wajib diisi!");
        return;
      }

      if (errorMsg) errorMsg.classList.add("d-none");

      // Aktifkan spinner & disable tombol
      loginBtn.disabled = true;
      loginSpinner.classList.remove("d-none");
      loginText.textContent = "Memproses...";

      setTimeout(() => {
        let userData = null;
        let redirectUrl = "";

        // LOGIN ADMIN
        if (username === "admin" && password === "admin123") {
          userData = { name: "Administrator", role: "admin" };
          redirectUrl = "admin-dashboard.html";
        } 
        // LOGIN CUSTOMER DUMMY
        else if (username === "customer" && password === "customer123") {
          userData = { name: "Customer", role: "customer" };
          redirectUrl = "index.html";
        } 
        // LOGIN USER REGISTRASI
        else {
          const users = JSON.parse(localStorage.getItem("users") || "[]"); // perbaikan key
          const found = users.find(
            (u) => u.username === username && u.password === password
          );
          if (found) {
            userData = {
              name: found.fullname, // perbaikan property
              phone: found.phone,
              address: found.address,
              username: found.username,
              role: "customer",
            };
            redirectUrl = "index.html";
          }
        }

        // HANDLE LOGIN RESULT
        if (userData) {
          localStorage.setItem("userData", JSON.stringify(userData));
          showToast(`Login berhasil! Selamat datang, ${userData.name}.`);
          setTimeout(() => window.location.href = redirectUrl, 2200);
        } else {
          if (errorMsg) errorMsg.classList.remove("d-none");
          loginBtn.disabled = false;
          loginSpinner.classList.add("d-none");
          loginText.textContent = "Login";
        }

      }, 1200); // durasi spinner
    });
  }
});
