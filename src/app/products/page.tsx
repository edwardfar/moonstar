"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase"; // Adjusted path
import Link from "next/link";
import Image from "next/image";
import { FaTruck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import PublicHeader from "../publicheader"; // Ensure path to PublicHeader is correct
import PrivateHeader from "../privateheader"; // Ensure path to PrivateHeader is correct

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
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState(null); // User state for authentication check
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedTag, setSelectedTag] = useState("All Tags");
  const router = useRouter();

  useEffect(() => {
    // Fetch products on component mount
    fetchProducts().then((fetchedProducts) => {
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    });

    // Check if the user is logged in
    const checkUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setUser(sessionData?.session?.user || null);
    };
    checkUser();
  }, []);

  const addToCart = (product: any) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  useEffect(() => {
    // Filter products based on selected category and tag
    const filtered = products.filter(
      (product) =>
        (selectedCategory === "All Categories" ||
          product.category === selectedCategory) &&
        (selectedTag === "All Tags" || product.tag === selectedTag)
    );
    setFilteredProducts(filtered);
  }, [selectedCategory, selectedTag, products]);

  return (
    <div className="bg-gray-100 text-gray-900 font-sans">
      {/* Header */}
      {user ? <PrivateHeader /> : <PublicHeader />}

      {/* Filters */}
      <div className="p-4 flex justify-between items-center bg-white shadow">
        <select
          className="p-2 border rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>All Categories</option>
          {Array.from(new Set(products.map((product) => product.category))).map(
            (category) => (
              <option key={category}>{category}</option>
            )
          )}
        </select>
        <select
          className="p-2 border rounded"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option>All Tags</option>
          {Array.from(new Set(products.map((product) => product.tag))).map(
            (tag) => (
              <option key={tag}>{tag}</option>
            )
          )}
        </select>
      </div>

      {/* Products List */}
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded shadow-md bg-white"
            >
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              <Image
                src={`/${product.image}`}
                alt={product.name}
                width={150}
                height={200}
                className="object-cover rounded-md mb-2"
              />
              <p className="mb-2">{product.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                Category: {product.category}
              </p>
              <p className="text-sm text-gray-500 mb-4">Tag: {product.tag}</p>
              {user ? (
                <>
                  <p className="text-green-600 font-bold">
                    Retail Price: ${product.retail_price}
                  </p>
                  <p className="text-blue-600 font-bold">
                    Wholesale Price: ${product.wholesale_price}
                  </p>
                  <p className="text-red-600 font-bold">
                    Distributor Price: ${product.distributor_price}
                  </p>
                </>
              ) : (
                <p
                  className="text-blue-500 underline cursor-pointer"
                  onClick={() => router.push("/auth/login")}
                >
                  Login to see prices
                </p>
              )}
              <button
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => addToCart(product)}
              >
                Add to Order
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-6">
        <p>&copy; 2025 MoonStar Food LLC. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-3">
          <Link href="/social">Social Media</Link>
          <Link href="/events">Events</Link>
          <Link href="/download">Download Our App</Link>
        </div>
      </footer>
    </div>
  );
}
