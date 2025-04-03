import axios from "axios";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

// Fetch a page by slug (e.g., "home" or "about")
export const fetchPage = async (slug: string) => {
  const res = await axios.get(`${WP_URL}/wp-json/wp/v2/pages?slug=${slug}`);
  return res.data;
};

// Fetch all products (assuming you have a custom post type "products")
export const fetchProducts = async () => {
  // Adjust per_page as needed, here we return up to 100 products.
  const res = await axios.get(`${WP_URL}/wp-json/wp/v2/products?per_page=100`);
  return res.data;
};

// Fetch a single product by its ID
export const fetchProduct = async (id: number) => {
  const res = await axios.get(`${WP_URL}/wp-json/wp/v2/products/${id}`);
  return res.data;
};
