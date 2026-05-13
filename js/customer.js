async function loadCustomers() {
    try {
        const res = await fetch(`${API_PATH}customers_api.php`);
        const data = await res.json();
        const tbody = document.getElementById('customerTableBody');
        tbody.innerHTML = '';

        if(data.success) {
            data.data.forEach(c => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${c.name}</td>
                    <td>${c.phone}</td>
                    <td><span class="product-count-badge">${c.points} pts</span></td>
                    <td>
                        <button class="btn-primary" style="padding: 5px 10px; width:auto; font-size:0.8rem;" onclick="editCustomer('${c.id}', '${c.name}', '${c.phone}', '${c.points}')"><i class="fa-solid fa-pen"></i></button>
                        ${c.id != 1 ? `<button class="btn-primary" style="padding: 5px 10px; width:auto; font-size:0.8rem; background:#dc2626;" onclick="deleteCustomer('${c.id}')"><i class="fa-solid fa-trash"></i></button>` : ''}
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error(e);
    }
}

async function loadCustomersForDropdown() {
    try {
        const res = await fetch(`${API_PATH}customers_api.php`);
        const data = await res.json();
        const sel = document.getElementById('checkoutCustomer');
        sel.innerHTML = '<option value="">Pilih Pelanggan (Umum)</option>';
        if(data.success) {
            data.data.forEach(c => {
                if(c.id != 1) sel.innerHTML += `<option value="${c.id}">${c.name} (${c.points} pts)</option>`;
            });
        }
    } catch (e) { console.error(e); }
}

document.getElementById('btnAddCustomer').addEventListener('click', () => {
    document.getElementById('customerForm').reset();
    document.getElementById('custId').value = '';
    document.getElementById('customerModalTitle').textContent = 'Tambah Pelanggan';
    document.getElementById('customerModal').classList.add('show');
});

document.getElementById('customerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('custId').value;
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const points = document.getElementById('custPoints').value;
    
    const isEdit = id !== '';
    const action = isEdit ? 'update' : 'create';

    try {
        const res = await fetch(`${API_PATH}customers_api.php?action=${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name, phone, points })
        });
        const data = await res.json();
        if(data.success) {
            showToast(isEdit ? 'Pelanggan diperbarui' : 'Pelanggan ditambahkan');
            document.getElementById('customerModal').classList.remove('show');
            loadCustomers();
            loadCustomersForDropdown();
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    } catch(err) {
        console.error(err);
    }
});

function editCustomer(id, name, phone, points) {
    document.getElementById('custId').value = id;
    document.getElementById('custName').value = name;
    document.getElementById('custPhone').value = phone;
    document.getElementById('custPoints').value = points;
    document.getElementById('customerModalTitle').textContent = 'Edit Pelanggan';
    document.getElementById('customerModal').classList.add('show');
}

function deleteCustomer(id) {
    Swal.fire({
        title: 'Hapus pelanggan?',
        text: "Data tidak bisa dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, hapus!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(`${API_PATH}customers_api.php?action=delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id})
            });
            const data = await res.json();
            if(data.success) {
                showToast('Pelanggan dihapus');
                loadCustomers();
                loadCustomersForDropdown();
            }
        }
    });
}
