<?php
session_start();
require_once '../config.php';

header('Content-Type: application/json');
$pdo = getDB();

$filter = $_GET['filter'] ?? 'all';
$dateCondition = "";

if ($filter === 'today') {
    $dateCondition = "WHERE DATE(t.created_at) = CURDATE()";
} elseif ($filter === 'yesterday') {
    $dateCondition = "WHERE DATE(t.created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";
} elseif ($filter === 'twodaysago') {
    $dateCondition = "WHERE DATE(t.created_at) = DATE_SUB(CURDATE(), INTERVAL 2 DAY)";
}

try {
    $query = "
        SELECT t.*, u.name as user_name, c.name as customer_name 
        FROM transactions t
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN customers c ON t.customer_id = c.id
        $dateCondition
        ORDER BY t.created_at DESC
    ";
    
    $stmt = $pdo->query($query);
    $transactions = $stmt->fetchAll();

    // Fetch items for each transaction (for simplicity, we do it in a loop, but could be grouped)
    $stmtItems = $pdo->prepare("SELECT * FROM transaction_items WHERE transaction_id = ?");
    
    foreach ($transactions as &$tr) {
        $stmtItems->execute([$tr['id']]);
        $tr['items'] = $stmtItems->fetchAll();
    }

    echo json_encode(['success' => true, 'data' => $transactions]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
