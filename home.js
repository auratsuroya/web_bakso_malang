/* ==========================================================
   Bakso Malang Lestari 38 — MENU VIEW ONLY (Login Required)
========================================================== */

/* 1. DATA MENU */
const menuData = [
  { id: 'm1', name: 'Bakso Malang', price: 13000, img: 'bakso-malang.jpg', category: 'makanan', bestseller: true },
  { id: 'm2', name: 'Bakso Telor', price: 15000, img: 'baksotelor.jpg', category: 'makanan' },
  { id: 'm3', name: 'Mie Ayam Bakso', price: 15000, img: 'mieayambakso.jpg', category: 'makanan' },
  { id: 'm4', name: 'Mie Ayam Ceker', price: 17000, img: 'mieayamceker.jpg', category: 'makanan' },
  { id: 'n1', name: 'Es Teh Manis', price: 5000, img: 'minum-esteh.jpg', category: 'minuman' },
  { id: 'n2', name: 'Es Jeruk Segar', price: 7000, img: 'minum-esjeruk.jpg', category: 'minuman', bestseller: true },
  { id: 'n3', name: 'Es Degan', price: 12000, img: 'minum-degan.jpg', category: 'minuman' },
  { id: 'n4', name: 'Air Mineral', price: 4000, img: 'minum-air.jpg', category: 'minuman' }
];


/* 2. FORMAT RUPIAH */
const rupiah = n => `Rp ${parseFloat(n).toLocaleString("id-ID")}`;


/* ==========================================================
   ELEMENT UTAMA
========================================================== */
const menuGrid = document.getElementById("menuGrid");
const tabs = document.querySelectorAll(".menu-tab");
let activeCategory = "makanan";


/* ==========================================================
   SKELETON SHIMMER
========================================================== */
function showShimmer(count = 6) {
  if (!menuGrid) return;

  const skeleton = `
    <div class="menu-card placeholder-card">
      <div class="shimmer"></div>
    </div>
  `.repeat(count);

  menuGrid.innerHTML = skeleton;
}


/* ==========================================================
   RENDER MENU (VIEW ONLY — NO CART)
========================================================== */
function renderMenu(category = "makanan") {
  if (!menuGrid) return;

  showShimmer();

  setTimeout(() => {
    const list = menuData.filter(m => m.category === category);

    if (!list.length) {
      menuGrid.innerHTML = `<p class="text-muted text-center">Menu belum tersedia.</p>`;
      return;
    }

    let html = "";

    list.forEach(item => {
      html += `
        <div class="menu-card fade-in">
          ${item.bestseller ? `<div class="badge-bestseller">Best Seller</div>` : ""}
          
          <img src="${item.img}" class="menu-img" alt="${item.name}" loading="lazy">

          <div class="p-3">
            <h5 class="fw-bold mb-1">${item.name}</h5>
            <p class="text-success fw-bold mb-3">${rupiah(item.price)}</p>

            <button onclick="goLogin()" class="btn btn-accent w-100">
              Login untuk Pesan
            </button>
          </div>
        </div>
      `;
    });

    menuGrid.innerHTML = html;
    animateMenuCards();

  }, 250);
}


/* ==========================================================
   PAKSA LOGIN
========================================================== */
function goLogin() {
  window.location.href = "login.html";
}


/* ==========================================================
   TAB HANDLER
========================================================== */
tabs.forEach(tab => {

  tab.addEventListener("click", () => {

    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    activeCategory = tab.dataset.category;
    renderMenu(activeCategory);
  });

});


/* ==========================================================
   FIRST LOAD
========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderMenu(activeCategory);
  revealOnScroll(); // supaya bagian atas langsung tampil
});


/* ==========================================================
   ANIMASI CARD PREMIUM (MENU)
========================================================== */
function animateMenuCards() {
  const cards = document.querySelectorAll(".menu-card");

  cards.forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity .4s ease, transform .4s ease";

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 70 * i);
  });
}



/* ==========================================================
   REVEAL ANIMATION — ABOUT & TESTIMONI
========================================================== */
function revealOnScroll() {
  const elements = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;

  elements.forEach(el => {
    const position = el.getBoundingClientRect().top;

    if (position < windowHeight - 90) {
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
window.addEventListener("resize", revealOnScroll);
