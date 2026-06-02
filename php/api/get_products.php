<?php
// ============================================================
//  FreshPOS – API: Ambil Data Produk (dan Stok)
//  Endpoint: GET /api/get_products.php
// ============================================================

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

try {
    $db = getDB();
    $stmt = $db->query("SELECT id, name, price, category, image, stock FROM products ORDER BY category ASC, name ASC");
    $dbProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $productsData = [];
    if ($dbProducts && count($dbProducts) > 0) {
        foreach ($dbProducts as $p) {
            $p['price'] = (float)$p['price'];
            $p['stock'] = (int)$p['stock'];
            $productsData[] = $p;
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $productsData
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal mengambil data produk: ' . $e->getMessage()
    ]);
}
