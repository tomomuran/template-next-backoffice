import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 180
    }
  }
};

export default nextConfig;
