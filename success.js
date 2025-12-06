/* success.js */
(async function(){
  const elOrderId = document.getElementById('orderId');
  const elOrderDate = document.getElementById('orderDate');
  const elInvoiceItems = document.getElementById('invoiceItems');
  const elSubtotal = document.getElementById('invSubtotal');
  const elShipping = document.getElementById('invShipping');
  const elTotal = document.getElementById('invTotal');
  const elPayBadge = document.getElementById('payBadge');
  const elMethod = document.getElementById('orderMethod');
  const statusBox = document.getElementById('statusBox');

  const data = JSON.parse(localStorage.getItem('lastOrder') || "null");
  if(!data){
    statusBox.innerHTML = `<div class="alert alert-warning">Tidak ada pesanan ditemukan. Kembali ke <a href="index.html">menu</a>.</div>`;
    return;
  }

  function rupiah(n){ return 'Rp ' + Number(n).toLocaleString('id-ID'); }

  elOrderId.textContent = data.id || 'Order -';
  elOrderDate.textContent = new Date().toLocaleString();
  elMethod.textContent = data.method || '-';
  elSubtotal.textContent = rupiah(data.subtotal || 0);
  elShipping.textContent = rupiah(data.shipping || 0);
  elTotal.textContent = rupiah(data.total || 0);

  // items
  elInvoiceItems.innerHTML = (data.items || []).map(i => `
    <div class="d-flex justify-content-between mb-2">
      <div>
        <div class="fw-bold">${i.name}</div>
        <div class="text-muted small">${i.qty} × ${rupiah(i.price)}</div>
      </div>
      <div class="fw-bold">${rupiah(i.price * i.qty)}</div>
    </div>
  `).join("");

  // payment badge
  if(data.paid){
    elPayBadge.innerHTML = `<span class="badge status-paid py-2 px-3">Berhasil • Dibayar</span>`;
    statusBox.innerHTML = `<div class="text-center mb-4"><h3 class="text-success">Pesanan Berhasil Diterima ✅</h3><p class="text-muted">Terima kasih — pesanan Anda sedang diproses.</p></div>`;
  } else {
    elPayBadge.innerHTML = `<span class="badge status-pending py-2 px-3">Menunggu Pembayaran</span>`;
    statusBox.innerHTML = `<div class="text-center mb-4"><h3 class="text-warning">Pesanan Diterima (Belum dibayar)</h3><p class="text-muted">Ikuti instruksi pembayaran pada metode yang dipilih.</p></div>`;
  }

  // PDF invoice using jsPDF
  document.getElementById('downloadPdf').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    const left = 40;
    let y = 40;
    doc.setFontSize(16).text('Bakso Malang Lestari 38', left, y); y += 22;
    doc.setFontSize(10).text(`Order ID: ${data.id}`, left, y); y += 16;
    doc.text(`Tanggal: ${new Date().toLocaleString()}`, left, y); y += 20;

    doc.setLineWidth(0.5); doc.line(left, y, 550, y); y += 12;

    (data.items || []).forEach(i => {
      doc.setFontSize(12).text(`${i.name} (${i.qty}x)`, left, y);
      doc.text(rupiah(i.price * i.qty), 480, y, { align: 'right' });
      y += 16;
    });

    y += 8; doc.line(left, y, 550, y); y += 12;

    doc.setFontSize(12).text('Subtotal', left, y); doc.text(rupiah(data.subtotal), 480, y, { align:'right' }); y += 16;
    doc.text('Ongkos Kirim', left, y); doc.text(rupiah(data.shipping), 480, y, { align:'right' }); y += 18;
    doc.setFontSize(14).text('Total', left, y); doc.text(rupiah(data.total), 480, y, { align:'right' });

    doc.save(`Invoice_${data.id}.pdf`);
  });

  // print button
  document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
  });

  // Send via WA (merchant number)
  document.getElementById('sendWA').addEventListener('click', () => {
    const waNumber = "6289630574763";
    let text = `Pesanan saya:%0AOrderID: ${data.id}%0A%0A`;
    (data.items || []).forEach(i => {
      text += `${i.name} (${i.qty}x) - ${i.price.toLocaleString('id-ID')}%0A`;
    });
    text += `%0ATotal: ${data.total.toLocaleString('id-ID')}%0AMetode: ${data.method}%0A%0A`;
    const url = `https://wa.me/${waNumber}?text=${text}`;
    window.open(url, '_blank');
  });

})();
