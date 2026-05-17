/**
 * FreshPOS – recap.js
 * Logika untuk rekap data transaksi dan reservasi (Harian, Mingguan, Bulanan)
 */

const recapBody = document.getElementById('recapBody');
const recapTabs = document.querySelectorAll('.recap-tab');
const btnOpenRecap = document.getElementById('btnOpenRecap');
const btnCloseRecap = document.getElementById('btnCloseRecap');
const recapModal = document.getElementById('recapModal');
const btnClearRecap = document.getElementById('btnClearRecap');
const btnExportRecap = document.getElementById('btnExportRecap');

let currentRecapTab = 'daily';

// Event Listeners
if (btnOpenRecap) {
    btnOpenRecap.addEventListener('click', () => {
        renderRecap();
        recapModal.classList.add('show');
    });
}

if (btnCloseRecap) {
    btnCloseRecap.addEventListener('click', () => {
        recapModal.classList.remove('show');
    });
}

if (btnExportRecap) {
    btnExportRecap.addEventListener('click', exportRecapToCSV);
}

function exportRecapToCSV() {
    const history = getHistoryData();
    if (history.length === 0) {
        alert("Tidak ada data transaksi untuk diexport.");
        return;
    }

    const now = new Date();
    const stats = calculateStats(history, getReservationData(), currentRecapTab, now);
    
    let csvContent = "Tipe,Kode,Waktu,Total\n";
    stats.recentItems.forEach(item => {
        const row = [
            item.type,
            item.code,
            item.time,
            item.total
        ].join(",");
        csvContent += row + "\n";
    });

    // Add Summary info
    csvContent += `\nRINGKASAN (${currentRecapTab.toUpperCase()})\n`;
    csvContent += `Total Pendapatan,${stats.totalRevenue}\n`;
    csvContent += `Total Transaksi,${stats.totalOrders}\n`;
    csvContent += `Total Reservasi,${stats.totalReservations}\n`;

    downloadCSVFile(csvContent, `rekap_${currentRecapTab}_freshpos_${new Date().toISOString().slice(0,10)}.csv`);
}

function downloadCSVFile(content, filename) {
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

if (btnClearRecap) {
    btnClearRecap.addEventListener('click', async () => {
        if (confirm('PERINGATAN: Semua riwayat transaksi dan reservasi akan DIHAPUS PERMANEN. Lanjutkan?')) {
            if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
                try {
                    const response = await fetch('php/api/clear_history.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'all' })
                    });
                    const res = await response.json();
                    if (!res.success) throw new Error(res.message);
                } catch (e) {
                    alert("Gagal menghapus data dari database: " + e.message);
                    return;
                }
            }
            localStorage.removeItem('freshpos_order_history');
            localStorage.removeItem('freshpos_reservations');
            alert('Semua data berhasil dibersihkan.');
            renderRecap();
            // Also refresh other lists if open
            if (typeof renderHistory === 'function') renderHistory();
            if (typeof renderResHistory === 'function') renderResHistory();
        }
    });
}

recapTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        recapTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentRecapTab = tab.getAttribute('data-tab');
        renderRecap();
    });
});

function getHistoryData() {
    const data = localStorage.getItem('freshpos_order_history');
    return data ? JSON.parse(data) : [];
}

function getReservationData() {
    const data = localStorage.getItem('freshpos_reservations');
    return data ? JSON.parse(data) : [];
}

function renderRecap() {
    if (!recapBody) return;
    
    const history = getHistoryData();
    const reservations = getReservationData();
    
    const now = new Date();
    const stats = calculateStats(history, reservations, currentRecapTab, now);
    
    recapBody.innerHTML = `
        <div class="recap-stats-grid">
            <div class="recap-card">
                <i class="fa-solid fa-money-bill-trend-up"></i>
                <div class="recap-info">
                    <span class="label">Total Pendapatan</span>
                    <span class="value">${formatRupiah(stats.totalRevenue)}</span>
                </div>
            </div>
            <div class="recap-card">
                <i class="fa-solid fa-receipt"></i>
                <div class="recap-info">
                    <span class="label">Total Transaksi</span>
                    <span class="value">${stats.totalOrders} Transaksi</span>
                </div>
            </div>
            <div class="recap-card">
                <i class="fa-solid fa-calendar-check"></i>
                <div class="recap-info">
                    <span class="label">Total Reservasi</span>
                    <span class="value">${stats.totalReservations} Reservasi</span>
                </div>
            </div>
            <div class="recap-card">
                <i class="fa-solid fa-utensils"></i>
                <div class="recap-info">
                    <span class="label">Pesanan Reservasi</span>
                    <span class="value">${formatRupiah(stats.totalResRevenue)}</span>
                </div>
            </div>
        </div>
        
        <div class="recap-details">
            <h3>Rincian Terakhir (${currentRecapTab.toUpperCase()})</h3>
            <div class="recap-table-container">
                <table class="recap-table">
                    <thead>
                        <tr>
                            <th>Tipe</th>
                            <th>Kode</th>
                            <th>Waktu</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${stats.recentItems.length > 0 ? stats.recentItems.map(item => `
                            <tr>
                                <td>${item.type}</td>
                                <td>${item.code}</td>
                                <td>${item.time}</td>
                                <td>${formatRupiah(item.total)}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="4" style="text-align:center;">Tidak ada data</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function calculateStats(history, reservations, tab, now) {
    let filterFn;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (tab === 'daily') {
        filterFn = (date) => {
            const d = new Date(date);
            return d >= today;
        };
    } else if (tab === 'weekly') {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        filterFn = (date) => new Date(date) >= lastWeek;
    } else if (tab === 'monthly') {
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        filterFn = (date) => new Date(date) >= lastMonth;
    }
    
    const filteredHistory = history.filter(h => filterFn(h.timestamp));
    const filteredRes = reservations.filter(r => filterFn(r.createdAt));
    
    const totalRevenue = filteredHistory.reduce((acc, curr) => acc + curr.total, 0);
    const totalResRevenue = filteredRes.reduce((acc, curr) => acc + (curr.totalOrder || 0), 0);
    
    const recentHistory = filteredHistory.slice(-10).map(h => ({
        type: 'Transaksi',
        code: h.order_code,
        time: new Date(h.timestamp).toLocaleString('id-ID', {day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit'}),
        total: h.total,
        rawTimestamp: new Date(h.timestamp).getTime()
    }));
    
    const recentRes = filteredRes.slice(-10).map(r => ({
        type: 'Reservasi',
        code: r.id,
        time: new Date(r.createdAt).toLocaleString('id-ID', {day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit'}),
        total: r.totalOrder || 0,
        rawTimestamp: new Date(r.createdAt).getTime()
    }));

    const combinedItems = [...recentHistory, ...recentRes]
        .sort((a,b) => b.rawTimestamp - a.rawTimestamp)
        .slice(0, 10);

    return {
        totalRevenue,
        totalResRevenue,
        totalOrders: filteredHistory.length,
        totalReservations: filteredRes.length,
        recentItems: combinedItems
    };
}

// Close modal when clicking outside
if (recapModal) {
    recapModal.addEventListener('click', (e) => {
        if (e.target === recapModal) {
            recapModal.classList.remove('show');
        }
    });
}
