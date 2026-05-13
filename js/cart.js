let cartState = [];
const TAX_RATE = 0.11;

const cartItemsEl = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotalAmount');
const taxEl = document.getElementById('taxAmount');
const totalEl = document.getElementById('totalAmount');
const btnCheckout = document.getElementById('btnCheckout');
const checkoutModal = document.getElementById('checkoutModal');
const btnSelesai = document.getElementById('btnSelesai');
const paymentButtons = document.querySelectorAll('.pay-btn');

function addToCart(productId) {
    const product = globalProducts.find(p => p.id === productId);
    if (!product) return;

    if(product.stock <= 0) {
        showToast('Stok produk habis!', 'error');
        return;
    }

    const existingItem = cartState.find(item => item.id === productId);
    if (existingItem) {
        if(existingItem.qty >= product.stock) {
            showToast('Melebihi stok yang ada!', 'warning');
            return;
        }
        existingItem.qty += 1;
    } else {
        cartState.push({ ...product, qty: 1 });
    }
    renderCart();
}

function updateQty(productId, increment) {
    const product = globalProducts.find(p => p.id === productId);
    const itemIndex = cartState.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const newQty = cartState[itemIndex].qty + increment;
        if(newQty > product.stock) {
            showToast('Melebihi stok yang ada!', 'warning');
            return;
        }
        cartState[itemIndex].qty = newQty;
        if (cartState[itemIndex].qty <= 0) {
            cartState.splice(itemIndex, 1);
        }
    }
    renderCart();
}

function removeFromCart(productId) {
    cartState = cartState.filter(item => item.id !== productId);
    renderCart();
}

function calculateTotal() {
    let subtotal = 0;
    cartState.forEach(item => { subtotal += (item.price * item.qty); });
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    return { subtotal, tax, total };
}

function renderCart() {
    const itemsHTML = cartState.map((item, index) => `
        <div class="cart-item" style="animation: slideIn 0.3s ease ${index * 0.05}s forwards; opacity: 0; transform: translateY(10px);">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">${formatRupiah(item.price)}</span>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateQty('${item.id}', -1)"><i class="fa-solid fa-minus"></i></button>
                    <span class="cart-item-qty">${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty('${item.id}', 1)"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
            <button class="del-btn" onclick="removeFromCart('${item.id}')" title="Hapus"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `).join('');

    if (cartState.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Belum ada produk yang dipilih</p>
            </div>
        `;
        btnCheckout.disabled = true;
    } else {
        cartItemsEl.innerHTML = itemsHTML;
        btnCheckout.disabled = false;
    }

    const { subtotal, tax, total } = calculateTotal();
    subtotalEl.textContent = formatRupiah(subtotal);
    taxEl.textContent = formatRupiah(tax);
    totalEl.textContent = formatRupiah(total);
}

let selectedPaymentMethod = "Tunai";
paymentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        paymentButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPaymentMethod = btn.getAttribute('data-method');
    });
});

btnCheckout.addEventListener('click', async () => {
    if (cartState.length > 0) {
        const { subtotal, tax, total } = calculateTotal();
        const originalText = btnCheckout.innerHTML;
        btnCheckout.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Proses...';
        btnCheckout.disabled = true;

        const order_code = "TRX-" + (Math.floor(Math.random() * 90000) + 10000);
        const customerId = document.getElementById('checkoutCustomer').value;

        try {
            const response = await fetch(`${API_PATH}checkout.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_code: order_code,
                    kasir: currentUser.name,
                    payment_method: selectedPaymentMethod,
                    customer_id: customerId,
                    items: cartState,
                    subtotal: subtotal,
                    tax: tax,
                    total: total
                })
            });

            const result = await response.json();

            if (!result.success) throw new Error(result.message);

            document.getElementById('receiptDate').textContent = new Date().toLocaleString('id-ID');
            document.getElementById('displayOrderId').textContent = order_code;

            const receiptItemsEl = document.getElementById('receiptItems');
            if (receiptItemsEl) {
                receiptItemsEl.innerHTML = cartState.map(item => `
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px dashed var(--border-color);">${item.name}<br><small style="color:var(--text-muted);">${formatRupiah(item.price)}</small></td>
                        <td style="text-align:center; padding: 8px 0; border-bottom: 1px dashed var(--border-color);">${item.qty}</td>
                        <td style="text-align:right; padding: 8px 0; border-bottom: 1px dashed var(--border-color);">${formatRupiah(item.price * item.qty)}</td>
                    </tr>
                `).join('');
            }

            document.getElementById('modalPaymentMethod').textContent = selectedPaymentMethod;
            document.getElementById('modalTotal').textContent = formatRupiah(total);

            if(customerId) {
                const earned = Math.floor(total / 10000);
                document.getElementById('modalPoints').textContent = `+${earned} Poin`;
                document.getElementById('pointEarnedRow').style.display = 'flex';
            } else {
                document.getElementById('pointEarnedRow').style.display = 'none';
            }

            checkoutModal.classList.add('show');
            
            // Reload global data
            loadProducts();
            if(customerId) loadCustomersForDropdown();

        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            btnCheckout.innerHTML = originalText;
            btnCheckout.disabled = false;
        }
    }
});

btnSelesai.addEventListener('click', () => {
    checkoutModal.classList.remove('show');
    cartState = [];
    renderCart();
    document.getElementById('checkoutCustomer').value = '';
});
