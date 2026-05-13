function initApp() {
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('mainApp').style.display = 'grid';
    
    // Set User Info
    document.getElementById('displayUserName').textContent = currentUser.name;
    document.getElementById('displayUserRole').innerHTML = `${currentUser.role} <i class="fa-solid fa-pen edit-admin-btn" title="Ganti Nama"></i>`;
    document.getElementById('receiptAdminName').textContent = currentUser.name;
    
    if(currentUser.role === 'admin') {
        document.getElementById('menuProduk').style.display = 'block';
    }

    // View Routing
    const menuBtns = document.querySelectorAll('.sidebar-menu-btn[data-target]');
    const views = document.querySelectorAll('.view-section');
    const headerTitle = document.getElementById('headerTitle');

    menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            menuBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const target = btn.getAttribute('data-target');
            views.forEach(v => v.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            
            // Set Header Title
            headerTitle.textContent = btn.textContent.trim();

            // Toggle Cart Sidebar
            const cartSidebar = document.getElementById('cartSidebar');
            if(target === 'view-kasir') {
                cartSidebar.style.display = 'flex';
                document.querySelector('.app-container').style.gridTemplateColumns = 'var(--sidebar-w) 1fr var(--cart-w)';
            } else {
                cartSidebar.style.display = 'none';
                document.querySelector('.app-container').style.gridTemplateColumns = 'var(--sidebar-w) 1fr';
            }

            // Load data based on view
            if(target === 'view-dashboard') loadDashboard();
            if(target === 'view-produk') loadProductsManage();
            if(target === 'view-pelanggan') loadCustomers();
            if(target === 'view-riwayat') loadHistory();
        });
    });

    // Initial Load Kasir
    loadCategories();
    loadProducts();
    loadCustomersForDropdown();
}
