<?php
// ============================================================
//  FreshPOS – API: Simpan Reservasi
//  Endpoint: POST /api/save_reservation.php
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

// Validasi field wajib
$required = ['id', 'name', 'date', 'time', 'people'];
foreach ($required as $field) {
    if (!isset($data[$field])) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => "Field '$field' wajib diisi."]);
        exit;
    }
}

try {
    $db = getDB();
    
    // Check if reservation already exists
    $checkStmt = $db->prepare("SELECT COUNT(*) FROM reservations WHERE id = :id");
    $checkStmt->execute([':id' => $data['id']]);
    $exists = $checkStmt->fetchColumn() > 0;
    
    if ($exists) {
        // Update
        $stmt = $db->prepare("
            UPDATE reservations
            SET name = :name, res_date = :res_date, res_time = :res_time,
                people = :people, table_num = :table_num, items = :items,
                total_order = :total_order, status = :status
            WHERE id = :id
        ");
    } else {
        // Insert
        $stmt = $db->prepare("
            INSERT INTO reservations
                (id, name, res_date, res_time, people, table_num, items, total_order, status, created_at)
            VALUES
                (:id, :name, :res_date, :res_time, :people, :table_num, :items, :total_order, :status, :created_at)
        ");
    }
    
    $params = [
        ':id'          => $data['id'],
        ':name'        => $data['name'],
        ':res_date'    => $data['date'],
        ':res_time'    => $data['time'],
        ':people'      => (int) $data['people'],
        ':table_num'   => $data['table']      ?? null,
        ':items'       => isset($data['items']) ? json_encode($data['items']) : null,
        ':total_order' => (float) ($data['totalOrder'] ?? 0),
        ':status'      => $data['status']     ?? 'Menunggu',
    ];
    
    if (!$exists) {
        // Handle ISO date format in frontend to mysql datetime format
        $createdAt = date('Y-m-d H:i:s');
        if (isset($data['createdAt'])) {
            $parsed = strtotime($data['createdAt']);
            if ($parsed !== false) {
                $createdAt = date('Y-m-d H:i:s', $parsed);
            }
        }
        $params[':created_at'] = $createdAt;
    }
    
    $stmt->execute($params);
    
    echo json_encode([
        'success' => true,
        'message' => 'Reservasi berhasil disimpan.',
        'id'      => $data['id']
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal menyimpan reservasi: ' . $e->getMessage()
    ]);
}
