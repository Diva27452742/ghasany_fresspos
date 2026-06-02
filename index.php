<?php
/**
 * FreshPOS – index.php (Root)
 * File utama aplikasi kasir. Berisi data PHP (statis) dan seluruh struktur HTML.
 * Versi PHP dengan data produk (Statis).
 */

// ============================================================
// BAGIAN: CEK KONEKSI DATABASE
// Coba sambungkan ke database MySQL. Jika gagal, aplikasi
// tetap berjalan dalam mode statis (tanpa database).
// ============================================================
$dbActive = false;
try {
    require_once __DIR__ . '/php/config.php';
    $db = getDB();
    $dbActive = true;
} catch (Exception $e) {
    $dbActive = false;
}

// ============================================================
// BAGIAN: DATA KATEGORI MENU
// Daftar kategori yang tampil di sidebar kiri aplikasi.
// Setiap kategori punya id, nama, dan ikon Font Awesome.
// ============================================================
$categoriesData = [
    ['id' => 'all',     'name' => 'Semua Menu',   'icon' => 'fa-table-cells-large'],
    ['id' => 'makanan', 'name' => 'Makanan',       'icon' => 'fa-burger'],
    ['id' => 'minuman', 'name' => 'Minuman',       'icon' => 'fa-mug-hot'],
    ['id' => 'snack',   'name' => 'Snack',         'icon' => 'fa-cookie'],
    ['id' => 'dessert', 'name' => 'Dessert',       'icon' => 'fa-ice-cream'],
    ['id' => 'paket',   'name' => 'Paket Hemat',   'icon' => 'fa-box-open']
];

// ============================================================
// BAGIAN: DATA PRODUK / DAFTAR MENU
// Semua produk yang dijual, lengkap dengan id, nama, harga,
// kategori, path gambar, dan stok awal.
// ============================================================
$productsData = [
    // --- Makanan ---
    ['id' => 'p1',  'name' => 'Salad Sayur Organik',   'price' => 35000, 'category' => 'makanan', 'image' => 'assets/image.png',              'stock' => 12],
    ['id' => 'p2',  'name' => 'Ayam Panggang Diet',    'price' => 45000, 'category' => 'makanan', 'image' => 'assets/image copy.png',         'stock' => 8],
    ['id' => 'p7',  'name' => 'Quinoa Bowl Berserat',  'price' => 50000, 'category' => 'makanan', 'image' => 'assets/image copy 6.png',       'stock' => 5],
    ['id' => 'p10', 'name' => 'Sandwich Telur',        'price' => 32000, 'category' => 'makanan', 'image' => 'assets/image copy 9.png',       'stock' => 15],
    ['id' => 'p11', 'name' => 'Nasi Goreng Spesial',   'price' => 30000, 'category' => 'makanan', 'image' => 'assets/image copy 10.png',      'stock' => 10],
    ['id' => 'p12', 'name' => 'Mie Goreng Pedas',      'price' => 28000, 'category' => 'makanan', 'image' => 'assets/image copy 11.png',      'stock' => 0],
    ['id' => 'p13', 'name' => 'Gado-Gado Segar',       'price' => 25000, 'category' => 'makanan', 'image' => 'assets/image copy 12.png',      'stock' => 20],
    ['id' => 'p14', 'name' => 'Soto Ayam Kuning',      'price' => 27000, 'category' => 'makanan', 'image' => 'assets/image copy 13.png',      'stock' => 12],

    // --- Minuman ---
    ['id' => 'p3',  'name' => 'Jus Alpukat Murni',     'price' => 25000, 'category' => 'minuman', 'image' => 'assets/image copy 2.png',       'stock' => 10],
    ['id' => 'p4',  'name' => 'Kopi Susu Gula Aren',   'price' => 20000, 'category' => 'minuman', 'image' => 'assets/image copy 3.png',       'stock' => 25],
    ['id' => 'p6',  'name' => 'Mix Berry Smoothie',    'price' => 30000, 'category' => 'minuman', 'image' => 'assets/image copy 5.png',       'stock' => 7],
    ['id' => 'p8',  'name' => 'Matcha Latte',          'price' => 28000, 'category' => 'minuman', 'image' => 'assets/image copy 7.png',       'stock' => 12],
    ['id' => 'p15', 'name' => 'Es Teh Manis',          'price' => 8000,  'category' => 'minuman', 'image' => 'assets/image copy 14.png',      'stock' => 50],
    ['id' => 'p16', 'name' => 'Susu Regal Premium',    'price' => 5000,  'category' => 'minuman', 'image' => 'assets/image copy 15.png',      'stock' => 18],
    ['id' => 'p17', 'name' => 'Jus Jeruk Segar',       'price' => 18000, 'category' => 'minuman', 'image' => 'assets/image copy 16.png',      'stock' => 15],
    ['id' => 'p18', 'name' => 'Lemon Tea Dingin',      'price' => 15000, 'category' => 'minuman', 'image' => 'assets/image copy 17.png',      'stock' => 20],

    // --- Snack ---
    ['id' => 'p5',  'name' => 'Keripik Kentang',       'price' => 15000, 'category' => 'snack',   'image' => 'assets/image copy 4.png',       'stock' => 30],
    ['id' => 'p9',  'name' => 'Soft Cookies',          'price' => 20000, 'category' => 'snack',   'image' => 'assets/image copy 8.png',       'stock' => 12],
    ['id' => 'p19', 'name' => 'Donat Coklat',          'price' => 12000, 'category' => 'snack',   'image' => 'assets/image copy 18.png',      'stock' => 25],
    ['id' => 'p20', 'name' => 'Pisang Goreng Crispy',  'price' => 10000, 'category' => 'snack',   'image' => 'assets/image copy 19.png',      'stock' => 0],
    ['id' => 'p21', 'name' => 'Roti Bakar Selai',      'price' => 14000, 'category' => 'snack',   'image' => 'assets/image copy 20.png',      'stock' => 15],
    ['id' => 'p22', 'name' => 'Dimsum Mentai',         'price' => 10000, 'category' => 'snack',   'image' => 'assets/image copy 21.png',      'stock' => 10],

    // --- Dessert ---
    // [DATA PRODUK PHP] - Data menu Es Krim Vanilla yang tampil di grid produk kasir.
    ['id' => 'p23', 'name' => 'Es Krim Vanilla',       'price' => 18000, 'category' => 'dessert', 'image' => 'assets/image copy 22.png',      'stock' => 12],
    ['id' => 'p24', 'name' => 'Puding Caramel',        'price' => 12000, 'category' => 'dessert', 'image' => 'assets/image copy 23.png',      'stock' => 15],
    ['id' => 'p25', 'name' => 'Brownies Panggang',     'price' => 22000, 'category' => 'dessert', 'image' => 'assets/image copy 24.png',      'stock' => 8],
    ['id' => 'p26', 'name' => 'Boba Matcha',           'price' => 25000, 'category' => 'dessert', 'image' => 'assets/image copy 25.png',      'stock' => 10],
    ['id' => 'p27', 'name' => 'Crepe Strawberry',      'price' => 20000, 'category' => 'dessert', 'image' => 'assets/image copy 26.png',      'stock' => 0],

    // --- Paket Hemat ---
    ['id' => 'p28', 'name' => 'Paket Makan Siang',       'price' => 55000,  'category' => 'paket', 'image' => 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png',  'stock' => 10],
    ['id' => 'p29', 'name' => 'Paket Sarapan Sehat',     'price' => 40000,  'category' => 'paket', 'image' => 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png',  'stock' => 10],
    ['id' => 'p30', 'name' => 'Paket Dinner Romantis',   'price' => 95000,  'category' => 'paket', 'image' => 'assets/Cokelat Krem Modern Kreatif Menu Burger Brosur Produk.png',     'stock' => 5],
    ['id' => 'p31', 'name' => 'Paket Keluarga Lengkap',  'price' => 120000, 'category' => 'paket', 'image' => 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png',  'stock' => 3],
    ['id' => 'p32', 'name' => 'Paket Buka Puasa',        'price' => 75000,  'category' => 'paket', 'image' => 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png',  'stock' => 8],
    ['id' => 'p33', 'name' => 'Paket Meeting Snack Box', 'price' => 65000,  'category' => 'paket', 'image' => 'assets/Krem Minimalis Menu Restoran.png',                             'stock' => 12]
];

// ============================================================
// BAGIAN: DATA MEMBER DARI DATABASE
// Jika database aktif, ambil seluruh data member yang sudah
// tersimpan agar bisa ditampilkan di dropdown kasir.
// ============================================================
$membersData = [];
if ($dbActive) {
    try {
        $stmt = $db->query("SELECT * FROM members ORDER BY name ASC");
        $membersData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) { }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FreshPOS – Sistem Kasir Modern</title>
    <meta name="description" content="Aplikasi kasir modern berbasis web dengan tampilan hijau elegan.">

    <!-- ============================================================ -->
    <!-- BAGIAN: IMPORT FONT & ICON EKSTERNAL                         -->
    <!-- ============================================================ -->
    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome (ikon) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- ============================================================ -->
    <!-- BAGIAN: IMPORT FILE CSS                                      -->
    <!-- Urutan penting: variabel/token dulu, lalu komponen           -->
    <!-- ============================================================ -->
    <!-- CSS Global Tokens & Animasi -->
    <link rel="stylesheet" href="./css/variables.css?v=<?= time() ?>">
    <link rel="stylesheet" href="./css/animations.css?v=<?= time() ?>">

    <!-- CSS Layout & Komponen -->
    <link rel="stylesheet" href="./css/layout.css">
    <link rel="stylesheet" href="./css/sidebar.css">
    <link rel="stylesheet" href="./css/header.css">
    <link rel="stylesheet" href="./css/products.css">
    <link rel="stylesheet" href="./css/cart.css">
    <link rel="stylesheet" href="./css/modal.css">
    <link rel="stylesheet" href="./css/history.css">
    <link rel="stylesheet" href="./css/reservation.css">
    <link rel="stylesheet" href="./css/recap.css?v=<?= time() ?>">
    <link rel="stylesheet" href="./css/stock_admin.css">

    <!-- ============================================================ -->
    <!-- BAGIAN: TEMA DINAMIS DARI PHP                                -->
    <!-- Jika operator mengedit php/theme_config.php, warna di sini   -->
    <!-- akan menimpa warna default yang ada di variables.css.        -->
    <!-- ============================================================ -->
    <?php
    if (file_exists(__DIR__ . '/php/theme_config.php')) {
        require_once __DIR__ . '/php/theme_config.php';
        echo "<style>\n:root {\n";
        foreach ($themeColors as $key => $color) {
            echo "    --{$key}: {$color};\n";
        }
        echo "}\n</style>\n";
    }
    ?>
</head>
<body>
    <!-- ============================================================ -->
    <!-- BAGIAN: WRAPPER UTAMA APLIKASI                               -->
    <!-- ============================================================ -->
    <div class="app-container">

        <!-- ============================================================ -->
        <!-- BAGIAN: SIDEBAR KIRI – NAVIGASI KATEGORI MENU               -->
        <!-- Berisi logo, daftar kategori menu, dan tombol fitur tambahan  -->
        <!-- ============================================================ -->
        <aside class="sidebar">
            <!-- Logo Aplikasi -->
            <div class="logo">
                <i class="fa-solid fa-leaf"></i>
                <h2>FreshPOS</h2>
            </div>

            <div class="sidebar-divider"></div>

            <!-- Label Navigasi Kategori -->
            <p class="nav-label">Menu Kategori</p>

            <!-- KOLOM BAGIAN: DAFTAR SEMUA KATEGORI MENU -->
            <!-- Tombol kategori dirender secara dinamis oleh sidebar.js -->
            <nav class="categories" id="categoryMenu">
                <!-- Kategori dirender oleh JS -->
            </nav>

            <div class="sidebar-divider"></div>

            <!-- Label Fitur Tambahan -->
            <p class="nav-label">Data & Reservasi</p>

            <!-- BAGIAN: TOMBOL FITUR TAMBAHAN DI SIDEBAR -->
            <div class="extra-features">
                <!-- Tombol buka modal Reservasi -->
                <button id="btnOpenReservation" class="extra-btn">
                    <i class="fa-solid fa-calendar-plus"></i> Buat Reservasi
                </button>
                <!-- Tombol buka modal Riwayat Reservasi -->
                <button id="btnOpenResHistory" class="extra-btn">
                    <i class="fa-solid fa-book"></i> Riwayat Reservasi
                </button>
                <!-- Tombol buka modal Rekap / Analitik Data -->
                <button id="btnOpenRecap" class="extra-btn recap">
                    <i class="fa-solid fa-chart-line"></i> Rekap Data (Analitik)
                </button>
                <!-- Tombol buka modal Kelola Stok Menu -->
                <button id="btnOpenStockAdmin" class="extra-btn stock">
                    <i class="fa-solid fa-boxes-stacked"></i> Kelola Stok Menu
                </button>
            </div>

            <!-- Footer Sidebar -->
            <div class="sidebar-footer">
                <p>© 2025 FreshPOS v2.0</p>
            </div>
        </aside>

        <!-- ============================================================ -->
        <!-- BAGIAN: KONTEN UTAMA – DAFTAR MENU / GRID PRODUK            -->
        <!-- ============================================================ -->
        <main class="main-content">

            <!-- BAGIAN: HEADER ATAS – PENCARIAN & PROFIL KASIR -->
            <header class="top-header">
                <!-- Kolom Pencarian Menu -->
                <div class="search-bar">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="searchInput" placeholder="Cari menu / produk...">
                </div>

                <!-- Profil & Tombol Riwayat Member -->
                <div class="user-profile">
                    <!-- Tombol buka modal Riwayat Member -->
                    <button id="btnOpenHistory" class="history-btn-top" title="Riwayat & Catatan Member">
                        <i class="fa-solid fa-user-check"></i> Riwayat Member
                    </button>
                    <!-- Info Nama & Role Kasir -->
                    <div class="user-info">
                        <span class="name" id="adminName">Admin Utama</span>
                        <span class="role">Kasir <i class="fa-solid fa-pen edit-admin-btn" id="editAdminBtn" title="Ganti Nama"></i></span>
                    </div>
                    <!-- Avatar Kasir (menggunakan UI Avatars API) -->
                    <img src="https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff" id="adminAvatar" alt="User" class="avatar">
                </div>
            </header>

            <!-- BAGIAN: BAR JUDUL SECTION DAFTAR MENU -->
            <div class="section-bar">
                <span class="section-title">
                    <i class="fa-solid fa-th-large"></i>
                    Daftar Menu
                </span>
                <!-- Badge jumlah produk yang tampil -->
                <span class="product-count-badge" id="productCountBadge">0 produk</span>
            </div>

            <!-- KOLOM BAGIAN: GRID / KOLOM SEMUA MENU PRODUK -->
            <!-- [KONTAINER UTAMA KOLOM/GRID] - Wadah HTML untuk menampung semua kartu produk dalam kolom dan baris.
                 Grep / Cari "KONTAINER UTAMA KOLOM" untuk menemukannya. -->
            <div class="products-grid" id="productsGrid">
                <!-- Produk dirender oleh JS -->
            </div>
        </main>

        <!-- ============================================================ -->
        <!-- BAGIAN KASIR: SIDEBAR KANAN – KERANJANG BELANJA & PEMBAYARAN-->
        <!-- Berisi daftar item yang dipilih, diskon member, total,       -->
        <!-- metode pembayaran, dan tombol bayar.                         -->
        <!-- ============================================================ -->
        <aside class="cart-sidebar">

            <!-- Header Kasir: Judul & Kode Order -->
            <div class="cart-header">
                <h2><i class="fa-solid fa-basket-shopping"></i> Kasir</h2>
                <!-- Input Kode Transaksi (auto-generate, bisa diedit) -->
                <input type="text" class="order-id" id="orderIdInput" style="width: 100px; text-align: center; outline: none; cursor: text;">
            </div>

            <!-- KOLOM BAGIAN KASIR: DAFTAR ITEM KERANJANG -->
            <!-- Item yang dipilih pelanggan dirender oleh cart.js -->
            <div class="cart-items" id="cartItems">
                <!-- Pesan kosong jika belum ada item -->
                <div class="empty-cart-msg" id="emptyCartMsg">
                    <i class="fa-solid fa-cart-arrow-down"></i>
                    <p>Keranjang masih kosong</p>
                </div>
            </div>

            <!-- ============================================================ -->
            <!-- KOLOM BAGIAN MEMBER: PANEL KARTU DISKON MEMBER             -->
            <!-- Dropdown pilih member, input diskon manual, checkbox aktif  -->
            <!-- ============================================================ -->
            <div class="member-card-panel" id="memberCardPanel">
                <div class="member-card-panel-header">
                    <i class="fa-solid fa-id-card"></i>
                    <span>Kartu Member</span>
                </div>

                <!-- Dropdown Pilih Member (diisi dari PHP $membersData) -->
                <select id="memberSelectCart" class="member-select-dropdown">
                    <option value="">-- Pilih Member --</option>
                    <?php foreach ($membersData as $m): ?>
                        <!-- Setiap option membawa data diskon dan status dari database -->
                        <option value="<?= htmlspecialchars($m['name']) ?>"
                                data-id="<?= htmlspecialchars($m['id']) ?>"
                                data-discount-pct="<?= htmlspecialchars($m['discount_pct']) ?>"
                                data-discount-status="<?= htmlspecialchars($m['discount_status']) ?>">
                            <?= htmlspecialchars($m['name']) ?>
                        </option>
                    <?php endforeach; ?>
                    <!-- Pilihan input diskon manual (tanpa member terdaftar) -->
                    <option value="manual">-- Input Manual --</option>
                </select>

                <!-- Input Diskon Manual (muncul jika pilih "Input Manual") -->
                <input type="number" id="manualDiscountInput" class="member-select-dropdown"
                       placeholder="Diskon (%) Opsional" min="0" max="100"
                       style="margin-top: 8px; display: none;">

                <!-- Checkbox: Aktifkan / nonaktifkan diskon member -->
                <div class="member-use-row" id="memberUseRow" style="display: none;">
                    <label class="member-use-label" for="useMemberDiscount">
                        <input type="checkbox" id="useMemberDiscount">
                        <span class="member-use-text">
                            <i class="fa-solid fa-tag"></i>
                            <span id="memberDiscountLabel">Gunakan Diskon 0%</span>
                        </span>
                    </label>
                    <!-- Badge status diskon (Aktif / Habis) -->
                    <span id="memberDiscountBadge" class="member-discount-badge"></span>
                </div>
            </div>

            <!-- ============================================================ -->
            <!-- BAGIAN KASIR: FOOTER – RINGKASAN HARGA & TOMBOL BAYAR      -->
            <!-- ============================================================ -->
            <div class="cart-footer">
                <!-- Baris Subtotal -->
                <div class="calculation-row">
                    <span>Subtotal</span>
                    <span id="subtotalAmount">Rp 0</span>
                </div>
                <!-- Baris Pajak PPN 11% -->
                <div class="calculation-row">
                    <span>Pajak (11%)</span>
                    <span id="taxAmount">Rp 0</span>
                </div>
                <!-- Baris Diskon Member (tersembunyi jika tidak ada diskon) -->
                <div class="calculation-row discount-row" id="discountRow" style="display: none;">
                    <span id="discountLabel">Diskon Member (0%)</span>
                    <span id="discountAmount" style="color: #34d399;">- Rp 0</span>
                </div>
                <!-- Baris Total Pembayaran -->
                <div class="calculation-row total">
                    <span>Total Pembayaran</span>
                    <span id="totalAmount">Rp 0</span>
                </div>

                <!-- BAGIAN KASIR: PILIHAN METODE PEMBAYARAN -->
                <div class="payment-section">
                    <label>Metode Pembayaran</label>
                    <div class="payment-methods">
                        <!-- Tombol Tunai (aktif default) -->
                        <button class="pay-btn active" data-method="Tunai">
                            <i class="fa-solid fa-money-bill-wave"></i> Tunai
                        </button>
                        <!-- Tombol Transfer Bank -->
                        <button class="pay-btn" data-method="Transfer">
                            <i class="fa-solid fa-building-columns"></i> Transfer
                        </button>
                        <!-- Tombol QRIS -->
                        <button class="pay-btn" data-method="QRIS">
                            <i class="fa-solid fa-qrcode"></i> QRIS
                        </button>
                    </div>
                </div>

                <!-- Tombol Bayar Sekarang (dinonaktifkan jika keranjang kosong) -->
                <button class="checkout-btn" id="btnCheckout" disabled>
                    <i class="fa-solid fa-cash-register"></i> Bayar Sekarang
                </button>
            </div>
        </aside>

        <!-- ============================================================ -->
        <!-- BAGIAN: MODAL CHECKOUT – STRUK PEMBAYARAN                   -->
        <!-- Tampil setelah tombol "Bayar Sekarang" diklik.              -->
        <!-- Berisi ringkasan transaksi dan tombol cetak struk.          -->
        <!-- ============================================================ -->
        <div class="modal-overlay" id="checkoutModal">
            <div class="modal-content receipt-modal">
                <!-- Header Struk -->
                <div class="receipt-header">
                    <h2>FreshPOS</h2>
                    <p>Struk Belanja</p>
                    <p id="receiptDate" class="receipt-date"></p>
                    <p>Kasir: <span id="receiptAdminName">Admin Utama</span></p>
                </div>

                <!-- Tabel Daftar Item Struk -->
                <div class="receipt-items-container">
                    <table class="receipt-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th style="text-align:center;">Qty</th>
                                <th style="text-align:right;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody id="receiptItems">
                            <!-- Items Dirender JS -->
                        </tbody>
                    </table>
                </div>

                <!-- Ringkasan Total Struk -->
                <div class="modal-details receipt-summary">
                    <div class="detail-row">
                        <span>Metode Bayar:</span>
                        <strong id="modalPaymentMethod">Tunai</strong>
                    </div>
                    <div class="detail-row">
                        <span>Subtotal:</span>
                        <strong id="modalSubtotal">Rp 0</strong>
                    </div>
                    <div class="detail-row">
                        <span>Pajak (11%):</span>
                        <strong id="modalTax">Rp 0</strong>
                    </div>
                    <!-- Baris diskon di struk (tersembunyi jika tidak ada) -->
                    <div class="detail-row" id="modalDiscountRow" style="display:none;">
                        <span id="modalDiscountLabel">Diskon Member:</span>
                        <strong id="modalDiscount" style="color: #059669;">- Rp 0</strong>
                    </div>
                    <div class="detail-row total">
                        <span>Total Pembayaran:</span>
                        <strong id="modalTotal">Rp 0</strong>
                    </div>
                </div>

                <!-- QR Code QRIS (muncul hanya jika metode QRIS dipilih) -->
                <div class="qris-container" id="qrisContainer" style="display: none; text-align: center; margin-bottom: 20px;">
                    <p style="font-weight: 600; font-size: 1.1rem; color: var(--primary-green-dark); margin-bottom: 8px;">Scan QRIS untuk Membayar</p>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Pembayaran+FreshPOS"
                         alt="QRIS Payment"
                         style="border: 4px solid var(--primary-green-light); border-radius: 8px; padding: 4px;">
                </div>

                <!-- Footer Struk -->
                <div class="receipt-footer">
                    <i class="fa-solid fa-circle-check modal-icon"></i>
                    <p>Terima Kasih Atas Kunjungan Anda!</p>
                </div>

                <!-- Tombol Selesai & Cetak Struk -->
                <button class="btn-primary" id="btnSelesai">
                    <i class="fa-solid fa-print"></i> Selesai & Cetak Struk
                </button>
            </div>
        </div>

        <!-- ============================================================ -->
        <!-- KOLOM BAGIAN MEMBER: MODAL RIWAYAT & CATATAN MEMBER (CRUD)  -->
        <!-- Berisi form tambah/edit member, pencarian, dan daftar member -->
        <!-- ============================================================ -->
        <div class="modal-overlay" id="historyModal">
            <div class="modal-content history-modal-content" style="max-width: 650px;">
                <!-- Header Modal Member -->
                <div class="history-header">
                    <h2><i class="fa-solid fa-user-check"></i> Riwayat & Catatan Member</h2>
                    <button id="btnCloseHistory" class="close-history-btn"><i class="fa-solid fa-times"></i></button>
                </div>

                <!-- BAGIAN: FORM TAMBAH / EDIT DATA MEMBER -->
                <div class="member-form-container" style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; margin-bottom: 15px; border: 1px solid rgba(52,211,153,0.15);">
                    <h3 style="font-size: 0.95rem; margin-bottom: 10px; color: var(--green-400); display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-user-plus"></i> <span id="memberFormTitle">Tambah Member Baru</span>
                    </h3>
                    <form id="memberForm" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <!-- ID member tersembunyi (diisi saat edit) -->
                        <input type="hidden" id="memberId" value="">

                        <!-- Kolom Nama Member -->
                        <div class="form-group" style="grid-column: span 2;">
                            <label style="font-size: 0.75rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">Nama Member / Pelanggan *</label>
                            <input type="text" id="memberName" required placeholder="Contoh: Budi, Pak Adi, Sisca"
                                   style="width: 100%; padding: 8px 12px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; outline: none; font-size: 0.85rem;">
                        </div>

                        <!-- Kolom Persen Diskon Member -->
                        <div class="form-group">
                            <label style="font-size: 0.75rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">Diskon Member (%)</label>
                            <input type="number" id="memberDiscountPct" min="0" max="100" value="0"
                                   style="width: 100%; padding: 8px 12px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; outline: none; font-size: 0.85rem;">
                        </div>

                        <!-- Kolom Status Masa Berlaku Diskon -->
                        <div class="form-group">
                            <label style="font-size: 0.75rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">Status Masa Berlaku Diskon</label>
                            <select id="memberDiscountStatus"
                                    style="width: 100%; padding: 8px 12px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; outline: none; font-size: 0.85rem;">
                                <option value="Aktif">Aktif</option>
                                <option value="Habis">Habis / Expired</option>
                            </select>
                        </div>

                        <!-- Kolom Checkbox Verifikasi Member -->
                        <div class="form-group" style="display: flex; align-items: center; gap: 8px; margin-top: 25px;">
                            <input type="checkbox" id="memberVerified" style="width: 16px; height: 16px; accent-color: var(--green-400); cursor: pointer;">
                            <label for="memberVerified" style="font-size: 0.82rem; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                                <i class="fa-solid fa-circle-check" style="color: #38bdf8;"></i> Telah Verifikasi Member
                            </label>
                        </div>

                        <!-- Kolom Catatan Tambahan Member -->
                        <div class="form-group" style="grid-column: span 2;">
                            <label style="font-size: 0.75rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">Catatan Tambahan / Keterangan</label>
                            <textarea id="memberNotes" placeholder="Catatan tambahan seperti no telepon, sisa paket, dll"
                                      style="width: 100%; height: 50px; padding: 8px 12px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; outline: none; font-size: 0.85rem; resize: none;"></textarea>
                        </div>

                        <!-- SIMPAN DATA: Tombol Aksi Form Member -->
                        <div class="form-actions" style="grid-column: span 2; display: flex; justify-content: flex-end; gap: 8px; margin-top: 5px;">
                            <!-- Tombol Batal Edit (tersembunyi saat mode tambah) -->
                            <button type="button" id="btnCancelEditMember"
                                    style="display: none; padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #fff; font-size: 0.8rem; cursor: pointer;">Batal</button>
                            <!-- Tombol Simpan Data Member -->
                            <button type="submit" id="btnSaveMember" class="btn-primary"
                                    style="padding: 6px 16px; border-radius: 6px; border: none; background: var(--green-500); color: #fff; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-save"></i> Simpan Catatan
                            </button>
                        </div>
                    </form>
                </div>

                <!-- BAGIAN: PENCARIAN MEMBER -->
                <div class="history-actions" style="display: flex; gap: 10px; align-items: center; margin-bottom: 15px;">
                    <div style="position: relative; flex-grow: 1;">
                        <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.4); font-size: 0.85rem;"></i>
                        <input type="text" id="searchMemberInput" placeholder="Cari member berdasarkan nama atau catatan..."
                               style="width: 100%; padding: 8px 12px 8px 32px; border-radius: 20px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; outline: none; font-size: 0.85rem; transition: all 0.3s ease;">
                    </div>
                    <button id="btnRefreshMembers" class="btn-secondary"
                            style="padding: 8px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
                        <i class="fa-arrows-rotate fa-solid"></i> Refresh
                    </button>
                </div>

                <!-- BAGIAN: DAFTAR KARTU MEMBER -->
                <!-- Kartu member dirender secara dinamis oleh history.js -->
                <div class="history-list" id="memberList"
                     style="max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 5px;">
                    <!-- Items rendered dynamically by JS -->
                </div>
            </div>
        </div>

        <!-- ============================================================ -->
        <!-- KOLOM BAGIAN RESERVASI: MODAL FORM BUAT RESERVASI           -->
        <!-- Berisi form input data reservasi dan pilihan menu pesanan    -->
        <!-- ============================================================ -->
        <div class="modal-overlay" id="reservationModal">
            <div class="modal-content reservation-modal-content">
                <!-- Header Modal Reservasi -->
                <div class="modal-header">
                    <h2><i class="fa-solid fa-calendar-check"></i> Reservasi Tempat</h2>
                    <button id="btnCloseReservation" class="close-btn"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="reservation-body">
                    <form id="reservationForm">
                        <!-- Kolom Nama Pelanggan -->
                        <div class="form-group">
                            <label for="resName">Nama Pelanggan</label>
                            <input type="text" id="resName" placeholder="Masukkan nama..." required>
                        </div>

                        <!-- Baris Tanggal & Jam -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="resDate">Tanggal</label>
                                <input type="date" id="resDate" required>
                            </div>
                            <div class="form-group">
                                <label for="resTime">Jam</label>
                                <input type="time" id="resTime" required>
                            </div>
                        </div>

                        <!-- Baris Jumlah Orang & Nomor Meja -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="resPeople">Jumlah Orang</label>
                                <input type="number" id="resPeople" min="1" max="20" value="2" required>
                            </div>
                            <div class="form-group">
                                <label for="resTable">Nomor Meja (Opsional)</label>
                                <input type="text" id="resTable" placeholder="Contoh: A1">
                            </div>
                        </div>

                        <!-- BAGIAN: PILIHAN MENU PESANAN RESERVASI -->
                        <!-- Daftar menu dirender oleh reservation.js -->
                        <div class="form-group food-selection-box">
                            <label><i class="fa-solid fa-utensils"></i> Pesan Menu (Opsional)</label>
                            <div class="res-food-selection" id="resFoodSelection">
                                <!-- Menu rendered by JS -->
                            </div>
                            <!-- Total pesanan menu reservasi -->
                            <div class="res-total-order">
                                <span>Total Pesanan:</span>
                                <span id="resTotalOrder">Rp 0</span>
                            </div>
                        </div>

                        <!-- SIMPAN DATA: Tombol Simpan Reservasi -->
                        <button type="submit" class="btn-primary"
                                style="width: 100%; margin-top: 20px; padding: 15px; font-size: 1rem; border-radius: 16px; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);">
                            <i class="fa-solid fa-check-circle"></i> Simpan & Buat Reservasi
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- ============================================================ -->
        <!-- KOLOM BAGIAN RESERVASI: MODAL RIWAYAT RESERVASI            -->
        <!-- Daftar semua reservasi yang sudah dibuat, bisa di-export CSV -->
        <!-- ============================================================ -->
        <div class="modal-overlay" id="resHistoryModal">
            <div class="modal-content history-modal-content">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-book"></i> Riwayat Reservasi</h2>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <!-- Tombol Export CSV Reservasi -->
                        <button id="btnExportRes" class="btn-info-small">
                            <i class="fa-solid fa-file-csv"></i> Export CSV
                        </button>
                        <button id="btnCloseResHistory" class="close-btn"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
                <!-- Daftar riwayat reservasi dirender oleh reservation.js -->
                <div class="history-list" id="resHistoryList" style="max-height: 500px; overflow-y: auto; padding: 15px;">
                    <!-- Items rendered by JS -->
                </div>
            </div>
        </div>

        <!-- ============================================================ -->
        <!-- BAGIAN: MODAL REKAP DATA TRANSAKSI (ANALITIK)               -->
        <!-- Tab harian / mingguan / bulanan, tabel rekap, export CSV     -->
        <!-- ============================================================ -->
        <div class="modal-overlay" id="recapModal">
            <div class="modal-content recap-modal-content">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-chart-pie"></i> Rekap Data Transaksi</h2>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <!-- Tombol Export CSV Rekap -->
                        <button id="btnExportRecap" class="btn-info-small">
                            <i class="fa-solid fa-file-csv"></i> Export CSV
                        </button>
                        <!-- Tombol Hapus Semua Data Riwayat -->
                        <button id="btnClearRecap" class="btn-danger-small" title="Hapus Semua Riwayat">
                            <i class="fa-solid fa-trash-can"></i> Hapus Data
                        </button>
                        <button id="btnCloseRecap" class="close-btn"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
                <!-- Tab Pilih Periode Rekap -->
                <div class="recap-tabs">
                    <button class="recap-tab active" data-tab="daily">Harian</button>
                    <button class="recap-tab" data-tab="weekly">Mingguan</button>
                    <button class="recap-tab" data-tab="monthly">Bulanan</button>
                </div>
                <!-- Konten rekap dirender oleh recap.js -->
                <div class="recap-body" id="recapBody">
                    <!-- Recap content rendered by JS -->
                </div>
            </div>
        </div>

        <!-- ============================================================ -->
        <!-- BAGIAN: MODAL KELOLA STOK MENU                              -->
        <!-- Admin bisa ubah jumlah stok tiap produk dari sini           -->
        <!-- ============================================================ -->
        <div class="modal-overlay" id="stockAdminModal">
            <div class="modal-content stock-modal-content">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-boxes-stacked"></i> Pengaturan Stok Menu</h2>
                    <button id="btnCloseStockAdmin" class="close-btn"><i class="fa-solid fa-times"></i></button>
                </div>
                <!-- Pencarian produk di modal stok -->
                <div class="stock-search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="stockSearchInput" placeholder="Cari menu untuk update stok...">
                </div>
                <!-- Daftar produk dengan kontrol stok dirender oleh stock_admin.js -->
                <div class="stock-list" id="stockListContainer">
                    <!-- Products rendered by JS -->
                </div>
                <!-- SIMPAN DATA: Tombol Selesai Update Stok -->
                <div class="modal-footer" style="padding: 15px; border-top: 1px solid var(--border); text-align: right;">
                    <button class="btn-primary" id="btnSaveStock" style="width: auto; padding: 10px 25px;">
                        <i class="fa-solid fa-check"></i> Selesai
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================================ -->
    <!-- BAGIAN: DATA JAVASCRIPT & LOAD FILE JS                      -->
    <!-- ============================================================ -->
    <script>
        // ============================================================
        // BAGIAN: DATA PHP → JAVASCRIPT (Diteruskan ke browser)
        // Data kategori dan produk dari PHP dikonversi ke format JS
        // agar bisa dipakai oleh semua file script.
        // ============================================================
        // Data Kategori Menu (array objek dari PHP)
        const categories = <?= json_encode($categoriesData) ?>;
        // Data Produk / Menu (array objek dari PHP)
        const products   = <?= json_encode($productsData) ?>;

        // ============================================================
        // BAGIAN: DETEKSI STATUS DATABASE
        // IS_DB_ACTIVE = true  → Kirim data ke server MySQL
        // IS_DB_ACTIVE = false → Mode statis / offline (localStorage)
        // ============================================================
        const IS_DB_ACTIVE = <?= $dbActive ? 'true' : 'false' ?>;
        const API_PATH = IS_DB_ACTIVE ? 'php/api/checkout.php' : '';

        // ============================================================
        // BAGIAN: HELPER – FORMAT RUPIAH
        // Fungsi global untuk memformat angka menjadi format Rupiah
        // Contoh: 35000 → "Rp 35.000"
        // ============================================================
        const formatRupiah = (number) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(number);
        };
    </script>

    <!-- ============================================================ -->
    <!-- BAGIAN: LOAD FILE JAVASCRIPT MODULAR                        -->
    <!-- Urutan load sangat penting karena ada ketergantungan antar  -->
    <!-- file. Query string ?v= mencegah cache browser lama.         -->
    <!-- ============================================================ -->
    <script src="./js/globals.js?v=<?= time() ?>"></script>       <!-- Variabel global -->
    <script src="./js/sidebar.js?v=<?= time() ?>"></script>       <!-- Render sidebar kategori -->
    <script src="./js/maingrid.js?v=<?= time() ?>"></script>      <!-- Render grid produk -->
    <script src="./js/filter.js?v=<?= time() ?>"></script>        <!-- Filter & pencarian produk -->
    <script src="./js/admin.js?v=<?= time() ?>"></script>         <!-- Profil kasir -->
    <script src="./js/cart.js?v=<?= time() ?>"></script>          <!-- Keranjang & checkout -->
    <script src="./js/history.js?v=<?= time() ?>"></script>       <!-- CRUD Data Member -->
    <script src="./js/reservation.js?v=<?= time() ?>"></script>   <!-- Reservasi tempat -->
    <script src="./js/recap.js?v=<?= time() ?>"></script>         <!-- Rekap & analitik -->
    <script src="./js/stock_admin.js?v=<?= time() ?>"></script>   <!-- Kelola stok menu -->
    <script src="./js/init.js?v=<?= time() ?>"></script>          <!-- Inisialisasi utama -->
</body>
</html>
