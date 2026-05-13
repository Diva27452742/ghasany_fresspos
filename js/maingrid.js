let globalProducts = [];
let catLabels = {};

async function loadProducts() {
    try {
        const res = await fetch(`${API_PATH}products_api.php`);
        const data = await res.json();
        if(data.success) {
            globalProducts = data.data;
            filterAndRenderProducts();
            
            // Low stock notification
            const lowStock = globalProducts.filter(p => p.stock < 10 && p.stock > 0);
            if(lowStock.length > 0) {
                showToast(`${lowStock.length} produk stok menipis!`, 'warning');
            }
        }
    } catch(e) { console.error(e); }
}

function filterAndRenderProducts() {
    const termInput = document.getElementById('searchInput');
    const term = termInput ? termInput.value.toLowerCase() : '';
    
    let filtered = globalProducts;
    if(currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    if(term) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }
    
    renderProducts(filtered);
    
    const countBadge = document.getElementById('productCountBadge');
    if(countBadge) countBadge.textContent = `${filtered.length} produk`;
}

function renderProducts(list) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    if (list.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-box-open"></i>
                <h3>Menu tidak ditemukan</h3>
            </div>`;
        return;
    }

    productsGrid.innerHTML = list.map((prod, i) => `
        <div class="product-card"
             onclick="addToCart('${prod.id}')"
             style="animation: cardIn .4s var(--ease) ${i * 0.04}s both; ${prod.stock <= 0 ? 'opacity:0.5; pointer-events:none;' : ''}">
            <div class="product-img-wrap">
                <img src="${prod.image}" alt="${prod.name}" class="product-img" onerror="this.src='https://placehold.co/300x160/d1fae5/064e3b?text=FreshPOS'">
                <div class="product-overlay">
                    <span><i class="fa-solid fa-plus"></i> Tambah</span>
                </div>
                ${prod.category !== 'all' ? `<span class="product-cat-chip">${catLabels[prod.category] || prod.category}</span>` : ''}
            </div>
            <div class="product-details">
                <span class="product-name">${prod.name}</span>
                <div class="product-footer">
                    <span class="product-price">${formatRupiah(prod.price)}</span>
                    <div class="add-icon"><i class="fa-solid ${prod.stock > 0 ? 'fa-plus' : 'fa-xmark'}"></i></div>
                </div>
                <div style="font-size: 0.75rem; color: ${prod.stock < 10 ? '#dc2626' : 'var(--text-muted)'}; margin-top: 4px; font-weight:600;">
                    Sisa Stok: ${prod.stock}
                </div>
            </div>
        </div>
    `).join('');
}
