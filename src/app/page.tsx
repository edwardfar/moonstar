"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/header";

interface HomePageContent {
  title: string;
  content: string;
}

export default function HomePage() {
  const [homeContent, setHomeContent] = useState<HomePageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        // Fetch the page using the slug "home"
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages?slug=home`
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          const pageData = response.data[0];
          setHomeContent({
            title: pageData.title.rendered,
            content: pageData.content.rendered,
          });
        } else {
          console.error("Home page content not found. Publish a page with slug 'home' in WordPress.");
        }
      } catch (error) {
        console.error("Error fetching home page content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeContent();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!homeContent) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <h1>Home page content not found.</h1>
          <p>Please ensure a page with the slug "home" is published on WordPress.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8" dangerouslySetInnerHTML={{ __html: homeContent.title }} />
        <div className="prose" dangerouslySetInnerHTML={{ __html: homeContent.content }} />
      </div>
    </div>
  );
}