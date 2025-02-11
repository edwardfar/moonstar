"use client";

import Link from "next/link";
import Header from "./components/header";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ✅ Fixed: No props needed */}
      <Header />

      {/* ✅ Hero Section */}
      <main
        className="flex-1 bg-cover bg-center text-white"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="bg-black bg-opacity-50 w-full h-full flex flex-col justify-center items-center py-20 px-6">
          <h1 className="text-5xl font-bold mb-4 text-center">
            Welcome to MoonStar Food LLC
          </h1>
          <p className="text-lg text-gray-200 mb-8 text-center">
            Explore our premium products and enjoy the best FMCG and Food Products.
          </p>
          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg text-xl shadow-lg"
          >
            Start Shopping
          </Link>

          {/* ✅ Featured Categories */}
          <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {[
              { img: "joyfulpool.jpg", title: "Joyful Products", desc: "Unlimited Joy from Joyful." },
              { img: "leezetsoup.jpg", title: "Discounted FMCG", desc: "Grab our special offers from Lezzet!" },
              { img: "WhatsApp Image 2025-02-03 at 21.31.14_7bc5961d.jpg", title: "Candy & Toys", desc: "The only FMCG import in DMV." },
            ].map(({ img, title, desc }, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img src={`/products/${img}`} alt={title} className="w-full h-80 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="text-gray-700">{desc}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* ✅ Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">MoonStar Food LLC</h3>
            <p>Your trusted partner for quality FMCG products and snacks.</p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://www.facebook.com/profile.php?id=100090946375741" target="_blank" className="hover:underline">
                Facebook
              </a>
              <a href="https://www.instagram.com/fruitjoyful/" target="_blank" className="hover:underline">
                Instagram
              </a>
              <a href="https://www.tiktok.com/@joy...ful" target="_blank" className="hover:underline">
                TikTok
              </a>
            </div>
          </div>

          {/* App Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Get Our App</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" target="_blank">
                <img src="/products/applestore.png" alt="App Store" className="h-10 object-contain" />
              </a>
              <a href="#" target="_blank">
                <img src="/products/googlestore.png" alt="Play Store" className="h-10 object-contain" />
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
