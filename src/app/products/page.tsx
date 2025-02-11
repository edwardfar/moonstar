"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import Image from "next/image";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../CartContext";
import Header from "../components/header"; // ✅ Use unified Header

type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  retail_price: number;
  wholesale_price: number;
  distributor_price: number;
  category: string;
  tags: string[];
  barcode: string;
  stripe_price_id: string; // ✅ Added Stripe Price ID
};

export default function ProductPage() {
  const { user } = useAuth();
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      const uniqueCategories = [...new Set(data.map((p) => p.category))];
      const uniqueTags = [...new Set(data.flatMap((p) => p.tags))];
      setCategories(uniqueCategories);
      setTags(uniqueTags);
    });
  }, []);

  const fetchProducts = async (): Promise<Product[]> => {
    const { data: products, error } = await supabase.from("Products").select("*");
    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }
    return products || [];
  };

  const filterProducts = () => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (selectedTag) {
      filtered = filtered.filter((p) => p.tags.includes(selectedTag));
    }
    return filtered;
  };

  const getPrice = (product: Product) => {
    if (!user) return `$${product.retail_price.toFixed(2)}`;
    if (user.role === "retail") return `$${product.retail_price.toFixed(2)}`;
    if (user.role === "wholesale") return `$${product.wholesale_price.toFixed(2)}`;
    if (user.role === "distributor") return `$${product.distributor_price.toFixed(2)}`;
    return `$${product.retail_price.toFixed(2)}`;
  };

  const handleQuantityChange = (productId: number, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) + change, 0),
    }));
  };

  return (
    <div className="bg-gray-100 text-gray-900 font-sans min-h-screen flex flex-col">
      {/* ✅ Use Unified Header */}
      <Header />

      {/* Filters */}
      <div className="p-4">
        <div className="flex gap-4">
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedTag || ""}
            onChange={(e) => setSelectedTag(e.target.value || null)}
            className="p-2 border rounded"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List */}
      <main className="p-10 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterProducts().map((product) => {
            const quantity = quantities[product.id] || 0;

            return (
              <div key={product.id} className="border p-4 rounded shadow-md bg-white">
                <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                <Image
                  src={product.image ? `/${product.image}` : "/placeholder.png"}
                  alt={product.name}
                  width={150}
                  height={200}
                  className="object-cover rounded-md mb-2"
                />
                <p className="mb-2">{product.description}</p>
                <p className="mb-2 text-sm text-gray-600">Barcode: {product.barcode}</p>
                <p className="text-green-600 font-bold">Price: {getPrice(product)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="bg-gray-300 px-2 py-1 rounded"
                    onClick={() => handleQuantityChange(product.id, -1)}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    className="bg-gray-300 px-2 py-1 rounded"
                    onClick={() => handleQuantityChange(product.id, 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: parseFloat(getPrice(product).slice(1)),
                      image: product.image,
                      quantity: quantity || 1,
                      stripe_price_id: product.stripe_price_id, // ✅ Fixed missing property
                    })
                  }
                >
                  Add to Order
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>© 2025 MoonStar Food LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
