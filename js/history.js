const HISTORY_KEY = 'freshpos_order_history';

// Elements
const btnOpenHistory = document.getElementById('btnOpenHistory');
const btnCloseHistory = document.getElementById('btnCloseHistory');
const historyModal = document.getElementById('historyModal');
const historyList = document.getElementById('historyList');
const historyFilterBtns = document.querySelectorAll('.history-filter-btn');
const btnRefreshHistory = document.getElementById('btnRefreshHistory');
const btnClearHistory = document.getElementById('btnClearHistory');

let currentHistoryFilter = 'today';

// Get History
function getHistory() {
    const historyStr = localStorage.getItem(HISTORY_KEY);
    return historyStr ? JSON.parse(historyStr) : [];
}

// Save Order to History
function saveOrderToHistory(orderData) {
    const history = getHistory();
    // Add timestamp if not exists
    if (!orderData.timestamp) {
        orderData.timestamp = new Date().toISOString();
    }
    history.push(orderData);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// Filter History
function filterHistory(history, filterType) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    return history.filter(order => {
        const orderDate = new Date(order.timestamp);
        const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
        
        if (filterType === 'today') {
            return orderDay.getTime() === today.getTime();
        } else if (filterType === 'yesterday') {
            return orderDay.getTime() === yesterday.getTime();
        } else if (filterType === 'twodaysago') {
            return orderDay.getTime() === twoDaysAgo.getTime();
        }
        return false;
    }).reverse(); // Latest first
}

// Render History
function renderHistory() {
    if (!historyList) return;
    
    const history = getHistory();
    const filteredHistory = filterHistory(history, currentHistoryFilter);

    if (filteredHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history-msg">
                <i class="fa-solid fa-clock"></i>
                <p>Tidak ada riwayat pesanan untuk filter ini.</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = filteredHistory.map(order => {
        const orderDate = new Date(order.timestamp);
        // Format: DD/MM/YYYY HH:mm
        const dateStr = orderDate.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = orderDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-order-id">${order.order_code}</span>
                    <span class="history-date">${dateStr} - ${timeStr}</span>
                </div>
                <div class="history-item-body">
                    <div class="history-details">
                        <span style="font-size: 0.9rem; color: var(--text-dark);">Kasir: ${order.kasir}</span>
                        <span class="history-method"><i class="fa-solid fa-wallet"></i> ${order.payment_method}</span>
                    </div>
                    <div class="history-total">
                        ${formatRupiah(order.total)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

if (btnOpenHistory) {
    btnOpenHistory.addEventListener('click', async () => {
        await syncHistoryFromDB();
        renderHistory();
        historyModal.classList.add('show');
    });
}

if (btnCloseHistory) {
    btnCloseHistory.addEventListener('click', () => {
        historyModal.classList.remove('show');
    });
}

historyFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        historyFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentHistoryFilter = btn.getAttribute('data-filter');
        renderHistory();
    });
});

if (btnRefreshHistory) {
    btnRefreshHistory.addEventListener('click', async () => {
        const icon = btnRefreshHistory.querySelector('i');
        if (icon) icon.classList.add('fa-spin');
        await syncHistoryFromDB();
        renderHistory();
        setTimeout(() => {
            if (icon) icon.classList.remove('fa-spin');
        }, 600);
    });
}

if (btnClearHistory) {
    btnClearHistory.addEventListener('click', async () => {
        if (confirm('Apakah Anda yakin ingin menghapus SEMUA riwayat pesanan?')) {
            if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
                try {
                    const response = await fetch('php/api/clear_history.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'transactions' })
                    });
                    const res = await response.json();
                    if (!res.success) throw new Error(res.message);
                } catch (e) {
                    alert("Gagal menghapus riwayat dari database: " + e.message);
                    return;
                }
            }
            localStorage.removeItem(HISTORY_KEY);
            renderHistory();
        }
    });
}

// Sync History from DB
async function syncHistoryFromDB() {
    if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
        try {
            const response = await fetch('php/api/get_history.php');
            const data = await response.json();
            if (data.success) {
                localStorage.setItem(HISTORY_KEY, JSON.stringify(data.transactions));
                localStorage.setItem('freshpos_reservations', JSON.stringify(data.reservations));
            }
        } catch (e) {
            console.error("Gagal sinkronisasi data dari database:", e);
        }
    }
}

// Automatically sync on load and bind to modals
document.addEventListener('DOMContentLoaded', () => {
    syncHistoryFromDB().then(() => {
        if (typeof renderHistory === 'function') renderHistory();
        if (typeof renderResHistory === 'function') renderResHistory();
        if (typeof renderRecap === 'function') renderRecap();
    });
});


// Close modal when clicking outside
if (historyModal) {
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.classList.remove('show');
        }
    });
}
