import axios from "axios";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Fetch a page by slug from Strapi (for a collection type "Pages")
export const fetchPage = async (slug: string) => {
  const res = await axios.get(
    `${STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&populate=*`
  );
  return res.data;
};

// Fetch navigation data (assuming you have a single type "Navigation")
export const fetchNavigation = async () => {
  const res = await axios.get(`${STRAPI_URL}/api/navigation?populate=*`);
  return res.data;
};

// Fetch categories (for product categories or similar)
export const fetchCategories = async () => {
  const res = await axios.get(`${STRAPI_URL}/api/categories?populate=*`);
  return res.data;
};
