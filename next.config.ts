import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-only "N" badge — it sits on top of the mobile tab bar.
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com",
      },
    ],
  },
};

export default nextConfig;

