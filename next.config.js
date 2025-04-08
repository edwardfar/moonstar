/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "via.placeholder.com", // for the placeholder fallback
      "joyfullezzet.com",      // images from your WordPress site
      "mycms.local"
      // add other domains as needed
    ],
  },
  eslint: {
    // Warning: This allows production builds to complete even if there are lint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;