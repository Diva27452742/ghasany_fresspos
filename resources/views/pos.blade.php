<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FreshPOS – Sistem Kasir Modern</title>
    <meta name="description" content="Aplikasi kasir modern berbasis web dengan tampilan hijau elegan.">

    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- CSS Global Tokens & Components -->
    <link rel="stylesheet" href="{{ asset('css/variables.css') }}?v={{ time() }}">
    <link rel="stylesheet" href="{{ asset('css/animations.css') }}?v={{ time() }}">
    <link rel="stylesheet" href="{{ asset('css/layout.css') }}">
    <link rel="stylesheet" href="{{ asset('css/sidebar.css') }}">
    <link rel="stylesheet" href="{{ asset('css/header.css') }}">
    <link rel="stylesheet" href="{{ asset('css/products.css') }}">
    <link rel="stylesheet" href="{{ asset('css/cart.css') }}">
    <link rel="stylesheet" href="{{ asset('css/modal.css') }}">
    <link rel="stylesheet" href="{{ asset('css/history.css') }}">
    <link rel="stylesheet" href="{{ asset('css/reservation.css') }}">
    <link rel="stylesheet" href="{{ asset('css/recap.css') }}?v={{ time() }}">
    <link rel="stylesheet" href="{{ asset('css/stock_admin.css') }}">
    <!-- Chart.js for Analytical Charts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="app-container">

        <!-- SIDEBAR KIRI – NAVIGASI KATEGORI MENU -->
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
                <button id="btnOpenHistory" class="extra-btn">
                    <i class="fa-solid fa-user-check"></i> Riwayat Member
                </button>
                <button id="btnOpenCategoryAdmin" class="extra-btn" onclick="openCategoryAdmin()">
                    <i class="fa-solid fa-layer-group"></i> Kelola Kategori
                </button>
                <button id="btnOpenProductAdmin" class="extra-btn stock" onclick="openProductAdmin()">
                    <i class="fa-solid fa-boxes-stacked"></i> Kelola Produk & Stok
                </button>
                <button id="btnOpenReceiptSettings" class="extra-btn">
                    <i class="fa-solid fa-receipt"></i> Pengaturan Struk
                </button>
                <button id="btnOpenRecap" class="extra-btn recap">
                    <i class="fa-solid fa-chart-line"></i> Rekap Data (Analitik)
                </button>
            </div>

            <div class="sidebar-footer">
                <p>© 2025 FreshPOS v2.0</p>
            </div>
        </aside>

        <!-- KONTEN UTAMA – DAFTAR MENU / GRID PRODUK -->
        <main class="main-content">
            <header class="top-header">
                <div class="search-bar">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="searchInput" placeholder="Cari menu / produk...">
                </div>

                <div class="user-profile" style="display: flex; align-items: center; gap: 12px;">
                    <!-- SWITCHER MODE ADMIN / MODE KASIR -->
                    <div class="mode-switcher-container" style="display: flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.12); padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(52, 211, 153, 0.3);">
                        <i class="fa-solid fa-user-shield" id="modeIcon" style="color: #34d399; font-size: 0.88rem;"></i>
                        <select id="appModeSelect" style="background: transparent; color: #ffffff; border: none; outline: none; font-size: 0.82rem; font-weight: 600; cursor: pointer;">
                            <option value="admin" style="background: #1e293b; color: #fff;">Mode Admin</option>
                            <option value="kasir" style="background: #1e293b; color: #fff;">Mode Kasir</option>
                        </select>
                    </div>

                    <div class="user-info">
                        <span class="name" id="adminName">Admin Utama</span>
                        <span class="role" id="adminRoleText">Kasir <i class="fa-solid fa-pen edit-admin-btn" id="editAdminBtn" title="Ganti Nama"></i></span>
                    </div>
                    <img src="https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff" id="adminAvatar" alt="User" class="avatar">
                </div>
            </header>

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

        <!-- SIDEBAR KANAN – KERANJANG BELANJA & PEMBAYARAN -->
        <aside class="cart-sidebar">
            <div class="cart-header">
                <h2><i class="fa-solid fa-basket-shopping"></i> Kasir</h2>
                <input type="text" class="order-id" id="orderIdInput" style="width: 100px; text-align: center; outline: none; cursor: text;">
            </div>

            <div class="cart-items" id="cartItems">
                <div class="empty-cart-msg" id="emptyCartMsg">
                    <i class="fa-solid fa-cart-arrow-down"></i>
                    <p>Keranjang masih kosong</p>
                </div>
            </div>

            <div class="member-card-panel" id="memberCardPanel">
                <div class="member-card-panel-header">
                    <i class="fa-solid fa-id-card"></i>
                    <span>Kartu Member</span>
                </div>

                <select id="memberSelectCart" class="member-select-dropdown">
                    <option value="">-- Pilih Member --</option>
                    <option value="manual">-- Input Manual --</option>
                </select>

                <input type="number" id="manualDiscountInput" class="member-select-dropdown"
                       placeholder="Diskon (%) Opsional" min="0" max="100"
                       style="margin-top: 8px; display: none;">

                <div class="member-use-row" id="memberUseRow" style="display: none;">
                    <label class="member-use-label" for="useMemberDiscount">
                        <input type="checkbox" id="useMemberDiscount">
                        <span class="member-use-text">
                            <i class="fa-solid fa-tag"></i>
                            <span id="memberDiscountLabel">Gunakan Diskon 0%</span>
                        </span>
                    </label>
                    <span id="memberDiscountBadge" class="member-discount-badge"></span>
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
                <div class="calculation-row discount-row" id="discountRow" style="display: none;">
                    <span id="discountLabel">Diskon Member (0%)</span>
                    <span id="discountAmount" style="color: #34d399;">- Rp 0</span>
                </div>
                <div class="calculation-row total">
                    <span>Total Pembayaran</span>
                    <span id="totalAmount">Rp 0</span>
                </div>

                <!-- PILIHAN TIPE PESANAN: DINE IN / TAKE AWAY -->
                <div class="payment-section" style="margin-top: 10px; margin-bottom: 8px;">
                    <label style="font-size: 0.8rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;"><i class="fa-solid fa-utensils"></i> Tipe Pesanan</label>
                    <div class="payment-methods" id="orderTypeContainer">
                        <button type="button" class="order-type-btn active" data-order-type="Dine In" id="btnOrderDineIn" style="font-size: 0.8rem; padding: 6px 10px;">
                            <i class="fa-solid fa-chair"></i> Dine In
                        </button>
                        <button type="button" class="order-type-btn" data-order-type="Take Away" id="btnOrderTakeAway" style="font-size: 0.8rem; padding: 6px 10px;">
                            <i class="fa-solid fa-bag-shopping"></i> Take Away
                        </button>
                    </div>
                </div>

                <!-- INPUT ATAS NAMA PELANGGAN & NOMOR MEJA/KURSI -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                    <div>
                        <label style="font-size: 0.72rem; color: rgba(255,255,255,0.6); display: block; margin-bottom: 2px;">Atas Nama *</label>
                        <input type="text" id="customerNameInput" placeholder="Nama Pelanggan"
                               style="width: 100%; padding: 6px 8px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.15); color: #fff; outline: none; font-size: 0.8rem;">
                    </div>
                    <div id="tableSeatGroup">
                        <label style="font-size: 0.72rem; color: rgba(255,255,255,0.6); display: block; margin-bottom: 2px;">No. Meja/Kursi *</label>
                        <input type="text" id="tableSeatInput" placeholder="Meja 05"
                               style="width: 100%; padding: 6px 8px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.15); color: #fff; outline: none; font-size: 0.8rem;">
                    </div>
                </div>

                <div class="payment-section">
                    <label>Metode Pembayaran</label>
                    <div class="payment-methods">
                        <button class="pay-btn active" data-method="Tunai">
                            <i class="fa-solid fa-money-bill-wave"></i> Tunai
                        </button>
                        <button class="pay-btn" data-method="Transfer">
                            <i class="fa-solid fa-building-columns"></i> Transfer
                        </button>
                        <button class="pay-btn" data-method="QRIS">
                            <i class="fa-solid fa-qrcode"></i> QRIS
                        </button>
                    </div>
                </div>

                <button class="checkout-btn" id="btnCheckout" disabled>
                    <i class="fa-solid fa-cash-register"></i> Bayar Sekarang
                </button>
            </div>
        </aside>

        <!-- MODAL CHECKOUT – STRUK PEMBAYARAN -->
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
                        <span>Tipe Pesanan:</span>
                        <strong id="modalOrderType" style="color: #38bdf8;">Dine In</strong>
                    </div>
                    <div class="detail-row">
                        <span>Atas Nama:</span>
                        <strong id="modalCustomerName">Umum</strong>
                    </div>
                    <div class="detail-row" id="modalTableSeatRow">
                        <span>No. Meja / Kursi:</span>
                        <strong id="modalTableSeat">Meja 01</strong>
                    </div>
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
                    <div class="detail-row" id="modalDiscountRow" style="display:none;">
                        <span id="modalDiscountLabel">Diskon Member:</span>
                        <strong id="modalDiscount" style="color: #059669;">- Rp 0</strong>
                    </div>
                    <div class="detail-row total">
                        <span>Total Pembayaran:</span>
                        <strong id="modalTotal">Rp 0</strong>
                    </div>
                </div>

                <div class="qris-container" id="qrisContainer" style="display: none; text-align: center; margin-bottom: 20px;">
                    <p style="font-weight: 600; font-size: 1.1rem; color: var(--primary-green-dark); margin-bottom: 8px;">Scan QRIS untuk Membayar</p>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Pembayaran+FreshPOS"
                         alt="QRIS Payment"
                         style="border: 4px solid var(--primary-green-light); border-radius: 8px; padding: 4px;">
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

        <!-- MODAL RIWAYAT & CATATAN MEMBER (CRUD) -->
        <div class="modal-overlay" id="historyModal">
            <div class="modal-content history-modal-content" style="max-width: 650px;">
                <div class="history-header">
                    <h2><i class="fa-solid fa-user-check"></i> Riwayat & Catatan Member</h2>
                    <button id="btnCloseHistory" class="close-history-btn"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="member-form-container" style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; margin-bottom: 15px; border: 1px solid rgba(52,211,153,0.15);">
                    <h3 style="font-size: 0.95rem; margin-bottom: 10px; color: var(--green-400); display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-user-plus"></i> <span id="memberFormTitle">Tambah Member Baru</span>
                    </h3>
                    <form id="memberForm" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <input type="hidden" id="memberId" value="">

                        <div class="form-group" style="grid-column: span 2;">
                            <label style="font-size: 0.75rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">Nama Member / Pelanggan *</label>
                            <input type="text" id="memberName" required placeholder="Contoh: Budi, Pak Adi, Sisca"
                                   style="width: 100%; padding: 8px 12px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; outline: none; font-size: 0.85rem;">
                        </div>

                        <div class="form-group">
                            <label style="font-size: 0.75rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">Diskon Member (%)</label>
                            <input type="number" id="memberDiscountPct" min="0" max="100" value="0"
                                   style="width: 100%; padding: 8px 12px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; outline: none; font-size: 0.85rem;">
                        </div>

                        <div class="form-group">
                            <label style="font-size: 0.75rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">Status Masa Berlaku Diskon</label>
                            <select id="memberDiscountStatus"
                                    style="width: 100%; padding: 8px 12px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; outline: none; font-size: 0.85rem;">
                                <option value="Aktif">Aktif</option>
                                <option value="Habis">Habis / Expired</option>
                            </select>
                        </div>

                        <div class="form-group" style="display: flex; align-items: center; gap: 8px; margin-top: 25px;">
                            <input type="checkbox" id="memberVerified" style="width: 16px; height: 16px; accent-color: var(--green-400); cursor: pointer;">
                            <label for="memberVerified" style="font-size: 0.82rem; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                                <i class="fa-solid fa-circle-check" style="color: #38bdf8;"></i> Telah Verifikasi Member
                            </label>
                        </div>

                        <div class="form-group" style="grid-column: span 2;">
                            <label style="font-size: 0.75rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">Catatan Tambahan / Keterangan</label>
                            <textarea id="memberNotes" placeholder="Catatan tambahan seperti no telepon, sisa paket, dll"
                                      style="width: 100%; height: 50px; padding: 8px 12px; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; outline: none; font-size: 0.85rem; resize: none;"></textarea>
                        </div>

                        <div class="form-actions" style="grid-column: span 2; display: flex; justify-content: flex-end; gap: 8px; margin-top: 5px;">
                            <button type="button" id="btnCancelEditMember"
                                    style="display: none; padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #fff; font-size: 0.8rem; cursor: pointer;">Batal</button>
                            <button type="submit" id="btnSaveMember" class="btn-primary"
                                    style="padding: 6px 16px; border-radius: 6px; border: none; background: var(--green-500); color: #fff; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-save"></i> Simpan Catatan
                            </button>
                        </div>
                    </form>
                </div>

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

                <div class="history-list" id="memberList"
                     style="max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 5px;">
                </div>
            </div>
        </div>

        <!-- MODAL FORM BUAT RESERVASI -->
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

                        <button type="submit" class="btn-primary"
                                style="width: 100%; margin-top: 20px; padding: 15px; font-size: 1rem; border-radius: 16px; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);">
                            <i class="fa-solid fa-check-circle"></i> Simpan & Buat Reservasi
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- MODAL RIWAYAT RESERVASI -->
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
                </div>
            </div>
        </div>

        <!-- MODAL REKAP DATA TRANSAKSI -->
        <div class="modal-overlay" id="recapModal">
            <div class="modal-content recap-modal-content" style="max-width: 850px;">
                <div class="modal-header">
                    <h2><i class="fa-solid fa-chart-pie"></i> Rekap Data & Analitik Transaksi</h2>
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

                <!-- Tab Pilih Periode Rekap -->
                <div class="recap-tabs" style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="recap-tab active" data-tab="daily">Harian</button>
                    <button class="recap-tab" data-tab="weekly">Mingguan</button>
                    <button class="recap-tab" data-tab="monthly">Bulanan</button>
                    <button class="recap-tab" data-tab="custom">Kustom Tanggal</button>
                </div>

                <!-- Bar Filter Tanggal X s/d Tanggal Y -->
                <div class="recap-date-filter" id="recapDateFilterBar" style="display: flex; gap: 10px; align-items: center; margin: 15px 0; background: rgba(255,255,255,0.05); padding: 12px 15px; border-radius: 12px; border: 1px solid rgba(52, 211, 153, 0.2); flex-wrap: wrap;">
                    <span style="color: var(--green-400); font-weight: 600; font-size: 0.88rem; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-calendar-range"></i> Filter Tanggal:
                    </span>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <label style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">Dari:</label>
                        <input type="date" id="recapStartDate" style="padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff; outline: none; font-size: 0.85rem;">
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <label style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">Sampai:</label>
                        <input type="date" id="recapEndDate" style="padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff; outline: none; font-size: 0.85rem;">
                    </div>
                    <button id="btnFilterRecapDate" class="btn-primary" style="padding: 6px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-magnifying-glass"></i> Cari
                    </button>
                    <button id="btnResetRecapDate" class="btn-secondary" style="padding: 6px 12px; border-radius: 8px; font-size: 0.82rem; cursor: pointer;">
                        Reset
                    </button>
                </div>

                <!-- Grafik Analitik Chart.js -->
                <div class="recap-chart-wrapper" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h3 style="color: var(--green-400); font-size: 0.95rem; font-weight: 600; display: flex; align-items: center; gap: 6px; margin: 0;">
                            <i class="fa-solid fa-chart-column"></i> Grafik Tren Pendapatan Penjualan
                        </h3>
                        <span id="chartPeriodBadge" style="font-size: 0.78rem; background: rgba(52,211,153,0.15); color: #34d399; padding: 3px 10px; border-radius: 12px; border: 1px solid rgba(52,211,153,0.3);">
                            Periode Harian
                        </span>
                    </div>
                    <div style="position: relative; height: 250px; width: 100%;">
                        <canvas id="recapChartCanvas"></canvas>
                    </div>
                </div>

                <div class="recap-body" id="recapBody">
                </div>
            </div>
        </div>

        <!-- MODAL PENGATURAN STRUK -->
        <div class="modal-overlay" id="receiptSettingsModal">
            <div class="modal-content history-modal-content" style="max-width: 550px;">
                <div class="history-header">
                    <h2><i class="fa-solid fa-receipt"></i> Pengaturan Struk Belanja</h2>
                    <button id="btnCloseReceiptSettings" class="close-history-btn"><i class="fa-solid fa-times"></i></button>
                </div>
                <form id="receiptSettingsForm" style="display: flex; flex-direction: column; gap: 12px; margin-top: 15px;">
                    <div class="form-group">
                        <label style="font-size: 0.8rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">Nama Toko / Usaha</label>
                        <input type="text" id="settingStoreName" value="FreshPOS Cafe & Resto" placeholder="Contoh: FreshPOS Cafe"
                               style="width: 100%; padding: 10px 12px; border-radius: 8px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.15); color: #fff; outline: none; font-size: 0.88rem;">
                    </div>
                    <div class="form-group">
                        <label style="font-size: 0.8rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">Alamat Toko</label>
                        <input type="text" id="settingStoreAddress" value="Jl. Merdeka No. 123, Indonesia" placeholder="Alamat lengkap toko"
                               style="width: 100%; padding: 10px 12px; border-radius: 8px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.15); color: #fff; outline: none; font-size: 0.88rem;">
                    </div>
                    <div class="form-group">
                        <label style="font-size: 0.8rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">No. Telepon / Kontak</label>
                        <input type="text" id="settingStorePhone" value="0812-3456-7890" placeholder="0812-xxxx-xxxx"
                               style="width: 100%; padding: 10px 12px; border-radius: 8px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.15); color: #fff; outline: none; font-size: 0.88rem;">
                    </div>
                    <div class="form-group">
                        <label style="font-size: 0.8rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">Judul Header Struk</label>
                        <input type="text" id="settingHeaderTitle" value="Struk Pembayaran" placeholder="Contoh: Struk Belanja"
                               style="width: 100%; padding: 10px 12px; border-radius: 8px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.15); color: #fff; outline: none; font-size: 0.88rem;">
                    </div>
                    <div class="form-group">
                        <label style="font-size: 0.8rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px;">Pesan Ucapan Footer Struk</label>
                        <input type="text" id="settingFooterMsg" value="Terima Kasih Atas Kunjungan Anda!" placeholder="Pesan ucapan terima kasih"
                               style="width: 100%; padding: 10px 12px; border-radius: 8px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.15); color: #fff; outline: none; font-size: 0.88rem;">
                    </div>
                    <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                        <button type="submit" class="btn-primary" style="padding: 10px 24px; font-size: 0.88rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                            <i class="fa-solid fa-save"></i> Simpan Pengaturan Struk
                        </button>
                    </div>
                </form>
            </div>
             <!-- MODAL KELOLA PRODUK & BARANG (CRUD) -->
        <div class="modal-overlay" id="productAdminModal">
            <div class="modal-content history-modal-content" style="max-width: 750px; text-align: left;">
                <div class="history-header" style="text-align: left;">
                    <h2 style="text-align: left; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-boxes-stacked"></i> Kelola Produk & Barang (CRUD)</h2>
                    <button id="btnCloseProductAdmin" class="close-history-btn"><i class="fa-solid fa-times"></i></button>
                </div>

                <!-- Form Tambah / Edit Produk -->
                <div class="member-form-container" style="background: rgba(255,255,255,0.04); padding: 18px; border-radius: 12px; margin-top: 15px; margin-bottom: 15px; border: 1px solid rgba(52,211,153,0.25); text-align: left;">
                    <h3 style="font-size: 0.95rem; margin-bottom: 12px; color: var(--green-400); text-align: left; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-plus-circle"></i> <span id="productFormTitle">Tambah Produk Baru</span>
                    </h3>
                    <form id="productAdminForm" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; text-align: left;">
                        <input type="hidden" id="prodFormId" value="">

                        <div class="form-group" style="grid-column: span 2; text-align: left;">
                            <label style="font-size: 0.78rem; color: rgba(255,255,255,0.8); display: block; margin-bottom: 4px; text-align: left; font-weight: 600;">Nama Produk / Menu *</label>
                            <input type="text" id="prodFormName" required placeholder="Contoh: Es Teh Solo, Nasi Bakar"
                                   style="width: 100%; padding: 10px 12px; border-radius: 8px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(52, 211, 153, 0.3); color: #fff; outline: none; font-size: 0.88rem; text-align: left;">
                        </div>

                        <div class="form-group" style="text-align: left;">
                            <label style="font-size: 0.78rem; color: rgba(255,255,255,0.8); display: block; margin-bottom: 4px; text-align: left; font-weight: 600;">Harga Jual (Rp) *</label>
                            <input type="number" id="prodFormPrice" min="0" required placeholder="15000"
                                   style="width: 100%; padding: 10px 12px; border-radius: 8px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(52, 211, 153, 0.3); color: #fff; outline: none; font-size: 0.88rem; text-align: left;">
                        </div>

                        <div class="form-group" style="text-align: left;">
                            <label style="font-size: 0.78rem; color: rgba(255,255,255,0.8); display: block; margin-bottom: 4px; text-align: left; font-weight: 600;">Kategori *</label>
                            <select id="prodFormCategory" style="width: 100%; padding: 10px 12px; border-radius: 8px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(52, 211, 153, 0.3); color: #fff; outline: none; font-size: 0.88rem; text-align: left;">
                                <option value="makanan">Makanan</option>
                                <option value="minuman">Minuman</option>
                                <option value="snack">Snack</option>
                                <option value="dessert">Dessert</option>
                                <option value="paket">Paket Hemat</option>
                            </select>
                        </div>

                        <div class="form-group" style="text-align: left;">
                            <label style="font-size: 0.78rem; color: rgba(255,255,255,0.8); display: block; margin-bottom: 4px; text-align: left; font-weight: 600;">Stok Awal</label>
                            <input type="number" id="prodFormStock" min="0" value="10"
                                   style="width: 100%; padding: 10px 12px; border-radius: 8px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(52, 211, 153, 0.3); color: #fff; outline: none; font-size: 0.88rem; text-align: left;">
                        </div>

                        <div class="form-group" style="text-align: left;">
                            <label style="font-size: 0.78rem; color: rgba(255,255,255,0.8); display: block; margin-bottom: 4px; text-align: left; font-weight: 600;">Path / URL Gambar</label>
                            <input type="text" id="prodFormImage" placeholder="assets/image.png" value="assets/image.png"
                                   style="width: 100%; padding: 10px 12px; border-radius: 8px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(52, 211, 153, 0.3); color: #fff; outline: none; font-size: 0.88rem; text-align: left;">
                        </div>

                        <div class="form-actions" style="grid-column: span 2; display: flex; justify-content: flex-start; gap: 10px; margin-top: 5px;">
                            <button type="button" id="btnCancelEditProduct"
                                    style="display: none; padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #fff; font-size: 0.85rem; cursor: pointer;">Batal</button>
                            <button type="submit" id="btnSaveProductForm" class="btn-primary"
                                    style="padding: 10px 24px; border-radius: 8px; border: 1px solid rgba(52, 211, 153, 0.4); background: var(--green-500); color: #fff; font-size: 0.88rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                <i class="fa-solid fa-save"></i> Simpan Produk
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Live Search & Daftar Produk -->
                <div class="history-actions" style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px; text-align: left;">
                    <div style="position: relative; flex-grow: 1; text-align: left;">
                        <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.4); font-size: 0.88rem;"></i>
                        <input type="text" id="searchProductAdminInput" placeholder="Cari nama atau kategori produk..."
                               style="width: 100%; padding: 10px 12px 10px 36px; border-radius: 20px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; outline: none; font-size: 0.88rem; text-align: left;">
                    </div>
                </div>

                <div class="history-list" id="productAdminListContainer" style="max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; text-align: left;">
                    <!-- Products list rendered dynamically by JS -->
                </div>
            </div>
        </div>

        <!-- MODAL KELOLA KATEGORI -->
        <div class="modal-overlay" id="categoryAdminModal">
            <div class="modal-content history-modal-content" style="max-width: 580px; text-align: left;">
                <div class="history-header" style="text-align: left;">
                    <h2 style="text-align: left; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-layer-group"></i> Kelola Kategori Menu</h2>
                    <button id="btnCloseCategoryAdmin" class="close-history-btn"><i class="fa-solid fa-times"></i></button>
                </div>

                <!-- Form Tambah / Edit Kategori -->
                <div class="member-form-container" style="background: rgba(255,255,255,0.04); padding: 18px; border-radius: 12px; margin-top: 15px; margin-bottom: 15px; border: 1px solid rgba(52, 211, 153, 0.25); text-align: left;">
                    <h3 style="font-size: 0.95rem; margin-bottom: 12px; color: var(--green-400); text-align: left; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-folder-plus"></i> <span id="categoryFormTitle">Tambah Kategori Baru</span>
                    </h3>
                    <form id="categoryAdminForm" style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
                        <input type="hidden" id="catFormId" value="">

                        <div class="form-group" style="text-align: left;">
                            <label style="font-size: 0.78rem; color: rgba(255,255,255,0.8); display: block; margin-bottom: 5px; text-align: left; font-weight: 600;">Nomor / Kode ID Kategori (Contoh: 01, 02, makanan_berat)</label>
                            <input type="text" id="catFormCustomId" placeholder="Kosongkan untuk otomatis atau masukkan ID (misal: 01)"
                                   style="width: 100%; padding: 10px 12px; border-radius: 8px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(52, 211, 153, 0.3); color: #fff; outline: none; font-size: 0.88rem; text-align: left;">
                        </div>

                        <div class="form-group" style="text-align: left;">
                            <label style="font-size: 0.78rem; color: rgba(255,255,255,0.8); display: block; margin-bottom: 5px; text-align: left; font-weight: 600;">Nama Kategori *</label>
                            <input type="text" id="catFormName" required placeholder="Contoh: Makanan Berat, Dimsum, Boba"
                                   style="width: 100%; padding: 10px 12px; border-radius: 8px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(52, 211, 153, 0.3); color: #fff; outline: none; font-size: 0.88rem; text-align: left;">
                        </div>

                        <div class="form-actions" style="display: flex; flex-direction: column; gap: 8px; margin-top: 5px;">
                            <button type="submit" id="btnSaveCategoryForm" class="btn-primary"
                                    style="width: 100%; padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(52, 211, 153, 0.4); background: var(--green-500); color: #fff; font-size: 0.88rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <i class="fa-solid fa-save"></i> Simpan Kategori
                            </button>
                            <button type="button" id="btnCancelEditCategory"
                                    style="display: none; width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #fff; font-size: 0.82rem; cursor: pointer; text-align: center;">Batal Edit</button>
                        </div>
                    </form>
                </div>

                <div class="history-list" id="categoryAdminListContainer" style="max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; text-align: left;">
                    <!-- Categories list rendered dynamically by JS -->
            </div>
        </div>
    </div>

    <!-- DATA JAVASCRIPT & LOAD FILE JS -->
    <script>
        let categories = {!! json_encode($categoriesData) !!};
        const products   = {!! json_encode($productsData) !!};
        const IS_DB_ACTIVE = {{ $dbActive ? 'true' : 'false' }};
        const API_PATH = IS_DB_ACTIVE ? 'api/checkout' : '';

        const formatRupiah = (number) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(number);
        };
    </script>

    <!-- LOAD FILE JAVASCRIPT MODULAR -->
    <script src="{{ asset('js/globals.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/sidebar.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/maingrid.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/filter.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/admin.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/cart.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/history.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/reservation.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/recap.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/stock_admin.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/receipt_settings.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/product_admin.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/category_admin.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/init.js') }}?v={{ time() }}"></script>
</body>
</html>
