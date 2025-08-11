import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // atau http kalau backend belum pakai SSL
        hostname: "backend.ptdahliaglobalindo.id",
        port: "", // kosongin kalau pakai default port (80/443)
        pathname: "/uploads/**",
      },
    ],
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
