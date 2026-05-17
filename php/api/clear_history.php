<?php
// ============================================================
//  FreshPOS – API: Hapus Riwayat
//  Endpoint: POST /api/clear_history.php
// ============================================================

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$rawBody = file_get_contents('php://input');
$data    = json_decode($rawBody, true);

if (!$data || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Body JSON tidak valid.']);
    exit;
}

$type = $data['type'] ?? 'all'; // 'transactions', 'reservations', or 'all'

try {
    $db = getDB();
    
    if ($type === 'transactions' || $type === 'all') {
        // Karena ON DELETE CASCADE aktif di foreign key transaction_items,
        // kita cukup mengosongkan tabel transactions saja.
        $db->exec("TRUNCATE TABLE transactions");
        // Jika TRUNCATE gagal karena foreign key, kita bisa pakai DELETE
        // $db->exec("DELETE FROM transaction_items");
        // $db->exec("DELETE FROM transactions");
    }
    
    if ($type === 'reservations' || $type === 'all') {
        $db->exec("TRUNCATE TABLE reservations");
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Riwayat berhasil dibersihkan dari database.',
        'type'    => $type
    ]);
    
} catch (Exception $e) {
    // Jika TRUNCATE gagal karena FK check, coba DELETE FROM
    try {
        if ($type === 'transactions' || $type === 'all') {
            $db->exec("DELETE FROM transaction_items");
            $db->exec("DELETE FROM transactions");
        }
        if ($type === 'reservations' || $type === 'all') {
            $db->exec("DELETE FROM reservations");
        }
        echo json_encode([
            'success' => true,
            'message' => 'Riwayat berhasil dibersihkan dari database (via DELETE).',
            'type'    => $type
        ]);
    } catch (Exception $err) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Gagal menghapus data: ' . $err->getMessage()
        ]);
    }
}
