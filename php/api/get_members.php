<?php
// ============================================================
//  FreshPOS – API: Dapatkan Daftar Member & Langganan
//  Endpoint: GET /api/get_members.php
// ============================================================

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $db = getDB();
    
    // Ambil semua member terdaftar, yang terbaru di atas
    $stmt = $db->query("SELECT * FROM members ORDER BY id DESC");
    $members = $stmt->fetchAll();
    
    $formattedMembers = [];
    foreach ($members as $m) {
        $formattedMembers[] = [
            'id'              => (int)$m['id'],
            'name'            => $m['name'],
            'verified'        => (int)$m['verified'],
            'discount_pct'    => (int)$m['discount_pct'],
            'discount_status' => $m['discount_status'],
            'notes'           => $m['notes'],
            'created_at'      => $m['created_at']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data'    => $formattedMembers
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal mengambil data member: ' . $e->getMessage()
    ]);
}
