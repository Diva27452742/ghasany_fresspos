<?php
session_start();
require_once '../config.php';

header('Content-Type: application/json');
$pdo = getDB();
$action = $_GET['action'] ?? 'read';

try {
    if ($action === 'read') {
        $stmt = $pdo->query("SELECT * FROM customers ORDER BY name ASC");
        $customers = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $customers]);
    } elseif ($action === 'create' || $action === 'update') {
        if (!isset($_SESSION['user_id'])) throw new Exception("Unauthorized");
        
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'] ?? '';
        $phone = $data['phone'] ?? '';
        $points = $data['points'] ?? 0;
        
        if ($action === 'create') {
            $stmt = $pdo->prepare("INSERT INTO customers (name, phone, points) VALUES (?, ?, ?)");
            $stmt->execute([$name, $phone, $points]);
        } else {
            $id = $data['id'] ?? 0;
            $stmt = $pdo->prepare("UPDATE customers SET name = ?, phone = ?, points = ? WHERE id = ?");
            $stmt->execute([$name, $phone, $points, $id]);
        }
        echo json_encode(['success' => true]);
    } elseif ($action === 'delete') {
        if (!isset($_SESSION['user_id'])) throw new Exception("Unauthorized");
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        if ($id == 1) throw new Exception("Cannot delete default customer");
        $stmt = $pdo->prepare("DELETE FROM customers WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
