"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Header from "../../components/header";

// Define types for the product data from WordPress
interface Product {
  id: number;
  title: { rendered: string };
  acf: {
    product_description: string;
    product_gallery: number[] | { url: string }[];
    barcode: string;
    inventory?: number;
    price: number;
    category: string;
    tags: string[];
  };
  _embedded?: {
    "acf:attachment"?: Array<{
      id: number;
      source_url: string;
    }>;
  };
}

export default function ProductDetail() {
  // Use useParams from next/navigation to get the dynamic segment
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  // Use your WordPress URL from env or hardcode if needed
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://joyfullezzet.com";

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      try {
        const res = await axios.get(`${WP_URL}/wp-json/wp/v2/products/${id}?_embed`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    }
    fetchProduct();
  }, [id, WP_URL]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="p-10 text-center">Loading...</div>
      </div>
    );
  }

  // Extract the gallery images from the product.
  // We assume the ACF field returns an array of IDs; then we look in _embedded["acf:attachment"]
  let galleryImages: string[] = [];
const gallery = product.acf.product_gallery;
if (Array.isArray(gallery) && gallery.length > 0) {
  if (typeof gallery[0] === "number") {
    galleryImages = product._embedded?.["acf:attachment"]?.map((att) => att.source_url) || [];
  } else if (isImageObject(gallery[0])) {
    galleryImages = (gallery as { url: string }[]).map((img) => img.url);
  }
}

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      <Header />
      <main className="p-6 md:p-10">
        <h1 className="text-4xl font-bold mb-4">{product.title.rendered}</h1>
        <div
          className="prose mb-6"
          dangerouslySetInnerHTML={{ __html: product.acf.product_description }}
        />
        {galleryImages.length > 0 ? (
  <div className="grid grid-cols-2 gap-4">
    {galleryImages.map((url, index) => (
      <div key={index} className="relative w-48 h-48 mb-2">
        <Image
          src={url}
          alt={`Gallery image ${index + 1}`}
          fill
          sizes="200px"
          className="object-cover rounded"
        />
      </div>
    ))}
  </div>
) : (
  <p>No gallery images available.</p>
)}

      </main>
    </div>
  );
}
function isImageObject(obj: any): obj is { url: string } {
  return obj && typeof obj.url === "string";
}

