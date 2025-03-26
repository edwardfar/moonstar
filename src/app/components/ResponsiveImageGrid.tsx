"use client";

import Image from "next/image";
import React from "react";

type ImageData = {
  src: string;
  alt: string;
};

type ResponsiveImageGridProps = {
  images: ImageData[];
};

export default function ResponsiveImageGrid({ images }: ResponsiveImageGridProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Our Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, index) => (
          <div key={index} className="relative w-full h-64 rounded overflow-hidden shadow-lg">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              style={{ objectFit: "cover" }}
              className="transition duration-300 ease-in-out transform hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
