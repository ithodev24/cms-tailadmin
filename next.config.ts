import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["backend.ptdahliaglobalindo.id"], // ✅ tambahkan ini
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
