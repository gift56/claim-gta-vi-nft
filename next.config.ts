import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    qualities: [75, 90, 95],
  },
};

export default nextConfig;
