/**
 * FreshPOS – stock_admin.js
 * Logika untuk pengaturan stok menu secara fleksibel oleh admin
 */

const stockAdminModal = document.getElementById('stockAdminModal');
const btnOpenStockAdmin = document.getElementById('btnOpenStockAdmin');
const btnCloseStockAdmin = document.getElementById('btnCloseStockAdmin');
const btnSaveStock = document.getElementById('btnSaveStock');
const stockListContainer = document.getElementById('stockListContainer');
const stockSearchInput = document.getElementById('stockSearchInput');

// Event Listeners
if (btnOpenStockAdmin) {
    btnOpenStockAdmin.addEventListener('click', () => {
        renderStockAdminList();
        stockAdminModal.classList.add('show');
    });
}

if (btnCloseStockAdmin) {
    btnCloseStockAdmin.addEventListener('click', () => {
        stockAdminModal.classList.remove('show');
    });
}

if (btnSaveStock) {
    btnSaveStock.addEventListener('click', () => {
        stockAdminModal.classList.remove('show');
    });
}

if (stockSearchInput) {
    stockSearchInput.addEventListener('input', () => {
        renderStockAdminList(stockSearchInput.value);
    });
}

function renderStockAdminList(query = '') {
    if (!stockListContainer) return;
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    stockListContainer.innerHTML = filtered.map(prod => `
        <div class="stock-admin-item">
            <div class="stock-item-info">
                <img src="${prod.image}" alt="${prod.name}" class="stock-item-thumb" onerror="this.src='https://placehold.co/50x50?text=Food'">
                <div class="stock-item-text">
                    <span class="stock-item-name">${prod.name}</span>
                    <span class="stock-item-cat">${prod.category}</span>
                </div>
            </div>
            <div class="stock-item-control">
                <button class="stock-control-btn" onclick="updateStockValue('${prod.id}', -1)">-</button>
                <input type="number" class="stock-input" value="${prod.stock}" 
                       onchange="updateStockValue('${prod.id}', this.value, true)"
                       id="stock-input-${prod.id}">
                <button class="stock-control-btn" onclick="updateStockValue('${prod.id}', 1)">+</button>
            </div>
        </div>
    `).join('');
}

window.updateStockValue = (productId, val, isDirect = false) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (isDirect) {
        product.stock = parseInt(val) || 0;
    } else {
        product.stock = Math.max(0, product.stock + val);
    }

    // Update input value in UI if it exists
    const input = document.getElementById(`stock-input-${productId}`);
    if (input) input.value = product.stock;

    // Refresh main product grid
    if (typeof renderProducts === 'function') {
        renderProducts(products);
    }
};

// Close modal when clicking outside
if (stockAdminModal) {
    stockAdminModal.addEventListener('click', (e) => {
        if (e.target === stockAdminModal) {
            stockAdminModal.classList.remove('show');
        }
    });
}
