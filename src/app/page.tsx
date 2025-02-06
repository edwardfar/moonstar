"use client";

import Link from "next/link";
import { useAuth } from "./auth/AuthContext";
import PrivateHeader from "./headers/privateheader";
import PublicHeader from "./headers/publicheader";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { user, setUser } = useAuth(); // Access authentication status and setter for user
  const [cartCount, setCartCount] = useState(0); // Cart count state
  const router = useRouter(); // Correct hook for Next.js 13+ navigation

  // Fetch cart count
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cartItems.length);
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      setUser(null); // Clear user session
      router.push("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Dynamic Header */}
      {user ? (
        <PrivateHeader handleLogout={handleLogout} cartCount={cartCount} />
      ) : (
        <PublicHeader />
      )}

      {/* Hero Section */}
      <main
        className="flex-1 bg-cover bg-center text-white"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="bg-black bg-opacity-50 w-full h-full flex flex-col justify-center items-center py-20">
          <h1 className="text-5xl font-bold mb-4 text-center">
            Welcome to MoonStar Food LLC
          </h1>
          <p className="text-lg text-gray-200 mb-8 text-center">
            Explore our premium products and enjoy the best FMCG and Food Products.
          </p>
          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg text-xl shadow-lg"
          >
            Start Shopping
          </Link>

          {/* Categories and Discounts */}
          <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-10">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="/products/joyfulpool.jpg"
                alt="Category 1"
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">Joyful Products</h3>
                <p className="text-gray-700">Unlimited Joy from Joyful.</p>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="/products/leezetsoup.jpg"
                alt="Category 2"
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">Discounted FMCG</h3>
                <p className="text-gray-700">Grab our special offers from Lezzet!</p>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="/products/WhatsApp Image 2025-02-03 at 21.31.14_7bc5961d.jpg"
                alt="Category 3"
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">Candy & Toys</h3>
                <p className="text-gray-700">The only FMCG import in DMV.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">MoonStar Food LLC</h3>
            <p>Your trusted partner for quality FMCG products and snacks.</p>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=100090946375741"
                target="_blank"
                className="hover:underline"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/fruitjoyful/"
                target="_blank"
                className="hover:underline"
              >
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@joy...ful"
                target="_blank"
                className="hover:underline"
              >
                Tiktok
              </a>
            </div>
          </div>

          {/* Download Our App */}
          <div>
            <h3 className="text-xl font-bold mb-4">Get Our App</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" target="_blank">
                <img
                  src="/products/applestore.png"
                  alt="App Store"
                  className="h-10 object-contain"
                />
              </a>
              <a href="#" target="_blank">
                <img
                  src="/products/googlestore.png"
                  alt="Play Store"
                  className="h-10 object-contain"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 text-center py-4">
          <p>© 2025 MoonStar Food LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
