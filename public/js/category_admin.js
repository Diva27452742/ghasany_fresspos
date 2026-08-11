/**
 * FreshPOS – category_admin.js
 * Logika Pengaturan & Tambah/Edit/Hapus Kategori Menu (CRUD)
 */

// ========================================================
// FUNGSI GLOBAL – dipanggil langsung dari onclick HTML
// ========================================================
window.openCategoryAdmin = function () {
    const modal = document.getElementById('categoryAdminModal');
    if (!modal) return;
    resetCategoryForm();
    renderCategoryAdminList();
    updateProductFormCategoryDropdown();
    modal.classList.add('show');
};

window.closeCategoryAdmin = function () {
    const modal = document.getElementById('categoryAdminModal');
    if (modal) modal.classList.remove('show');
};

// ========================================================
// RESET FORM TAMBAH/EDIT KATEGORI
// ========================================================
function resetCategoryForm() {
    const form      = document.getElementById('categoryAdminForm');
    const idInput   = document.getElementById('catFormId');
    const custInput = document.getElementById('catFormCustomId');
    const title     = document.getElementById('categoryFormTitle');
    const cancelBtn = document.getElementById('btnCancelEditCategory');

    if (form)      form.reset();
    if (idInput)   idInput.value = '';
    if (custInput) custInput.value = '';
    if (title)     title.innerHTML = '<i class="fa-solid fa-folder-plus"></i> Tambah Kategori Baru';
    if (cancelBtn) cancelBtn.style.display = 'none';
}

// ========================================================
// UPDATE DROPDOWN KATEGORI DI FORM PRODUK
// ========================================================
function updateProductFormCategoryDropdown() {
    const sel = document.getElementById('prodFormCategory');
    if (!sel || typeof categories === 'undefined' || !Array.isArray(categories)) return;

    const currentVal = sel.value;
    sel.innerHTML = '';

    categories.forEach(c => {
        if (!c || c.id === 'all') return;
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name || c.id;
        sel.appendChild(opt);
    });

    if (currentVal) sel.value = currentVal;
}

// ========================================================
// RENDER DAFTAR KATEGORI DI MODAL ADMIN
// ========================================================
function renderCategoryAdminList() {
    const container = document.getElementById('categoryAdminListContainer');
    if (!container || typeof categories === 'undefined' || !Array.isArray(categories)) return;

    if (categories.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:20px;color:rgba(255,255,255,0.5);">
                <i class="fa-solid fa-folder-open" style="font-size:2rem;margin-bottom:8px;"></i>
                <p>Belum ada kategori menu.</p>
            </div>`;
        return;
    }

    container.innerHTML = categories.map(c => {
        if (!c) return '';
        const isAll = (c.id === 'all');
        const cId   = String(c.id || '');
        const cName = c.name || cId;
        return `
        <div style="display:flex;flex-direction:column;align-items:flex-start;padding:14px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(52,211,153,0.18);border-radius:12px;gap:8px;margin-bottom:4px;">
            <div style="display:flex;align-items:center;gap:12px;width:100%;">
                <div style="min-width:46px;height:42px;padding:0 10px;border-radius:10px;background:rgba(16,185,129,0.15);color:#34d399;display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:800;flex-shrink:0;border:1px solid rgba(52,211,153,0.3);">
                    #${cId}
                </div>
                <div>
                    <h4 style="margin:0;font-size:0.95rem;color:#fff;font-weight:700;line-height:1.2;">${cName}</h4>
                    <span style="font-size:0.76rem;color:rgba(255,255,255,0.55);display:block;margin-top:3px;">ID: ${cId}</span>
                </div>
            </div>
            ${!isAll ? `
            <div style="display:flex;gap:8px;margin-top:4px;">
                <button type="button" onclick="editCategory('${cId}')" class="btn-member-action edit" style="padding:4px 12px;font-size:0.78rem;display:flex;align-items:center;gap:4px;border-radius:6px;cursor:pointer;">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button type="button" onclick="deleteCategory('${cId}')" class="btn-member-action delete" style="padding:4px 12px;font-size:0.78rem;display:flex;align-items:center;gap:4px;border-radius:6px;cursor:pointer;">
                    <i class="fa-solid fa-trash"></i> Hapus
                </button>
            </div>
            ` : `<span style="font-size:0.76rem;color:rgba(255,255,255,0.45);font-style:italic;">Utama (tidak dapat dihapus)</span>`}
        </div>`;
    }).join('');
}

// ========================================================
// SIMPAN KATEGORI (TAMBAH / EDIT) – via form submit
// ========================================================
document.addEventListener('submit', async (e) => {
    if (!e.target || e.target.id !== 'categoryAdminForm') return;
    e.preventDefault();

    const idInput   = document.getElementById('catFormId');
    const custInput = document.getElementById('catFormCustomId');
    const nameInput = document.getElementById('catFormName');

    let id         = idInput   ? idInput.value.trim()   : '';
    const customId = custInput ? custInput.value.trim() : '';
    const name     = nameInput ? nameInput.value.trim() : '';

    if (!id && customId) id = customId;

    if (!name) { alert('Nama kategori wajib diisi.'); return; }

    const payload = { id: id || undefined, name, icon: 'fa-utensils' };

    const btnSave  = document.getElementById('btnSaveCategoryForm');
    const origHTML = btnSave ? btnSave.innerHTML : '';
    if (btnSave) { btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...'; btnSave.disabled = true; }

    try {
        if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
            const res    = await fetch('api/categories/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const result = await res.json();
            if (!result.success) throw new Error(result.message);

            const saved = result.category;
            const idx   = categories.findIndex(c => String(c.id) === String(saved.id));
            if (idx !== -1) categories[idx] = saved; else categories.push(saved);
        } else {
            if (!id) id = name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_');
            const idx = categories.findIndex(c => String(c.id) === String(id));
            if (idx !== -1) categories[idx] = { ...categories[idx], name };
            else categories.push({ id, name, icon: 'fa-utensils' });
        }

        alert('Kategori berhasil disimpan!');
        resetCategoryForm();
        renderCategoryAdminList();
        if (typeof renderCategories === 'function') renderCategories();
        updateProductFormCategoryDropdown();
    } catch (err) {
        alert('Gagal menyimpan kategori: ' + err.message);
    } finally {
        if (btnSave) { btnSave.innerHTML = origHTML; btnSave.disabled = false; }
    }
});

// ========================================================
// EDIT KATEGORI
// ========================================================
window.editCategory = function (id) {
    if (typeof categories === 'undefined' || !Array.isArray(categories)) return;
    const cat = categories.find(c => String(c.id) === String(id));
    if (!cat) return;

    const idInput   = document.getElementById('catFormId');
    const custInput = document.getElementById('catFormCustomId');
    const nameInput = document.getElementById('catFormName');
    const title     = document.getElementById('categoryFormTitle');
    const cancelBtn = document.getElementById('btnCancelEditCategory');

    if (idInput)   idInput.value   = cat.id;
    if (custInput) custInput.value = cat.id;
    if (nameInput) nameInput.value = cat.name;
    if (title)     title.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Kategori';
    if (cancelBtn) cancelBtn.style.display = 'block';
};

// ========================================================
// HAPUS KATEGORI
// ========================================================
window.deleteCategory = async function (id) {
    if (typeof categories === 'undefined' || !Array.isArray(categories)) return;
    const cat = categories.find(c => String(c.id) === String(id));
    if (!cat) return;
    if (!confirm(`Hapus kategori "${cat.name}"?`)) return;

    try {
        if (typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE) {
            const res    = await fetch('api/categories/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
            const result = await res.json();
            if (!result.success) throw new Error(result.message);
        }
        const idx = categories.findIndex(c => String(c.id) === String(id));
        if (idx !== -1) categories.splice(idx, 1);

        alert(`Kategori "${cat.name}" berhasil dihapus.`);
        renderCategoryAdminList();
        if (typeof renderCategories === 'function') renderCategories();
        updateProductFormCategoryDropdown();
    } catch (err) {
        alert('Gagal menghapus kategori: ' + err.message);
    }
};

// ========================================================
// LISTENERS TUTUP MODAL & BATAL EDIT
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
    // Tombol tutup modal
    const closeBtn = document.getElementById('btnCloseCategoryAdmin');
    if (closeBtn) closeBtn.addEventListener('click', window.closeCategoryAdmin);

    // Klik di luar modal (overlay)
    const modal = document.getElementById('categoryAdminModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) window.closeCategoryAdmin();
        });
    }

    // Tombol Batal Edit
    const cancelBtn = document.getElementById('btnCancelEditCategory');
    if (cancelBtn) cancelBtn.addEventListener('click', resetCategoryForm);

    // Inisialisasi dropdown kategori di form produk
    updateProductFormCategoryDropdown();
});
