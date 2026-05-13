<?php
session_start();
require_once '../config.php';

header('Content-Type: application/json');

$pdo = getDB();
$action = $_GET['action'] ?? 'read';

try {
    if ($action === 'read') {
        $stmt = $pdo->query("SELECT * FROM products");
        $products = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $products]);
    } elseif ($action === 'categories') {
        $stmt = $pdo->query("SELECT * FROM categories");
        $categories = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $categories]);
    } elseif ($action === 'create' || $action === 'update') {
        // Handle form data + file upload
        if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
            throw new Exception("Unauthorized. Admin only.");
        }

        $id = $_POST['id'] ?? uniqid('p_');
        $name = $_POST['name'] ?? '';
        $price = $_POST['price'] ?? 0;
        $category = $_POST['category'] ?? '';
        $stock = $_POST['stock'] ?? 0;
        $imagePath = $_POST['existing_image'] ?? 'assets/placeholder.png';

        // Image Upload Logic
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = '../../assets/'; // path relative to script
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            
            $fileInfo = pathinfo($_FILES['image']['name']);
            $extension = strtolower($fileInfo['extension']);
            $allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
            
            if (in_array($extension, $allowedExts)) {
                $newFileName = uniqid('img_') . '.' . $extension;
                $targetFile = $uploadDir . $newFileName;
                
                if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
                    $imagePath = 'assets/' . $newFileName;
                }
            }
        }

        if ($action === 'create') {
            $stmt = $pdo->prepare("INSERT INTO products (id, name, price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $name, $price, $category, $stock, $imagePath]);
        } else {
            $stmt = $pdo->prepare("UPDATE products SET name = ?, price = ?, category = ?, stock = ?, image = ? WHERE id = ?");
            $stmt->execute([$name, $price, $category, $stock, $imagePath, $id]);
        }

        echo json_encode(['success' => true, 'message' => 'Product saved successfully']);
    } elseif ($action === 'delete') {
        if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
            throw new Exception("Unauthorized. Admin only.");
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
