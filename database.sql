-- ============================================================
--  FreshPOS – Database Schema
-- ============================================================
--  Jalankan script ini di MySQL/MariaDB (misal via phpMyAdmin)
--  untuk membuat database dan tabel yang diperlukan.
-- ============================================================

CREATE DATABASE IF NOT EXISTS freshpos_db;
USE freshpos_db;

-- 1. Tabel Kategori
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Produk
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255) NOT NULL,
    FOREIGN KEY (category) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Transaksi (Header)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(20) NOT NULL,
    kasir VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    tax DECIMAL(15, 2) NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Member & Langganan (CRUD)
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    verified TINYINT(1) DEFAULT 0,
    discount_pct INT DEFAULT 0,
    discount_status VARCHAR(50) DEFAULT 'Aktif',
    notes TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Item Transaksi (Detail)
CREATE TABLE IF NOT EXISTS transaction_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    qty INT NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
--  DATA AWAL (Initial Data)
-- ------------------------------------------------------------

-- Insert Kategori
INSERT INTO categories (id, name, icon) VALUES
('all', 'Semua Menu', 'fa-table-cells-large'),
('makanan', 'Makanan', 'fa-burger'),
('minuman', 'Minuman', 'fa-mug-hot'),
('snack', 'Snack', 'fa-cookie'),
('dessert', 'Dessert', 'fa-ice-cream'),
('paket', 'Paket Hemat', 'fa-box-open');

-- Insert Produk
INSERT INTO products (id, name, price, category, image) VALUES
('p1', 'Salad Sayur Organik', 35000, 'makanan', 'assets/image.png'),
('p2', 'Ayam Panggang Diet', 45000, 'makanan', 'assets/image copy.png'),
('p7', 'Quinoa Bowl Berserat', 50000, 'makanan', 'assets/image copy 6.png'),
('p10', 'Sandwich Telur', 32000, 'makanan', 'assets/image copy 9.png'),
('p11', 'Nasi Goreng Spesial', 30000, 'makanan', 'assets/image copy 10.png'),
('p12', 'Mie Goreng Pedas', 28000, 'makanan', 'assets/image copy 11.png'),
('p13', 'Gado-Gado Segar', 25000, 'makanan', 'assets/image copy 12.png'),
('p14', 'Soto Ayam Kuning', 27000, 'makanan', 'assets/image copy 13.png'),
('p3', 'Jus Alpukat Murni', 25000, 'minuman', 'assets/image copy 2.png'),
('p4', 'Kopi Susu Gula Aren', 20000, 'minuman', 'assets/image copy 3.png'),
('p6', 'Mix Berry Smoothie', 30000, 'minuman', 'assets/image copy 5.png'),
('p8', 'Matcha Latte', 28000, 'minuman', 'assets/image copy 7.png'),
('p15', 'Es Teh Manis', 8000, 'minuman', 'assets/image copy 14.png'),
('p16', 'Susu Regal Premium', 5000, 'minuman', 'assets/image copy 15.png'),
('p17', 'Jus Jeruk Segar', 18000, 'minuman', 'assets/image copy 16.png'),
('p18', 'Lemon Tea Dingin', 15000, 'minuman', 'assets/image copy 17.png'),
('p5', 'Keripik Kentang', 15000, 'snack', 'assets/image copy 4.png'),
('p9', 'Soft Cookies', 20000, 'snack', 'assets/image copy 8.png'),
('p19', 'Donat Coklat', 12000, 'snack', 'assets/image copy 18.png'),
('p20', 'Pisang Goreng Crispy', 10000, 'snack', 'assets/image copy 19.png'),
('p21', 'Roti Bakar Selai', 14000, 'snack', 'assets/image copy 20.png'),
('p22', 'Dimsum Mentai', 10000, 'snack', 'assets/image copy 21.png'),
-- [DATA PRODUK DATABASE] - Data menu Es Krim Vanilla yang disimpan di database MySQL
('p23', 'Es Krim Vanilla', 18000, 'dessert', 'assets/image copy 22.png'),
('p24', 'Puding Caramel', 12000, 'dessert', 'assets/image copy 23.png'),
('p25', 'Brownies Panggang', 22000, 'dessert', 'assets/image copy 24.png'),
('p26', 'Boba Matcha', 25000, 'dessert', 'assets/image copy 25.png'),
('p27', 'Crepe Strawberry', 20000, 'dessert', 'assets/image copy 26.png'),
('p28', 'Paket Makan Siang', 55000, 'paket', 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png'),
('p29', 'Paket Sarapan Sehat', 40000, 'paket', 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png'),
('p30', 'Paket Dinner Romantis', 95000, 'paket', 'assets/Cokelat Krem Modern Kreatif Menu Burger Brosur Produk.png'),
('p31', 'Paket Keluarga Lengkap', 120000, 'paket', 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png'),
('p32', 'Paket Buka Puasa', 75000, 'paket', 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png'),
('p33', 'Paket Meeting Snack Box', 65000, 'paket', 'assets/Krem Minimalis Menu Restoran.png');

-- 5. Tabel Reservasi
CREATE TABLE IF NOT EXISTS reservations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    res_date DATE NOT NULL,
    res_time TIME NOT NULL,
    people INT NOT NULL,
    table_num VARCHAR(50) DEFAULT NULL,
    items JSON DEFAULT NULL,
    total_order DECIMAL(15, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Menunggu',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

