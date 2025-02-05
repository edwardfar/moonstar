"use client";

import Link from "next/link";
import { FaTruck } from "react-icons/fa";

export default function PrivateHeader() {
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
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/dashboard">My Account</Link>
            </li>
            <li>
              <Link href="/cart">
                <FaTruck size={24} className="inline-block" />
              </Link>
            </li>
            <li>
              <Link href="/auth/logout">Logout</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
