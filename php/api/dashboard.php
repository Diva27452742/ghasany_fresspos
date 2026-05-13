<?php
session_start();
require_once '../config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$pdo = getDB();

try {
    // 1. Total Transactions Today
    $stmt = $pdo->query("SELECT COUNT(*) as total_today, COALESCE(SUM(total), 0) as revenue_today FROM transactions WHERE DATE(created_at) = CURDATE()");
    $todayStats = $stmt->fetch();

    // 2. Best-Selling Products (Top 5)
    $stmt = $pdo->query("
        SELECT product_name, SUM(qty) as total_sold
        FROM transaction_items ti
        JOIN transactions t ON ti.transaction_id = t.id
        WHERE t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY product_id, product_name
        ORDER BY total_sold DESC
        LIMIT 5
    ");
    $topProducts = $stmt->fetchAll();

    // 3. Weekly Sales Chart Data (Last 7 days)
    $stmt = $pdo->query("
        SELECT DATE(created_at) as date, COALESCE(SUM(total), 0) as daily_total
        FROM transactions
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) ASC
    ");
    $weeklySales = $stmt->fetchAll();

    // 4. Customer Stats (Total members)
    $stmt = $pdo->query("SELECT COUNT(*) as total_customers FROM customers WHERE id != 1"); // Exclude 'Umum'
    $customerStats = $stmt->fetch();

    echo json_encode([
        'success' => true,
        'todayStats' => $todayStats,
        'topProducts' => $topProducts,
        'weeklySales' => $weeklySales,
        'customerStats' => $customerStats
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
