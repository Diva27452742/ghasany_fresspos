-- ============================================================
--  FreshPOS – Database Schema (Updated)
-- ============================================================

DROP DATABASE IF EXISTS freshpos_db;
CREATE DATABASE IF NOT EXISTS freshpos_db;
USE freshpos_db;

-- 1. Tabel Users (Multi-user)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'kasir') DEFAULT 'kasir',
    name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Customers (Pelanggan / Member)
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    points INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Kategori
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Produk (ditambahkan stok)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    FOREIGN KEY (category) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel Transaksi (Header)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(20) NOT NULL,
    user_id INT,
    customer_id INT NULL,
    kasir VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    tax DECIMAL(15, 2) NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabel Item Transaksi (Detail)
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

-- Insert Default Users
INSERT INTO users (username, password, role, name) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Admin Utama'), -- password: password
('kasir1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'kasir', 'Kasir Pagi'); -- password: password

-- Insert Default Customers
INSERT INTO customers (name, phone, points) VALUES
('Umum', '000000000', 0),
('Budi Santoso', '08123456789', 50);

-- Insert Kategori
INSERT INTO categories (id, name, icon) VALUES
('all', 'Semua Menu', 'fa-table-cells-large'),
('makanan', 'Makanan', 'fa-burger'),
('minuman', 'Minuman', 'fa-mug-hot'),
('snack', 'Snack', 'fa-cookie'),
('dessert', 'Dessert', 'fa-ice-cream'),
('paket', 'Paket Hemat', 'fa-box-open');

-- Insert Produk (stok awal = 50)
INSERT INTO products (id, name, price, category, image, stock) VALUES
('p1', 'Salad Sayur Organik', 35000, 'makanan', 'assets/image.png', 50),
('p2', 'Ayam Panggang Diet', 45000, 'makanan', 'assets/image copy.png', 50),
('p7', 'Quinoa Bowl Berserat', 50000, 'makanan', 'assets/image copy 6.png', 50),
('p10', 'Sandwich Telur', 32000, 'makanan', 'assets/image copy 9.png', 50),
('p11', 'Nasi Goreng Spesial', 30000, 'makanan', 'assets/image copy 10.png', 50),
('p12', 'Mie Goreng Pedas', 28000, 'makanan', 'assets/image copy 11.png', 50),
('p13', 'Gado-Gado Segar', 25000, 'makanan', 'assets/image copy 12.png', 50),
('p14', 'Soto Ayam Kuning', 27000, 'makanan', 'assets/image copy 13.png', 50),
('p3', 'Jus Alpukat Murni', 25000, 'minuman', 'assets/image copy 2.png', 50),
('p4', 'Kopi Susu Gula Aren', 20000, 'minuman', 'assets/image copy 3.png', 50),
('p6', 'Mix Berry Smoothie', 30000, 'minuman', 'assets/image copy 5.png', 50),
('p8', 'Matcha Latte', 28000, 'minuman', 'assets/image copy 7.png', 50),
('p15', 'Es Teh Manis', 8000, 'minuman', 'assets/image copy 14.png', 50),
('p16', 'Susu Regal Premium', 5000, 'minuman', 'assets/image copy 15.png', 50),
('p17', 'Jus Jeruk Segar', 18000, 'minuman', 'assets/image copy 16.png', 50),
('p18', 'Lemon Tea Dingin', 15000, 'minuman', 'assets/image copy 17.png', 50),
('p5', 'Keripik Kentang', 15000, 'snack', 'assets/image copy 4.png', 50),
('p9', 'Soft Cookies', 20000, 'snack', 'assets/image copy 8.png', 50),
('p19', 'Donat Coklat', 12000, 'snack', 'assets/image copy 18.png', 50),
('p20', 'Pisang Goreng Crispy', 10000, 'snack', 'assets/image copy 19.png', 50),
('p21', 'Roti Bakar Selai', 14000, 'snack', 'assets/image copy 20.png', 50),
('p22', 'Dimsum Mentai', 10000, 'snack', 'assets/image copy 21.png', 50),
('p23', 'Es Krim Vanilla', 18000, 'dessert', 'assets/image copy 22.png', 50),
('p24', 'Puding Caramel', 12000, 'dessert', 'assets/image copy 23.png', 50),
('p25', 'Brownies Panggang', 22000, 'dessert', 'assets/image copy 24.png', 50),
('p26', 'Boba Matcha', 25000, 'dessert', 'assets/image copy 25.png', 50),
('p27', 'Crepe Strawberry', 20000, 'dessert', 'assets/image copy 26.png', 50),
('p28', 'Paket Makan Siang', 55000, 'paket', 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png', 50),
('p29', 'Paket Sarapan Sehat', 40000, 'paket', 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png', 50),
('p30', 'Paket Dinner Romantis', 95000, 'paket', 'assets/Cokelat Krem Modern Kreatif Menu Burger Brosur Produk.png', 50),
('p31', 'Paket Keluarga Lengkap', 120000, 'paket', 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png', 50),
('p32', 'Paket Buka Puasa', 75000, 'paket', 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png', 50),
('p33', 'Paket Meeting Snack Box', 65000, 'paket', 'assets/Krem Minimalis Menu Restoran.png', 50);

