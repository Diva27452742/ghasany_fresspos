<?php
require_once __DIR__ . '/php/config.php';
$db = getDB();
$stmt = $db->query("SELECT * FROM transactions");
$transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(['count' => count($transactions), 'data' => $transactions]);
