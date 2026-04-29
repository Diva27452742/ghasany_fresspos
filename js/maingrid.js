/**
 * FreshPOS – maingrid.js
 * Logika untuk merender grid produk utama
 */

function renderProducts(list) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    if (list.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-box-open"></i>
                <h3>Menu tidak ditemukan</h3>
                <p>Coba kata kunci pencarian yang berbeda.</p>
            </div>`;
        return;
    }

    productsGrid.innerHTML = list.map((prod, i) => `
        <div class="product-card"
             onclick="addToCart('${prod.id}')"
             style="animation: cardIn .4s var(--ease) ${i * 0.04}s both;">
            <div class="product-img-wrap">
                <img src="${prod.image}" alt="${prod.name}" class="product-img"
                     onerror="this.src='https://placehold.co/300x160/d1fae5/064e3b?text=FreshPOS'">
                <div class="product-overlay">
                    <span><i class="fa-solid fa-plus"></i> Tambah</span>
                </div>
                ${prod.category !== 'all'
                    ? `<span class="product-cat-chip">${catLabels[prod.category] || prod.category}</span>`
                    : ''}
            </div>
            <div class="product-details">
                <span class="product-name">${prod.name}</span>
                <div class="product-footer">
                    <span class="product-price">${formatRupiah(prod.price)}</span>
                    <div class="add-icon"><i class="fa-solid fa-plus"></i></div>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCountBadge(count) {
    const badge = document.getElementById('productCountBadge');
    if (badge) badge.textContent = `${count} produk`;
}
