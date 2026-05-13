<?php
session_start();
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$rawBody = file_get_contents('php://input');
$data    = json_decode($rawBody, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Body JSON tidak valid.']);
    exit;
}

$required = ['order_code', 'kasir', 'payment_method', 'items', 'subtotal', 'tax', 'total'];
foreach ($required as $field) {
    if (!isset($data[$field])) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => "Field '$field' wajib diisi."]);
        exit;
    }
}

try {
    $db = getDB();
    $db->beginTransaction();

    $userId = $_SESSION['user_id'] ?? null;
    $customerId = isset($data['customer_id']) && $data['customer_id'] !== '' ? $data['customer_id'] : null;

    // 1. Simpan header transaksi
    $stmt = $db->prepare("
        INSERT INTO transactions
            (order_code, user_id, customer_id, kasir, payment_method, subtotal, tax, total, created_at)
        VALUES
            (:order_code, :user_id, :customer_id, :kasir, :payment_method, :subtotal, :tax, :total, NOW())
    ");
    $stmt->execute([
        ':order_code'      => $data['order_code'],
        ':user_id'         => $userId,
        ':customer_id'     => $customerId,
        ':kasir'           => $data['kasir'],
        ':payment_method'  => $data['payment_method'],
        ':subtotal'        => (float) $data['subtotal'],
        ':tax'             => (float) $data['tax'],
        ':total'           => (float) $data['total'],
    ]);
    $transactionId = $db->lastInsertId();

    // 2. Simpan setiap item transaksi dan kurangi stok
    $itemStmt = $db->prepare("
        INSERT INTO transaction_items
            (transaction_id, product_id, product_name, price, qty, subtotal)
        VALUES
            (:transaction_id, :product_id, :product_name, :price, :qty, :subtotal)
    ");
    $stockStmt = $db->prepare("UPDATE products SET stock = stock - :qty WHERE id = :id AND stock >= :qty");

    foreach ($data['items'] as $item) {
        $qty = (int)($item['qty'] ?? 1);
        $productId = $item['id'] ?? '';

        $itemStmt->execute([
            ':transaction_id' => $transactionId,
            ':product_id'     => $productId,
            ':product_name'   => $item['name']  ?? '',
            ':price'          => (float)($item['price'] ?? 0),
            ':qty'            => $qty,
            ':subtotal'       => (float)($item['price'] ?? 0) * $qty,
        ]);

        $stockStmt->execute([
            ':qty' => $qty,
            ':id'  => $productId
        ]);
        if ($stockStmt->rowCount() === 0) {
            throw new Exception("Stok tidak mencukupi untuk " . ($item['name'] ?? 'produk'));
        }
    }

    // 3. Tambah poin jika ada customer
    if ($customerId) {
        $pointsEarned = floor((float)$data['total'] / 10000); // 1 point per 10k
        $ptsStmt = $db->prepare("UPDATE customers SET points = points + ? WHERE id = ?");
        $ptsStmt->execute([$pointsEarned, $customerId]);
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
?>
