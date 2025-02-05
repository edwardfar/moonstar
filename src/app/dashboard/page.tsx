"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
    console.log("HomePage component rendered"); // Add this line
    return (
        <div className="bg-gray-100 text-gray-900 font-sans">
            {/* Header */}
            <header className="bg-gray-800 p-4 shadow-lg text-white">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Image
                            src="/logo.png" // Ensure the logo is placed in the public folder
                            alt="MoonStar Logo"
                            width={50}
                            height={50}
                        />
                        <h1 className="text-3xl font-bold">MoonStar Food LLC</h1>
                    </div>
                    <nav>
                        <ul className="flex space-x-6 text-lg">
                            <li>
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="/products">Products</Link>
                            </li>
                            <li>
                                <Link href="/auth/signup">Sign Up</Link>
                            </li>
                            <li>
                                <Link href="/auth/login">Login</Link>
                            </li>
                            <li>
                                <Link href="/about">About</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-10 text-center">
                <h2 className="text-4xl font-bold mb-6">Welcome to MoonStar Food LLC</h2>
                <p className="text-lg mb-6">Explore our products and enjoy the best FMCG and snacks.</p>
                <div className="mt-6">
                    <Link
                        href="/products"
                        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                    >
                        Explore Products
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-bold text-xl mb-4">About Us</h4>
                        <p>
                            MoonStar Food LLC is your go-to source for premium FMCG products
                            and snacks. Our mission is to deliver quality and satisfaction to
                            our customers.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="hover:underline">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="hover:underline">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/login" className="hover:underline">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/signup" className="hover:underline">
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl mb-4">Connect With Us</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="hover:underline">
                                    Facebook
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Twitter
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Instagram
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Download Our App
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="text-center mt-8 border-t border-gray-600 pt-4">
                    <p>© 2025 MoonStar Food LLC. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
