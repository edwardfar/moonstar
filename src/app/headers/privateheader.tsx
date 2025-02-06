"use client";

import Link from "next/link";
import { FaTruck } from "react-icons/fa";

type PrivateHeaderProps = {
  handleLogout: () => void;
  cartCount: number;
};

export default function PrivateHeader({ handleLogout, cartCount }: PrivateHeaderProps) {
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
              <Link href="/cart">
                <div className="relative">
                  <FaTruck size={24} className="inline-block" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </li>
            <li>
              <Link href="/dashboard">My Account</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-red-500">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
