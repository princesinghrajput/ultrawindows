import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.ultrawindows.co.uk',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
