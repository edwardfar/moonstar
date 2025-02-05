"use client";

import Link from "next/link";

export default function PublicHeader() {
  return (
    <header className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">MoonStar Food LLC</Link>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/auth/signup">Sign Up</Link>
            </li>
            <li>
              <Link href="/auth/login">Login</Link>
            </li>
            <li className="relative group">
              <Link href="/products">Products</Link>
              <ul className="absolute left-0 mt-2 hidden group-hover:block bg-white text-black shadow-lg rounded">
                <li className="p-2 hover:bg-gray-200">
                  <Link href="/products/joyful">Joyful</Link>
                </li>
                <li className="p-2 hover:bg-gray-200">
                  <Link href="/products/lezzet">Lezzet</Link>
                </li>
                <li className="p-2 hover:bg-gray-200">
                  <Link href="/products/candytoys">Candy Toys</Link>
                </li>
                <li className="p-2 hover:bg-gray-200">
                  <Link href="/products/fmcg">FMCG</Link>
                </li>
                <li className="p-2 hover:bg-gray-200">
                  <Link href="/products/all">All Products</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
