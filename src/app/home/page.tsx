"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="bg-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-lg text-white">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image src="/products/MoonStar logo.jpg" alt="MoonStar Food LLC" width={50} height={50} priority />
            <h1 className="text-3xl font-bold">MoonStar Food LLC</h1>
          </div>
          <ul className="flex space-x-6 text-lg">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/auth/signup">Sign Up</Link></li>
            <li><Link href="/auth/login">Login</Link></li>
            <li className="relative group">
              <span className="cursor-pointer">Products</span>
              <ul className="absolute hidden group-hover:block bg-white text-gray-800 shadow-md mt-2">
                <li><Link href="/products/fmcg" className="block px-4 py-2 hover:bg-gray-200">FMCG</Link></li>
                <li><Link href="/products/candytoys" className="block px-4 py-2 hover:bg-gray-200">Candy Toys</Link></li>
                <li><Link href="/products/joyful" className="block px-4 py-2 hover:bg-gray-200">Joyful</Link></li>
                <li><Link href="/products/lezzet" className="block px-4 py-2 hover:bg-gray-200">Lezzet</Link></li>
              </ul>
            </li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </nav>
      </header>

      {/* Categories */}
      <section className="grid grid-cols-2 gap-6 p-6">
        <div className="bg-gray-300 text-center p-10 rounded shadow-md flex items-center justify-center aspect-square">
          <Link href="/products/fmcg" className="font-bold text-lg">
            <Image src="/products/WhatsApp Image 2025-02-03 at 21.31.14_7bc5961d.jpg" alt="FMCG" width={800} height={800} priority className="mb-2" />
            FMCG
          </Link>
        </div>
        <div className="bg-gray-300 text-center p-10 rounded shadow-md flex items-center justify-center aspect-square">
          <Link href="/products/candytoys" className="font-bold text-lg">
            <Image src="/products/funtubes.jpg" alt="Candy Toys" width={800} height={800} priority className="mb-2" />
            Candy Toys
          </Link>
        </div>
        <div className="bg-gray-300 text-center p-10 rounded shadow-md flex items-center justify-center aspect-square">
          <Link href="/products/joyful" className="font-bold text-lg">
            <Image src="/products/joyful logo.jpg" alt="Joyful" width={800} height={800} priority className="mb-2" />
            Joyful
          </Link>
        </div>
        <div className="bg-gray-300 text-center p-10 rounded shadow-md flex items-center justify-center aspect-square">
          <Link href="/products/lezzet" className="font-bold text-lg">
            <Image src="/products/Logo lezzet.png" alt="Lezzet" width={800} height={800} priority className="mb-2" />
            Lezzet
          </Link>
        </div>
      </section>

      {/* Tags */}
      <section className="grid grid-cols-2 gap-4 p-6">
        <div className="bg-gray-400 text-center py-6 rounded shadow-md">
          <Link href="/tags/soda-drinks">Soda & Drinks</Link>
        </div>
        <div className="bg-gray-400 text-center py-6 rounded shadow-md">
          <Link href="/tags/cookies-snacks">Cookies & Snacks</Link>
        </div>
        <div className="bg-gray-400 text-center py-6 rounded shadow-md">
          <Link href="/tags/candy">Candy</Link>
        </div>
        <div className="bg-gray-400 text-center py-6 rounded shadow-md">
          <Link href="/tags/groceries">Groceries</Link>
        </div>
      </section>

      {/* Scrolling Discounted Products */}
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-4"> Best Deals </h2>
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="relative w-40 p-4 bg-gray-200 rounded shadow-md hover:scale-105">
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Sale</span>
              <p className="mt-2 text-center font-bold">Product {index + 1}</p>
            </div>
          ))}
        </div>
      </section>

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
