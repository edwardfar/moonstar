"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/header";

interface PageAttributes {
  title: string;
  content: string;
}

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<PageAttributes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        // Replace NEXT_PUBLIC_WORDPRESS_URL with your WordPress URL (without a trailing slash)
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages?slug=about`
        );
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          const page = data[0];
          setAboutContent({
            title: page.title.rendered,
            content: page.content.rendered,
          });
        } else {
          console.error(
            "About page not found. Ensure it is published in WordPress with the slug 'about'."
          );
        }
      } catch (error) {
        console.error("Error fetching About page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!aboutContent)
    return (
      <div>
        About page not found. Please publish an About page in WordPress with the slug "about".
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-orange-600">
          {aboutContent.title}
        </h1>
        <div
          className="prose max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: aboutContent.content }}
        ></div>
      </div>
    </div>
  );
}