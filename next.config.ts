import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config) => {
    config.module.rules.push({
      test: /\.glb$/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[path][name].[hash][ext]",
      },
    });
    return config;
  },
};

export default nextConfig;
