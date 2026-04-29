<?php
// ============================================================
//  FreshPOS – Konfigurasi Database
// ============================================================
//  Sesuaikan nilai di bawah dengan setting MySQL/MariaDB Anda.
//  Jalankan file database.sql terlebih dahulu untuk membuat
//  tabel yang diperlukan.
// ============================================================

define('DB_HOST',     'localhost');
define('DB_PORT',     '3306');
define('DB_NAME',     'freshpos_db');
define('DB_USER',     'root');     // ganti jika perlu
define('DB_PASS',     '');         // ganti jika perlu
define('DB_CHARSET',  'utf8mb4');

// ------------------------------------------------------------
//  Buat koneksi PDO
// ------------------------------------------------------------
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
        );
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Koneksi database gagal: ' . $e->getMessage()
            ]);
            exit;
        }
    }
    return $pdo;
}
