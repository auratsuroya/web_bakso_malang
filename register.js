document.addEventListener("DOMContentLoaded", () => {
  // =====================
  // ELEMENT SELECTION
  // =====================
  const registerForm = document.getElementById("registerForm");
  const successMsg = document.getElementById("successMsg");
  const errorMsg = document.getElementById("errorMsg");
  const togglePassword = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");

  // =====================
  // TOGGLE PASSWORD VISIBILITY
  // =====================
  if (togglePassword && passwordField) {
    togglePassword.addEventListener("click", () => {
      passwordField.type = passwordField.type === "password" ? "text" : "password";
      togglePassword.classList.toggle("bi-eye");
      togglePassword.classList.toggle("bi-eye-slash-fill");
    });
  }

  // =====================
  // REGISTER LOGIC
  // =====================
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullname = document.getElementById("fullname").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const username = document.getElementById("username").value.trim();
      const password = passwordField.value.trim();
      const address = document.getElementById("address").value.trim();

      // Reset pesan
      successMsg.classList.add("d-none");
      errorMsg.classList.add("d-none");

      // =====================
      // VALIDASI INPUT
      // =====================
      if (!fullname || !phone || !username || !password || !address) {
        errorMsg.textContent = "Semua field wajib diisi!";
        errorMsg.classList.remove("d-none");
        return;
      }

      // Ambil daftar user dari localStorage
      let users = JSON.parse(localStorage.getItem("users") || "[]");

      // Cek username duplikat
      if (users.some(u => u.username === username)) {
        errorMsg.textContent = "Username sudah digunakan!";
        errorMsg.classList.remove("d-none");
        return;
      }

      // Simpan user baru
      const newUser = {
        fullname,
        phone,
        username,
        password,
        address,
        role: "customer"
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // =====================
      // NOTIFIKASI SUKSES
      // =====================
      successMsg.textContent = "Berhasil daftar! Mengalihkan ke halaman login...";
      successMsg.classList.remove("d-none");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    });
  }
});
