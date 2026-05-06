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
        const timeStr = orderDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-order-id">${order.order_code}</span>
                    <span class="history-date">${timeStr}</span>
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

// Event Listeners
if (btnOpenHistory) {
    btnOpenHistory.addEventListener('click', () => {
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
    btnRefreshHistory.addEventListener('click', () => {
        renderHistory();
    });
}

if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin menghapus SEMUA riwayat pesanan?')) {
            localStorage.removeItem(HISTORY_KEY);
            renderHistory();
        }
    });
}

// Close modal when clicking outside
if (historyModal) {
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.classList.remove('show');
        }
    });
}
