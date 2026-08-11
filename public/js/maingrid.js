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

    productsGrid.innerHTML = list.map((prod, i) => {
        const isOutOfStock = prod.stock <= 0;
        return `
            <!-- =========================================================================
                 [TAMPILAN KARTU PRODUK] - MENAMPILKAN SETIAP MENU (SEPERTI ES KRIM VANILLA)
                 Grep / Cari "TAMPILAN KARTU PRODUK" untuk menemukan kode ini.
                 ========================================================================= -->
            <div class="product-card ${isOutOfStock ? 'out-of-stock' : ''}"
                 onclick="${isOutOfStock ? '' : `addToCart('${prod.id}')`}"
                 style="animation: cardIn .4s var(--ease) ${i * 0.04}s both;">
                
                <!-- Wrapper Gambar & Badge (Kategori, Stok) -->
                <div class="product-img-wrap">
                    <!-- Foto Produk -->
                    <img src="${prod.image}" alt="${prod.name}" class="product-img"
                         onerror="this.src='https://placehold.co/300x160/d1fae5/064e3b?text=FreshPOS'">
                    
                    <!-- Overlay Efek Hover "Tambah" -->
                    <div class="product-overlay">
                        <span><i class="fa-solid fa-plus"></i> Tambah</span>
                    </div>
                    
                    <!-- Badge Kategori (Contoh: DESSERT) -->
                    ${prod.category !== 'all'
                        ? `<span class="product-cat-chip">${catLabels[prod.category] || prod.category}</span>`
                        : ''}
                    
                    <!-- Badge Jumlah Stok (Contoh: Stok: 12 atau Stok Habis) -->
                    ${isOutOfStock 
                        ? `<span class="stock-badge habis">Stok Habis</span>`
                        : `<span class="stock-badge">Stok: ${prod.stock}</span>`}
                </div>
                
                <!-- Informasi Detail Produk (Nama, Harga, & Tombol Plus) -->
                <div class="product-details">
                    <!-- Nama Produk (Contoh: Es Krim Vanilla) -->
                    <span class="product-name">${prod.name}</span>
                    
                    <div class="product-footer">
                        <!-- Harga Produk (Contoh: Rp 18.000) -->
                        <span class="product-price">${formatRupiah(prod.price)}</span>
                        
                        <!-- Tombol Bulat Hijau Plus (+) di Pojok Kanan Bawah -->
                        <div class="add-icon"><i class="fa-solid fa-plus"></i></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateCountBadge(count) {
    const badge = document.getElementById('productCountBadge');
    if (badge) badge.textContent = `${count} produk`;
}
