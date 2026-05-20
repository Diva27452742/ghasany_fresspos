<?php
// ============================================================
//  FreshPOS – API: Simpan / Perbarui Data Member
//  Endpoint: POST /api/save_member.php
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

try {
    // Ambil payload JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data || empty(trim($data['name']))) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Nama member wajib diisi!'
        ]);
        exit;
    }
    
    $db = getDB();
    
    $id = isset($data['id']) && $data['id'] !== '' ? (int)$data['id'] : null;
    $name = trim($data['name']);
    $verified = isset($data['verified']) ? (int)$data['verified'] : 0;
    $discount_pct = isset($data['discount_pct']) ? (int)$data['discount_pct'] : 0;
    $discount_status = isset($data['discount_status']) ? trim($data['discount_status']) : 'Aktif';
    $notes = isset($data['notes']) ? trim($data['notes']) : null;
    
    if ($id) {
        // Update member lama
        $stmt = $db->prepare("
            UPDATE members 
            SET name = :name, 
                verified = :verified, 
                discount_pct = :discount_pct, 
                discount_status = :discount_status, 
                notes = :notes 
            WHERE id = :id
        ");
        $stmt->execute([
            ':name'            => $name,
            ':verified'        => $verified,
            ':discount_pct'    => $discount_pct,
            ':discount_status' => $discount_status,
            ':notes'           => $notes,
            ':id'              => $id
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Data member berhasil diperbarui.'
        ]);
    } else {
        // Insert member baru
        $stmt = $db->prepare("
            INSERT INTO members (name, verified, discount_pct, discount_status, notes, created_at)
            VALUES (:name, :verified, :discount_pct, :discount_status, :notes, NOW())
        ");
        $stmt->execute([
            ':name'            => $name,
            ':verified'        => $verified,
            ':discount_pct'    => $discount_pct,
            ':discount_status' => $discount_status,
            ':notes'           => $notes
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Member baru berhasil ditambahkan.',
            'id'      => (int)$db->lastInsertId()
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal menyimpan data member: ' . $e->getMessage()
    ]);
}
