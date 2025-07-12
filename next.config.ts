import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bitai.millerbit.biz",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
