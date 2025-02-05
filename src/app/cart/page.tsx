"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((item: any) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotal = () => {
    return cart.reduce((total: number, item: any) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="bg-gray-100 text-gray-900 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-lg text-white">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image src="/products/MoonStar logo.jpg" alt="MoonStar Food LLC" width={50} height={50} />
            <h1 className="text-3xl font-bold">MoonStar Food LLC</h1>
          </div>
          <ul className="flex space-x-6 text-lg">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/auth/signup">Sign Up</Link>
            </li>
            <li>
              <Link href="/auth/login">Login</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Cart Content */}
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {cart.length === 0 ? (
          <p className="text-lg">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {cart.map((item: any) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between border p-4 rounded shadow-md bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={`/${item.image}`}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-cover rounded-md"
                    />
                    <div>
                      <h2 className="text-lg font-bold">{item.name}</h2>
                      <p>Price: ${item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrashAlt size={24} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 text-right">
              <h3 className="text-xl font-bold">Total: ${getTotal()}</h3>
              <button
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
                onClick={() => alert("Proceed to checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>© 2025 MoonStar Food LLC. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-2">
            <Link href="/social">Social Media</Link>
            <Link href="/events">Events</Link>
            <Link href="/download">Download Our App</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
