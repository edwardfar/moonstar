/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "via.placeholder.com", // for the placeholder fallback
      "joyfullezzet.com",         // if you load images from your local WP
      "mycms.local"
      // add other domains as needed
    ],
  },
};

module.exports = nextConfig;
