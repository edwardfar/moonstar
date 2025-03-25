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

  // Update cart count whenever the cart changes
  useEffect(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, [cart]);

  // Optional: If you store a full name in user metadata, you could do:
  // const [username, setUsername] = useState<string>("");
  // useEffect(() => {
  //   if (user) {
  //     setUsername(user.email); // or user.user_metadata.name
  //   }
  // }, [user]);

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="products\moonstar-logo.jpg"
            alt="MoonStar Logo"
            className="h-8"
          />
          <Link href="/" className="text-xl font-bold">
            MoonStar Food LLC
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-6 items-center">
          {user ? (
            /* ---------- PRIVATE NAV (Logged-In) ---------- */
            <>
              {/* Display a small greeting */}
              <span className="text-sm text-gray-200">
                Welcome, {user.email}
              </span>

              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/products" className="hover:underline">
                Products
              </Link>
              <Link href="/cart" className="relative hover:underline">
                <FaTruck size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/about" className="hover:underline">
                About
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
              <button
                onClick={logout}
                className="hover:underline text-red-400 ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            /* ---------- PUBLIC NAV (Not Logged-In) ---------- */
            <>
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/about" className="hover:underline">
                About
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
              <Link href="/auth/login" className="hover:underline">
                Sign In
              </Link>
              <Link href="/auth/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button (Hamburger) */}
        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu (visible if menuOpen = true) */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-900 text-white absolute w-full top-14 left-0 py-4 px-6 space-y-4 shadow-lg">
          {user ? (
            /* ---------- PRIVATE NAV (Mobile) ---------- */
            <>
              <span className="block text-sm text-gray-200">
                Welcome, {user.email}
              </span>
              <Link
                href="/dashboard"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/products"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/cart"
                className="block relative"
                onClick={() => setMenuOpen(false)}
              >
                <FaTruck size={20} className="inline-block mr-2" />
                Cart ({cartCount})
              </Link>
              <Link
                href="/about"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            /* ---------- PUBLIC NAV (Mobile) ---------- */
            <>
              <Link
                href="/"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/auth/login"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
