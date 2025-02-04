"use client";

import { supabase } from "../../lib/supabase";
import Link from "next/link";
import Image from "next/image";

async function fetchProducts() {
  const { data: products, error } = await supabase.from("Products").select("*");
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return products || [];
}

export default async function Home() {
  const products = await fetchProducts();

  return (
    <div className="bg-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-lg text-white">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image src="/products/MoonStar logo.jpg" alt="MoonStar Food LLC" width={50} height={50} priority />
            <h1 className="text-3xl font-bold">MoonStar Food LLC</h1>
          </div>
          <ul className="flex space-x-6 text-lg">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/auth/signup">Sign Up</Link>
            </li>
            <li>
              <Link href="/auth/login">Login</Link>
            </li>
            <li className="relative group">
              <span className="cursor-pointer">Products</span>
              <ul className="absolute hidden group-hover:block bg-white text-gray-800 shadow-md mt-2">
                <li>
                  <Link href="/products/fmcg" className="block px-4 py-2 hover:bg-gray-200">
                    FMCG
                  </Link>
                </li>
                <li>
                  <Link href="/products/candytoys" className="block px-4 py-2 hover:bg-gray-200">
                    Candy Toys
                  </Link>
                </li>
                <li>
                  <Link href="/products/joyful" className="block px-4 py-2 hover:bg-gray-200">
                    Joyful
                  </Link>
                </li>
                <li>
                  <Link href="/products/lezzet" className="block px-4 py-2 hover:bg-gray-200">
                    Lezzet
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Products List */}
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <ul>
          {products.map((product) => (
            <li key={product.id} className="border p-4 mb-4 rounded">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <img
                src={`/${product.image}`}
                alt={product.name}
                className="w-32 h-40 object-cover rounded-md mb-2"
              />
              <p>{product.description}</p>
              <p>Retail Price: ${product.retail_price}</p>
              <p>Wholesale Price: ${product.wholesale_price}</p>
              <p>Distributor Price: ${product.distributor_price}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
