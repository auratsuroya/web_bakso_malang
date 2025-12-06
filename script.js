/* ==========================================================
   Bakso Malang Lestari 38 — SCRIPT.JS (Clean & Fixed)
========================================================== */

/* 1. DATA MENU */
const menuData = [
  { id: 'm1', name: 'Bakso Malang', price: 13000, img: 'bakso-malang.jpg', category: 'makanan', bestseller: true },
  { id: 'm2', name: 'Bakso Malang Telor', price: 15000, img: 'baksotelor.jpg', category: 'makanan' },
  { id: 'm3', name: 'Mie Ayam Bakso', price: 15000, img: 'mieayambakso.jpg', category: 'makanan' },
  { id: 'm4', name: 'Mie Ayam Ceker', price: 17000, img: 'mieayamceker.jpg', category: 'makanan' },
  { id: 'm5', name: 'Mie Ayam', price: 13000, img: 'mieayam.jpg', category: 'makanan' },
  { id: 'n1', name: 'Es Teh Manis', price: 5000, img: 'minum-esteh.jpg', category: 'minuman' },
  { id: 'n2', name: 'Es Jeruk Segar', price: 7000, img: 'minum-esjeruk.jpg', category: 'minuman', bestseller: true },
  { id: 'n3', name: 'Es Teh Tawar', price: 3000, img: 'minum-estehtawar.jpg', category: 'minuman' },
  { id: 'n4', name: 'Air Mineral', price: 4000, img: 'minum-air.jpg', category: 'minuman' },
  { id: 'n5', name: 'Es Teh Jus', price: 3000, img: 'minum-tehjus.jpg', category: 'minuman' },
  { id: 'n6', name: 'Es Nutrisari', price: 4000, img: 'minum-nutrisari.jpg', category: 'minuman' },
];

const rupiah = n => `Rp ${Number(n).toLocaleString("id-ID")}`;

/* 2. DARK MODE */
const root = document.documentElement;
const darkToggle = document.getElementById("darkToggle");
if (darkToggle) {
  if (localStorage.getItem("bml_dark") === "true") {
    root.classList.add("dark");
    darkToggle.textContent = "☀️";
  }
  darkToggle.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark");
    darkToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("bml_dark", isDark);
  });
}

/* 3. RENDER MENU + SHIMMER EFFECT */
const menuGrid = document.getElementById("menuGrid");
const tabs = document.querySelectorAll(".menu-tab") || [];
let activeCategory = "makanan";

function showShimmer(count = 6) {
  if (!menuGrid) return;
  menuGrid.innerHTML = "";
  for (let i = 0; i < count; i++) {
    menuGrid.innerHTML += `
      <div class="menu-card p-3 placeholder-card" style="display:inline-block;width:240px;margin:8px;vertical-align:top;">
        <div class="shimmer" style="height:160px;border-radius:8px;background:#eee"></div>
        <div style="height:12px;margin-top:12px;width:60%;background:#eee;border-radius:4px;"></div>
        <div style="height:12px;margin-top:8px;width:40%;background:#eee;border-radius:4px;"></div>
      </div>`;
  }
}

function renderMenu(category = "makanan") {
  if (!menuGrid) return;
  showShimmer();
  setTimeout(() => {
    menuGrid.innerHTML = "";
    const list = menuData.filter(m => m.category === category);
    if (!list.length) {
      menuGrid.innerHTML = `<p class="text-muted">Tidak ada menu pada kategori ini.</p>`;
      return;
    }
    list.forEach(item => {
      const bestseller = item.bestseller ? `<div class="badge-bestseller">Best</div>` : "";
      menuGrid.innerHTML += `
        <div class="menu-card position-relative menu-animate" style="display:inline-block;width:240px;margin:8px;vertical-align:top;">
          ${bestseller}
          <img src="${item.img}" alt="${item.name}" class="w-100" style="height:160px;object-fit:cover;border-radius:8px;">
          <div class="p-3">
            <h5 class="mb-2 fw-bold">${item.name}</h5>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div class="price fw-bold">${rupiah(item.price)}</div>
              <div class="qty d-flex align-items-center" data-id="${item.id}">
                <button class="btn btn-sm btn-outline-secondary dec">−</button>
                <input type="number" value="1" min="1" class="form-control form-control-sm qty-input mx-1" style="width:56px; text-align:center; padding:2px 6px;">
                <button class="btn btn-sm btn-outline-secondary inc">+</button>
              </div>
            </div>
            <button class="btn btn-accent w-100 add-to-cart" data-id="${item.id}">Tambah ke Keranjang</button>
          </div>
        </div>`;
    });
    attachCardEvents();
    animateMenuCards();
  }, 300);
}

// attach tab listeners if tabs exist
if (tabs.length) {
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeCategory = tab.dataset.category;
      renderMenu(activeCategory);
    });
  });
}

// initial render
renderMenu(activeCategory);

/* 4. CARD EVENTS */
function attachCardEvents() {
  document.querySelectorAll(".qty").forEach(q => {
    const input = q.querySelector(".qty-input");
    if (!input) return;
    const dec = q.querySelector(".dec");
    const inc = q.querySelector(".inc");
    if (dec) dec.onclick = () => input.value = Math.max(1, Number(input.value) - 1);
    if (inc) inc.onclick = () => input.value = Math.max(1, Number(input.value) + 1);
  });

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    // avoid duplicate listeners
    btn.replaceWith(btn.cloneNode(true));
  });

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const input = btn.closest(".menu-card").querySelector(".qty-input");
      const qty = input ? Math.max(1, Number(input.value)) : 1;
      addToCart(id, qty);
    });
  });
}

/* 5. CART SYSTEM */
const cart = JSON.parse(localStorage.getItem("bml_cart") || "[]");
const cartCountEl = document.getElementById("cartCount");
const floatCount = document.getElementById("floatCount");
const cartListEl = document.getElementById("cartList");
const cartItemsEl = document.getElementById("cartItems");
const cartSidebar = document.getElementById("cartSidebar");
const cartTotalEl = document.getElementById("cartTotal");
const cartOpen = document.getElementById("cartOpen");
const cartClose = document.getElementById("cartClose");
const cartFloating = document.getElementById("cartFloating");

function saveCart() { localStorage.setItem("bml_cart", JSON.stringify(cart)); }

function removeFromCart(index) {
  if (typeof index !== "number" || !cart[index]) return;
  if (confirm(`Hapus "${cart[index].name}" dari keranjang?`)) {
    cart.splice(index, 1);
    updateCartUI();
  }
}

function clearCart() {
  if (!cart.length) return;
  if (confirm("Hapus semua item dari keranjang?")) {
    cart.length = 0;
    updateCartUI();
  }
}

function updateQty(index, change) {
  if (typeof index !== "number" || !cart[index]) return;
  cart[index].qty = Math.max(1, (cart[index].qty || 1) + change);
  updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0);

  if (cartCountEl) cartCountEl.textContent = cart.length;
  if (floatCount) floatCount.textContent = cart.length;
  if (cartTotalEl) cartTotalEl.textContent = rupiah(total);

  if (cartListEl) {
    cartListEl.innerHTML = cart.length
      ? cart.map((i, idx) => `
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span>${i.name}</span>
            <div class="d-flex align-items-center">
              <button class="btn btn-sm btn-outline-secondary me-1" onclick="updateQty(${idx}, -1)">−</button>
              <span class="mx-1">${i.qty}</span>
              <button class="btn btn-sm btn-outline-secondary ms-1" onclick="updateQty(${idx}, 1)">+</button>
              <span class="ms-2">${rupiah(i.price * i.qty)}</span>
              <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${idx})"><i class="bi bi-trash"></i></button>
            </div>
          </div>`).join("")
      : `<div class="text-muted">Keranjang kosong...</div>`;
  }

  if (cartItemsEl) {
    cartItemsEl.innerHTML = cart.length
      ? cart.map((i, idx) => `
          <div class="cart-item d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center">
              <img src="${i.img}" style="width:40px;height:40px;object-fit:cover;border-radius:5px;margin-right:8px;">
              <div><strong>${i.name}</strong><br><small>${i.qty} × ${rupiah(i.price)}</small></div>
            </div>
            <div class="d-flex align-items-center">
              <button class="btn btn-sm btn-outline-secondary me-1" onclick="updateQty(${idx}, -1)">−</button>
              <span class="mx-1">${i.qty}</span>
              <button class="btn btn-sm btn-outline-secondary ms-1" onclick="updateQty(${idx}, 1)">+</button>
              <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${idx})"><i class="bi bi-trash"></i></button>
            </div>
          </div>`).join("")
      : `<div class="text-muted">Keranjang kosong...</div>`;
  }

  const sidebarTotalEl = document.getElementById("cartSidebarTotal");
  if (sidebarTotalEl) sidebarTotalEl.textContent = rupiah(total);

  saveCart();
}

// add "Hapus Semua" button if sidebar exists and button not present
if (cartSidebar && !document.getElementById("clearCartBtn")) {
  const btnClear = document.createElement("button");
  btnClear.id = "clearCartBtn";
  btnClear.className = "btn btn-danger w-100 mt-2";
  btnClear.textContent = "Hapus Semua";
  btnClear.onclick = clearCart;
  cartSidebar.appendChild(btnClear);
}

function addToCart(id, qty) {
  const item = menuData.find(m => m.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty = (existing.qty || 0) + qty;
  else cart.push({ ...item, qty });
  updateCartUI();
  openCart();
}

function openCart() {
  if (cartSidebar) cartSidebar.classList.add("open");
}

if (cartOpen) cartOpen.addEventListener("click", openCart);
if (cartFloating) cartFloating.addEventListener("click", openCart);
if (cartClose) cartClose.addEventListener("click", () => cartSidebar && cartSidebar.classList.remove("open"));

updateCartUI();

/* 6. CHECKOUT MIDTRANS */
function doCheckout() {
    // simpan cart di localStorage untuk halaman checkout
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    window.location.href = "checkout.html";
}

// Tombol checkout di ringkasan bawah
const checkoutSummaryBtn = document.getElementById("checkoutSummary");
if (checkoutSummaryBtn) {
    checkoutSummaryBtn.addEventListener("click", doCheckout);
}

// Tombol checkout di sidebar keranjang
const checkoutSidebarBtn = document.getElementById("checkoutSidebar");
if (checkoutSidebarBtn) {
    checkoutSidebarBtn.addEventListener("click", doCheckout);
}

/* 8. NAVBAR SCROLL EFFECT */
const navbar = document.querySelector(".navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("nav-scrolled", window.scrollY > 20);
  });
}

/* 9. FOOTER YEAR */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* 10. NAVBAR AUTO CLOSE & REVEAL */
document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
  link.addEventListener("click", () => {
    const navCollapseEl = document.getElementById("navCollapse");
    if (navCollapseEl) {
      const bs = bootstrap.Collapse.getInstance(navCollapseEl) || new bootstrap.Collapse(navCollapseEl, { toggle: false });
      bs.hide();
    }
  });
});

const reveals = document.querySelectorAll(".reveal");
function doReveal() {
  reveals.forEach(el => {
    const rectTop = el.getBoundingClientRect().top;
    if (rectTop < window.innerHeight - 80) el.classList.add("show");
  });
}
window.addEventListener("scroll", doReveal);
doReveal();

/* 11. NAV LINK ACTIVE ON SCROLL */
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const pageSections = document.querySelectorAll("section[id]");
function onScrollActive() {
  let current = "";
  pageSections.forEach(sec => {
    const offsetTop = sec.offsetTop;
    if (window.pageYOffset >= offsetTop - 200) current = sec.getAttribute("id");
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) link.classList.add("active");
  });
}
window.addEventListener("scroll", onScrollActive);
onScrollActive();

function animateMenuCards() {
  const cards = document.querySelectorAll(".menu-card");

  cards.forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px) scale(0.97)";
    card.style.transition = "opacity .45s ease, transform .45s ease";

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0) scale(1)";
    }, 80 * i);
  });
}