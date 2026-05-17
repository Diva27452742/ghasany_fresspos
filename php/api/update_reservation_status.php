<?php
// ============================================================
//  FreshPOS – API: Update Status Reservasi
//  Endpoint: POST /api/update_reservation_status.php
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

if (!isset($data['id']) || !isset($data['status'])) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => "Field 'id' dan 'status' wajib diisi."]);
    exit;
}

try {
    $db = getDB();
    $stmt = $db->prepare("UPDATE reservations SET status = :status WHERE id = :id");
    $stmt->execute([
        ':id'     => $data['id'],
        ':status' => $data['status']
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Status reservasi berhasil diupdate.',
        'id'      => $data['id'],
        'status'  => $data['status']
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal mengupdate status: ' . $e->getMessage()
    ]);
}
