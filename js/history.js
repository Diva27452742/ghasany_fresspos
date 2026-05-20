// ============================================================
//  FreshPOS – Controller: Riwayat & Catatan Member & Langganan
//  File: js/history.js
// ============================================================

const MEMBERS_KEY = 'freshpos_members';

// DOM Elements
const btnOpenHistory = document.getElementById('btnOpenHistory');
const btnCloseHistory = document.getElementById('btnCloseHistory');
const historyModal = document.getElementById('historyModal');
const memberList = document.getElementById('memberList');

// Form Elements
const memberForm = document.getElementById('memberForm');
const memberIdInput = document.getElementById('memberId');
const memberFormTitle = document.getElementById('memberFormTitle');
const memberNameInput = document.getElementById('memberName');
const memberDiscountPctInput = document.getElementById('memberDiscountPct');
const memberDiscountStatusInput = document.getElementById('memberDiscountStatus');
const memberVerifiedCheckbox = document.getElementById('memberVerified');
const memberNotesInput = document.getElementById('memberNotes');
const btnCancelEditMember = document.getElementById('btnCancelEditMember');

// Search & Refresh Elements
const searchMemberInput = document.getElementById('searchMemberInput');
const btnRefreshMembers = document.getElementById('btnRefreshMembers');

let currentSearchQuery = '';

// Get local members
function getLocalMembers() {
    const dataStr = localStorage.getItem(MEMBERS_KEY);
    return dataStr ? JSON.parse(dataStr) : [];
}

// Save local members
function saveLocalMembers(members) {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

// Check database status
function isDatabaseActive() {
    return typeof IS_DB_ACTIVE !== 'undefined' && IS_DB_ACTIVE;
}

// Sync members from Database
async function syncMembersFromDB() {
    if (isDatabaseActive()) {
        try {
            const response = await fetch('php/api/get_members.php');
            const result = await response.json();
            if (result.success) {
                saveLocalMembers(result.data);
            }
        } catch (e) {
            console.error("Gagal sinkronisasi data member dari database:", e);
        }
    }
}

// Render member cards
function renderMembers() {
    if (!memberList) return;
    
    const members = getLocalMembers();
    
    // Filter by search query
    const filteredMembers = members.filter(m => {
        const query = currentSearchQuery.toLowerCase();
        const nameMatch = m.name && m.name.toLowerCase().includes(query);
        const notesMatch = m.notes && m.notes.toLowerCase().includes(query);
        return nameMatch || notesMatch;
    });

    if (filteredMembers.length === 0) {
        memberList.innerHTML = `
            <div class="empty-history-msg">
                <i class="fa-solid fa-address-book"></i>
                <p>${currentSearchQuery ? 'Tidak ada member yang cocok dengan pencarian.' : 'Belum ada catatan member. Silakan tambahkan member baru!'}</p>
            </div>
        `;
        return;
    }

    memberList.innerHTML = filteredMembers.map(m => {
        const createdDate = m.created_at ? new Date(m.created_at) : new Date();
        const dateStr = createdDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        // Badges
        const verifiedBadge = m.verified 
            ? `<span class="member-badge badge-verified"><i class="fa-solid fa-circle-check"></i> Terverifikasi</span>` 
            : `<span class="member-badge badge-unverified"><i class="fa-solid fa-circle-xmark"></i> Belum Verifikasi</span>`;
            
        const discountBadge = m.discount_pct > 0 
            ? `<span class="member-badge badge-discount"><i class="fa-solid fa-percent"></i> Diskon: ${m.discount_pct}%</span>` 
            : `<span class="member-badge badge-discount-zero"><i class="fa-solid fa-percent"></i> Tanpa Diskon</span>`;
            
        const statusBadge = m.discount_status === 'Aktif' 
            ? `<span class="member-badge badge-status-aktif"><i class="fa-solid fa-clock"></i> Diskon Aktif</span>` 
            : `<span class="member-badge badge-status-habis"><i class="fa-solid fa-ban"></i> Diskon Habis</span>`;
            
        const notesHTML = m.notes && m.notes.trim() !== '' 
            ? `<p class="member-notes-text">${m.notes.replace(/\n/g, '<br>')}</p>` 
            : '';

        return `
            <div class="member-card" id="member-card-${m.id}">
                <div class="member-card-header">
                    <h4 class="member-name-title">
                        <i class="fa-solid fa-user"></i> ${m.name}
                    </h4>
                    <span class="member-date">${dateStr}</span>
                </div>
                <div class="member-badges-row">
                    ${verifiedBadge}
                    ${discountBadge}
                    ${statusBadge}
                </div>
                ${notesHTML}
                <div class="member-actions">
                    <button onclick="editMember(${m.id})" class="btn-member-action edit">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button onclick="deleteMember(${m.id})" class="btn-member-action delete">
                        <i class="fa-solid fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Reset member form to default
function resetMemberForm() {
    if (memberForm) memberForm.reset();
    if (memberIdInput) memberIdInput.value = '';
    if (memberFormTitle) memberFormTitle.textContent = 'Tambah Member Baru';
    if (btnCancelEditMember) btnCancelEditMember.style.display = 'none';
}

// Save Member (Add/Edit)
if (memberForm) {
    memberForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = memberIdInput.value;
        const name = memberNameInput.value.trim();
        const discount_pct = parseInt(memberDiscountPctInput.value) || 0;
        const discount_status = memberDiscountStatusInput.value;
        const verified = memberVerifiedCheckbox.checked ? 1 : 0;
        const notes = memberNotesInput.value.trim();
        
        const memberData = {
            id: id || undefined,
            name: name,
            discount_pct: discount_pct,
            discount_status: discount_status,
            verified: verified,
            notes: notes
        };
        
        // Simpan ke database jika aktif
        if (isDatabaseActive()) {
            try {
                const response = await fetch('php/api/save_member.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(memberData)
                });
                const result = await response.json();
                if (!result.success) throw new Error(result.message);
            } catch (error) {
                alert("Gagal menyimpan ke database: " + error.message);
                return;
            }
        } else {
            // Static offline fallback
            const localMembers = getLocalMembers();
            if (id) {
                // Update
                const idx = localMembers.findIndex(m => m.id == id);
                if (idx !== -1) {
                    localMembers[idx] = { 
                        ...localMembers[idx], 
                        name, 
                        discount_pct, 
                        discount_status, 
                        verified, 
                        notes 
                    };
                }
            } else {
                // Insert
                const newId = Date.now();
                localMembers.unshift({
                    id: newId,
                    name,
                    discount_pct,
                    discount_status,
                    verified,
                    notes,
                    created_at: new Date().toISOString()
                });
            }
            saveLocalMembers(localMembers);
        }
        
        resetMemberForm();
        await syncMembersFromDB();
        renderMembers();
    });
}

// Edit Member trigger
window.editMember = function(id) {
    const members = getLocalMembers();
    const member = members.find(m => m.id == id);
    if (!member) return;
    
    // Fill Form inputs
    memberIdInput.value = member.id;
    memberNameInput.value = member.name;
    memberDiscountPctInput.value = member.discount_pct;
    memberDiscountStatusInput.value = member.discount_status || 'Aktif';
    memberVerifiedCheckbox.checked = !!member.verified;
    memberNotesInput.value = member.notes || '';
    
    // Toggle UI
    if (memberFormTitle) memberFormTitle.textContent = 'Edit Data Member';
    if (btnCancelEditMember) btnCancelEditMember.style.display = 'inline-block';
    
    // Smooth scroll to form inside the modal
    const formContainer = document.querySelector('.member-form-container');
    if (formContainer) {
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }
};

// Cancel Edit Mode
if (btnCancelEditMember) {
    btnCancelEditMember.addEventListener('click', resetMemberForm);
}

// Delete Member trigger
window.deleteMember = async function(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan member ini?')) return;
    
    if (isDatabaseActive()) {
        try {
            const response = await fetch('php/api/delete_member.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.message);
        } catch (error) {
            alert("Gagal menghapus member dari database: " + error.message);
            return;
        }
    } else {
        // Static offline fallback
        const localMembers = getLocalMembers();
        const updated = localMembers.filter(m => m.id != id);
        saveLocalMembers(updated);
    }
    
    await syncMembersFromDB();
    renderMembers();
};

// Search Live Input
if (searchMemberInput) {
    searchMemberInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        renderMembers();
    });
}

// Refresh Button trigger
if (btnRefreshMembers) {
    btnRefreshMembers.addEventListener('click', async () => {
        const icon = btnRefreshMembers.querySelector('i');
        if (icon) icon.classList.add('fa-spin');
        await syncMembersFromDB();
        renderMembers();
        setTimeout(() => {
            if (icon) icon.classList.remove('fa-spin');
        }, 600);
    });
}

// Opening Modal
if (btnOpenHistory) {
    btnOpenHistory.addEventListener('click', async () => {
        resetMemberForm();
        await syncMembersFromDB();
        renderMembers();
        if (historyModal) historyModal.classList.add('show');
    });
}

// Closing Modal
if (btnCloseHistory) {
    btnCloseHistory.addEventListener('click', () => {
        if (historyModal) historyModal.classList.remove('show');
    });
}

// Outside Click closing
if (historyModal) {
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.classList.remove('show');
        }
    });
}

// Document Load - Initial Sync
document.addEventListener('DOMContentLoaded', () => {
    syncMembersFromDB().then(() => {
        // We only render in background if needed
    });
});
