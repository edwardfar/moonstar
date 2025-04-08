/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "via.placeholder.com",
      "joyfullezzet.com",
      "mycms.local"
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add custom webpack configuration:
  webpack: (config, { isServer }) => {
    // Replace the problematic file with a stub
    config.module.rules.push({
      test: /my-cms\/src\/admin\/app\.example\.tsx$/,
      use: 'null-loader'
    });
    return config;
  },
};

module.exports = nextConfig;