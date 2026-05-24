// ============================================================
//  BAGIAN KASIR: cart.js
//  File ini mengatur seluruh logika keranjang belanja kasir:
//  - Tambah / ubah / hapus item keranjang
//  - Hitung subtotal, pajak, diskon member, total
//  - Render tampilan keranjang
//  - Proses checkout & simpan ke history
//  - Logika diskon member (pilih member / manual)
// ============================================================

// ============================================================
// BAGIAN KASIR: STATE KERANJANG & VARIABEL GLOBAL
// cartState  = array item yang ada di keranjang
// TAX_RATE   = tarif PPN (11%)
// ============================================================
let cartState = [];
const TAX_RATE = 0.11; // PPN 11%

// ============================================================
// KOLOM BAGIAN MEMBER: STATE DISKON MEMBER
// selectedMember         = objek member yang dipilih
// useMemberDiscountActive = apakah diskon sedang aktif dipakai
// ============================================================
let selectedMember = null;   // { id, name, discount_pct, discount_status }
let useMemberDiscountActive = false;

// ============================================================
// BAGIAN KASIR: REFERENSI ELEMEN DOM KERANJANG
// Semua elemen HTML yang dibutuhkan oleh keranjang
// ============================================================
const cartItemsEl    = document.getElementById('cartItems');
const emptyCartMsg   = document.getElementById('emptyCartMsg');
const subtotalEl     = document.getElementById('subtotalAmount');
const taxEl          = document.getElementById('taxAmount');
const totalEl        = document.getElementById('totalAmount');
const discountRowEl  = document.getElementById('discountRow');
const discountLabelEl  = document.getElementById('discountLabel');
const discountAmountEl = document.getElementById('discountAmount');
const btnCheckout    = document.getElementById('btnCheckout');
const adminNameEl    = document.getElementById('adminName');
const modalTotalEl   = document.getElementById('modalTotal');
const checkoutModal  = document.getElementById('checkoutModal');
const btnSelesai     = document.getElementById('btnSelesai');
const paymentButtons = document.querySelectorAll('.pay-btn');

// ============================================================
// BAGIAN KASIR: FUNGSI TAMBAH ITEM KE KERANJANG
// Dipanggil saat user klik kartu produk di grid menu.
// Cek stok sebelum menambahkan. Jika sudah ada, tambah qty.
// ============================================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Cek stok: jika habis, tampilkan peringatan
    if (product.stock <= 0) {
        alert("Maaf, stok " + product.name + " sedang habis.");
        return;
    }

    const existingItem = cartState.find(item => item.id === productId);
    if (existingItem) {
        // Jika item sudah ada di keranjang, cek apakah qty melebihi stok
        if (existingItem.qty >= product.stock) {
            alert("Jumlah pesanan melebihi stok yang tersedia.");
            return;
        }
        existingItem.qty += 1;
    } else {
        // Item baru: tambahkan ke array keranjang dengan qty awal 1
        cartState.push({ ...product, qty: 1 });
    }

    renderCart(); // Perbarui tampilan keranjang
}

// ============================================================
// BAGIAN KASIR: FUNGSI UBAH JUMLAH (QTY) ITEM
// Dipanggil saat user klik tombol + atau - di item keranjang.
// increment = +1 (tambah) atau -1 (kurang). Jika qty <= 0, hapus item.
// ============================================================
function updateQty(productId, increment) {
    const itemIndex = cartState.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const product = products.find(p => p.id === productId);
        // Cek batas stok saat menambah qty
        if (increment > 0 && cartState[itemIndex].qty >= product.stock) {
            alert("Jumlah pesanan melebihi stok yang tersedia.");
            return;
        }

        cartState[itemIndex].qty += increment;

        // Jika qty menjadi 0 atau kurang, hapus item dari keranjang
        if (cartState[itemIndex].qty <= 0) {
            cartState.splice(itemIndex, 1);
        }
    }
    renderCart();
}

// ============================================================
// BAGIAN KASIR: FUNGSI HAPUS ITEM DARI KERANJANG
// Dipanggil saat user klik tombol hapus (tempat sampah).
// ============================================================
function removeFromCart(productId) {
    cartState = cartState.filter(item => item.id !== productId);
    renderCart();
}

// ============================================================
// BAGIAN KASIR: FUNGSI HITUNG TOTAL PEMBAYARAN
// Menghitung subtotal, pajak PPN 11%, diskon member (jika aktif),
// dan total akhir yang harus dibayar.
// ============================================================
function calculateTotal() {
    let subtotal = 0;
    cartState.forEach(item => {
        subtotal += (item.price * item.qty);
    });

    const tax = subtotal * TAX_RATE;

    // Hitung diskon member jika checkbox diskon aktif
    let discount = 0;
    if (useMemberDiscountActive && selectedMember && selectedMember.discount_pct > 0) {
        // Diskon diterapkan pada subtotal + pajak (total sebelum diskon)
        const preDiscount = subtotal + tax;
        discount = preDiscount * (selectedMember.discount_pct / 100);
    }

    const total = subtotal + tax - discount;

    return { subtotal, tax, discount, total };
}

// ============================================================
// BAGIAN KASIR: FUNGSI RENDER / TAMPILKAN KERANJANG
// Mengubah array cartState menjadi HTML lalu ditampilkan.
// Juga memperbarui subtotal, pajak, diskon, dan total di footer.
// ============================================================
function renderCart() {
    // Buat HTML untuk setiap item di keranjang
    const itemsHTML = cartState.map((item, index) => `
        <div class="cart-item" style="animation: slideIn 0.3s ease ${index * 0.05}s forwards; opacity: 0; transform: translateY(10px);">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">${formatRupiah(item.price)}</span>
                <!-- Kontrol Qty: tombol - , jumlah, tombol + -->
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateQty('${item.id}', -1)"><i class="fa-solid fa-minus" style="font-size: 0.7rem;"></i></button>
                    <span class="cart-item-qty">${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty('${item.id}', 1)"><i class="fa-solid fa-plus" style="font-size: 0.7rem;"></i></button>
                </div>
            </div>
            <!-- Tombol Hapus Item -->
            <button class="del-btn" onclick="removeFromCart('${item.id}')" title="Hapus">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join('');

    // Tampilkan pesan kosong jika tidak ada item, atau tampilkan daftar item
    if (cartState.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Belum ada produk yang dipilih</p>
            </div>
        `;
        btnCheckout.disabled = true; // Nonaktifkan tombol bayar
    } else {
        cartItemsEl.innerHTML = itemsHTML;
        btnCheckout.disabled = false; // Aktifkan tombol bayar
    }

    // Perbarui tampilan angka di footer kasir
    const { subtotal, tax, discount, total } = calculateTotal();
    subtotalEl.textContent = formatRupiah(subtotal);
    taxEl.textContent      = formatRupiah(tax);

    // Tampilkan atau sembunyikan baris diskon member
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

// ============================================================
// BAGIAN KASIR: ANIMASI SLIDE-IN ITEM KERANJANG
// Tambahkan CSS keyframe secara dinamis untuk animasi daftar item
// ============================================================
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


// ============================================================
// KOLOM BAGIAN MEMBER: LOGIKA DISKON KARTU MEMBER
// Fungsi-fungsi untuk mengisi dropdown member dan menangani
// perubahan pilihan member atau diskon manual.
// ============================================================

// Isi dropdown member di keranjang dari localStorage
function populateMemberDropdown() {
    const dl = document.getElementById('memberDatalist');
    if (!dl) return;

    const members = JSON.parse(localStorage.getItem('freshpos_members') || '[]');
    dl.innerHTML = '';
    members.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.name;
        opt.dataset.id             = m.id;
        opt.dataset.discountPct    = m.discount_pct;
        opt.dataset.discountStatus = m.discount_status;
        dl.appendChild(opt);
    });
}

// KOLOM BAGIAN MEMBER: Referensi elemen panel diskon member
const memberSelectCart    = document.getElementById('memberSelectCart');
const manualDiscountInput = document.getElementById('manualDiscountInput');
const memberUseRow        = document.getElementById('memberUseRow');
const useMemberChk        = document.getElementById('useMemberDiscount');
const memberDiscLbl       = document.getElementById('memberDiscountLabel');
const memberDiscBadge     = document.getElementById('memberDiscountBadge');

// ============================================================
// KOLOM BAGIAN MEMBER: HANDLER PERUBAHAN PILIHAN MEMBER
// Dipanggil saat user memilih member dari dropdown.
// Menentukan apakah member terdaftar atau input manual.
// ============================================================
function handleMemberInput() {
    const isSelect = memberSelectCart && memberSelectCart.tagName === 'SELECT';
    const val = memberSelectCart ? memberSelectCart.value.trim() : '';
    const dl  = document.getElementById('memberDatalist');

    // Jika tidak ada yang dipilih (kosong), reset semua state member
    if (val === '') {
        selectedMember = null;
        useMemberDiscountActive = false;
        if (memberUseRow)        memberUseRow.style.display = 'none';
        if (manualDiscountInput) manualDiscountInput.style.display = 'none';
        if (useMemberChk)        { useMemberChk.checked = false; useMemberChk.disabled = false; }
        renderCart();
        return;
    }

    // Cari option yang dipilih dari dropdown atau datalist
    let matchedOption = null;
    if (isSelect) {
        if (memberSelectCart.selectedIndex > -1) {
            matchedOption = memberSelectCart.options[memberSelectCart.selectedIndex];
        }
    } else if (dl) {
        for (let opt of dl.options) {
            if (opt.value === val) { matchedOption = opt; break; }
        }
    }

    if (matchedOption && val !== 'manual') {
        // --- Member Terdaftar di Database ---
        selectedMember = {
            id:              matchedOption.dataset.id,
            name:            matchedOption.textContent.trim(),
            discount_pct:    parseInt(matchedOption.dataset.discountPct) || 0,
            discount_status: matchedOption.dataset.discountStatus
        };

        if (manualDiscountInput) manualDiscountInput.style.display = 'none';
        if (memberUseRow)        memberUseRow.style.display = 'flex';

        const isExpired = selectedMember.discount_status === 'Habis';
        const pct       = selectedMember.discount_pct;

        // Tampilkan label diskon dan badge status
        if (memberDiscLbl) memberDiscLbl.textContent = `Gunakan Diskon ${pct}%`;
        if (memberDiscBadge) {
            memberDiscBadge.textContent = isExpired ? 'Habis' : 'Aktif';
            memberDiscBadge.style.cssText = isExpired
                ? 'background:rgba(239,68,68,0.12);color:#f87171;border:1px solid rgba(239,68,68,0.25);padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:600;'
                : 'background:rgba(16,185,129,0.12);color:#34d399;border:1px solid rgba(16,185,129,0.25);padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:600;';
        }

        // Nonaktifkan checkbox jika diskon sudah habis masa berlakunya
        if (useMemberChk) {
            useMemberChk.disabled = isExpired;
            if (isExpired) {
                useMemberChk.checked  = false;
                useMemberChk.title    = 'Masa berlaku diskon sudah habis';
                useMemberDiscountActive = false;
            } else {
                useMemberChk.title    = '';
                useMemberChk.checked  = true;
                useMemberDiscountActive = true;
            }
        }
    } else {
        // --- Input Diskon Manual (tanpa member terdaftar) ---
        const manualPct = manualDiscountInput ? (parseInt(manualDiscountInput.value) || 0) : 0;
        selectedMember = {
            id:              'manual',
            name:            'Manual',
            discount_pct:    manualPct,
            discount_status: 'Aktif'
        };
        if (manualDiscountInput) manualDiscountInput.style.display = 'block';
        if (memberUseRow)        memberUseRow.style.display = 'flex';

        if (memberDiscLbl)   memberDiscLbl.textContent = `Gunakan Diskon Manual ${manualPct}%`;
        if (memberDiscBadge) {
            memberDiscBadge.textContent = 'Manual';
            memberDiscBadge.style.cssText = 'background:rgba(56,189,248,0.12);color:#38bdf8;border:1px solid rgba(56,189,248,0.25);padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:600;';
        }
        if (useMemberChk) {
            useMemberChk.disabled = false;
            useMemberChk.title    = '';
            useMemberChk.checked  = true;
            useMemberDiscountActive = true;
        }
    }
    renderCart();
}

// KOLOM BAGIAN MEMBER: Event listener dropdown & input diskon
if (memberSelectCart) {
    memberSelectCart.addEventListener('input',  handleMemberInput);
    memberSelectCart.addEventListener('change', handleMemberInput);
}
if (manualDiscountInput) {
    manualDiscountInput.addEventListener('input', handleMemberInput);
}

// KOLOM BAGIAN MEMBER: Checkbox aktifkan / nonaktifkan diskon
if (useMemberChk) {
    useMemberChk.addEventListener('change', () => {
        useMemberDiscountActive = useMemberChk.checked;
        renderCart();
    });
}

// ============================================================
// BAGIAN KASIR: PILIHAN METODE PEMBAYARAN
// User bisa pilih Tunai, Transfer, atau QRIS.
// Tombol yang aktif ditandai dengan class 'active'.
// ============================================================
let selectedPaymentMethod = "Tunai"; // Default: Tunai

paymentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        paymentButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPaymentMethod = btn.getAttribute('data-method');
    });
});

// ============================================================
// BAGIAN KASIR: PROSES CHECKOUT / BAYAR
// Dipanggil saat user klik tombol "Bayar Sekarang".
// - Kirim data ke backend (jika DB aktif)
// - Isi struk pembayaran di modal
// - Tampilkan QR Code jika QRIS
// - Simpan ke history localStorage
// - Kurangi stok produk
// ============================================================
btnCheckout.addEventListener('click', async () => {
    if (cartState.length > 0) {
        const { subtotal, tax, discount, total } = calculateTotal();

        // Tampilkan loading pada tombol bayar
        const originalText = btnCheckout.innerHTML;
        btnCheckout.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sedang memproses...';
        btnCheckout.disabled  = true;

        // BAGIAN KASIR: Generate Kode Order Transaksi
        const orderIdEl = document.querySelector('.order-id');
        let order_code  = orderIdEl && orderIdEl.tagName === 'INPUT' ? orderIdEl.value.trim() : "";

        // Jika input kosong atau tidak diawali 'TRX-', buat kode baru secara otomatis
        if (!order_code || !order_code.startsWith('TRX-')) {
            order_code = "TRX-" + Math.floor(100000 + Math.random() * 900000);
        }

        try {
            // SIMPAN DATA: Kirim data transaksi ke server (jika database aktif)
            if (API_PATH) {
                const response = await fetch(API_PATH, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order_code:     order_code,
                        kasir:          adminNameEl ? adminNameEl.textContent : 'Admin',
                        payment_method: selectedPaymentMethod,
                        items:          cartState,
                        subtotal:       subtotal,
                        tax:            tax,
                        discount:       discount,
                        total:          total
                    })
                });

                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.message);
                }
            } else {
                // Mode statis: tidak ada koneksi DB, data hanya disimpan lokal
                console.log("Static Mode: Skipping backend database save.");
            }

            // BAGIAN KASIR: Isi Header Struk Pembayaran
            document.getElementById('receiptDate').textContent = new Date().toLocaleString('id-ID');
            const adminNameReceipt = document.getElementById('receiptAdminName');
            if (adminNameEl && adminNameReceipt) {
                adminNameReceipt.textContent = adminNameEl.textContent;
            }

            // Perbarui Kode Order di header keranjang
            const orderIdElNew = document.querySelector('.order-id');
            if (orderIdElNew) {
                if (orderIdElNew.tagName === 'INPUT') {
                    orderIdElNew.value = order_code;
                } else {
                    orderIdElNew.textContent = order_code;
                }
            }

            // BAGIAN KASIR: Isi Tabel Item di Struk
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

            // BAGIAN KASIR: Isi Ringkasan Total di Struk
            if (document.getElementById('modalPaymentMethod')) {
                document.getElementById('modalPaymentMethod').textContent = selectedPaymentMethod;
                document.getElementById('modalSubtotal').textContent      = formatRupiah(subtotal);
                document.getElementById('modalTax').textContent           = formatRupiah(tax);

                // Tampilkan baris diskon di struk jika ada
                const modalDiscRow = document.getElementById('modalDiscountRow');
                const modalDiscEl  = document.getElementById('modalDiscount');
                const modalDiscLbl = document.getElementById('modalDiscountLabel');
                if (discount > 0 && modalDiscRow) {
                    modalDiscRow.style.display = 'flex';
                    if (modalDiscLbl) modalDiscLbl.textContent = `Diskon Member ${selectedMember ? selectedMember.name : ''} (${selectedMember ? selectedMember.discount_pct : 0}%):`;
                    if (modalDiscEl)  modalDiscEl.textContent  = `- ${formatRupiah(discount)}`;
                } else if (modalDiscRow) {
                    modalDiscRow.style.display = 'none';
                }

                document.getElementById('modalTotal').textContent = formatRupiah(total);
            } else {
                if (modalTotalEl) modalTotalEl.textContent = formatRupiah(total);
            }

            // BAGIAN KASIR: Tampilkan QR Code jika metode pembayaran QRIS
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

            // Tampilkan modal struk pembayaran
            checkoutModal.classList.add('show');

            // SIMPAN DATA: Simpan order ke history localStorage (mode offline/backup)
            saveOrderToHistory({
                order_code:     order_code,
                kasir:          adminNameEl ? adminNameEl.textContent : 'Admin',
                payment_method: selectedPaymentMethod,
                items:          [...cartState],
                subtotal:       subtotal,
                tax:            tax,
                total:          total,
                timestamp:      new Date().toISOString()
            });

            // BAGIAN KASIR: Kurangi Stok Produk Setelah Checkout
            cartState.forEach(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                if (product) {
                    product.stock -= cartItem.qty;
                }
            });
            // Re-render grid produk agar badge stok diperbarui
            if (typeof filterAndRenderProducts === 'function') {
                filterAndRenderProducts();
            }

        } catch (error) {
            alert("Kesalahan proses: " + error.message);
        } finally {
            // Kembalikan teks tombol bayar seperti semula
            btnCheckout.innerHTML = originalText;
            btnCheckout.disabled  = false;
        }
    }
});

// ============================================================
// BAGIAN KASIR: TOMBOL SELESAI & CETAK STRUK
// Menutup modal struk, mereset keranjang & state member,
// lalu membuat kode order baru untuk transaksi berikutnya.
// ============================================================
btnSelesai.addEventListener('click', () => {
    checkoutModal.classList.remove('show');

    // Reset keranjang ke kondisi kosong
    cartState = [];

    // Reset state diskon member
    selectedMember = null;
    useMemberDiscountActive = false;
    if (memberSelectCart)    memberSelectCart.value = '';
    if (manualDiscountInput) {
        manualDiscountInput.value = '';
        manualDiscountInput.style.display = 'none';
    }
    if (useMemberChk) { useMemberChk.checked = false; useMemberChk.disabled = false; }
    if (memberUseRow)   memberUseRow.style.display = 'none';

    renderCart(); // Tampilkan keranjang kosong

    // Buat kode order baru untuk transaksi selanjutnya
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

// ============================================================
// BAGIAN KASIR: INISIALISASI SAAT HALAMAN DIMUAT
// - Generate kode order pertama
// - Isi dropdown member dari localStorage
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Generate kode order awal saat halaman pertama dibuka
    const orderIdEl = document.querySelector('.order-id');
    if (orderIdEl) {
        const initCode = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
        if (orderIdEl.tagName === 'INPUT') {
            orderIdEl.value = initCode;
        } else {
            orderIdEl.textContent = initCode;
        }
    }

    // Isi dropdown member dari data localStorage
    populateMemberDropdown();
});

// KOLOM BAGIAN MEMBER: Re-populate dropdown saat modal member ditutup
// (data member mungkin berubah setelah edit/tambah)
document.getElementById('btnCloseHistory')?.addEventListener('click', () => {
    populateMemberDropdown();
});

// ============================================================
// SIMPAN DATA: HELPER – Simpan Order ke History (localStorage)
// Dipakai sebagai backup offline. Data disimpan ke key
// 'freshpos_order_history' di localStorage browser.
// ============================================================
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
