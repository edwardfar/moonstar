"use client";

import React from "react";
import Header from "./components/header";
import HeroCarousel from "./components/HeroCarousel";
import ResponsiveImageGrid from "./components/ResponsiveImageGrid";

export default function HomePage() {
  // Example image data – update paths and alt texts as needed.
  const galleryImages = [
    { src: "/products/gallery1.jpg", alt: "Gallery Image 1" },
    { src: "/products/gallery2.jpg", alt: "Gallery Image 2" },
    { src: "/products/gallery3.jpg", alt: "Gallery Image 3" },
    { src: "/products/gallery4.jpg", alt: "Gallery Image 4" },
    { src: "/products/gallery5.jpg", alt: "Gallery Image 5" },
    { src: "/products/gallery6.jpg", alt: "Gallery Image 6" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Responsive Image Gallery Section */}
      <ResponsiveImageGrid images={galleryImages} />

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold mb-4">MoonStar Food LLC</h3>
            <p>Your trusted partner for quality FMCG products and snacks.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=100090946375741"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/fruitjoyful/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@joy...ful"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                TikTok
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Get Our App</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" target="_blank" rel="noreferrer">
                <img
                  src="/products/applestore.png"
                  alt="App Store"
                  className="h-10 object-contain"
                />
              </a>
              <a href="#" target="_blank" rel="noreferrer">
                <img
                  src="/products/googlestore.png"
                  alt="Play Store"
                  className="h-10 object-contain"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 text-center py-4">
          <p>© 2025 MoonStar Food LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
