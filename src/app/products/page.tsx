"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import Image from "next/image";
import { useAuth } from "../auth/AuthContext";     // or wherever your AuthContext is
import { useCart } from "../CartContext";          // or wherever your CartContext is
import Header from "../components/header";         // Your unified Header

type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;               // <-- Single price column
  category: string;
  tags: string[];              // e.g. ["Candy", "Snack"]
  barcode: string;
  stripe_price_id: string;     // If you integrate with Stripe
};

export default function ProductPage() {
  const { user } = useAuth();               // if needed, e.g. for future role checks
  const { addToCart } = useCart();          // to add items to the cart

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // Filters and sorting
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortByPrice, setSortByPrice] = useState<"" | "asc" | "desc">("");

  // Quantities for each product: { [productId]: quantity }
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // Fetch products on first render
  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);

      // Extract unique categories and tags
      const uniqueCategories = Array.from(new Set(data.map((p) => p.category)));
      const uniqueTags = Array.from(new Set(data.flatMap((p) => p.tags)));
      setCategories(uniqueCategories);
      setTags(uniqueTags);
    });
  }, []);

  // Get all products from Supabase
  const fetchProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase.from("Products").select("*");
    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }
    return data || [];
  };

  // Format the price for display
  const getDisplayPrice = (product: Product) => {
    return `$${product.price.toFixed(2)}`;
  };

  // Filter and sort products
  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((p) => p.tags.includes(selectedTag));
    }
    // Sort by price
    if (sortByPrice === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortByPrice === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  };

  // Increase or decrease quantity
  const handleQuantityChange = (productId: number, change: number) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] || 0;
      const newQty = Math.max(currentQty + change, 0); // prevent negative
      return { ...prev, [productId]: newQty };
    });
  };

  // Render
  return (
    <div className="bg-gray-100 text-gray-900 font-sans min-h-screen flex flex-col">
      {/* Header with an optional truck icon if your Header supports it */}
      <Header icon="truck" />

      {/* Filters + Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-4 bg-white shadow-sm">
        <div className="flex gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="p-2 border rounded text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTag || ""}
            onChange={(e) => setSelectedTag(e.target.value || null)}
            className="p-2 border rounded text-sm"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Sort by Price */}
        <div className="flex items-center gap-2">
          <label htmlFor="sortPrice" className="text-sm font-semibold">
            Sort by Price:
          </label>
          <select
            id="sortPrice"
            value={sortByPrice}
            onChange={(e) =>
              setSortByPrice(e.target.value as "asc" | "desc" | "")
            }
            className="p-2 border rounded text-sm"
          >
            <option value="">None</option>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </select>
        </div>
      </div>

      {/* Main Content: Product Grid */}
      <main className="flex-grow p-6 md:p-10">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-orange-600">
          Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterProducts().map((product) => {
            const quantity = quantities[product.id] || 0;

            return (
              <div
                key={product.id}
                className="flex flex-col bg-white rounded shadow-md p-4 hover:shadow-lg transition"
              >
                {/* Product Image + Title */}
                <div className="mb-3">
                  <div className="relative w-full h-48 mb-2">
                    <Image
                      src={
                        product.image
                          ? `/${product.image}`
                          : "/placeholder.png"
                      }
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw"
                      className="object-cover rounded"
                    />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Barcode: {product.barcode}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 flex-grow">
                  {product.description}
                </p>

                {/* Price */}
                <p className="mt-3 text-orange-600 font-bold">
                  Price: {getDisplayPrice(product)}
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center justify-center mt-3">
                  <button
                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-l hover:bg-gray-300 transition"
                    onClick={() => handleQuantityChange(product.id, -1)}
                  >
                    –
                  </button>
                  <div className="w-10 text-center border-y border-gray-200 py-1">
                    {quantity}
                  </div>
                  <button
                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-r hover:bg-gray-300 transition"
                    onClick={() => handleQuantityChange(product.id, 1)}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  className="mt-4 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition font-semibold"
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price, // single price column
                      image: product.image,
                      quantity: quantity || 1,
                      stripe_price_id: product.stripe_price_id,
                    })
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {/* Optional icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 21h9a2 2 0 002-2v-6a2 2 0 00-2-2h-9m-4 0H3m6 0v-6a2 2 0 012-2h6a2 2 0 012 2v6m-6 2v4"
                      />
                    </svg>
                    Add to Order
                  </span>
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
