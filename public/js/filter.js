/**
 * FreshPOS – filter.js
 * Logika pencarian dan penyaringan (filter) produk
 */

function filterAndRenderProducts() {
    const searchInput = document.getElementById('searchInput');
    let filtered = products;

    // 1. Filter Kategori
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    // 2. Filter Pencarian Nama
    const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (term) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }

    // 3. Render Hasil
    renderProducts(filtered);
    updateCountBadge(filtered.length);
}
