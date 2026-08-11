<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class PosController extends Controller
{
    public function index()
    {
        $categoriesData = Category::all()->toArray();
        if (empty($categoriesData)) {
            $categoriesData = [
                ['id' => 'all',     'name' => 'Semua Menu',   'icon' => 'fa-table-cells-large'],
                ['id' => 'makanan', 'name' => 'Makanan',       'icon' => 'fa-burger'],
                ['id' => 'minuman', 'name' => 'Minuman',       'icon' => 'fa-mug-hot'],
                ['id' => 'snack',   'name' => 'Snack',         'icon' => 'fa-cookie'],
                ['id' => 'dessert', 'name' => 'Dessert',       'icon' => 'fa-ice-cream'],
                ['id' => 'paket',   'name' => 'Paket Hemat',   'icon' => 'fa-box-open']
            ];
        }

        $productsData = Product::all()->toArray();

        return view('pos', [
            'categoriesData' => $categoriesData,
            'productsData'   => $productsData,
            'dbActive'       => true,
        ]);
    }
}
