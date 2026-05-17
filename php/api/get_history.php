<?php
// ============================================================
//  FreshPOS – API: Dapatkan Riwayat (Transaksi & Reservasi)
//  Endpoint: GET /api/get_history.php
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
    
    // 1. Ambil semua transaksi
    $transQuery = $db->query("SELECT * FROM transactions ORDER BY id ASC");
    $transactions = $transQuery->fetchAll();
    
    // Ambil semua item transaksi
    $itemsQuery = $db->query("SELECT * FROM transaction_items ORDER BY transaction_id ASC, id ASC");
    $allItems = $itemsQuery->fetchAll();
    
    // Kelompokkan item transaksi berdasarkan transaction_id
    $groupedItems = [];
    foreach ($allItems as $item) {
        $tid = $item['transaction_id'];
        if (!isset($groupedItems[$tid])) {
            $groupedItems[$tid] = [];
        }
        $groupedItems[$tid][] = [
            'id'    => $item['product_id'],
            'name'  => $item['product_name'],
            'price' => (float)$item['price'],
            'qty'   => (int)$item['qty']
        ];
    }
    
    // Format transaksi untuk frontend
    $formattedTransactions = [];
    foreach ($transactions as $t) {
        $tid = $t['id'];
        // Parse time to ISO format (WIB UTC+7) or generic UTC
        $timestamp = date('c', strtotime($t['created_at']));
        
        $formattedTransactions[] = [
            'order_code'     => $t['order_code'],
            'kasir'          => $t['kasir'],
            'payment_method' => $t['payment_method'],
            'subtotal'       => (float)$t['subtotal'],
            'tax'            => (float)$t['tax'],
            'total'          => (float)$t['total'],
            'timestamp'      => $timestamp,
            'items'          => $groupedItems[$tid] ?? []
        ];
    }
    
    // 2. Ambil semua reservasi
    $resQuery = $db->query("SELECT * FROM reservations ORDER BY created_at ASC");
    $reservations = $resQuery->fetchAll();
    
    // Format reservasi untuk frontend
    $formattedReservations = [];
    foreach ($reservations as $r) {
        $createdAt = date('c', strtotime($r['created_at']));
        $itemsDecoded = null;
        if (!empty($r['items'])) {
            $itemsDecoded = json_decode($r['items'], true);
        }
        
        $formattedReservations[] = [
            'id'         => $r['id'],
            'name'       => $r['name'],
            'date'       => $r['res_date'],
            'time'       => substr($r['res_time'], 0, 5), // '12:00:00' -> '12:00'
            'people'     => (int)$r['people'],
            'table'      => $r['table_num'],
            'items'      => $itemsDecoded ?? [],
            'totalOrder' => (float)$r['total_order'],
            'status'     => $r['status'],
            'createdAt'  => $createdAt
        ];
    }
    
    echo json_encode([
        'success'      => true,
        'transactions' => $formattedTransactions,
        'reservations' => $formattedReservations
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal mengambil riwayat: ' . $e->getMessage()
    ]);
}
