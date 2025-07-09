import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tus otras configuraciones aquí...
  typescript: {
    ignoreBuildErrors: true,
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
