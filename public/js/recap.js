/**
 * FreshPOS – recap.js
 * Logika untuk rekap data transaksi dan reservasi dengan Grafik Analitik (Chart.js),
 * Filter Tanggal X s/d Tanggal Y, Rincian Pesanan Menu, dan Ringkasan Total Harian di bagian bawah.
 */

const recapBody         = document.getElementById('recapBody');
const recapTabs         = document.querySelectorAll('.recap-tab');
const btnOpenRecap      = document.getElementById('btnOpenRecap');
const btnCloseRecap     = document.getElementById('btnCloseRecap');
const recapModal        = document.getElementById('recapModal');
const btnClearRecap     = document.getElementById('btnClearRecap');
const btnExportRecap    = document.getElementById('btnExportRecap');

// Filter Tanggal DOM
const recapStartDateInput = document.getElementById('recapStartDate');
const recapEndDateInput   = document.getElementById('recapEndDate');
const btnFilterRecapDate  = document.getElementById('btnFilterRecapDate');
const btnResetRecapDate   = document.getElementById('btnResetRecapDate');
const chartPeriodBadge    = document.getElementById('chartPeriodBadge');

let currentRecapTab = 'daily'; // 'daily', 'weekly', 'monthly', 'custom'
let customStartDate = null;
let customEndDate   = null;
let recapChartInstance = null;

async function syncRecapFromDB() {
    if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
        try {
            const response = await fetch(`api/history?_=${new Date().getTime()}`);
            const result = await response.json();
            if (result.success) {
                localStorage.setItem('freshpos_order_history', JSON.stringify(result.transactions || []));
                localStorage.setItem('freshpos_reservations', JSON.stringify(result.reservations || []));
            }
        } catch (e) {
            console.error("Gagal sinkronisasi recap dari database:", e);
        }
    }
}

// Event Listeners Modal
if (btnOpenRecap) {
    btnOpenRecap.addEventListener('click', async () => {
        const icon = btnOpenRecap.querySelector('i');
        if (icon) icon.classList.add('fa-spin');

        await syncRecapFromDB();
        renderRecap();

        if (icon) icon.classList.remove('fa-spin');
        if (recapModal) recapModal.classList.add('show');
    });
}

if (btnCloseRecap) {
    btnCloseRecap.addEventListener('click', () => {
        if (recapModal) recapModal.classList.remove('show');
    });
}

if (btnExportRecap) {
    btnExportRecap.addEventListener('click', exportRecapToCSV);
}

// Filter Date Range Listener
if (btnFilterRecapDate) {
    btnFilterRecapDate.addEventListener('click', () => {
        const startVal = recapStartDateInput ? recapStartDateInput.value : '';
        const endVal   = recapEndDateInput ? recapEndDateInput.value : '';

        if (!startVal || !endVal) {
            alert('Silakan pilih Tanggal Mulai dan Tanggal Selesai terlebih dahulu.');
            return;
        }

        customStartDate = new Date(startVal + 'T00:00:00');
        customEndDate   = new Date(endVal + 'T23:59:59');

        if (customStartDate > customEndDate) {
            alert('Tanggal Mulai tidak boleh lebih besar dari Tanggal Selesai.');
            return;
        }

        currentRecapTab = 'custom';
        recapTabs.forEach(t => {
            if (t.getAttribute('data-tab') === 'custom') t.classList.add('active');
            else t.classList.remove('active');
        });

        renderRecap();
    });
}

if (btnResetRecapDate) {
    btnResetRecapDate.addEventListener('click', () => {
        if (recapStartDateInput) recapStartDateInput.value = '';
        if (recapEndDateInput) recapEndDateInput.value = '';
        customStartDate = null;
        customEndDate   = null;
        currentRecapTab = 'daily';
        recapTabs.forEach(t => {
            if (t.getAttribute('data-tab') === 'daily') t.classList.add('active');
            else t.classList.remove('active');
        });
        renderRecap();
    });
}

recapTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        recapTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentRecapTab = tab.getAttribute('data-tab');

        if (currentRecapTab !== 'custom') {
            customStartDate = null;
            customEndDate   = null;
            if (recapStartDateInput) recapStartDateInput.value = '';
            if (recapEndDateInput) recapEndDateInput.value = '';
        }

        renderRecap();
    });
});

function exportRecapToCSV() {
    const history = getHistoryData();
    if (history.length === 0) {
        alert("Tidak ada data transaksi untuk diexport.");
        return;
    }

    const now = new Date();
    const stats = calculateStats(history, getReservationData(), currentRecapTab, now);

    let csvContent = "Tipe,Kode,Kasir/Pemesan,Waktu,Detail Pesanan Menu,Total\n";
    stats.recentItems.forEach(item => {
        const row = [
            item.type,
            item.code,
            `"${item.kasir}"`,
            `"${item.time}"`,
            `"${item.itemsDetail.replace(/"/g, '""')}"`,
            item.total
        ].join(",");
        csvContent += row + "\n";
    });

    csvContent += `\nRINGKASAN REKAP (${currentRecapTab.toUpperCase()})\n`;
    csvContent += `Total Pendapatan Transaksi,${stats.totalRevenue}\n`;
    csvContent += `Total Transaksi,${stats.totalOrders}\n`;
    csvContent += `Total Reservasi,${stats.totalReservations}\n`;
    csvContent += `Total Pesanan Reservasi,${stats.totalResRevenue}\n`;
    csvContent += `\nTOTAL HARIAN (HARI INI)\n`;
    csvContent += `Total Omset Harian,${stats.dailyRevenue}\n`;
    csvContent += `Total Transaksi Harian,${stats.dailyTrxCount}\n`;
    csvContent += `Total Item Terjual Harian,${stats.dailyQtyCount}\n`;

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
                    const response = await fetch('api/history/clear', {
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
        }
    });
}

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

    // Update Badge text
    if (chartPeriodBadge) {
        if (currentRecapTab === 'daily') chartPeriodBadge.textContent = 'Periode Hari Ini';
        else if (currentRecapTab === 'weekly') chartPeriodBadge.textContent = '7 Hari Terakhir';
        else if (currentRecapTab === 'monthly') chartPeriodBadge.textContent = '30 Hari Terakhir';
        else if (currentRecapTab === 'custom' && customStartDate && customEndDate) {
            chartPeriodBadge.textContent = `${customStartDate.toLocaleDateString('id-ID')} s/d ${customEndDate.toLocaleDateString('id-ID')}`;
        }
    }

    const todayStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

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
            <h3 style="margin-top: 15px; margin-bottom: 10px; font-size: 0.95rem; color: var(--green-400); display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-list-check"></i> Rincian Transaksi & Pesanan Menu (${currentRecapTab.toUpperCase()})
            </h3>
            <div class="recap-table-container" style="max-height: 280px; overflow-y: auto;">
                <table class="recap-table">
                    <thead>
                        <tr>
                            <th>Tipe</th>
                            <th>Kode</th>
                            <th>Kasir / Pemesan</th>
                            <th>Waktu / Tanggal</th>
                            <th>Detail Pesanan Menu</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${stats.recentItems.length > 0 ? stats.recentItems.map(item => `
                            <tr>
                                <td><span class="badge ${item.type === 'Transaksi' ? 'badge-verified' : 'badge-status-aktif'}" style="padding: 2px 8px; font-size: 0.75rem; border-radius: 4px;">${item.type}</span></td>
                                <td style="font-weight: 600;">${item.code}</td>
                                <td>${item.kasir}</td>
                                <td>${item.time}</td>
                                <td><small style="color: #cbd5e1; line-height: 1.35; display: block; max-width: 250px;">${item.itemsDetail}</small></td>
                                <td style="font-weight: 600; color: #34d399;">${formatRupiah(item.total)}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="6" style="text-align:center; padding: 20px; color: rgba(255,255,255,0.5);">Tidak ada data pada periode ini</td></tr>'}
                    </tbody>
                </table>
            </div>

            <!-- RINGKASAN TOTAL HARIAN DI BAGIAN BAWAH -->
            <div class="daily-summary-footer" style="margin-top: 20px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.55), rgba(5, 150, 105, 0.75)); border: 2px solid #34d399; border-radius: 14px; padding: 16px 20px; box-shadow: 0 4px 24px rgba(16, 185, 129, 0.45);">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                    <h4 style="margin: 0; font-size: 1rem; color: #ffffff; font-weight: 900; display: flex; align-items: center; gap: 8px; text-shadow: 0 0 10px rgba(52,211,153,0.8), 0 1px 4px rgba(0,0,0,0.6);">
                        <i class="fa-solid fa-calendar-day" style="color: #a7f3d0;"></i> Total Ringkasan Hari Ini (${todayStr})
                    </h4>
                    <div style="display: flex; gap: 20px; flex-wrap: wrap; align-items: center;">
                        <div style="text-align: right;">
                            <span style="font-size: 0.75rem; color: #ffffff; display: block; font-weight: 700; letter-spacing: 0.3px;">Item Terjual Hari Ini</span>
                            <strong style="font-size: 1.1rem; color: #001aff; font-weight: 900; text-shadow: 0 0 8px rgba(0, 89, 255, 0.7);">${stats.dailyQtyCount} Porsi / Item</strong>
                        </div>
                        <div style="text-align: right;">
                            <span style="font-size: 0.75rem; color: #ffffff; display: block; font-weight: 700; letter-spacing: 0.3px;">Total Transaksi Hari Ini</span>
                            <strong style="font-size: 1.1rem; color: #ffd700; font-weight: 900; text-shadow: 0 0 8px rgba(255,215,0,0.7);">${stats.dailyTrxCount} Transaksi</strong>
                        </div>
                        <div style="text-align: right; background: rgba(0,0,0,0.5); padding: 10px 18px; border-radius: 10px; border: 2px solid #34d399; box-shadow: 0 0 12px rgba(52,211,153,0.4);">
                            <span style="font-size: 0.75rem; color: #ffffff; display: block; font-weight: 700; letter-spacing: 0.3px;">Total Omset Harian</span>
                            <strong style="font-size: 1.3rem; color: #00ff99; font-weight: 900; text-shadow: 0 0 10px rgba(0,255,153,0.8);">${formatRupiah(stats.dailyRevenue)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderChart(stats.chartLabels, stats.chartData);
}

function calculateStats(history, reservations, tab, now) {
    let filterFn;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (tab === 'daily') {
        filterFn = (dateStr) => {
            if (!dateStr) return false;
            const d = new Date(dateStr);
            return d >= today;
        };
    } else if (tab === 'weekly') {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        filterFn = (dateStr) => {
            if (!dateStr) return false;
            return new Date(dateStr) >= lastWeek;
        };
    } else if (tab === 'monthly') {
        const lastMonth = new Date(today);
        lastMonth.setDate(today.getDate() - 30);
        filterFn = (dateStr) => {
            if (!dateStr) return false;
            return new Date(dateStr) >= lastMonth;
        };
    } else if (tab === 'custom' && customStartDate && customEndDate) {
        filterFn = (dateStr) => {
            if (!dateStr) return false;
            const d = new Date(dateStr);
            return d >= customStartDate && d <= customEndDate;
        };
    } else {
        filterFn = () => true;
    }

    const filteredHistory = history.filter(h => filterFn(h.timestamp || h.created_at));
    const filteredRes     = reservations.filter(r => filterFn(r.createdAt || r.created_at));

    const totalRevenue    = filteredHistory.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0);
    const totalResRevenue = filteredRes.reduce((acc, curr) => acc + (parseFloat(curr.totalOrder || curr.total_order) || 0), 0);

    const recentHistory = filteredHistory.map(h => {
        const dt = new Date(h.timestamp || h.created_at || Date.now());

        let itemsDetail = '-';
        if (h.items && Array.isArray(h.items) && h.items.length > 0) {
            itemsDetail = h.items.map(i => `${i.product_name || i.name} (x${i.qty || 1})`).join(', ');
        }

        return {
            type: 'Transaksi',
            code: h.order_code || ('ORD-' + h.id),
            kasir: h.kasir || 'Admin Utama',
            time: dt.toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            itemsDetail: itemsDetail,
            total: parseFloat(h.total) || 0,
            rawTimestamp: dt.getTime()
        };
    });

    const recentRes = filteredRes.map(r => {
        const dt = new Date(r.createdAt || r.created_at || Date.now());

        let itemsDetail = '-';
        if (r.items && Array.isArray(r.items) && r.items.length > 0) {
            itemsDetail = r.items.map(i => `${i.name || i.product_name} (x${i.qty || 1})`).join(', ');
        } else if (r.table_num || r.table || r.people) {
            itemsDetail = `Reservasi Tempat: Meja ${r.table_num || r.table || '-'} (${r.people || 1} org)`;
        }

        return {
            type: 'Reservasi',
            code: r.id || '-',
            kasir: r.name || 'Pelanggan',
            time: dt.toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            itemsDetail: itemsDetail,
            total: parseFloat(r.totalOrder || r.total_order) || 0,
            rawTimestamp: dt.getTime()
        };
    });

    const combinedItems = [...recentHistory, ...recentRes]
        .sort((a, b) => b.rawTimestamp - a.rawTimestamp);

    // Dynamic Chart Grouping (Daily Breakdown for chart)
    const chartMap = {};
    filteredHistory.forEach(h => {
        const dt = new Date(h.timestamp || h.created_at || Date.now());
        const dateKey = dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        chartMap[dateKey] = (chartMap[dateKey] || 0) + (parseFloat(h.total) || 0);
    });

    const chartLabels = Object.keys(chartMap);
    const chartData   = Object.values(chartMap);

    // KALKULASI TOTAL HARIAN (HARI INI)
    const startOfToday = today.getTime();

    const todayHistory = history.filter(h => {
        const t = new Date(h.timestamp || h.created_at).getTime();
        return t >= startOfToday;
    });

    const todayRes = reservations.filter(r => {
        const t = new Date(r.createdAt || r.created_at).getTime();
        return t >= startOfToday;
    });

    const dailyRevenue = todayHistory.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0) +
                         todayRes.reduce((acc, curr) => acc + (parseFloat(curr.totalOrder || curr.total_order) || 0), 0);

    const dailyTrxCount = todayHistory.length + todayRes.length;

    let dailyQtyCount = 0;
    todayHistory.forEach(h => {
        if (h.items && Array.isArray(h.items)) {
            h.items.forEach(i => dailyQtyCount += (parseInt(i.qty) || 1));
        }
    });
    todayRes.forEach(r => {
        if (r.items && Array.isArray(r.items)) {
            r.items.forEach(i => dailyQtyCount += (parseInt(i.qty) || 1));
        }
    });

    return {
        totalRevenue,
        totalResRevenue,
        totalOrders: filteredHistory.length,
        totalReservations: filteredRes.length,
        recentItems: combinedItems,
        chartLabels,
        chartData,
        dailyRevenue,
        dailyTrxCount,
        dailyQtyCount
    };
}

function renderChart(labels, data) {
    const canvas = document.getElementById('recapChartCanvas');
    if (!canvas) return;

    if (typeof Chart === 'undefined') {
        console.warn('Chart.js belum dimuat.');
        return;
    }

    const ctx = canvas.getContext('2d');

    if (recapChartInstance) {
        recapChartInstance.destroy();
    }

    const displayLabels = labels.length > 0 ? labels : ['Belum Ada Data'];
    const displayData   = data.length > 0 ? data : [0];

    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(52, 211, 153, 0.4)');
    gradient.addColorStop(1, 'rgba(52, 211, 153, 0.0)');

    recapChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: displayLabels,
            datasets: [{
                label: 'Pendapatan Penjualan (Rp)',
                data: displayData,
                borderColor: '#34d399',
                borderWidth: 3,
                backgroundColor: gradient,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#e2e8f0',
                        font: { family: 'Inter', size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ' Pendapatan: ' + formatRupiah(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: 'rgba(255, 255, 255, 0.7)', font: { family: 'Inter', size: 11 } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: { family: 'Inter', size: 11 },
                        callback: function(val) {
                            if (val >= 1000000) return 'Rp ' + (val/1000000).toFixed(1) + 'M';
                            if (val >= 1000) return 'Rp ' + (val/1000).toFixed(0) + 'k';
                            return 'Rp ' + val;
                        }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.08)' }
                }
            }
        }
    });
}

// Close modal when clicking outside
if (recapModal) {
    recapModal.addEventListener('click', (e) => {
        if (e.target === recapModal) {
            recapModal.classList.remove('show');
        }
    });
}
