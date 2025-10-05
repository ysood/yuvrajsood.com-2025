import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // If your repo is named differently, update this basePath
  // basePath: '/your-repo-name',
};

export default nextConfig;
