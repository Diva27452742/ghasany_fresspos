async function loadProductsManage() {
    try {
        const res = await fetch(`${API_PATH}products_api.php`);
        const data = await res.json();
        const tbody = document.getElementById('productTableBody');
        tbody.innerHTML = '';

        if(data.success) {
            data.data.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img src="${p.image}" width="50" style="border-radius:var(--r-xs);"></td>
                    <td>${p.name}</td>
                    <td>${p.category}</td>
                    <td>${formatRupiah(p.price)}</td>
                    <td>
                        <span class="product-count-badge" style="${p.stock < 10 ? 'background:#fee2e2;color:#dc2626;border-color:#fca5a5;' : ''}">${p.stock}</span>
                    </td>
                    <td>
                        <button class="btn-primary" style="padding: 5px 10px; width:auto; font-size:0.8rem;" onclick="editProduct('${p.id}', '${p.name}', '${p.price}', '${p.category}', '${p.stock}', '${p.image}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-primary" style="padding: 5px 10px; width:auto; font-size:0.8rem; background:#dc2626;" onclick="deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error(e);
    }
}

document.getElementById('btnAddProduct').addEventListener('click', () => {
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = '';
    document.getElementById('productModalTitle').textContent = 'Tambah Produk';
    loadCategoriesForSelect();
    document.getElementById('productModal').classList.add('show');
});

async function loadCategoriesForSelect() {
    const res = await fetch(`${API_PATH}products_api.php?action=categories`);
    const data = await res.json();
    const sel = document.getElementById('prodCategory');
    sel.innerHTML = '';
    data.data.forEach(c => {
        if(c.id !== 'all') sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', document.getElementById('prodId').value);
    formData.append('name', document.getElementById('prodName').value);
    formData.append('price', document.getElementById('prodPrice').value);
    formData.append('stock', document.getElementById('prodStock').value);
    formData.append('category', document.getElementById('prodCategory').value);
    formData.append('existing_image', document.getElementById('prodExistingImg').value);
    
    const imageFile = document.getElementById('prodImage').files[0];
    if(imageFile) {
        formData.append('image', imageFile);
    }

    const isEdit = document.getElementById('prodId').value !== '';
    const action = isEdit ? 'update' : 'create';

    try {
        const res = await fetch(`${API_PATH}products_api.php?action=${action}`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if(data.success) {
            showToast(isEdit ? 'Produk diperbarui' : 'Produk ditambahkan');
            document.getElementById('productModal').classList.remove('show');
            loadProductsManage();
            loadProducts(); // Update kasir view too
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    } catch(err) {
        console.error(err);
    }
});

function editProduct(id, name, price, category, stock, image) {
    document.getElementById('prodId').value = id;
    document.getElementById('prodName').value = name;
    document.getElementById('prodPrice').value = price;
    document.getElementById('prodStock').value = stock;
    document.getElementById('prodExistingImg').value = image;
    document.getElementById('productModalTitle').textContent = 'Edit Produk';
    
    loadCategoriesForSelect().then(() => {
        document.getElementById('prodCategory').value = category;
        document.getElementById('productModal').classList.add('show');
    });
}

function deleteProduct(id) {
    Swal.fire({
        title: 'Hapus produk?',
        text: "Data tidak bisa dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, hapus!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(`${API_PATH}products_api.php?action=delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id})
            });
            const data = await res.json();
            if(data.success) {
                showToast('Produk dihapus');
                loadProductsManage();
                loadProducts();
            }
        }
    });
}
