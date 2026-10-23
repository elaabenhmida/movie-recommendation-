import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },
  allowedDevOrigins: ["http://localhost:3000", "http://192.168.1.120:3000]"],
};

export default nextConfig;
