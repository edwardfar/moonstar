import axios from "axios";

// Optionally, you can set a default if the env variable is missing:
// const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://joyfullezzet.com";
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export const fetchPage = async (slug: string) => {
  try {
    const res = await axios.get(
      `${WP_URL}/wp-json/wp/v2/pages?slug=${slug}&_embed`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching page with slug:", slug, error);
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    // Returns up to 100 products with embedded data.
    const res = await axios.get(
      `${WP_URL}/wp-json/wp/v2/products?per_page=100&_embed`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProduct = async (id: number) => {
  try {
    const res = await axios.get(
      `${WP_URL}/wp-json/wp/v2/products/${id}?_embed`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching product with ID:", id, error);
    throw error;
  }
};
