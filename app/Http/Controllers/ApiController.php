<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Member;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class ApiController extends Controller
{
    // GET /api/categories
    public function getCategories()
    {
        try {
            $categories = Category::all();
            return response()->json([
                'success'    => true,
                'categories' => $categories
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data kategori: ' . $e->getMessage()
            ], 500);
        }
    }

    // POST /api/categories/save
    public function saveCategory(Request $request)
    {
        $id   = trim($request->input('id', ''));
        $name = trim($request->input('name', ''));
        $icon = trim($request->input('icon', 'fa-utensils'));

        if (empty($name)) {
            return response()->json([
                'success' => false,
                'message' => 'Nama kategori wajib diisi.'
            ], 422);
        }

        try {
            if (empty($id)) {
                $cleanSlug = strtolower(trim(preg_replace('/[^a-zA-Z0-9]+/', '_', $name), '_'));
                $id = $cleanSlug ?: ('cat_' . rand(100, 999));
            }

            $category = Category::updateOrCreate(
                ['id' => $id],
                ['name' => $name, 'icon' => $icon]
            );

            return response()->json([
                'success'  => true,
                'message'  => 'Kategori berhasil disimpan.',
                'category' => $category
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan kategori: ' . $e->getMessage()
            ], 500);
        }
    }

    // POST /api/categories/delete
    public function deleteCategory(Request $request)
    {
        $id = $request->input('id');
        if (!$id || $id === 'all') {
            return response()->json([
                'success' => false,
                'message' => 'Kategori utama tidak dapat dihapus.'
            ], 422);
        }

        try {
            Category::where('id', $id)->delete();
            return response()->json([
                'success' => true,
                'message' => 'Kategori berhasil dihapus.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus kategori: ' . $e->getMessage()
            ], 500);
        }
    }
    // GET /api/products (get_products.php)
    public function getProducts()
    {
        try {
            $products = Product::orderBy('category')->orderBy('name')->get();
            return response()->json([
                'success'  => true,
                'products' => $products
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data produk: ' . $e->getMessage()
            ], 500);
        }
    }

    // POST /api/checkout (checkout.php)
    public function checkout(Request $request)
    {
        $data = $request->all();

        if (empty($data['order_code']) || empty($data['kasir']) || empty($data['items'])) {
            return response()->json([
                'success' => false,
                'message' => 'Field transaksi wajib diisi.'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $transaction = Transaction::create([
                'order_code'     => $data['order_code'],
                'kasir'          => $data['kasir'],
                'payment_method' => $data['payment_method'] ?? 'Tunai',
                'order_type'     => $data['order_type'] ?? 'Dine In',
                'customer_name'  => $data['customer_name'] ?? null,
                'table_seat'     => $data['table_seat'] ?? null,
                'subtotal'       => (float)($data['subtotal'] ?? 0),
                'tax'            => (float)($data['tax'] ?? 0),
                'total'          => (float)($data['total'] ?? 0),
            ]);

            foreach ($data['items'] as $item) {
                $qty = (int)($item['qty'] ?? 1);
                $productId = $item['id'] ?? '';

                $product = Product::find($productId);
                if ($product) {
                    if ($product->stock < $qty) {
                        throw new Exception("Stok untuk produk " . ($item['name'] ?? $productId) . " tidak mencukupi.");
                    }
                    $product->decrement('stock', $qty);
                }

                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id'     => $productId,
                    'product_name'   => $item['name'] ?? '',
                    'price'          => (float)($item['price'] ?? 0),
                    'qty'            => $qty,
                    'subtotal'       => (float)($item['price'] ?? 0) * $qty,
                ]);
            }

            DB::commit();

            return response()->json([
                'success'        => true,
                'message'        => 'Transaksi berhasil disimpan.',
                'transaction_id' => $transaction->id,
                'order_code'     => $data['order_code'],
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan transaksi: ' . $e->getMessage()
            ], 500);
        }
    }

    // GET /api/members (get_members.php)
    public function getMembers()
    {
        try {
            $members = Member::orderBy('id', 'desc')->get();
            return response()->json([
                'success' => true,
                'members' => $members,
                'data'    => $members
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data member: ' . $e->getMessage()
            ], 500);
        }
    }

    // POST /api/members/save (save_member.php)
    public function saveMember(Request $request)
    {
        $id = $request->input('id');
        $name = trim($request->input('name', ''));

        if (empty($name)) {
            return response()->json([
                'success' => false,
                'message' => 'Nama member wajib diisi.'
            ], 422);
        }

        try {
            $data = [
                'name'            => $name,
                'verified'        => (bool)$request->input('verified', false),
                'discount_pct'    => (int)$request->input('discount_pct', 0),
                'discount_status' => $request->input('discount_status', 'Aktif'),
                'notes'           => $request->input('notes', ''),
            ];

            if ($id) {
                $member = Member::findOrFail($id);
                $member->update($data);
            } else {
                $member = Member::create($data);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data member berhasil disimpan.',
                'member'  => $member
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data member: ' . $e->getMessage()
            ], 500);
        }
    }

    // POST /api/members/delete (delete_member.php)
    public function deleteMember(Request $request)
    {
        $id = $request->input('id');
        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'ID member wajib diisi.'
            ], 422);
        }

        try {
            Member::where('id', $id)->delete();
            return response()->json([
                'success' => true,
                'message' => 'Member berhasil dihapus.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus member: ' . $e->getMessage()
            ], 500);
        }
    }

    // GET /api/history (get_history.php)
    public function getHistory()
    {
        try {
            $transactions = Transaction::with('items')->orderBy('id', 'desc')->get()->map(function ($t) {
                return [
                    'id'             => $t->id,
                    'order_code'     => $t->order_code,
                    'kasir'          => $t->kasir,
                    'payment_method' => $t->payment_method,
                    'order_type'     => $t->order_type ?? 'Dine In',
                    'customer_name'  => $t->customer_name ?? '-',
                    'table_seat'     => $t->table_seat ?? '-',
                    'subtotal'       => (float)$t->subtotal,
                    'tax'            => (float)$t->tax,
                    'total'          => (float)$t->total,
                    'timestamp'      => $t->created_at ? $t->created_at->toISOString() : now()->toISOString(),
                    'created_at'     => $t->created_at ? $t->created_at->toDateTimeString() : now()->toDateTimeString(),
                    'items'          => $t->items
                ];
            });

            $reservations = Reservation::orderBy('id', 'desc')->get()->map(function ($r) {
                return [
                    'id'          => $r->id,
                    'name'        => $r->name,
                    'res_date'    => $r->res_date,
                    'res_time'    => $r->res_time,
                    'people'      => $r->people,
                    'table_num'   => $r->table_num,
                    'items'       => $r->items,
                    'totalOrder'  => (float)$r->total_order,
                    'total_order' => (float)$r->total_order,
                    'status'      => $r->status,
                    'createdAt'   => $r->created_at ? $r->created_at->toISOString() : now()->toISOString(),
                    'created_at'  => $r->created_at ? $r->created_at->toDateTimeString() : now()->toDateTimeString(),
                ];
            });

            return response()->json([
                'success'      => true,
                'transactions' => $transactions,
                'reservations' => $reservations
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil riwayat transaksi: ' . $e->getMessage()
            ], 500);
        }
    }

    // POST /api/history/clear (clear_history.php)
    public function clearHistory()
    {
        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        } catch (Exception $e) {}

        try {
            TransactionItem::truncate();
            Transaction::truncate();

            try {
                DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            } catch (Exception $e) {}

            return response()->json([
                'success' => true,
                'message' => 'Seluruh riwayat transaksi berhasil dihapus.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus riwayat: ' . $e->getMessage()
            ], 500);
        }
    }

    // POST /api/reservations/save (save_reservation.php)
    public function saveReservation(Request $request)
    {
        $id        = $request->input('id');
        $name      = trim($request->input('name', ''));
        $resDate   = $request->input('res_date');
        $resTime   = $request->input('res_time');
        $people    = (int)$request->input('people', 1);

        if (empty($name) || empty($resDate) || empty($resTime)) {
            return response()->json([
                'success' => false,
                'message' => 'Nama, tanggal, dan jam reservasi wajib diisi.'
            ], 422);
        }

        try {
            $data = [
                'name'        => $name,
                'res_date'    => $resDate,
                'res_time'    => $resTime,
                'people'      => $people,
                'table_num'   => $request->input('table_num', '-'),
                'items'       => $request->input('items', []),
                'total_order' => (float)$request->input('total_order', 0),
                'status'      => $request->input('status', 'Menunggu'),
            ];

            if ($id) {
                $reservation = Reservation::find($id);
                if ($reservation) {
                    $reservation->update($data);
                } else {
                    $data['id'] = $id;
                    $reservation = Reservation::create($data);
                }
            } else {
                $data['id'] = 'res_' . time() . '_' . rand(100, 999);
                $reservation = Reservation::create($data);
            }

            return response()->json([
                'success'     => true,
                'message'     => 'Reservasi berhasil disimpan.',
                'reservation' => $reservation
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan reservasi: ' . $e->getMessage()
            ], 500);
        }
    }

    // POST /api/reservations/update-status (update_reservation_status.php)
    public function updateReservationStatus(Request $request)
    {
        $id     = $request->input('id');
        $status = $request->input('status');

        if (!$id || !$status) {
            return response()->json([
                'success' => false,
                'message' => 'ID dan status wajib diisi.'
            ], 422);
        }

        try {
            $res = Reservation::findOrFail($id);
            $res->update(['status' => $status]);

            return response()->json([
                'success' => true,
                'message' => 'Status reservasi berhasil diperbarui.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status reservasi: ' . $e->getMessage()
            ], 500);
        }
    }

    // POST /api/products/save
    public function saveProduct(Request $request)
    {
        $id       = $request->input('id');
        $name     = trim($request->input('name', ''));
        $price    = (float)$request->input('price', 0);
        $category = $request->input('category', 'makanan');
        $image    = trim($request->input('image', 'assets/image.png'));
        $stock    = (int)$request->input('stock', 0);

        if (empty($name) || $price < 0) {
            return response()->json([
                'success' => false,
                'message' => 'Nama produk dan harga yang valid wajib diisi.'
            ], 422);
        }

        try {
            $data = [
                'name'     => $name,
                'price'    => $price,
                'category' => $category,
                'image'    => empty($image) ? 'assets/image.png' : $image,
                'stock'    => max(0, $stock),
            ];

            if ($id) {
                $product = Product::find($id);
                if ($product) {
                    $product->update($data);
                } else {
                    $data['id'] = $id;
                    $product = Product::create($data);
                }
            } else {
                $data['id'] = 'p_' . time() . '_' . rand(10, 99);
                $product = Product::create($data);
            }

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil disimpan.',
                'product' => $product
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan produk: ' . $e->getMessage()
            ], 500);
        }
    }

    // POST /api/products/delete
    public function deleteProduct(Request $request)
    {
        $id = $request->input('id');
        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'ID produk wajib diisi.'
            ], 422);
        }

        try {
            Product::where('id', $id)->delete();
            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil dihapus.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus produk: ' . $e->getMessage()
            ], 500);
        }
    }

    // POST /api/stock/update (update_stock.php)
    public function updateStock(Request $request)
    {
        $updates = $request->input('updates', $request->all());

        if (!is_array($updates)) {
            return response()->json([
                'success' => false,
                'message' => 'Format data updates tidak valid.'
            ], 422);
        }

        try {
            DB::beginTransaction();

            foreach ($updates as $up) {
                if (is_array($up)) {
                    $productId = $up['id'] ?? null;
                    $stock     = isset($up['stock']) ? (int)$up['stock'] : null;

                    if ($productId !== null && $stock !== null) {
                        Product::where('id', $productId)->update(['stock' => max(0, $stock)]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Stok produk berhasil diperbarui.'
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui stok: ' . $e->getMessage()
            ], 500);
        }
    }
}
