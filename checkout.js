document.addEventListener("DOMContentLoaded", () => {

  // ELEMENTS
  const cart = JSON.parse(localStorage.getItem("checkoutCart") || "[]");
  const elItems = document.getElementById("checkoutItems");
  const elSubtotal = document.getElementById("checkoutSubtotal");
  const elShipping = document.getElementById("checkoutShipping");
  const elTotal = document.getElementById("checkoutTotal");
  const payNowBtn = document.getElementById("payNow");
  const noteEl = document.getElementById("note");
  const nameEl = document.getElementById("checkoutName");
  const phoneEl = document.getElementById("checkoutPhone");
  const addressEl = document.getElementById("checkoutAddress");

  // AUTOFILL USER
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  if(nameEl) nameEl.value = user.name || "";
  if(phoneEl) phoneEl.value = user.phone || "";
  if(addressEl) addressEl.value = user.address || "";

  const shipping = cart.length ? 5000 : 0; 
  const rupiah = n => `Rp ${Number(n).toLocaleString("id-ID")}`;

  // CART EMPTY
  if(!cart.length){
    if(elItems) elItems.innerHTML = `<div class="text-center text-muted py-4">Keranjang kosong. Silahkan kembali ke menu.</div>`;
    if(payNowBtn) payNowBtn.disabled = true;
    return;
  }

  // RENDER ITEMS
  let subtotal = 0;
  if(elItems){
    elItems.innerHTML = cart.map(i => {
      const qty = i.qty || 1;
      subtotal += i.price * qty;
      return `
        <div class="item-row d-flex justify-content-between align-items-center mb-2">
          <div class="d-flex align-items-center">
            <img src="${i.img}" alt="${i.name}" width="50">
            <div class="ms-2">
              <div class="fw-bold">${i.name}</div>
              <small class="text-muted">${qty} × ${rupiah(i.price)}</small>
            </div>
          </div>
          <div class="fw-bold">${rupiah(i.price * qty)}</div>
        </div>`;
    }).join("");
  }

  if(elSubtotal) elSubtotal.textContent = rupiah(subtotal);
  if(elShipping) elShipping.textContent = rupiah(shipping);
  if(elTotal) elTotal.textContent = rupiah(subtotal + shipping);

  // VALIDATION
  function validateForm(){
    if(!nameEl.value.trim()) return alert("Nama pemesan wajib diisi");
    if(!phoneEl.value.trim()) return alert("Nomor HP wajib diisi");
    if(!addressEl.value.trim()) return alert("Alamat lengkap wajib diisi");
    return true;
  }

  // BUILD ORDER
  function buildOrder(method){
    return {
      id: "ORD-" + Date.now(),
      customer: {
        name: nameEl.value,
        phone: phoneEl.value,
        address: addressEl.value
      },
      items: cart.map(i => ({
        id: i.id || `item-${i.name}`,
        name: i.name || '-',
        price: i.price || 0,
        quantity: i.qty || 1
      })),
      subtotal,
      shipping,
      total: subtotal + shipping,
      method,
      note: noteEl.value || "",
      created_at: new Date().toISOString()
    };
  }

  // PAY NOW
  if(payNowBtn){
    payNowBtn.addEventListener("click", async () => {
      if(!validateForm()) return;
      const method = document.querySelector("input[name='payment']:checked")?.value || "-";
      const order = buildOrder(method);

      // Tambahkan ongkir sebagai item
      if(order.shipping > 0){
        order.items.push({
          id: "shipping",
          name: "Biaya Ongkir",
          price: order.shipping,
          quantity: 1
        });
      }

      localStorage.setItem("lastOrder", JSON.stringify(order));

      async function clearCartAndRedirect(){
        localStorage.setItem("checkoutCart", JSON.stringify([])); // kosongkan cart
        window.location.href = "success.html";
      }

      if(method === "Midtrans"){
        try {
          const resp = await fetch("generate_snap_token.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: order.total,
              order_id: order.id,
              customer: order.customer,
              cart: order.items
            })
          });
          const data = await resp.json();
          if(!resp.ok || !data.token){
            alert(`⚠ Server Midtrans bermasalah!\nStatus: ${resp.status}`);
            return;
          }

          if(typeof snap !== "undefined"){
            snap.pay(data.token, {
              onSuccess: res => { 
                order.paid = true; 
                order.paymentResult = res;
                localStorage.setItem("lastOrder", JSON.stringify(order));
                clearCartAndRedirect();
              },
              onPending: res => { 
                order.paid = false; 
                order.paymentResult = res;
                localStorage.setItem("lastOrder", JSON.stringify(order));
                clearCartAndRedirect();
              },
              onError: res => {
                console.error("Midtrans onError:", res);
                alert("❌ Pembayaran gagal");
              },
              onClose: () => alert("⚠ Anda menutup halaman pembayaran")
            });
          } else alert("⚠ Snap.js belum terload");

        } catch(err){
          console.error("Fetch error:", err);
          alert("❌ Gagal terhubung ke server Midtrans!");
        }

      } else {
        // COD / Transfer / QRIS
        clearCartAndRedirect();
      }
    });
  }

});
