<?php
// ============================================================
//  FreshPOS – API: Simpan Transaksi (checkout)
//  Endpoint: POST /api/checkout.php
// ============================================================
//  Body JSON yang diharapkan:
//  {
//    "order_code"     : "ORD-12345",
//    "kasir"          : "Admin Utama",
//    "payment_method" : "Tunai",
//    "items"          : [
//       { "id": "p1", "name": "Salad Sayur Organik",
//         "price": 35000, "qty": 2 }
//    ],
//    "subtotal"       : 70000,
//    "tax"            : 7700,
//    "total"          : 77700
//  }
// ============================================================

require_once __DIR__ . '/../config.php';

// CORS – izinkan request dari halaman yang sama
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Tangani preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Hanya terima POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Baca & validasi body JSON
$rawBody = file_get_contents('php://input');
$data    = json_decode($rawBody, true);

if (!$data || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Body JSON tidak valid.']);
    exit;
}

// Validasi field wajib
$required = ['order_code', 'kasir', 'payment_method', 'items', 'subtotal', 'tax', 'total'];
foreach ($required as $field) {
    if (!isset($data[$field])) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => "Field '$field' wajib diisi."]);
        exit;
    }
}

if (!is_array($data['items']) || count($data['items']) === 0) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Items tidak boleh kosong.']);
    exit;
}

// ---- Simpan ke database ----
try {
    $db = getDB();
    $db->beginTransaction();

    // 1. Simpan header transaksi
    $stmt = $db->prepare("
        INSERT INTO transactions
            (order_code, kasir, payment_method, subtotal, tax, total, created_at)
        VALUES
            (:order_code, :kasir, :payment_method, :subtotal, :tax, :total, NOW())
    ");
    $stmt->execute([
        ':order_code'      => $data['order_code'],
        ':kasir'           => $data['kasir'],
        ':payment_method'  => $data['payment_method'],
        ':subtotal'        => (float) $data['subtotal'],
        ':tax'             => (float) $data['tax'],
        ':total'           => (float) $data['total'],
    ]);
    $transactionId = $db->lastInsertId();

    // 2. Simpan setiap item transaksi
    $itemStmt = $db->prepare("
        INSERT INTO transaction_items
            (transaction_id, product_id, product_name, price, qty, subtotal)
        VALUES
            (:transaction_id, :product_id, :product_name, :price, :qty, :subtotal)
    ");
    $stockStmt = $db->prepare("UPDATE products SET stock = stock - :qty1 WHERE id = :id AND stock >= :qty2");

    foreach ($data['items'] as $item) {
        $qty = (int)($item['qty'] ?? 1);
        $productId = $item['id'] ?? '';
        
        // 2a. Potong stok
        $stockStmt->execute([
            ':qty1' => $qty,
            ':qty2' => $qty,
            ':id'  => $productId
        ]);

        if ($stockStmt->rowCount() === 0) {
            throw new Exception("Stok untuk produk " . ($item['name'] ?? $productId) . " tidak mencukupi.");
        }

        // 2b. Simpan item
        $itemStmt->execute([
            ':transaction_id' => $transactionId,
            ':product_id'     => $productId,
            ':product_name'   => $item['name']  ?? '',
            ':price'          => (float)($item['price'] ?? 0),
            ':qty'            => $qty,
            ':subtotal'       => (float)($item['price'] ?? 0) * $qty,
        ]);
    }

    $db->commit();

    echo json_encode([
        'success'        => true,
        'message'        => 'Transaksi berhasil disimpan.',
        'transaction_id' => (int) $transactionId,
        'order_code'     => $data['order_code'],
    ]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal menyimpan transaksi: ' . $e->getMessage(),
    ]);
}
