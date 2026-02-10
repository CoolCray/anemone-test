<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create HO user
        User::create([
            'name' => 'Head Office Admin',
            'email' => 'ho@example.com',
            'password' => bcrypt('password'),
            'role' => 'ho',
        ]);

        // Create Outlet users
        User::create([
            'name' => 'Outlet Bali',
            'email' => 'outlet1@example.com',
            'password' => bcrypt('password'),
            'role' => 'outlet',
        ]);

        User::create([
            'name' => 'Outlet Denpasar',
            'email' => 'outlet2@example.com',
            'password' => bcrypt('password'),
            'role' => 'outlet',
        ]);

        // Create sample products
        $products = [
            ['name' => 'Nasi Goreng Special', 'price' => 25000, 'stock' => 100],
            ['name' => 'Mie Ayam Bakso', 'price' => 20000, 'stock' => 150],
            ['name' => 'Ayam Geprek', 'price' => 22000, 'stock' => 80],
            ['name' => 'Soto Ayam', 'price' => 18000, 'stock' => 120],
            ['name' => 'Ikan Bakar', 'price' => 15000, 'stock' => 90],
            ['name' => 'Es Teh Manis', 'price' => 5000, 'stock' => 200],
            ['name' => 'Es Jeruk', 'price' => 7000, 'stock' => 180],
            ['name' => 'Kopi Susu', 'price' => 12000, 'stock' => 150],
            ['name' => 'Jus Alpukat', 'price' => 15000, 'stock' => 100],
            ['name' => 'Pisang Goreng', 'price' => 10000, 'stock' => 75],
        ];

        foreach ($products as $product) {
            \App\Models\Product::create($product);
        }
    }
}
