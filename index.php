<?php
/**
 * FreshPOS – index.php (Root)
 * Versi PHP dengan data produk (Statis).
 */

// Data Kategori
$categoriesData = [
    ['id' => 'all', 'name' => 'Semua Menu', 'icon' => 'fa-table-cells-large'],
    ['id' => 'makanan', 'name' => 'Makanan', 'icon' => 'fa-burger'],
    ['id' => 'minuman', 'name' => 'Minuman', 'icon' => 'fa-mug-hot'],
    ['id' => 'snack', 'name' => 'Snack', 'icon' => 'fa-cookie'],
    ['id' => 'dessert', 'name' => 'Dessert', 'icon' => 'fa-ice-cream'],
    ['id' => 'paket', 'name' => 'Paket Hemat', 'icon' => 'fa-box-open']
];

// Data Produk (Disesuaikan agar foto dan nama benar)
$productsData = [
    ['id' => 'p1', 'name' => 'Salad Sayur Organik', 'price' => 35000, 'category' => 'makanan', 'image' => 'assets/image.png', 'stock' => 12],
    ['id' => 'p2', 'name' => 'Ayam Panggang Diet', 'price' => 45000, 'category' => 'makanan', 'image' => 'assets/image copy.png', 'stock' => 8],
    ['id' => 'p7', 'name' => 'Quinoa Bowl Berserat', 'price' => 50000, 'category' => 'makanan', 'image' => 'assets/image copy 6.png', 'stock' => 5],
    ['id' => 'p10', 'name' => 'Sandwich Telur', 'price' => 32000, 'category' => 'makanan', 'image' => 'assets/image copy 9.png', 'stock' => 15],
    ['id' => 'p11', 'name' => 'Nasi Goreng Spesial', 'price' => 30000, 'category' => 'makanan', 'image' => 'assets/image copy 10.png', 'stock' => 10],
    ['id' => 'p12', 'name' => 'Mie Goreng Pedas', 'price' => 28000, 'category' => 'makanan', 'image' => 'assets/image copy 11.png', 'stock' => 0],
    ['id' => 'p13', 'name' => 'Gado-Gado Segar', 'price' => 25000, 'category' => 'makanan', 'image' => 'assets/image copy 12.png', 'stock' => 20],
    ['id' => 'p14', 'name' => 'Soto Ayam Kuning', 'price' => 27000, 'category' => 'makanan', 'image' => 'assets/image copy 13.png', 'stock' => 12],
    ['id' => 'p3', 'name' => 'Jus Alpukat Murni', 'price' => 25000, 'category' => 'minuman', 'image' => 'assets/image copy 2.png', 'stock' => 10],
    ['id' => 'p4', 'name' => 'Kopi Susu Gula Aren', 'price' => 20000, 'category' => 'minuman', 'image' => 'assets/image copy 3.png', 'stock' => 25],
    ['id' => 'p6', 'name' => 'Mix Berry Smoothie', 'price' => 30000, 'category' => 'minuman', 'image' => 'assets/image copy 5.png', 'stock' => 7],
    ['id' => 'p8', 'name' => 'Matcha Latte', 'price' => 28000, 'category' => 'minuman', 'image' => 'assets/image copy 7.png', 'stock' => 12],
    ['id' => 'p15', 'name' => 'Es Teh Manis', 'price' => 8000, 'category' => 'minuman', 'image' => 'assets/image copy 14.png', 'stock' => 50],
    ['id' => 'p16', 'name' => 'Susu Regal Premium', 'price' => 5000, 'category' => 'minuman', 'image' => 'assets/image copy 15.png', 'stock' => 18],
    ['id' => 'p17', 'name' => 'Jus Jeruk Segar', 'price' => 18000, 'category' => 'minuman', 'image' => 'assets/image copy 16.png', 'stock' => 15],
    ['id' => 'p18', 'name' => 'Lemon Tea Dingin', 'price' => 15000, 'category' => 'minuman', 'image' => 'assets/image copy 17.png', 'stock' => 20],
    ['id' => 'p5', 'name' => 'Keripik Kentang', 'price' => 15000, 'category' => 'snack', 'image' => 'assets/image copy 4.png', 'stock' => 30],
    ['id' => 'p9', 'name' => 'Soft Cookies', 'price' => 20000, 'category' => 'snack', 'image' => 'assets/image copy 8.png', 'stock' => 12],
    ['id' => 'p19', 'name' => 'Donat Coklat', 'price' => 12000, 'category' => 'snack', 'image' => 'assets/image copy 18.png', 'stock' => 25],
    ['id' => 'p20', 'name' => 'Pisang Goreng Crispy', 'price' => 10000, 'category' => 'snack', 'image' => 'assets/image copy 19.png', 'stock' => 0],
    ['id' => 'p21', 'name' => 'Roti Bakar Selai', 'price' => 14000, 'category' => 'snack', 'image' => 'assets/image copy 20.png', 'stock' => 15],
    ['id' => 'p22', 'name' => 'Dimsum Mentai', 'price' => 10000, 'category' => 'snack', 'image' => 'assets/image copy 21.png', 'stock' => 10],
    ['id' => 'p23', 'name' => 'Es Krim Vanilla', 'price' => 18000, 'category' => 'dessert', 'image' => 'assets/image copy 22.png', 'stock' => 12],
    ['id' => 'p24', 'name' => 'Puding Caramel', 'price' => 12000, 'category' => 'dessert', 'image' => 'assets/image copy 23.png', 'stock' => 15],
    ['id' => 'p25', 'name' => 'Brownies Panggang', 'price' => 22000, 'category' => 'dessert', 'image' => 'assets/image copy 24.png', 'stock' => 8],
    ['id' => 'p26', 'name' => 'Boba Matcha', 'price' => 25000, 'category' => 'dessert', 'image' => 'assets/image copy 25.png', 'stock' => 10],
    ['id' => 'p27', 'name' => 'Crepe Strawberry', 'price' => 20000, 'category' => 'dessert', 'image' => 'assets/image copy 26.png', 'stock' => 0],
    ['id' => 'p28', 'name' => 'Paket Makan Siang', 'price' => 55000, 'category' => 'paket', 'image' => 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png', 'stock' => 10],
    ['id' => 'p29', 'name' => 'Paket Sarapan Sehat', 'price' => 40000, 'category' => 'paket', 'image' => 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png', 'stock' => 10],
    ['id' => 'p30', 'name' => 'Paket Dinner Romantis', 'price' => 95000, 'category' => 'paket', 'image' => 'assets/Cokelat Krem Modern Kreatif Menu Burger Brosur Produk.png', 'stock' => 5],
    ['id' => 'p31', 'name' => 'Paket Keluarga Lengkap', 'price' => 120000, 'category' => 'paket', 'image' => 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png', 'stock' => 3],
    ['id' => 'p32', 'name' => 'Paket Buka Puasa', 'price' => 75000, 'category' => 'paket', 'image' => 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png', 'stock' => 8],
    ['id' => 'p33', 'name' => 'Paket Meeting Snack Box', 'price' => 65000, 'category' => 'paket', 'image' => 'assets/Krem Minimalis Menu Restoran.png', 'stock' => 12]
];
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FreshPOS – Sistem Kasir Modern</title>
    <meta name="description" content="Aplikasi kasir modern berbasis web dengan tampilan hijau elegan.">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Global Tokens & Base -->
    <link rel="stylesheet" href="./css/variables.css">
    <link rel="stylesheet" href="./css/animations.css">
    
    <!-- Layout & Components -->
    <link rel="stylesheet" href="./css/layout.css">
    <link rel="stylesheet" href="./css/sidebar.css">
    <link rel="stylesheet" href="./css/header.css">
    <link rel="stylesheet" href="./css/products.css">
    <link rel="stylesheet" href="./css/cart.css">
    <link rel="stylesheet" href="./css/modal.css">
    <link rel="stylesheet" href="./css/history.css">
    <link rel="stylesheet" href="./css/reservation.css">
    <link rel="stylesheet" href="./css/recap.css">
    <link rel="stylesheet" href="./css/stock_admin.css">
</head>
<body>
    <div class="app-container">
        <!-- Sidebar Navigation (Kategori) -->
        <aside class="sidebar">
            <div class="logo">
                <i class="fa-solid fa-leaf"></i>
                <h2>FreshPOS</h2>
            </div>
            <div class="sidebar-divider"></div>
            <p class="nav-label">Menu Kategori</p>
            <nav class="categories" id="categoryMenu">
                <!-- Kategori dirender oleh JS -->
            </nav>
            <div class="sidebar-divider"></div>
            <p class="nav-label">Data & Reservasi</p>
            <div class="extra-features">
                <button id="btnOpenReservation" class="extra-btn">
                    <i class="fa-solid fa-calendar-plus"></i> Buat Reservasi
                </button>
                <button id="btnOpenResHistory" class="extra-btn">
                    <i class="fa-solid fa-book"></i> Riwayat Reservasi
                </button>
                <button id="btnOpenRecap" class="extra-btn recap">
                    <i class="fa-solid fa-chart-line"></i> Rekap Data (Analitik)
                </button>
                <button id="btnOpenStockAdmin" class="extra-btn stock">
                    <i class="fa-solid fa-boxes-stacked"></i> Kelola Stok Menu
                </button>
            </div>
            <div class="sidebar-footer">
                <p>© 2025 FreshPOS v2.0</p>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="top-header">
                <div class="search-bar">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="searchInput" placeholder="Cari menu / produk...">
                </div>
                <div class="user-profile">
                    <button id="btnOpenHistory" class="history-btn-top" title="Riwayat Pesanan">
                        <i class="fa-solid fa-clock-rotate-left"></i> Riwayat
                    </button>
                    <div class="user-info">
                        <span class="name" id="adminName">Admin Utama</span>
                        <span class="role">Kasir <i class="fa-solid fa-pen edit-admin-btn" id="editAdminBtn" title="Ganti Nama"></i></span>
                    </div>
                    <img src="https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff" id="adminAvatar" alt="User" class="avatar">
                </div>
            </header>

            <!-- Section bar -->
            <div class="section-bar">
                <span class="section-title">
                    <i class="fa-solid fa-th-large"></i>
                    Daftar Menu
                </span>
                <span class="product-count-badge" id="productCountBadge">0 produk</span>
            </div>

            <div class="products-grid" id="productsGrid">
                <!-- Produk dirender oleh JS -->
            </div>
        </main>

        <!-- Cart Sidebar -->
        <aside class="cart-sidebar">
            <div class="cart-header">
                <h2><i class="fa-solid fa-basket-shopping"></i> Kasir</h2>
                <input type="text" class="order-id" id="orderIdInput" style="width: 100px; text-align: center; outline: none; cursor: text;">
            </div>
            
            <div class="cart-items" id="cartItems">
                <!-- Item Keranjang dirender oleh JS -->
                <div class="empty-cart-msg" id="emptyCartMsg">
                    <i class="fa-solid fa-cart-arrow-down"></i>
                    <p>Keranjang masih kosong</p>
                </div>
            </div>

            <div class="cart-footer">
                <div class="calculation-row">
                    <span>Subtotal</span>
                    <span id="subtotalAmount">Rp 0</span>
                </div>
                <div class="calculation-row">
                    <span>Pajak (11%)</span>
                    <span id="taxAmount">Rp 0</span>
                </div>
                <div class="calculation-row total">
                    <span>Total Pembayaran</span>
                    <span id="totalAmount">Rp 0</span>
                </div>
                
                <div class="payment-section">
                    <label>Metode Pembayaran</label>
                    <div class="payment-methods">
                        <button class="pay-btn active" data-method="Tunai"><i class="fa-solid fa-money-bill-wave"></i> Tunai</button>
                        <button class="pay-btn" data-method="Transfer"><i class="fa-solid fa-building-columns"></i> Transfer</button>
                        <button class="pay-btn" data-method="QRIS"><i class="fa-solid fa-qrcode"></i> QRIS</button>
                    </div>
                </div>

                <button class="checkout-btn" id="btnCheckout" disabled>
                    <i class="fa-solid fa-cash-register"></i> Bayar Sekarang
                </button>
            </div>
        </aside>

        <!-- Checkout Modal (Overlay) -->
        <div class="modal-overlay" id="checkoutModal">
            <div class="modal-content receipt-modal">
                <div class="receipt-header">
                    <h2>FreshPOS</h2>
                    <p>Struk Belanja</p>
                    <p id="receiptDate" class="receipt-date"></p>
                    <p>Kasir: <span id="receiptAdminName">Admin Utama</span></p>
                </div>
                
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
                    <div class="detail-row total">
                        <span>Total Pembayaran:</span>
                        <strong id="modalTotal">Rp 0</strong>
                    </div>
                </div>
                
                <div class="qris-container" id="qrisContainer" style="display: none; text-align: center; margin-bottom: 20px;">
                    <p style="font-weight: 600; font-size: 1.1rem; color: var(--primary-green-dark); margin-bottom: 8px;">Scan QRIS untuk Membayar</p>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Pembayaran+FreshPOS" alt="QRIS Payment" style="border: 4px solid var(--primary-green-light); border-radius: 8px; padding: 4px;">
                </div>

                <div class="receipt-footer">
                    <i class="fa-solid fa-circle-check modal-icon"></i>
                    <p>Terima Kasih Atas Kunjungan Anda!</p>
                </div>
                
                <button class="btn-primary" id="btnSelesai">
                    <i class="fa-solid fa-print"></i> Selesai & Cetak Struk
                </button>
            </div>
        </div>

        <!-- History Modal -->
        <div class="modal-overlay" id="historyModal">
            <div class="modal-content history-modal-content">
                <div class="history-header">
                    <h2><i class="fa-solid fa-clock-rotate-left"></i> Riwayat Pesanan</h2>
                    <button id="btnCloseHistory" class="close-history-btn"><i class="fa-solid fa-times"></i></button>
                </div>
                
                <div class="history-filters">
                    <button class="history-filter-btn active" data-filter="today">Hari Ini</button>
                    <button class="history-filter-btn" data-filter="yesterday">Kemarin</button>
                    <button class="history-filter-btn" data-filter="twodaysago">2 Hari Lalu</button>
                </div>

                <div class="history-actions">
                    <button id="btnRefreshHistory" class="btn-secondary"><i class="fa-solid fa-arrows-rotate"></i> Refresh</button>
                    <button id="btnClearHistory" class="btn-danger"><i class="fa-solid fa-trash-can"></i> Hapus Riwayat</button>
                </div>

                <div class="history-list" id="historyList">
                    <!-- History items rendered by JS -->
                </div>
            </div>
        </div>

        <!-- Reservation Modal -->
        <div class="modal-overlay" id="reservationModal">
            <div class="modal-content reservation-modal-content">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-calendar-check"></i> Reservasi Tempat</h2>
                    <button id="btnCloseReservation" class="close-btn"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="reservation-body">
                    <form id="reservationForm">
                        <div class="form-group">
                            <label for="resName">Nama Pelanggan</label>
                            <input type="text" id="resName" placeholder="Masukkan nama..." required>
                        </div>
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
                        
                        <div class="form-group food-selection-box">
                            <label><i class="fa-solid fa-utensils"></i> Pesan Menu (Opsional)</label>
                            <div class="res-food-selection" id="resFoodSelection">
                                <!-- Menu rendered by JS -->
                            </div>
                            <div class="res-total-order">
                                <span>Total Pesanan:</span>
                                <span id="resTotalOrder">Rp 0</span>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn-primary" style="width: 100%; margin-top: 20px; padding: 15px; font-size: 1rem; border-radius: 16px; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);">
                            <i class="fa-solid fa-check-circle"></i> Simpan & Buat Reservasi
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Reservation History Modal -->
        <div class="modal-overlay" id="resHistoryModal">
            <div class="modal-content history-modal-content">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-book"></i> Riwayat Reservasi</h2>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button id="btnExportRes" class="btn-info-small">
                            <i class="fa-solid fa-file-csv"></i> Export CSV
                        </button>
                        <button id="btnCloseResHistory" class="close-btn"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
                <div class="history-list" id="resHistoryList" style="max-height: 500px; overflow-y: auto; padding: 15px;">
                    <!-- Items rendered by JS -->
                </div>
            </div>
        </div>

        <!-- Recap Modal -->
        <div class="modal-overlay" id="recapModal">
            <div class="modal-content recap-modal-content">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-chart-pie"></i> Rekap Data Transaksi</h2>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button id="btnExportRecap" class="btn-info-small">
                            <i class="fa-solid fa-file-csv"></i> Export CSV
                        </button>
                        <button id="btnClearRecap" class="btn-danger-small" title="Hapus Semua Riwayat">
                            <i class="fa-solid fa-trash-can"></i> Hapus Data
                        </button>
                        <button id="btnCloseRecap" class="close-btn"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
                <div class="recap-tabs">
                    <button class="recap-tab active" data-tab="daily">Harian</button>
                    <button class="recap-tab" data-tab="weekly">Mingguan</button>
                    <button class="recap-tab" data-tab="monthly">Bulanan</button>
                </div>
                <div class="recap-body" id="recapBody">
                    <!-- Recap content rendered by JS -->
                </div>
            </div>
        </div>

        <!-- Stock Management Modal -->
        <div class="modal-overlay" id="stockAdminModal">
            <div class="modal-content stock-modal-content">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-boxes-stacked"></i> Pengaturan Stok Menu</h2>
                    <button id="btnCloseStockAdmin" class="close-btn"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="stock-search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="stockSearchInput" placeholder="Cari menu untuk update stok...">
                </div>
                <div class="stock-list" id="stockListContainer">
                    <!-- Products rendered by JS -->
                </div>
                <div class="modal-footer" style="padding: 15px; border-top: 1px solid var(--border); text-align: right;">
                    <button class="btn-primary" id="btnSaveStock" style="width: auto; padding: 10px 25px;">
                        <i class="fa-solid fa-check"></i> Selesai
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Data & Scripts -->
    <script>
        // Data PHP (Statis di file ini agar foto/nama sinkron sempurna)
        const categories = <?= json_encode($categoriesData) ?>;
        const products   = <?= json_encode($productsData) ?>;
        
        const API_PATH = ''; // Mode statis agar tidak error database

        const formatRupiah = (number) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(number);
        };
    </script>
    <script src="./js/globals.js"></script>
    <script src="./js/sidebar.js"></script>
    <script src="./js/maingrid.js"></script>
    <script src="./js/filter.js"></script>
    <script src="./js/admin.js"></script>
    <script src="./js/cart.js"></script>
    <script src="./js/history.js"></script>
    <script src="./js/reservation.js"></script>
    <script src="./js/recap.js"></script>
    <script src="./js/stock_admin.js"></script>
    <script src="./js/init.js"></script>
</body>
</html>
