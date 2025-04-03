"use client";

import React, { useEffect, useState } from "react";
import { fetchPage } from "../../../lib/strapi";

interface PageAttributes {
  title: string;
  content: string;
}

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<PageAttributes | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const aboutRes = await fetchPage("about");
        console.log("aboutRes:", aboutRes);
        // Try extracting using typical Strapi v4 structure
        let pageData = aboutRes.data?.data?.[0]?.attributes;
        if (!pageData) {
          // If that fails, try a flat structure:
          pageData = aboutRes.data?.[0];
        }
        console.log("Extracted pageData:", pageData);
        setAboutContent(pageData);
      } catch (error) {
        console.error("Error fetching About page:", error);
      }
    };

    getData();
  }, []);

  if (!aboutContent) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
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
