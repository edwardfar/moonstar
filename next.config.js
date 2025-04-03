/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "via.placeholder.com", // for the placeholder fallback
      "mycms.local",         // if you load images from your local WP
      // add other domains as needed
    ],
  },
};

module.exports = nextConfig;
