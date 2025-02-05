"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { FaTruck } from "react-icons/fa";

async function fetchProducts() {
  const { data: products, error } = await supabase.from("Products").select("*");
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return products || [];
}

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const addToCart = (product: any) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <div className="bg-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-lg text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">
            <Link href="/">MoonStar Food LLC</Link>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li>
                <Link href="/cart">
                  <FaTruck size={24} className="inline-block" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Product List */}
      <main className="p-10">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow-md bg-white">
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              <Image
                src={`/${product.image}`}
                alt={product.name}
                width={150}
                height={200}
                className="object-cover rounded-md mb-2"
              />
              <p className="mb-2">{product.description}</p>
              <button
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => addToCart(product)}
              >
                Add to Order
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}