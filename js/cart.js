let cartState = [];
const TAX_RATE = 0.11; // PPN 11%

// Member Discount State
let selectedMember = null;   // { id, name, discount_pct, discount_status }
let useMemberDiscountActive = false;

const cartItemsEl = document.getElementById('cartItems');
const emptyCartMsg = document.getElementById('emptyCartMsg');
const subtotalEl = document.getElementById('subtotalAmount');
const taxEl = document.getElementById('taxAmount');
const totalEl = document.getElementById('totalAmount');
const discountRowEl = document.getElementById('discountRow');
const discountLabelEl = document.getElementById('discountLabel');
const discountAmountEl = document.getElementById('discountAmount');
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
    
    // Hitung diskon member jika aktif
    let discount = 0;
    if (useMemberDiscountActive && selectedMember && selectedMember.discount_pct > 0) {
        // Diskon diterapkan pada subtotal + pajak (total sebelum diskon)
        const preDiscount = subtotal + tax;
        discount = preDiscount * (selectedMember.discount_pct / 100);
    }
    
    const total = subtotal + tax - discount;
    
    return { subtotal, tax, discount, total };
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

    const { subtotal, tax, discount, total } = calculateTotal();
    subtotalEl.textContent = formatRupiah(subtotal);
    taxEl.textContent = formatRupiah(tax);
    
    // Tampilkan baris diskon jika aktif
    if (discount > 0 && discountRowEl) {
        const pct = selectedMember ? selectedMember.discount_pct : 0;
        discountRowEl.style.display = 'flex';
        if (discountLabelEl) discountLabelEl.textContent = `Diskon Member (${pct}%)`;
        if (discountAmountEl) discountAmountEl.textContent = `- ${formatRupiah(discount)}`;
    } else if (discountRowEl) {
        discountRowEl.style.display = 'none';
    }
    
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


// ── Member Card Discount Logic ──────────────────────────────
function populateMemberDropdown() {
    const dl = document.getElementById('memberDatalist');
    if (!dl) return;
    
    const members = JSON.parse(localStorage.getItem('freshpos_members') || '[]');
    dl.innerHTML = '';
    members.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.name;
        opt.dataset.id = m.id;
        opt.dataset.discountPct    = m.discount_pct;
        opt.dataset.discountStatus = m.discount_status;
        dl.appendChild(opt);
    });
}

const memberSelectCart = document.getElementById('memberSelectCart');
const manualDiscountInput = document.getElementById('manualDiscountInput');
const memberUseRow     = document.getElementById('memberUseRow');
const useMemberChk     = document.getElementById('useMemberDiscount');
const memberDiscLbl    = document.getElementById('memberDiscountLabel');
const memberDiscBadge  = document.getElementById('memberDiscountBadge');

function handleMemberInput() {
    const isSelect = memberSelectCart && memberSelectCart.tagName === 'SELECT';
    const val = memberSelectCart ? memberSelectCart.value.trim() : '';
    const dl = document.getElementById('memberDatalist');
    
    if (val === '') {
        selectedMember = null;
        useMemberDiscountActive = false;
        if (memberUseRow) memberUseRow.style.display = 'none';
        if (manualDiscountInput) manualDiscountInput.style.display = 'none';
        if (useMemberChk) { useMemberChk.checked = false; useMemberChk.disabled = false; }
        renderCart();
        return;
    }

    let matchedOption = null;
    if (isSelect) {
        if (memberSelectCart.selectedIndex > -1) {
            matchedOption = memberSelectCart.options[memberSelectCart.selectedIndex];
        }
    } else if (dl) {
        for (let opt of dl.options) {
            if (opt.value === val) {
                matchedOption = opt;
                break;
            }
        }
    }

    if (matchedOption && val !== 'manual') {
        // Terdaftar di database member
        selectedMember = {
            id: matchedOption.dataset.id,
            name: matchedOption.textContent.trim(),
            discount_pct: parseInt(matchedOption.dataset.discountPct) || 0,
            discount_status: matchedOption.dataset.discountStatus
        };
        
        if (manualDiscountInput) manualDiscountInput.style.display = 'none';
        if (memberUseRow) memberUseRow.style.display = 'flex';
        
        const isExpired = selectedMember.discount_status === 'Habis';
        const pct = selectedMember.discount_pct;
        
        if (memberDiscLbl) memberDiscLbl.textContent = `Gunakan Diskon ${pct}%`;
        if (memberDiscBadge) {
            memberDiscBadge.textContent = isExpired ? 'Habis' : 'Aktif';
            memberDiscBadge.style.cssText = isExpired
                ? 'background:rgba(239,68,68,0.12);color:#f87171;border:1px solid rgba(239,68,68,0.25);padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:600;'
                : 'background:rgba(16,185,129,0.12);color:#34d399;border:1px solid rgba(16,185,129,0.25);padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:600;';
        }
        
        if (useMemberChk) {
            useMemberChk.disabled = isExpired;
            if (isExpired) {
                useMemberChk.checked  = false;
                useMemberChk.title = 'Masa berlaku diskon sudah habis';
                useMemberDiscountActive = false;
            } else {
                useMemberChk.title = '';
                useMemberChk.checked = true;
                useMemberDiscountActive = true;
            }
        }
    } else {
        // Manual Entry
        const manualPct = manualDiscountInput ? (parseInt(manualDiscountInput.value) || 0) : 0;
        selectedMember = {
            id: 'manual',
            name: 'Manual',
            discount_pct: manualPct,
            discount_status: 'Aktif'
        };
        if (manualDiscountInput) manualDiscountInput.style.display = 'block';
        if (memberUseRow) memberUseRow.style.display = 'flex';
        
        if (memberDiscLbl) memberDiscLbl.textContent = `Gunakan Diskon Manual ${manualPct}%`;
        if (memberDiscBadge) {
            memberDiscBadge.textContent = 'Manual';
            memberDiscBadge.style.cssText = 'background:rgba(56,189,248,0.12);color:#38bdf8;border:1px solid rgba(56,189,248,0.25);padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:600;';
        }
        if (useMemberChk) {
            useMemberChk.disabled = false;
            useMemberChk.title = '';
            useMemberChk.checked = true;
            useMemberDiscountActive = true;
        }
    }
    renderCart();
}

if (memberSelectCart) {
    memberSelectCart.addEventListener('input', handleMemberInput);
    memberSelectCart.addEventListener('change', handleMemberInput);
}
if (manualDiscountInput) {
    manualDiscountInput.addEventListener('input', handleMemberInput);
}

if (useMemberChk) {
    useMemberChk.addEventListener('change', () => {
        useMemberDiscountActive = useMemberChk.checked;
        renderCart();
    });
}

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
        const { subtotal, tax, discount, total } = calculateTotal();
        
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
                        discount: discount,
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
                
                // Diskon baris di struk
                const modalDiscRow = document.getElementById('modalDiscountRow');
                const modalDiscEl  = document.getElementById('modalDiscount');
                const modalDiscLbl = document.getElementById('modalDiscountLabel');
                if (discount > 0 && modalDiscRow) {
                    modalDiscRow.style.display = 'flex';
                    if (modalDiscLbl) modalDiscLbl.textContent = `Diskon Member ${selectedMember ? selectedMember.name : ''} (${selectedMember ? selectedMember.discount_pct : 0}%):`;
                    if (modalDiscEl)  modalDiscEl.textContent = `- ${formatRupiah(discount)}`;
                } else if (modalDiscRow) {
                    modalDiscRow.style.display = 'none';
                }
                
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
            
            // Save to History locally
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
    
    // Reset member discount state
    selectedMember = null;
    useMemberDiscountActive = false;
    if (memberSelectCart) memberSelectCart.value = '';
    if (manualDiscountInput) { 
        manualDiscountInput.value = ''; 
        manualDiscountInput.style.display = 'none'; 
    }
    if (useMemberChk) { useMemberChk.checked = false; useMemberChk.disabled = false; }
    if (memberUseRow) memberUseRow.style.display = 'none';
    
    renderCart();
    
    // Create new order ID
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

// Inisialisasi tanggal pada input dan member dropdown
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
    
    // Populate member dropdown dari localStorage
    populateMemberDropdown();
});

// Re-populate dropdown setiap kali modal member ditutup (data mungkin berubah)
document.getElementById('btnCloseHistory')?.addEventListener('click', () => {
    populateMemberDropdown();
});

// Helper untuk simpan history ke localStorage (fallback/offline mode)
function saveOrderToHistory(orderData) {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('freshpos_order_history')) || [];
    } catch (e) {
        history = [];
    }
    history.push(orderData);
    localStorage.setItem('freshpos_order_history', JSON.stringify(history));
}
