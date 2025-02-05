"use client";

import Link from "next/link";
import { useAuth } from "../AuthContext"; // Adjust the path based on your project structure

export default function PublicHeader() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Optionally add a loading indicator
  }

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
            {!user && (
              <>
                <li>
                  <Link href="/auth/login">Login</Link>
                </li>
                <li>
                  <Link href="/auth/signup">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
