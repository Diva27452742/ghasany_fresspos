/**
 * FreshPOS – admin.js
 * Logika untuk mengubah profil admin/kasir
 */

function initAdminLogic() {
    const editBtn = document.getElementById('editAdminBtn');
    const adminNameEl = document.getElementById('adminName');

    if (editBtn && adminNameEl) {
        editBtn.addEventListener('click', () => {
            const cur = adminNameEl.textContent.trim();
            const name = prompt('Masukkan nama kasir baru:', cur);
            
            if (name && name.trim()) {
                const newName = name.trim();
                
                // Update UI Nama
                adminNameEl.textContent = newName;
                
                // Update Avatar (menggunakan UI Avatars API)
                const avatar = document.getElementById('adminAvatar');
                if (avatar) {
                    avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=10b981&color=fff`;
                }
                
                // Update Nama di Struk
                const receiptName = document.getElementById('receiptAdminName');
                if (receiptName) receiptName.textContent = newName;
            }
        });
    }
}
