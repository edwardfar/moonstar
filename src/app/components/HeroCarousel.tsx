"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import base Swiper styles + any modules' CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export default function HeroCarousel() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      className="w-full h-[100vh]"
    >
      <SwiperSlide>
        <div
          className="w-full h-full bg-cover bg-center flex items-center justify-center text-white"
          style={{ backgroundImage: "url('/products/nutella.jpg')" }}
        >
          <div className="bg-black bg-opacity-40 p-6 rounded text-center max-w-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              MoonStar Food Only FMCG importer in DMV
            </h1>
            <p className="text-lg mb-6">
              Discover premium products, exclusive deals, and more!
            </p>
            <a
              href="/auth/login"
              className="inline-block bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 rounded-md text-lg shadow-lg"
            >
              Shop Now
            </a>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div
          className="w-full h-full bg-cover bg-center flex items-center justify-center text-white"
          style={{ backgroundImage: "url('/products/joyfulpool.jpg')" }}
        >
          <div className="bg-black bg-opacity-40 p-6 rounded text-center max-w-lg">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Fresh & Delicious
            </h2>
            <p className="text-lg mb-6">
              Indulge in our curated range of Joyful snacks and beverages.
            </p>
            <a
              href="/products"
              className="inline-block bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 rounded-md text-lg shadow-lg"
            >
              Explore Products
            </a>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div
          className="w-full h-full bg-cover bg-center flex items-center justify-center text-white"
          style={{ backgroundImage: "url('/products/leezetsoup.jpg')" }}
        >
          <div className="bg-black bg-opacity-40 p-6 rounded text-center max-w-lg">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Special Discounts
            </h2>
            <p className="text-lg mb-6">
              Grab our exclusive deals before they’re gone!
            </p>
            <a
              href="/products"
              className="inline-block bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 rounded-md text-lg shadow-lg"
            >
              Check Deals
            </a>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
