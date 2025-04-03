"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../components/header";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../CartContext";
import { supabase } from "../../../lib/supabase";
import axios from "axios";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

// Helper: fetch products from WordPress
async function fetchWpProducts(): Promise<any[]> {
  const res = await axios.get(`${WP_URL}/wp-json/wp/v2/products?_embed`);
  return res.data; // Expect an array of WP products
}

// Define our Product type for the UI
interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  tags: string[];
  barcode: string;
  inventory?: number;
}

export default function ProductPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // Filters & sorting state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortByPrice, setSortByPrice] = useState<"" | "asc" | "desc">("");

  // Quantities per product
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    async function getProducts() {
      try {
        // 1) Fetch products from WordPress
        const wpProducts = await fetchWpProducts();
        console.log("Fetched WP products:", wpProducts);

        // 2) Transform each product with custom pricing lookup
        const transformed: Product[] = await Promise.all(
          wpProducts.map(async (prod: any): Promise<Product> => {
            // Get the barcode from WP ACF
            const barcode = prod.acf?.barcode;
            let customPrice: number | null = null;
            // If user is logged in and barcode exists, try to fetch a custom price
            if (user && barcode) {
              const { data, error } = await supabase
                .from("user_product_prices")
                .select("custom_price")
                .eq("user_id", user.id)
                .eq("barcode", barcode)
                .single();
              if (!error && data) {
                customPrice = data.custom_price;
                console.log(
                  `Custom price found for barcode ${barcode}:`,
                  customPrice
                );
              } else {
                console.log(
                  `No custom price found for barcode ${barcode}. Using default WP price.`
                );
              }
            }
            // Fallback price from WordPress ACF (ensure it's a valid number)
            const wpPrice = prod.acf?.price ? parseFloat(prod.acf.price) : 0;
            // Final price: if custom price exists, use it; otherwise, use WP price
            const finalPrice = user && customPrice !== null ? customPrice : wpPrice;

            // For image: if ACF returns a string, use it; if an object, use .url
            let imageUrl = "/placeholder.png";
            if (prod.acf?.product_gallery) {
              if (typeof prod.acf.product_gallery === "string") {
                imageUrl = prod.acf.product_gallery;
              } else if (typeof prod.acf.product_gallery === "object") {
                imageUrl = prod.acf.product_gallery.url || "/placeholder.png";
              }
            }

            return {
              id: prod.id,
              name: prod.title.rendered || "Unnamed Product",
              description:
                prod.acf?.product_description || prod.content.rendered || "",
              image: imageUrl,
              price: finalPrice,
              category: prod.acf?.category || "Unknown",
              tags: prod.acf?.tags || [],
              barcode: barcode || "N/A",
              inventory: prod.acf?.inventory ? parseInt(prod.acf.inventory) : undefined,
            };
          })
        );

        console.log("Transformed products:", transformed);
        setProducts(transformed);

        // Extract unique categories & tags
        const uniqueCategories = Array.from(
          new Set(transformed.map((p) => p.category))
        );
        const uniqueTags = Array.from(
          new Set(transformed.flatMap((p) => p.tags))
        );
        setCategories(uniqueCategories);
        setTags(uniqueTags);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProducts();
  }, [user]);

  const filterProducts = () => {
    let filtered = [...products];
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (selectedTag) {
      filtered = filtered.filter((p) => p.tags.includes(selectedTag));
    }
    if (sortByPrice === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortByPrice === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }
    return filtered;
  };

  const handleQuantityChange = (productId: number, change: number) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] || 1;
      const newQty = Math.max(currentQty + change, 0);
      return { ...prev, [productId]: newQty };
    });
  };

  const getDisplayPrice = (p: Product) => {
    return `$${p.price.toFixed(2)}`;
  };

  return (
    <div className="bg-gray-100 text-gray-900 font-sans min-h-screen flex flex-col">
      <Header icon="truck" />

      {/* Filters & Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-4 bg-white shadow-sm">
        <div className="flex gap-2">
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="p-2 border rounded text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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
        <div className="flex items-center gap-2">
          <label htmlFor="sortPrice" className="text-sm font-semibold">
            Sort by Price:
          </label>
          <select
            id="sortPrice"
            value={sortByPrice}
            onChange={(e) => setSortByPrice(e.target.value as "asc" | "desc" | "")}
            className="p-2 border rounded text-sm"
          >
            <option value="">None</option>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <main className="flex-grow p-6 md:p-10">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-orange-600">
          Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterProducts().map((product) => {
            const quantity = quantities[product.id] || 1;
            return (
              <div
                key={product.id}
                className="flex flex-col bg-white rounded shadow-md p-4 hover:shadow-lg transition"
              >
                {/* Product Image & Title */}
                <div className="mb-3">
                  <div className="relative w-full h-48 mb-2">
                    <Image
                      src={product.image}
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
                <div
                  className="text-sm text-gray-600 flex-grow prose"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />

                {/* Price */}
                <p className="mt-3 text-orange-600 font-bold">
                  Price: {product.price > 0 ? getDisplayPrice(product) : "Not Available"}
                </p>

                {/* Optional: Inventory */}
                {product.inventory !== undefined && (
                  <p className="text-sm text-gray-500">
                    In Stock: {product.inventory}
                  </p>
                )}

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

                {/* Add to Cart Button */}
                <button
                  className="mt-4 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition font-semibold"
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      quantity,
                    })
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    Add to Order
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>© 2025 MoonStar Food LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
