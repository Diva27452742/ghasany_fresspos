/**
 * FreshPOS – reservation.js
 * Logika untuk menangani reservasi tempat
 */

const RESERVATION_KEY = 'freshpos_reservations';

// Elements
const btnOpenReservation = document.getElementById('btnOpenReservation');
const btnCloseReservation = document.getElementById('btnCloseReservation');
const btnOpenResHistory = document.getElementById('btnOpenResHistory');
const btnCloseResHistory = document.getElementById('btnCloseResHistory');
const reservationModal = document.getElementById('reservationModal');
const resHistoryModal = document.getElementById('resHistoryModal');
const reservationForm = document.getElementById('reservationForm');
const resFoodSelection = document.getElementById('resFoodSelection');
const resTotalOrder = document.getElementById('resTotalOrder');
const resHistoryList = document.getElementById('resHistoryList');
const btnExportRes = document.getElementById('btnExportRes');

let selectedResFoods = {}; // { productId: qty }

// Event Listeners
if (btnOpenReservation) {
    btnOpenReservation.addEventListener('click', () => {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('resDate');
        if (dateInput) dateInput.value = today;
        
        selectedResFoods = {};
        renderResFoodSelection();
        updateResTotal();
        reservationModal.classList.add('show');
    });
}

if (btnCloseReservation) {
    btnCloseReservation.addEventListener('click', () => {
        reservationModal.classList.remove('show');
    });
}

if (btnOpenResHistory) {
    btnOpenResHistory.addEventListener('click', () => {
        renderResHistory();
        resHistoryModal.classList.add('show');
    });
}

if (btnCloseResHistory) {
    btnCloseResHistory.addEventListener('click', () => {
        resHistoryModal.classList.remove('show');
    });
}

if (btnExportRes) {
    btnExportRes.addEventListener('click', exportReservationsToCSV);
}

function exportReservationsToCSV() {
    const reservations = getReservations();
    if (reservations.length === 0) {
        alert("Tidak ada data reservasi untuk diexport.");
        return;
    }

    let csvContent = "ID,Nama,Tanggal,Jam,Jumlah Orang,Meja,Status,Total Pesanan\n";
    reservations.forEach(res => {
        const row = [
            res.id,
            `"${res.name}"`,
            res.date,
            res.time,
            res.people,
            res.table || "-",
            res.status || "Menunggu",
            res.totalOrder || 0
        ].join(",");
        csvContent += row + "\n";
    });

    downloadCSV(csvContent, `reservasi_freshpos_${new Date().toISOString().slice(0,10)}.csv`);
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Render Food Selection in Reservation
function renderResFoodSelection() {
    if (!resFoodSelection) return;
    
    resFoodSelection.innerHTML = products.map(prod => {
        const qty = selectedResFoods[prod.id] || 0;
        const isOutOfStock = prod.stock <= 0;
        
        return `
            <div class="res-food-item ${isOutOfStock ? 'disabled' : ''}">
                <div class="res-food-info">
                    <span class="res-food-name">${prod.name}</span>
                    <span class="res-food-price">${formatRupiah(prod.price)}</span>
                    ${isOutOfStock ? '<span class="res-food-status">Habis</span>' : `<span class="res-food-stock">Stok: ${prod.stock}</span>`}
                </div>
                <div class="res-food-qty">
                    <button type="button" class="res-qty-btn" onclick="updateResFoodQty('${prod.id}', -1)" ${qty <= 0 || isOutOfStock ? 'disabled' : ''}>-</button>
                    <span class="res-qty-val">${qty}</span>
                    <button type="button" class="res-qty-btn" onclick="updateResFoodQty('${prod.id}', 1)" ${isOutOfStock || qty >= prod.stock ? 'disabled' : ''}>+</button>
                </div>
            </div>
        `;
    }).join('');
}

window.updateResFoodQty = (productId, delta) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const currentQty = selectedResFoods[productId] || 0;
    const newQty = currentQty + delta;

    if (newQty < 0) return;
    if (newQty > product.stock) {
        alert("Stok tidak mencukupi");
        return;
    }

    if (newQty === 0) {
        delete selectedResFoods[productId];
    } else {
        selectedResFoods[productId] = newQty;
    }

    renderResFoodSelection();
    updateResTotal();
};

function updateResTotal() {
    let total = 0;
    for (const id in selectedResFoods) {
        const product = products.find(p => p.id === id);
        if (product) total += product.price * selectedResFoods[id];
    }
    if (resTotalOrder) resTotalOrder.textContent = formatRupiah(total);
}

if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const peopleCount = parseInt(document.getElementById('resPeople').value);
        if (peopleCount > 40) {
            alert("Maaf, kapasitas maksimal reservasi adalah 40 orang.");
            return;
        }

        const orderedItems = [];
        let totalOrder = 0;
        for (const id in selectedResFoods) {
            const product = products.find(p => p.id === id);
            if (product) {
                orderedItems.push({ ...product, qty: selectedResFoods[id] });
                totalOrder += product.price * selectedResFoods[id];
            }
        }

        const reservationData = {
            id: 'RES-' + Math.floor(100000 + Math.random() * 900000),
            name: document.getElementById('resName').value,
            date: document.getElementById('resDate').value,
            time: document.getElementById('resTime').value,
            people: peopleCount,
            table: document.getElementById('resTable').value,
            items: orderedItems,
            totalOrder: totalOrder,
            createdAt: new Date().toISOString()
        };
        
        await saveReservation(reservationData);
        
        // Decrease stock if items ordered
        orderedItems.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) product.stock -= item.qty;
        });
        if (typeof renderProducts === 'function') renderProducts(products);

        alert(`Reservasi berhasil disimpan!\nNama: ${reservationData.name}\nWaktu: ${reservationData.date} ${reservationData.time}\nKapasitas: ${reservationData.people} orang`);
        
        reservationForm.reset();
        reservationModal.classList.remove('show');
    });
}

// Functions
async function saveReservation(data) {
    if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
        try {
            const response = await fetch('php/api/save_reservation.php', {
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
    const reservations = getReservations();
    reservations.push(data);
    localStorage.setItem(RESERVATION_KEY, JSON.stringify(reservations));
}

function getReservations() {
    const data = localStorage.getItem(RESERVATION_KEY);
    return data ? JSON.parse(data) : [];
}

function renderResHistory() {
    if (!resHistoryList) return;
    const reservations = getReservations().reverse();

    if (reservations.length === 0) {
        resHistoryList.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 20px;">Belum ada riwayat reservasi.</p>';
        return;
    }

    resHistoryList.innerHTML = reservations.map(res => {
        const isDone = res.status === 'Selesai';
        return `
            <div class="res-history-item ${isDone ? 'done' : ''}">
                <div class="res-item-header">
                    <span class="res-id">${res.id}</span>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <span class="res-status-badge ${isDone ? 'done' : ''}">${res.status || 'Menunggu'}</span>
                        ${!isDone ? `
                            <button class="res-action-btn done" onclick="updateResStatus('${res.id}', 'Selesai')" title="Tandai Selesai">
                                <i class="fa-solid fa-check-double"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="res-item-body">
                    <div class="res-info-main">
                        <strong>${res.name}</strong>
                        <span><i class="fa-solid fa-calendar"></i> ${res.date} | <i class="fa-solid fa-clock"></i> ${res.time}</span>
                        <span><i class="fa-solid fa-users"></i> ${res.people} Orang | Meja: ${res.table || '-'}</span>
                    </div>
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

window.updateResStatus = async (resId, newStatus) => {
    if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
        try {
            const response = await fetch('php/api/update_reservation_status.php', {
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
    const reservations = getReservations();
    const res = reservations.find(r => r.id === resId);
    if (res) {
        res.status = newStatus;
        localStorage.setItem(RESERVATION_KEY, JSON.stringify(reservations));
        renderResHistory();
    }
};

// Close modal when clicking outside
[reservationModal, resHistoryModal].forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
});
