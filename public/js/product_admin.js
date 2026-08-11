/**
 * FreshPOS – product_admin.js
 * Logika CRUD Produk & Barang (Tambah, Edit, Hapus, Cari Produk)
 */

let productAdminSearchQuery = '';

// ========================================================
// FUNGSI GLOBAL – dipanggil langsung dari onclick HTML
// ========================================================
window.openProductAdmin = function () {
    const modal = document.getElementById('productAdminModal');
    if (!modal) return;
    resetProductForm();
    renderProductAdminList();
    modal.classList.add('show');
};

window.closeProductAdmin = function () {
    const modal = document.getElementById('productAdminModal');
    if (modal) modal.classList.remove('show');
};

// ========================================================
// RESET FORM TAMBAH/EDIT PRODUK
// ========================================================
function resetProductForm() {
    const form      = document.getElementById('productAdminForm');
    const idInput   = document.getElementById('prodFormId');
    const title     = document.getElementById('productFormTitle');
    const cancelBtn = document.getElementById('btnCancelEditProduct');

    if (form)      form.reset();
    if (idInput)   idInput.value = '';
    if (title)     title.innerHTML = '<i class="fa-solid fa-plus-circle"></i> Tambah Produk Baru';
    if (cancelBtn) cancelBtn.style.display = 'none';
}

// ========================================================
// RENDER DAFTAR PRODUK DI MODAL ADMIN
// ========================================================
function renderProductAdminList() {
    const container = document.getElementById('productAdminListContainer');
    if (!container || typeof products === 'undefined' || !Array.isArray(products)) return;

    const q        = (productAdminSearchQuery || '').toLowerCase();
    const filtered = products.filter(p => {
        if (!p) return false;
        return (p.name     ? String(p.name).toLowerCase().includes(q)     : false)
            || (p.category ? String(p.category).toLowerCase().includes(q) : false);
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:20px;color:rgba(255,255,255,0.5);">
                <i class="fa-solid fa-box-open" style="font-size:2rem;margin-bottom:8px;"></i>
                <p>Tidak ada produk yang sesuai.</p>
            </div>`;
        return;
    }

    container.innerHTML = filtered.map(p => {
        if (!p) return '';
        const pId    = String(p.id    || '');
        const pName  = p.name     || 'Produk Tanpa Nama';
        const pCat   = p.category || 'makanan';
        const pPrice = typeof p.price !== 'undefined' ? p.price : 0;
        const pStock = typeof p.stock !== 'undefined' ? p.stock : 0;
        const pImage = p.image    || 'assets/image.png';
        const harga  = typeof formatRupiah === 'function' ? formatRupiah(pPrice) : 'Rp ' + pPrice;

        return `
        <div style="display:flex;flex-direction:column;align-items:flex-start;padding:14px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(52,211,153,0.18);border-radius:12px;gap:8px;margin-bottom:4px;">
            <div style="display:flex;align-items:center;gap:14px;width:100%;">
                <img src="${pImage}" alt="${pName}" style="width:46px;height:46px;object-fit:cover;border-radius:10px;border:1px solid rgba(255,255,255,0.15);flex-shrink:0;" onerror="this.src='https://placehold.co/50x50?text=Food'">
                <div style="flex-grow:1;">
                    <h4 style="margin:0;font-size:0.95rem;color:#fff;font-weight:700;line-height:1.2;">${pName}</h4>
                    <div style="display:flex;gap:8px;align-items:center;margin-top:4px;flex-wrap:wrap;">
                        <span style="font-size:0.74rem;background:rgba(52,211,153,0.15);color:#34d399;padding:2px 8px;border-radius:4px;text-transform:capitalize;font-weight:600;">${pCat}</span>
                        <span style="font-size:0.85rem;color:#fbbf24;font-weight:700;">${harga}</span>
                        <span style="font-size:0.76rem;color:rgba(255,255,255,0.6);">Stok: ${pStock}</span>
                    </div>
                </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:4px;">
                <button type="button" onclick="editProduct('${pId}')" class="btn-member-action edit" style="padding:4px 12px;font-size:0.78rem;display:flex;align-items:center;gap:4px;border-radius:6px;cursor:pointer;">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button type="button" onclick="deleteProduct('${pId}')" class="btn-member-action delete" style="padding:4px 12px;font-size:0.78rem;display:flex;align-items:center;gap:4px;border-radius:6px;cursor:pointer;">
                    <i class="fa-solid fa-trash"></i> Hapus
                </button>
            </div>
        </div>`;
    }).join('');
}

// ========================================================
// SIMPAN PRODUK (TAMBAH / EDIT) – via form submit
// ========================================================
document.addEventListener('submit', async (e) => {
    if (!e.target || e.target.id !== 'productAdminForm') return;
    e.preventDefault();

    const idInput    = document.getElementById('prodFormId');
    const nameInput  = document.getElementById('prodFormName');
    const priceInput = document.getElementById('prodFormPrice');
    const catInput   = document.getElementById('prodFormCategory');
    const stockInput = document.getElementById('prodFormStock');
    const imageInput = document.getElementById('prodFormImage');

    const id       = idInput    ? idInput.value.trim()               : '';
    const name     = nameInput  ? nameInput.value.trim()             : '';
    const price    = priceInput ? (parseFloat(priceInput.value) || 0): 0;
    const category = catInput   ? catInput.value                     : 'makanan';
    const stock    = stockInput ? (parseInt(stockInput.value)   || 0): 0;
    const image    = imageInput ? (imageInput.value.trim() || 'assets/image.png') : 'assets/image.png';

    if (!name) { alert('Nama produk wajib diisi.'); return; }

    const payload = { id: id || undefined, name, price, category, stock, image };

    const btnSave  = document.getElementById('btnSaveProductForm');
    const origHTML = btnSave ? btnSave.innerHTML : '';
    if (btnSave) { btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...'; btnSave.disabled = true; }

    try {
        if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
            const res    = await fetch('api/products/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const result = await res.json();
            if (!result.success) throw new Error(result.message);

            const saved = result.product;
            const idx   = products.findIndex(p => String(p.id) === String(saved.id));
            if (idx !== -1) products[idx] = saved; else products.unshift(saved);
        } else {
            if (id) {
                const idx = products.findIndex(p => String(p.id) === String(id));
                if (idx !== -1) products[idx] = { ...products[idx], name, price, category, stock, image };
            } else {
                products.unshift({ id: 'p_' + Date.now(), name, price, category, stock, image });
            }
        }

        alert('Produk berhasil disimpan!');
        resetProductForm();
        renderProductAdminList();
        if (typeof filterAndRenderProducts === 'function') filterAndRenderProducts();
    } catch (err) {
        alert('Gagal menyimpan produk: ' + err.message);
    } finally {
        if (btnSave) { btnSave.innerHTML = origHTML; btnSave.disabled = false; }
    }
});

// ========================================================
// EDIT PRODUK
// ========================================================
window.editProduct = function (id) {
    if (typeof products === 'undefined' || !Array.isArray(products)) return;
    const prod = products.find(p => String(p.id) === String(id));
    if (!prod) return;

    const idInput    = document.getElementById('prodFormId');
    const nameInput  = document.getElementById('prodFormName');
    const priceInput = document.getElementById('prodFormPrice');
    const catInput   = document.getElementById('prodFormCategory');
    const stockInput = document.getElementById('prodFormStock');
    const imageInput = document.getElementById('prodFormImage');
    const title      = document.getElementById('productFormTitle');
    const cancelBtn  = document.getElementById('btnCancelEditProduct');

    if (idInput)    idInput.value    = prod.id;
    if (nameInput)  nameInput.value  = prod.name;
    if (priceInput) priceInput.value = prod.price;
    if (catInput)   catInput.value   = prod.category;
    if (stockInput) stockInput.value = prod.stock;
    if (imageInput) imageInput.value = prod.image || 'assets/image.png';
    if (title)      title.innerHTML  = '<i class="fa-solid fa-pen-to-square"></i> Edit Produk';
    if (cancelBtn)  cancelBtn.style.display = 'inline-block';

    const formEl = document.querySelector('#productAdminModal .member-form-container');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
};

// ========================================================
// HAPUS PRODUK
// ========================================================
window.deleteProduct = async function (id) {
    if (typeof products === 'undefined' || !Array.isArray(products)) return;
    const prod = products.find(p => String(p.id) === String(id));
    if (!prod) return;
    if (!confirm(`Hapus produk "${prod.name}"?`)) return;

    try {
        if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
            const res    = await fetch('api/products/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
            const result = await res.json();
            if (!result.success) throw new Error(result.message);
        }
        const idx = products.findIndex(p => String(p.id) === String(id));
        if (idx !== -1) products.splice(idx, 1);

        alert(`Produk "${prod.name}" berhasil dihapus.`);
        renderProductAdminList();
        if (typeof filterAndRenderProducts === 'function') filterAndRenderProducts();
    } catch (err) {
        alert('Gagal menghapus produk: ' + err.message);
    }
};

// ========================================================
// LISTENERS TUTUP MODAL, BATAL EDIT, LIVE SEARCH
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
    // Tombol tutup modal
    const closeBtn = document.getElementById('btnCloseProductAdmin');
    if (closeBtn) closeBtn.addEventListener('click', window.closeProductAdmin);

    // Klik di luar modal (overlay)
    const modal = document.getElementById('productAdminModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) window.closeProductAdmin();
        });
    }

    // Tombol Batal Edit
    const cancelBtn = document.getElementById('btnCancelEditProduct');
    if (cancelBtn) cancelBtn.addEventListener('click', resetProductForm);

    // Live search produk
    const searchInput = document.getElementById('searchProductAdminInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            productAdminSearchQuery = e.target.value;
            renderProductAdminList();
        });
    }
});
