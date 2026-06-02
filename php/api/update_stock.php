<?php
// ============================================================
//  FreshPOS – API: Update Stok Produk
//  Endpoint: POST /api/update_stock.php
// ============================================================
//  Body JSON yang diharapkan:
//  [
//      { "id": "p1", "stock": 15 },
//      { "id": "p2", "stock": 20 }
//  ]
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

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Body JSON tidak valid atau harus berupa array.']);
    exit;
}

try {
    $db = getDB();
    $db->beginTransaction();

    $stmt = $db->prepare("UPDATE products SET stock = :stock WHERE id = :id");

    $updated = 0;
    foreach ($data as $item) {
        if (isset($item['id']) && isset($item['stock'])) {
            $stmt->execute([
                ':stock' => (int)$item['stock'],
                ':id'    => $item['id']
            ]);
            $updated += $stmt->rowCount();
        }
    }

    $db->commit();

    echo json_encode([
        'success' => true,
        'message' => "Berhasil menyimpan perubahan stok untuk $updated produk."
    ]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal memperbarui stok: ' . $e->getMessage()
    ]);
}
