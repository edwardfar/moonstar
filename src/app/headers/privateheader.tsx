"use client";

import Link from "next/link";
import { FaTruck } from "react-icons/fa";

type PrivateHeaderProps = {
  handleLogout: () => void; // Define the type for the prop
};

export default function PrivateHeader({ handleLogout }: PrivateHeaderProps) {
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
