"use client";

import React, { useEffect, useState } from "react";
import Header from "./components/header";
import { fetchPage } from "../../lib/wordpress";

interface PageData {
  title: { rendered: string };
  content: { rendered: string };
  // Add additional fields if needed
}

export default function HomePage() {
  const [homeContent, setHomeContent] = useState<PageData | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchPage("home");
        console.log("Home API response:", response);
        // WordPress REST API returns an array; we take the first item.
        const pageData: PageData = response[0];
        console.log("Extracted pageData:", pageData);
        setHomeContent(pageData);
      } catch (error) {
        console.error("Error fetching home page:", error);
      }
    };
    getData();
  }, []);

  if (!homeContent) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Render Home page content from WordPress */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-orange-600">
            {homeContent.title.rendered}
          </h2>
          <div
            className="prose max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: homeContent.content.rendered }}
          ></div>
        </div>
      </section>

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
