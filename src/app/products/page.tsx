"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../auth/AuthContext";
import PrivateHeader from "../headers/privateheader";
import PublicHeader from "../headers/publicheader";

async function fetchProducts() {
  const { data: products, error } = await supabase.from("Products").select("*");
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return products || [];
}

export default function ProductPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const addToCart = (product: any) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} added to your order!`);
  };

  const getPrice = (product: any) => {
    if (!user) return "Contact Us"; // For non-logged-in users
    if (user.role === "retail") return `$${product.retail_price.toFixed(2)}`;
    if (user.role === "wholesale") return `$${product.wholesale_price.toFixed(2)}`;
    if (user.role === "distributor") return `$${product.distributor_price.toFixed(2)}`;
    return "Contact Us"; // Fallback for undefined roles
  };

  const handleLogout = async () => {
    console.log("Logged out");
    return Promise.resolve(); // Dummy logout implementation
  };

  return (
    <div className="bg-gray-100 text-gray-900 font-sans">
      {/* Header */}
      {user ? (
        <PrivateHeader handleLogout={handleLogout} cartCount={cart.length} />
      ) : (
        <PublicHeader />
      )}

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
              <p className="text-green-600 font-bold">Price: {getPrice(product)}</p>
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
