<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FreshPOS – Sistem Kasir Modern</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- SweetAlert2 -->
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.min.css" rel="stylesheet">
    
    <!-- CSS -->
    <link rel="stylesheet" href="./css/variables.css">
    <link rel="stylesheet" href="./css/animations.css">
    <link rel="stylesheet" href="./css/layout.css">
    <link rel="stylesheet" href="./css/sidebar.css">
    <link rel="stylesheet" href="./css/header.css">
    <link rel="stylesheet" href="./css/products.css">
    <link rel="stylesheet" href="./css/cart.css">
    <link rel="stylesheet" href="./css/modal.css">
    <link rel="stylesheet" href="./css/history.css">

    <style>
        .admin-nav-btn {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            padding: 8px 15px;
            border-radius: var(--r-sm);
            color: var(--green-900);
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all var(--fast);
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .admin-nav-btn:hover { background: var(--green-100); }
        .full-modal { max-width: 900px !important; width: 95% !important; }
        
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .stat-card { background: var(--bg-card); padding: 20px; border-radius: var(--r-md); box-shadow: var(--shadow-card); border: 1px solid var(--border); }
        .chart-container { padding: 20px; background: var(--bg-card); border-radius: var(--r-md); height: 300px; border: 1px solid var(--border); }
        .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.85rem; }
        .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px dashed var(--border); }
        .form-group { margin-bottom: 15px; text-align: left; }
        .form-group label { display: block; margin-bottom: 5px; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
        .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid var(--border-strong); border-radius: var(--r-sm); }
    </style>
</head>
<body>
    <!-- Login Overlay -->
    <div id="authOverlay" class="modal-overlay" style="background: var(--grad-page); z-index: 99999;">
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <i class="fa-solid fa-leaf" style="font-size: 3rem; color: var(--green-500); margin-bottom: 10px;"></i>
            <h2 style="color: var(--green-900); font-weight: 800; font-size: 1.5rem;">FreshPOS</h2>
            <p style="margin-bottom: 24px; color: var(--text-muted); font-size: 0.85rem;">Login untuk mengakses sistem</p>
            <form id="loginForm">
                <input type="text" id="loginUser" placeholder="Username" required style="width:100%; padding:12px; margin-bottom:12px; border:1px solid var(--border-strong); border-radius:var(--r-sm);">
                <input type="password" id="loginPass" placeholder="Password" required style="width:100%; padding:12px; margin-bottom:20px; border:1px solid var(--border-strong); border-radius:var(--r-sm);">
                <button type="submit" class="btn-primary" style="width: 100%;"><i class="fa-solid fa-right-to-bracket"></i> Masuk</button>
            </form>
        </div>
    </div>

    <div class="app-container" id="mainApp" style="opacity: 0; transition: opacity 0.3s;">
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
            <div class="sidebar-footer" style="display:flex; flex-direction:column; gap:10px;">
                <p>© 2026 FreshPOS v3.0</p>
                <button id="btnLogout" class="admin-nav-btn" style="color:#dc2626; border-color:#fca5a5; justify-content:center;">
                    <i class="fa-solid fa-power-off"></i> Logout
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="top-header">
                <div class="search-bar">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="searchInput" placeholder="Cari menu / produk...">
                </div>
                
                <div style="display:flex; gap:10px; margin-left: 20px;">
                    <button class="admin-nav-btn" id="btnOpenDashboard" title="Dashboard">
                        <i class="fa-solid fa-chart-pie"></i> <span class="hide-mobile">Dashboard</span>
                    </button>
                    <button class="admin-nav-btn" id="btnOpenProducts" title="Kelola Produk" style="display:none;">
                        <i class="fa-solid fa-box-open"></i> <span class="hide-mobile">Produk</span>
                    </button>
                    <button class="admin-nav-btn" id="btnOpenCustomers" title="Pelanggan">
                        <i class="fa-solid fa-users"></i> <span class="hide-mobile">Pelanggan</span>
                    </button>
                    <button class="admin-nav-btn" id="btnOpenHistory" title="Riwayat Pesanan">
                        <i class="fa-solid fa-clock-rotate-left"></i> <span class="hide-mobile">Riwayat</span>
                    </button>
                </div>

                <div class="user-profile" style="margin-left: auto;">
                    <div class="user-info">
                        <span class="name" id="displayUserName">Admin Utama</span>
                        <span class="role" id="displayUserRole">Kasir</span>
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
                <span class="order-id" id="displayOrderId">#ORD-001</span>
            </div>
            
            <div style="padding: 10px 15px; border-bottom: 1px solid var(--border);">
                <select id="checkoutCustomer" style="width: 100%; padding: 8px; border-radius: var(--r-sm); border: 1px solid var(--border-strong); font-size:0.85rem; outline:none;">
                    <option value="">Pilih Pelanggan (Opsional)</option>
                </select>
            </div>

            <div class="cart-items" id="cartItems">
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

        <!-- Modals -->

        <!-- Checkout Modal -->
        <div class="modal-overlay" id="checkoutModal">
            <div class="modal-content receipt-modal">
                <div class="receipt-header">
                    <h2>FreshPOS</h2>
                    <p>Struk Belanja</p>
                    <p id="receiptDate" class="receipt-date"></p>
                    <p>Kasir: <span id="receiptAdminName">Admin</span></p>
                </div>
                <div class="receipt-items-container">
                    <table class="receipt-table">
                        <thead><tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Subtotal</th></tr></thead>
                        <tbody id="receiptItems"></tbody>
                    </table>
                </div>
                <div class="modal-details receipt-summary">
                    <div class="detail-row"><span>Metode Bayar:</span><strong id="modalPaymentMethod">Tunai</strong></div>
                    <div class="detail-row"><span>Subtotal:</span><strong id="modalSubtotal">Rp 0</strong></div>
                    <div class="detail-row"><span>Pajak (11%):</span><strong id="modalTax">Rp 0</strong></div>
                    <div class="detail-row total"><span>Total Pembayaran:</span><strong id="modalTotal">Rp 0</strong></div>
                    <div class="detail-row" id="pointEarnedRow" style="display:none; margin-top:8px;"><span style="color:var(--green-600)">Poin Didapat:</span><strong id="modalPoints" style="color:var(--green-600)">+0 Poin</strong></div>
                </div>
                <div class="qris-container" id="qrisContainer" style="display: none; text-align: center; margin-bottom: 20px;">
                    <p style="font-weight: 600; font-size: 1.1rem; color: var(--primary-green-dark); margin-bottom: 8px;">Scan QRIS untuk Membayar</p>
                    <img src="" alt="QRIS Payment" style="border: 4px solid var(--primary-green-light); border-radius: 8px; padding: 4px;">
                </div>
                <div class="receipt-footer"><i class="fa-solid fa-circle-check modal-icon"></i><p>Terima Kasih!</p></div>
                <button class="btn-primary" id="btnSelesai"><i class="fa-solid fa-print"></i> Selesai & Cetak</button>
            </div>
        </div>

        <!-- Dashboard Modal -->
        <div class="modal-overlay" id="dashboardModal">
            <div class="modal-content full-modal">
                <div class="history-header">
                    <h2><i class="fa-solid fa-chart-pie"></i> Dashboard Statistik</h2>
                    <button class="close-history-btn" onclick="document.getElementById('dashboardModal').classList.remove('show')"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="dashboard-grid">
                    <div class="stat-card">
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Transaksi Hari Ini</p>
                        <h3 id="dashTotalTx" style="font-size: 1.8rem; color: var(--green-800);">0</h3>
                    </div>
                    <div class="stat-card">
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Pendapatan Hari Ini</p>
                        <h3 id="dashRevenue" style="font-size: 1.8rem; color: var(--green-800);">Rp 0</h3>
                    </div>
                    <div class="stat-card">
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Total Pelanggan</p>
                        <h3 id="dashCustomers" style="font-size: 1.8rem; color: var(--green-800);">0</h3>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="salesChart"></canvas>
                </div>
            </div>
        </div>

        <!-- History Modal -->
        <div class="modal-overlay" id="historyModal">
            <div class="modal-content full-modal history-modal-content">
                <div class="history-header">
                    <h2><i class="fa-solid fa-clock-rotate-left"></i> Riwayat Pesanan</h2>
                    <button class="close-history-btn" onclick="document.getElementById('historyModal').classList.remove('show')"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="history-filters" style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <select id="historyFilter" style="padding: 8px 12px; border-radius: var(--r-sm); border:1px solid var(--border-strong); outline:none;">
                            <option value="all">Semua Waktu</option>
                            <option value="today">Hari Ini</option>
                            <option value="yesterday">Kemarin</option>
                        </select>
                        <button id="btnRefreshHistory" class="admin-nav-btn" style="display:inline-flex; margin-left:10px;"><i class="fa-solid fa-arrows-rotate"></i> Refresh</button>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="admin-nav-btn" id="btnExportPDF" style="color: #dc2626; border-color:#fca5a5;"><i class="fa-solid fa-file-pdf"></i> PDF</button>
                        <button class="admin-nav-btn" id="btnExportExcel" style="color: #10b981; border-color:#6ee7b7;"><i class="fa-solid fa-file-excel"></i> Excel</button>
                    </div>
                </div>
                <div class="history-list" id="historyList" style="margin-top:15px; max-height:400px; overflow-y:auto; border-radius:var(--r-sm); border:1px solid var(--border);">
                    <table class="data-table">
                        <thead style="position:sticky; top:0; background:var(--bg-card);">
                            <tr><th>Tanggal</th><th>Kode Order</th><th>Kasir</th><th>Pelanggan</th><th>Total</th></tr>
                        </thead>
                        <tbody id="historyTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Products Modal -->
        <div class="modal-overlay" id="productsModal">
            <div class="modal-content full-modal">
                <div class="history-header">
                    <h2><i class="fa-solid fa-box-open"></i> Kelola Produk</h2>
                    <button class="close-history-btn" onclick="document.getElementById('productsModal').classList.remove('show')"><i class="fa-solid fa-times"></i></button>
                </div>
                <div style="margin-bottom: 15px;">
                    <button class="btn-primary" id="btnAddProduct" style="width: auto; padding: 10px 20px;"><i class="fa-solid fa-plus"></i> Tambah Produk Baru</button>
                </div>
                <div style="max-height:400px; overflow-y:auto;">
                    <table class="data-table">
                        <thead style="position:sticky; top:0; background:var(--bg-card);">
                            <tr><th>Gbr</th><th>Nama Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Aksi</th></tr>
                        </thead>
                        <tbody id="productTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Customers Modal -->
        <div class="modal-overlay" id="customersModal">
            <div class="modal-content full-modal">
                <div class="history-header">
                    <h2><i class="fa-solid fa-users"></i> Kelola Pelanggan</h2>
                    <button class="close-history-btn" onclick="document.getElementById('customersModal').classList.remove('show')"><i class="fa-solid fa-times"></i></button>
                </div>
                <div style="margin-bottom: 15px;">
                    <button class="btn-primary" id="btnAddCustomer" style="width: auto; padding: 10px 20px;"><i class="fa-solid fa-plus"></i> Tambah Pelanggan</button>
                </div>
                <div style="max-height:400px; overflow-y:auto;">
                    <table class="data-table">
                        <thead style="position:sticky; top:0; background:var(--bg-card);">
                            <tr><th>Nama</th><th>No. HP</th><th>Poin</th><th>Aksi</th></tr>
                        </thead>
                        <tbody id="customerTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Product Form Modal -->
        <div class="modal-overlay" id="productFormModal" style="z-index:1001;">
            <div class="modal-content">
                <h2 id="productModalTitle" style="margin-bottom: 20px; color:var(--green-900);">Tambah Produk</h2>
                <form id="productForm">
                    <input type="hidden" id="prodId">
                    <input type="hidden" id="prodExistingImg">
                    <div class="form-group"><label>Nama Produk</label><input type="text" id="prodName" required></div>
                    <div class="form-group"><label>Harga (Rp)</label><input type="number" id="prodPrice" required></div>
                    <div class="form-group"><label>Stok</label><input type="number" id="prodStock" required></div>
                    <div class="form-group"><label>Kategori</label><select id="prodCategory" required></select></div>
                    <div class="form-group"><label>Gambar</label><input type="file" id="prodImage" accept="image/*"></div>
                    <div style="display:flex; gap:10px; margin-top:20px;">
                        <button type="button" class="btn-primary" style="background:#6b7280;" onclick="document.getElementById('productFormModal').classList.remove('show')">Batal</button>
                        <button type="submit" class="btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Customer Form Modal -->
        <div class="modal-overlay" id="customerFormModal" style="z-index:1001;">
            <div class="modal-content">
                <h2 id="customerModalTitle" style="margin-bottom: 20px; color:var(--green-900);">Tambah Pelanggan</h2>
                <form id="customerForm">
                    <input type="hidden" id="custId">
                    <div class="form-group"><label>Nama Pelanggan</label><input type="text" id="custName" required></div>
                    <div class="form-group"><label>No. HP</label><input type="text" id="custPhone" required></div>
                    <div class="form-group"><label>Poin</label><input type="number" id="custPoints" value="0" required></div>
                    <div style="display:flex; gap:10px; margin-top:20px;">
                        <button type="button" class="btn-primary" style="background:#6b7280;" onclick="document.getElementById('customerFormModal').classList.remove('show')">Batal</button>
                        <button type="submit" class="btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
        </div>

    </div>

    <!-- CDNs -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.all.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>
    <script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>

    <!-- App Scripts -->
    <script src="./js/globals.js"></script>
    <script src="./js/auth.js"></script>
    <script src="./js/app.js"></script>
    <script src="./js/dashboard.js"></script>
    <script src="./js/product_management.js"></script>
    <script src="./js/customer.js"></script>
    <script src="./js/export.js"></script>
    <script src="./js/cart.js"></script>
    <script src="./js/history.js"></script>
    
    <script>
        // Override app.js initApp behavior to fit the new layout
        function initApp() {
            document.getElementById('authOverlay').style.display = 'none';
            document.getElementById('mainApp').style.opacity = '1';
            
            // Set User Info
            document.getElementById('displayUserName').textContent = currentUser.name;
            document.getElementById('displayUserRole').textContent = currentUser.role;
            document.getElementById('receiptAdminName').textContent = currentUser.name;
            
            const avatar = document.getElementById('adminAvatar');
            if (avatar) avatar.src = \`https://ui-avatars.com/api/?name=\${encodeURIComponent(currentUser.name)}&background=10b981&color=fff\`;

            if(currentUser.role === 'admin') {
                document.getElementById('btnOpenProducts').style.display = 'flex';
            }

            // Load data
            loadCategories();
            loadProducts();
            loadCustomersForDropdown();
        }

        // Modal triggers
        document.getElementById('btnOpenDashboard').addEventListener('click', () => {
            loadDashboard();
            document.getElementById('dashboardModal').classList.add('show');
        });
        document.getElementById('btnOpenProducts').addEventListener('click', () => {
            loadProductsManage();
            document.getElementById('productsModal').classList.add('show');
        });
        document.getElementById('btnOpenCustomers').addEventListener('click', () => {
            loadCustomers();
            document.getElementById('customersModal').classList.add('show');
        });
        document.getElementById('btnOpenHistory').addEventListener('click', () => {
            loadHistory();
            document.getElementById('historyModal').classList.add('show');
        });

        // Search trigger
        document.getElementById('searchInput').addEventListener('input', (e) => {
            if(typeof filterAndRenderProducts === 'function') {
                filterAndRenderProducts();
            }
        });

        // Handle Add Buttons in Modals properly
        document.getElementById('btnAddProduct').addEventListener('click', () => {
            document.getElementById('productForm').reset();
            document.getElementById('prodId').value = '';
            document.getElementById('productModalTitle').textContent = 'Tambah Produk';
            loadCategoriesForSelect();
            document.getElementById('productFormModal').classList.add('show');
        });

        document.getElementById('btnAddCustomer').addEventListener('click', () => {
            document.getElementById('customerForm').reset();
            document.getElementById('custId').value = '';
            document.getElementById('customerModalTitle').textContent = 'Tambah Pelanggan';
            document.getElementById('customerFormModal').classList.add('show');
        });
    </script>
</body>
</html>
