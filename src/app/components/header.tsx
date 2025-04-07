"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../CartContext";
import { FaBars, FaTimes, FaTruck } from "react-icons/fa";
import Image from "next/image";

interface ExtendedUser {
  email?: string;
  businessName?: string;
  role?: string;
}

type HeaderProps = {
  icon?: string;
};

export default function Header({ icon }: HeaderProps) {
  const { user: authUser, logout, loading } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const user = authUser as ExtendedUser | null;
  const isLoggedIn = !!user;

  useEffect(() => {
    console.log("🔍 Auth user in header:", authUser);
  }, [authUser]);

  useEffect(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, [cart]);

  const displayName = user?.businessName || user?.email;

  const renderLinks = (isMobile: boolean) => {
    if (loading) return null;

    return isLoggedIn ? (
      <>
        {!isMobile && displayName && (
          <span className="text-sm text-gray-200">Welcome, {displayName}</span>
        )}
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact Us
        </Link>
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
        <button onClick={logout} className="hover:underline text-red-400 ml-2">
          Logout
        </button>
      </>
    ) : (
      <>
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact Us
        </Link>
        <Link href="/auth/login" className="hover:underline">
          Sign In
        </Link>
        <Link href="/auth/signup" className="hover:underline">
          Sign Up
        </Link>
      </>
    );
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {icon === "truck" && <FaTruck className="text-white mr-2" />}

        <div className="flex items-center space-x-2">
          <Image
            src="/products/moonstar-logo.jpg"
            alt="MoonStar Logo"
            width={120}
            height={32}
            className="object-contain"
          />
          <Link href="/" className="text-xl font-bold">
            MoonStar Food LLC
          </Link>
        </div>

        <nav className="hidden lg:flex space-x-6 items-center">
          {renderLinks(false)}
        </nav>

        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-gray-900 text-white absolute w-full top-14 left-0 py-4 px-6 space-y-4 shadow-lg">
          <div className="space-y-3 flex flex-col">{renderLinks(true)}</div>
          {isLoggedIn && (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="block text-red-400"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
