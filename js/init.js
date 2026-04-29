// 3. Main Init Listener
document.addEventListener('DOMContentLoaded', () => {
    console.log("FreshPOS: Initializing modular scripts...");

    // Render awal kategori di sidebar
    renderCategories();

    // Render awal produk (Semua Menu)
    filterAndRenderProducts();

    // Inisialisasi logika admin/kasir
    initAdminLogic();

    // Listener pencarian di header
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterAndRenderProducts);
    }

    // Panggil renderCart() dari cart.js jika ada data awal
    if (typeof renderCart === 'function') {
        renderCart();
    }
});
