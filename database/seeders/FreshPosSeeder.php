<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class FreshPosSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['id' => 'all',     'name' => 'Semua Menu',   'icon' => 'fa-table-cells-large'],
            ['id' => 'makanan', 'name' => 'Makanan',       'icon' => 'fa-burger'],
            ['id' => 'minuman', 'name' => 'Minuman',       'icon' => 'fa-mug-hot'],
            ['id' => 'snack',   'name' => 'Snack',         'icon' => 'fa-cookie'],
            ['id' => 'dessert', 'name' => 'Dessert',       'icon' => 'fa-ice-cream'],
            ['id' => 'paket',   'name' => 'Paket Hemat',   'icon' => 'fa-box-open']
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['id' => $cat['id']], $cat);
        }

        $products = [
            // Makanan
            ['id' => 'p1',  'name' => 'Salad Sayur Organik',   'price' => 35000, 'category' => 'makanan', 'image' => 'assets/image.png',              'stock' => 12],
            ['id' => 'p2',  'name' => 'Ayam Panggang Diet',    'price' => 45000, 'category' => 'makanan', 'image' => 'assets/image copy.png',         'stock' => 8],
            ['id' => 'p7',  'name' => 'Quinoa Bowl Berserat',  'price' => 50000, 'category' => 'makanan', 'image' => 'assets/image copy 6.png',       'stock' => 5],
            ['id' => 'p10', 'name' => 'Sandwich Telur',        'price' => 32000, 'category' => 'makanan', 'image' => 'assets/image copy 9.png',       'stock' => 15],
            ['id' => 'p11', 'name' => 'Nasi Goreng Spesial',   'price' => 30000, 'category' => 'makanan', 'image' => 'assets/image copy 10.png',      'stock' => 10],
            ['id' => 'p12', 'name' => 'Mie Goreng Pedas',      'price' => 28000, 'category' => 'makanan', 'image' => 'assets/image copy 11.png',      'stock' => 0],
            ['id' => 'p13', 'name' => 'Gado-Gado Segar',       'price' => 25000, 'category' => 'makanan', 'image' => 'assets/image copy 12.png',      'stock' => 20],
            ['id' => 'p14', 'name' => 'Soto Ayam Kuning',      'price' => 27000, 'category' => 'makanan', 'image' => 'assets/image copy 13.png',      'stock' => 12],

            // Minuman
            ['id' => 'p3',  'name' => 'Jus Alpukat Murni',     'price' => 25000, 'category' => 'minuman', 'image' => 'assets/image copy 2.png',       'stock' => 10],
            ['id' => 'p4',  'name' => 'Kopi Susu Gula Aren',   'price' => 20000, 'category' => 'minuman', 'image' => 'assets/image copy 3.png',       'stock' => 25],
            ['id' => 'p6',  'name' => 'Mix Berry Smoothie',    'price' => 30000, 'category' => 'minuman', 'image' => 'assets/image copy 5.png',       'stock' => 7],
            ['id' => 'p8',  'name' => 'Matcha Latte',          'price' => 28000, 'category' => 'minuman', 'image' => 'assets/image copy 7.png',       'stock' => 12],
            ['id' => 'p15', 'name' => 'Es Teh Manis',          'price' => 8000,  'category' => 'minuman', 'image' => 'assets/image copy 14.png',      'stock' => 50],
            ['id' => 'p16', 'name' => 'Susu Regal Premium',    'price' => 5000,  'category' => 'minuman', 'image' => 'assets/image copy 15.png',      'stock' => 18],
            ['id' => 'p17', 'name' => 'Jus Jeruk Segar',       'price' => 18000, 'category' => 'minuman', 'image' => 'assets/image copy 16.png',      'stock' => 15],
            ['id' => 'p18', 'name' => 'Lemon Tea Dingin',      'price' => 15000, 'category' => 'minuman', 'image' => 'assets/image copy 17.png',      'stock' => 20],

            // Snack
            ['id' => 'p5',  'name' => 'Keripik Kentang',       'price' => 15000, 'category' => 'snack',   'image' => 'assets/image copy 4.png',       'stock' => 30],
            ['id' => 'p9',  'name' => 'Soft Cookies',          'price' => 20000, 'category' => 'snack',   'image' => 'assets/image copy 8.png',       'stock' => 12],
            ['id' => 'p19', 'name' => 'Donat Coklat',          'price' => 12000, 'category' => 'snack',   'image' => 'assets/image copy 18.png',      'stock' => 25],
            ['id' => 'p20', 'name' => 'Pisang Goreng Crispy',  'price' => 10000, 'category' => 'snack',   'image' => 'assets/image copy 19.png',      'stock' => 0],
            ['id' => 'p21', 'name' => 'Roti Bakar Selai',      'price' => 14000, 'category' => 'snack',   'image' => 'assets/image copy 20.png',      'stock' => 15],
            ['id' => 'p22', 'name' => 'Dimsum Mentai',         'price' => 10000, 'category' => 'snack',   'image' => 'assets/image copy 21.png',      'stock' => 10],

            // Dessert
            ['id' => 'p23', 'name' => 'Es Krim Vanilla',       'price' => 18000, 'category' => 'dessert', 'image' => 'assets/image copy 22.png',      'stock' => 12],
            ['id' => 'p24', 'name' => 'Puding Caramel',        'price' => 12000, 'category' => 'dessert', 'image' => 'assets/image copy 23.png',      'stock' => 15],
            ['id' => 'p25', 'name' => 'Brownies Panggang',     'price' => 22000, 'category' => 'dessert', 'image' => 'assets/image copy 24.png',      'stock' => 8],
            ['id' => 'p26', 'name' => 'Boba Matcha',           'price' => 25000, 'category' => 'dessert', 'image' => 'assets/image copy 25.png',      'stock' => 10],
            ['id' => 'p27', 'name' => 'Crepe Strawberry',      'price' => 20000, 'category' => 'dessert', 'image' => 'assets/image copy 26.png',      'stock' => 0],

            // Paket Hemat
            ['id' => 'p28', 'name' => 'Paket Makan Siang',       'price' => 55000,  'category' => 'paket', 'image' => 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png',  'stock' => 10],
            ['id' => 'p29', 'name' => 'Paket Sarapan Sehat',     'price' => 40000,  'category' => 'paket', 'image' => 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png',  'stock' => 10],
            ['id' => 'p30', 'name' => 'Paket Dinner Romantis',   'price' => 95000,  'category' => 'paket', 'image' => 'assets/Cokelat Krem Modern Kreatif Menu Burger Brosur Produk.png',     'stock' => 5],
            ['id' => 'p31', 'name' => 'Paket Keluarga Lengkap',  'price' => 120000, 'category' => 'paket', 'image' => 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png',  'stock' => 3],
            ['id' => 'p32', 'name' => 'Paket Buka Puasa',        'price' => 75000,  'category' => 'paket', 'image' => 'assets/Hijau dan Putih Minimal Geometric Warung Menu Landscape.png',  'stock' => 8],
            ['id' => 'p33', 'name' => 'Paket Meeting Snack Box', 'price' => 65000,  'category' => 'paket', 'image' => 'assets/Krem Minimalis Menu Restoran.png',                             'stock' => 12]
        ];

        foreach ($products as $prod) {
            Product::updateOrCreate(['id' => $prod['id']], $prod);
        }
    }
}
