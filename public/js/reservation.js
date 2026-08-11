// ============================================================
//  KOLOM BAGIAN RESERVASI: reservation.js
//  File ini mengatur seluruh logika reservasi tempat:
//  - Buka / tutup modal form reservasi
//  - Render pilihan menu di form reservasi
//  - Simpan data reservasi ke database dan localStorage
//  - Tampilkan riwayat reservasi
//  - Update status reservasi (Selesai)
//  - Export data reservasi ke CSV
// ============================================================

// KOLOM BAGIAN RESERVASI: Kunci penyimpanan data di localStorage
const RESERVATION_KEY = 'freshpos_reservations';

// ============================================================
// KOLOM BAGIAN RESERVASI: REFERENSI ELEMEN DOM
// Semua elemen HTML yang dibutuhkan oleh fitur reservasi
// ============================================================
const btnOpenReservation   = document.getElementById('btnOpenReservation');
const btnCloseReservation  = document.getElementById('btnCloseReservation');
const btnOpenResHistory    = document.getElementById('btnOpenResHistory');
const btnCloseResHistory   = document.getElementById('btnCloseResHistory');
const reservationModal     = document.getElementById('reservationModal');
const resHistoryModal      = document.getElementById('resHistoryModal');
const reservationForm      = document.getElementById('reservationForm');
const resFoodSelection     = document.getElementById('resFoodSelection');
const resTotalOrder        = document.getElementById('resTotalOrder');
const resHistoryList       = document.getElementById('resHistoryList');
const btnExportRes         = document.getElementById('btnExportRes');

// KOLOM BAGIAN RESERVASI: State pilihan menu dalam form reservasi
// Objek dengan format { productId: qty }
let selectedResFoods = {};

// ============================================================
// KOLOM BAGIAN RESERVASI: EVENT LISTENERS – BUKA/TUTUP MODAL
// ============================================================

// Tombol "Buat Reservasi" di sidebar → buka modal form reservasi
if (btnOpenReservation) {
    btnOpenReservation.addEventListener('click', () => {
        // Set tanggal default ke hari ini
        const today     = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('resDate');
        if (dateInput) dateInput.value = today;

        // Reset pilihan menu dan total
        selectedResFoods = {};
        renderResFoodSelection();
        updateResTotal();

        reservationModal.classList.add('show');
    });
}

// Tombol tutup modal form reservasi
if (btnCloseReservation) {
    btnCloseReservation.addEventListener('click', () => {
        reservationModal.classList.remove('show');
    });
}

// Tombol "Riwayat Reservasi" di sidebar → buka modal riwayat
if (btnOpenResHistory) {
    btnOpenResHistory.addEventListener('click', () => {
        renderResHistory(); // Render ulang daftar reservasi sebelum buka modal
        resHistoryModal.classList.add('show');
    });
}

// Tombol tutup modal riwayat reservasi
if (btnCloseResHistory) {
    btnCloseResHistory.addEventListener('click', () => {
        resHistoryModal.classList.remove('show');
    });
}

// Tombol Export CSV reservasi
if (btnExportRes) {
    btnExportRes.addEventListener('click', exportReservationsToCSV);
}

// ============================================================
// KOLOM BAGIAN RESERVASI: EXPORT DATA KE FILE CSV
// Mengubah semua data reservasi di localStorage menjadi
// file .csv yang bisa diunduh oleh user.
// ============================================================
function exportReservationsToCSV() {
    const reservations = getReservations();
    if (reservations.length === 0) {
        alert("Tidak ada data reservasi untuk diexport.");
        return;
    }

    // Buat isi CSV: header kolom + baris data
    let csvContent = "ID,Nama,Tanggal,Jam,Jumlah Orang,Meja,Status,Total Pesanan\n";
    reservations.forEach(res => {
        const row = [
            res.id,
            `"${res.name}"`,
            res.date,
            res.time,
            res.people,
            res.table  || "-",
            res.status || "Menunggu",
            res.totalOrder || 0
        ].join(",");
        csvContent += row + "\n";
    });

    // Unduh file CSV dengan nama yang menyertakan tanggal hari ini
    downloadCSV(csvContent, `reservasi_freshpos_${new Date().toISOString().slice(0,10)}.csv`);
}

// Helper: Buat dan unduh file CSV dari string konten
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link  = document.createElement("a");
    const url   = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ============================================================
// KOLOM BAGIAN RESERVASI: RENDER PILIHAN MENU DI FORM RESERVASI
// Menampilkan semua produk sebagai daftar pilihan qty
// di dalam form reservasi. Produk habis stok dinonaktifkan.
// ============================================================
function renderResFoodSelection() {
    if (!resFoodSelection) return;

    resFoodSelection.innerHTML = products.map(prod => {
        const qty          = selectedResFoods[prod.id] || 0;
        const isOutOfStock = prod.stock <= 0;

        return `
            <div class="res-food-item ${isOutOfStock ? 'disabled' : ''}">
                <div class="res-food-info">
                    <span class="res-food-name">${prod.name}</span>
                    <span class="res-food-price">${formatRupiah(prod.price)}</span>
                    ${isOutOfStock
                        ? '<span class="res-food-status">Habis</span>'
                        : `<span class="res-food-stock">Stok: ${prod.stock}</span>`}
                </div>
                <!-- Kontrol qty menu pesanan reservasi -->
                <div class="res-food-qty">
                    <button type="button" class="res-qty-btn"
                            onclick="updateResFoodQty('${prod.id}', -1)"
                            ${qty <= 0 || isOutOfStock ? 'disabled' : ''}>-</button>
                    <span class="res-qty-val">${qty}</span>
                    <button type="button" class="res-qty-btn"
                            onclick="updateResFoodQty('${prod.id}', 1)"
                            ${isOutOfStock || qty >= prod.stock ? 'disabled' : ''}>+</button>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================
// KOLOM BAGIAN RESERVASI: UPDATE QTY MENU DI FORM RESERVASI
// Dipanggil saat user klik + atau - pada daftar menu reservasi.
// ============================================================
window.updateResFoodQty = (productId, delta) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const currentQty = selectedResFoods[productId] || 0;
    const newQty     = currentQty + delta;

    if (newQty < 0) return; // Tidak boleh minus

    // Cek batas stok
    if (newQty > product.stock) {
        alert("Stok tidak mencukupi");
        return;
    }

    // Hapus dari objek jika qty = 0, atau perbarui nilai qty
    if (newQty === 0) {
        delete selectedResFoods[productId];
    } else {
        selectedResFoods[productId] = newQty;
    }

    renderResFoodSelection(); // Perbarui tampilan daftar menu
    updateResTotal();          // Perbarui total pesanan
};

// ============================================================
// KOLOM BAGIAN RESERVASI: HITUNG & TAMPILKAN TOTAL PESANAN MENU
// ============================================================
function updateResTotal() {
    let total = 0;
    for (const id in selectedResFoods) {
        const product = products.find(p => p.id === id);
        if (product) total += product.price * selectedResFoods[id];
    }
    if (resTotalOrder) resTotalOrder.textContent = formatRupiah(total);
}

// ============================================================
// SIMPAN DATA: SUBMIT FORM RESERVASI
// Dipanggil saat user klik tombol "Simpan & Buat Reservasi".
// Validasi data, susun objek reservasi, simpan ke DB dan localStorage.
// ============================================================
if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validasi: kapasitas maksimal 40 orang
        const peopleCount = parseInt(document.getElementById('resPeople').value);
        if (peopleCount > 40) {
            alert("Maaf, kapasitas maksimal reservasi adalah 40 orang.");
            return;
        }

        // Susun daftar item menu yang dipesan beserta total harganya
        const orderedItems = [];
        let totalOrder = 0;
        for (const id in selectedResFoods) {
            const product = products.find(p => p.id === id);
            if (product) {
                orderedItems.push({ ...product, qty: selectedResFoods[id] });
                totalOrder += product.price * selectedResFoods[id];
            }
        }

        // SIMPAN DATA: Susun objek data reservasi lengkap
        const reservationData = {
            id:        'RES-' + Math.floor(100000 + Math.random() * 900000), // ID unik otomatis
            name:      document.getElementById('resName').value,
            date:      document.getElementById('resDate').value,
            time:      document.getElementById('resTime').value,
            people:    peopleCount,
            table:     document.getElementById('resTable').value,
            items:     orderedItems,
            totalOrder: totalOrder,
            createdAt: new Date().toISOString()
        };

        // Simpan ke database dan localStorage
        await saveReservation(reservationData);

        // Kurangi stok produk yang dipesan lewat reservasi
        orderedItems.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) product.stock -= item.qty;
        });
        // Perbarui tampilan grid produk agar stok terupdate
        if (typeof renderProducts === 'function') renderProducts(products);

        // Konfirmasi berhasil & reset form
        alert(`Reservasi berhasil disimpan!\nNama: ${reservationData.name}\nWaktu: ${reservationData.date} ${reservationData.time}\nKapasitas: ${reservationData.people} orang`);
        reservationForm.reset();
        reservationModal.classList.remove('show');
    });
}

// ============================================================
// SIMPAN DATA: FUNGSI SIMPAN RESERVASI
// Jika database aktif, kirim ke server via API.
// Selalu simpan juga ke localStorage sebagai backup offline.
// ============================================================
async function saveReservation(data) {
    // Kirim ke database jika koneksi aktif
    if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
        try {
            const response = await fetch('api/reservations/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.message);
        } catch (e) {
            console.error("Gagal menyimpan reservasi ke DB:", e);
        }
    }

    // Simpan ke localStorage sebagai fallback/offline
    const reservations = getReservations();
    reservations.push(data);
    localStorage.setItem(RESERVATION_KEY, JSON.stringify(reservations));
}

// Ambil semua data reservasi dari localStorage
function getReservations() {
    const data = localStorage.getItem(RESERVATION_KEY);
    return data ? JSON.parse(data) : [];
}

// ============================================================
// KOLOM BAGIAN RESERVASI: RENDER DAFTAR RIWAYAT RESERVASI
// Menampilkan semua reservasi dari localStorage di modal riwayat.
// Setiap item menampilkan info reservasi dan tombol tandai selesai.
// ============================================================
function renderResHistory() {
    if (!resHistoryList) return;

    // Tampilkan dari yang terbaru (reverse)
    const reservations = getReservations().reverse();

    if (reservations.length === 0) {
        resHistoryList.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 20px;">Belum ada riwayat reservasi.</p>';
        return;
    }

    resHistoryList.innerHTML = reservations.map(res => {
        const isDone = res.status === 'Selesai';
        return `
            <div class="res-history-item ${isDone ? 'done' : ''}">
                <!-- Header kartu reservasi: ID dan status -->
                <div class="res-item-header">
                    <span class="res-id">${res.id}</span>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <!-- Badge status reservasi -->
                        <span class="res-status-badge ${isDone ? 'done' : ''}">${res.status || 'Menunggu'}</span>
                        <!-- Tombol Tandai Selesai (hanya muncul jika belum selesai) -->
                        ${!isDone ? `
                            <button class="res-action-btn done"
                                    onclick="updateResStatus('${res.id}', 'Selesai')"
                                    title="Tandai Selesai">
                                <i class="fa-solid fa-check-double"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                <!-- Body: Info nama, tanggal, jam, jumlah orang, meja -->
                <div class="res-item-body">
                    <div class="res-info-main">
                        <strong>${res.name}</strong>
                        <span><i class="fa-solid fa-calendar"></i> ${res.date} | <i class="fa-solid fa-clock"></i> ${res.time}</span>
                        <span><i class="fa-solid fa-users"></i> ${res.people} Orang | Meja: ${res.table || '-'}</span>
                    </div>
                    <!-- Daftar menu yang dipesan (jika ada) -->
                    ${res.items && res.items.length > 0 ? `
                        <div class="res-item-foods">
                            <p>Pesanan Menu:</p>
                            <ul>
                                ${res.items.map(item => `<li>${item.name} (x${item.qty})</li>`).join('')}
                            </ul>
                            <div class="res-item-total">Total: ${formatRupiah(res.totalOrder)}</div>
                        </div>
                    ` : '<p class="no-food">Tidak ada pesanan makanan</p>'}
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================
// KOLOM BAGIAN RESERVASI: UPDATE STATUS RESERVASI
// Dipanggil saat user klik tombol "Tandai Selesai" pada reservasi.
// Jika DB aktif, update ke server. Selalu update di localStorage.
// ============================================================
window.updateResStatus = async (resId, newStatus) => {
    // Update ke database jika aktif
    if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
        try {
            const response = await fetch('api/reservations/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: resId, status: newStatus })
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.message);
        } catch (e) {
            alert("Gagal mengupdate status di database: " + e.message);
            return;
        }
    }

    // Update di localStorage
    const reservations = getReservations();
    const res = reservations.find(r => r.id === resId);
    if (res) {
        res.status = newStatus;
        localStorage.setItem(RESERVATION_KEY, JSON.stringify(reservations));
        renderResHistory(); // Perbarui tampilan riwayat
    }
};

// ============================================================
// KOLOM BAGIAN RESERVASI: TUTUP MODAL SAAT KLIK AREA LUAR
// Jika user klik di luar kotak modal, modal akan tertutup.
// ============================================================
[reservationModal, resHistoryModal].forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
});
