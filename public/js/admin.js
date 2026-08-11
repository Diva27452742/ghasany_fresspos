/**
 * FreshPOS – admin.js
 * Logika untuk mengubah profil admin/kasir & Switcher Mode (Mode Admin vs Mode Kasir)
 */

function applyAppMode(mode) {
    const appModeSelect = document.getElementById('appModeSelect');
    const modeIcon      = document.getElementById('modeIcon');
    const adminRoleText = document.getElementById('adminRoleText');

    // Daftar ID tombol khusus Admin yang disembunyikan di Mode Kasir
    const adminOnlyButtons = [
        'btnOpenCategoryAdmin',
        'btnOpenProductAdmin',
        'btnOpenReceiptSettings',
        'btnOpenRecap'
    ];

    // Daftar ID tombol yang tetap dapat diakses di Mode Kasir (Pesanan, Reservasi, & Member)
    const kasirAllowedButtons = [
        'btnOpenReservation',
        'btnOpenResHistory',
        'btnOpenHistory'
    ];

    if (mode === 'kasir') {
        // Sembunyikan tombol-tombol pengaturan & rekap data
        adminOnlyButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.style.display = 'none';
        });

        // Tampilkan tombol pelayanan pesanan, reservasi, & member
        kasirAllowedButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.style.display = 'flex';
        });

        if (modeIcon) modeIcon.className = 'fa-solid fa-cash-register';
        if (adminRoleText) {
            adminRoleText.innerHTML = `Mode Kasir <i class="fa-solid fa-pen edit-admin-btn" id="editAdminBtn" title="Ganti Nama"></i>`;
            const editBtn = document.getElementById('editAdminBtn');
            if (editBtn) attachEditAdminNameListener(editBtn);
        }
    } else {
        // Mode Admin: Tampilkan seluruh fitur & pengaturan
        adminOnlyButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.style.display = 'flex';
        });

        kasirAllowedButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.style.display = 'flex';
        });

        if (modeIcon) modeIcon.className = 'fa-solid fa-user-shield';
        if (adminRoleText) {
            adminRoleText.innerHTML = `Mode Admin <i class="fa-solid fa-pen edit-admin-btn" id="editAdminBtn" title="Ganti Nama"></i>`;
            const editBtn = document.getElementById('editAdminBtn');
            if (editBtn) attachEditAdminNameListener(editBtn);
        }
    }

    if (appModeSelect && appModeSelect.value !== mode) {
        appModeSelect.value = mode;
    }
}

function attachEditAdminNameListener(editBtn) {
    const adminNameEl = document.getElementById('adminName');
    if (!editBtn || !adminNameEl) return;

    editBtn.onclick = () => {
        const cur = adminNameEl.textContent.trim();
        const name = prompt('Masukkan nama operator/kasir baru:', cur);

        if (name && name.trim()) {
            const newName = name.trim();
            adminNameEl.textContent = newName;

            const avatar = document.getElementById('adminAvatar');
            if (avatar) {
                avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=10b981&color=fff`;
            }

            const receiptName = document.getElementById('receiptAdminName');
            if (receiptName) receiptName.textContent = newName;
        }
    };
}

function initAdminLogic() {
    const editBtn       = document.getElementById('editAdminBtn');
    const appModeSelect = document.getElementById('appModeSelect');

    if (editBtn) {
        attachEditAdminNameListener(editBtn);
    }

    // Restore saved mode from localStorage (Default: 'admin')
    const savedMode = localStorage.getItem('freshpos_app_mode') || 'admin';
    applyAppMode(savedMode);

    if (appModeSelect) {
        appModeSelect.addEventListener('change', (e) => {
            const selectedMode = e.target.value;
            localStorage.setItem('freshpos_app_mode', selectedMode);
            applyAppMode(selectedMode);

            if (selectedMode === 'kasir') {
                alert("Berhasil beralih ke Mode Kasir!\nHanya fitur pelayanan pesanan, reservasi, & riwayat member yang aktif.");
            } else {
                alert("Berhasil beralih ke Mode Admin!\nAkses penuh ke seluruh fitur & pengaturan telah diaktifkan.");
            }
        });
    }
}
