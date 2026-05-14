let cartState = [];
const TAX_RATE = 0.11; // PPN 11%

const cartItemsEl = document.getElementById('cartItems');
const emptyCartMsg = document.getElementById('emptyCartMsg');
const subtotalEl = document.getElementById('subtotalAmount');
const taxEl = document.getElementById('taxAmount');
const totalEl = document.getElementById('totalAmount');
const btnCheckout = document.getElementById('btnCheckout');
const adminNameEl = document.getElementById('adminName');
const modalTotalEl = document.getElementById('modalTotal');
const checkoutModal = document.getElementById('checkoutModal');
const btnSelesai = document.getElementById('btnSelesai');
const paymentButtons = document.querySelectorAll('.pay-btn');

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check stock
    if (product.stock <= 0) {
        alert("Maaf, stok " + product.name + " sedang habis.");
        return;
    }

    const existingItem = cartState.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.qty >= product.stock) {
            alert("Jumlah pesanan melebihi stok yang tersedia.");
            return;
        }
        existingItem.qty += 1;
    } else {
        cartState.push({ ...product, qty: 1 });
    }
    
    renderCart();
}

function updateQty(productId, increment) {
    const itemIndex = cartState.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const product = products.find(p => p.id === productId);
        if (increment > 0 && cartState[itemIndex].qty >= product.stock) {
            alert("Jumlah pesanan melebihi stok yang tersedia.");
            return;
        }
        
        cartState[itemIndex].qty += increment;
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
    cartState.forEach(item => {
        subtotal += (item.price * item.qty);
    });
    
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
}

function renderCart() {
    // Clear items except the empty message
    const itemsHTML = cartState.map((item, index) => `
        <div class="cart-item" style="animation: slideIn 0.3s ease ${index * 0.05}s forwards; opacity: 0; transform: translateY(10px);">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">${formatRupiah(item.price)}</span>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateQty('${item.id}', -1)"><i class="fa-solid fa-minus" style="font-size: 0.7rem;"></i></button>
                    <span class="cart-item-qty">${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty('${item.id}', 1)"><i class="fa-solid fa-plus" style="font-size: 0.7rem;"></i></button>
                </div>
            </div>
            <button class="del-btn" onclick="removeFromCart('${item.id}')" title="Hapus">
                <i class="fa-solid fa-trash-can"></i>
            </button>
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

// Tambahkan definisi CSS Keyframes secara dinamis untuk animasi daftar keranjang
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);


// Interactivity for Checkout
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
        
        // Atur UI Loading
        const originalText = btnCheckout.innerHTML;
        btnCheckout.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sedang memproses...';
        btnCheckout.disabled = true;

        // Generate Order Code yang lebih robust
        const orderIdEl = document.querySelector('.order-id');
        let order_code = orderIdEl && orderIdEl.tagName === 'INPUT' ? orderIdEl.value.trim() : "";
        
        // Jika input kosong atau tidak dimulai dengan 'TRX-', buat kode baru
        if (!order_code || !order_code.startsWith('TRX-')) {
            order_code = "TRX-" + Math.floor(100000 + Math.random() * 900000);
        }

        try {
            // Jika ada API_PATH, kirim data ke backend. Jika tidak (statis), lewati.
            if (API_PATH) {
                const response = await fetch(API_PATH, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order_code: order_code,
                        kasir: adminNameEl ? adminNameEl.textContent : 'Admin',
                        payment_method: selectedPaymentMethod,
                        items: cartState,
                        subtotal: subtotal,
                        tax: tax,
                        total: total
                    })
                });

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message);
                }
            } else {
                console.log("Static Mode: Skipping backend database save.");
            }
            
            // Fill Header Struk
            document.getElementById('receiptDate').textContent = new Date().toLocaleString('id-ID');
            const adminNameReceipt = document.getElementById('receiptAdminName');
            if (adminNameEl && adminNameReceipt) {
                adminNameReceipt.textContent = adminNameEl.textContent;
            }
            
            // Update Order ID pada Header Keranjang
            const orderIdEl = document.querySelector('.order-id');
            if(orderIdEl) {
                if (orderIdEl.tagName === 'INPUT') {
                    orderIdEl.value = order_code;
                } else {
                    orderIdEl.textContent = order_code;
                }
            }

            // Fill Items dalam Struk
            const receiptItemsEl = document.getElementById('receiptItems');
            if (receiptItemsEl) {
                receiptItemsEl.innerHTML = cartState.map(item => `
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px dashed var(--border-color);">
                            ${item.name}<br><small style="color:var(--text-muted);">${formatRupiah(item.price)}</small>
                        </td>
                        <td style="text-align:center; padding: 8px 0; border-bottom: 1px dashed var(--border-color);">${item.qty}</td>
                        <td style="text-align:right; padding: 8px 0; border-bottom: 1px dashed var(--border-color);">${formatRupiah(item.price * item.qty)}</td>
                    </tr>
                `).join('');
            }

            // Update Total dan Rincian
            if (document.getElementById('modalPaymentMethod')) {
                document.getElementById('modalPaymentMethod').textContent = selectedPaymentMethod;
                document.getElementById('modalSubtotal').textContent = formatRupiah(subtotal);
                document.getElementById('modalTax').textContent = formatRupiah(tax);
                document.getElementById('modalTotal').textContent = formatRupiah(total);
            } else {
                if(modalTotalEl) modalTotalEl.textContent = formatRupiah(total);
            }

            // Tampilkan QR Code jika metode QRIS dipilih
            const qrisContainer = document.getElementById('qrisContainer');
            if (qrisContainer) {
                if (selectedPaymentMethod === 'QRIS') {
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FreshPOS_${order_code}_Rp${total}`;
                    qrisContainer.querySelector('img').src = qrUrl;
                    qrisContainer.style.display = 'block';
                } else {
                    qrisContainer.style.display = 'none';
                }
            }

            checkoutModal.classList.add('show');
            
            // Save to History (if history.js is loaded)
            if (typeof saveOrderToHistory === 'function') {
                saveOrderToHistory({
                    order_code: order_code,
                    kasir: adminNameEl ? adminNameEl.textContent : 'Admin',
                    payment_method: selectedPaymentMethod,
                    items: [...cartState],
                    subtotal: subtotal,
                    tax: tax,
                    total: total,
                    timestamp: new Date().toISOString()
                });
            }

            // Decrease Stock
            cartState.forEach(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                if (product) {
                    product.stock -= cartItem.qty;
                }
            });
            // Re-render grid to update stock display
            if (typeof filterAndRenderProducts === 'function') {
                filterAndRenderProducts();
            }
        } catch (error) {
            alert("Kesalahan proses: " + error.message);
        } finally {
            btnCheckout.innerHTML = originalText;
            btnCheckout.disabled = false;
        }
    }
});

btnSelesai.addEventListener('click', () => {
    checkoutModal.classList.remove('show');
    // Clear Cart
    cartState = [];
    renderCart();
    
    // Create new order ID or keep the date
    const orderIdEl = document.querySelector('.order-id');
    if (orderIdEl) {
        const newCode = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
        if (orderIdEl.tagName === 'INPUT') {
            orderIdEl.value = newCode;
        } else {
            orderIdEl.textContent = newCode;
        }
    }
});

// Inisialisasi tanggal pada input
document.addEventListener('DOMContentLoaded', () => {
    const orderIdEl = document.querySelector('.order-id');
    if (orderIdEl) {
        const initCode = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
        if (orderIdEl.tagName === 'INPUT') {
            orderIdEl.value = initCode;
        } else {
            orderIdEl.textContent = initCode;
        }
    }
});
