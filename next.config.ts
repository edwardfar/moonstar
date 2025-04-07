import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'via.placeholder.com', // for the placeholder fallback
      'joyfullezzet.com',      // your live WP domain
    ],
  },
};

export default nextConfig;
