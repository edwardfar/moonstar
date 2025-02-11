"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../CartContext";
import { FaBars, FaTimes, FaTruck } from "react-icons/fa";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Update cart count globally
  useEffect(() => {
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
  }, [cart]);

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/products/MoonStar_logo.jpg" alt="MoonStar Logo" className="h-8" />
          <Link href="/" className="text-xl font-bold">MoonStar Food LLC</Link>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex space-x-6 items-center">
          <Link href="/" className="hover:underline">Home</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/products" className="hover:underline">Products</Link>
              <Link href="/cart" className="relative">
                <FaTruck size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={logout} className="hover:underline text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:underline">Login</Link>
              <Link href="/auth/signup" className="hover:underline">Sign Up</Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-900 text-white absolute w-full top-14 left-0 py-4 px-6 space-y-4 shadow-lg">
          <Link href="/" className="block" onClick={() => setMenuOpen(false)}>Home</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/products" className="block" onClick={() => setMenuOpen(false)}>Products</Link>
              <Link href="/cart" className="block relative" onClick={() => setMenuOpen(false)}>
                <FaTruck size={22} className="inline-block mr-2" />Cart ({cartCount})
              </Link>
              <button onClick={logout} className="block text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/auth/signup" className="block" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
