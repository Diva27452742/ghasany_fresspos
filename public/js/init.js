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

    if (typeof syncMembersFromDB === 'function') {
        syncMembersFromDB();
    } else if (typeof populateMemberDropdown === 'function') {
        populateMemberDropdown();
    }
    
    // Mulai sinkronisasi stok berkala dari database
    startStockSync();
});

// Fungsi untuk mensinkronkan stok secara otomatis dari database
async function startStockSync() {
    if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
        setInterval(async () => {
            try {
                const response = await fetch('api/products');
                const result = await response.json();
                const dbProds = result.products || result.data;
                
                if (result.success && dbProds) {
                    let stockChanged = false;
                    
                    dbProds.forEach(dbProd => {
                        const localProd = products.find(p => p.id === dbProd.id);
                        // Jika ada perubahan stok
                        if (localProd && localProd.stock !== dbProd.stock) {
                            localProd.stock = dbProd.stock;
                            stockChanged = true;
                            
                            // Jika ada elemen input di kelola stok yang sedang terbuka, update nilainya
                            const stockInput = document.getElementById(`stock-input-${dbProd.id}`);
                            if (stockInput) {
                                stockInput.value = dbProd.stock;
                            }
                        }
                    });
                    
                    // Jika ada stok yang berubah, render ulang grid produk
                    if (stockChanged && typeof filterAndRenderProducts === 'function') {
                        filterAndRenderProducts();
                    }
                }
            } catch (err) {
                console.error("Gagal sinkronisasi stok berkala:", err);
            }
        }, 15000); // 15 detik
    }
}

