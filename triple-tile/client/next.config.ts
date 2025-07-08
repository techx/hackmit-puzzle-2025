import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/submit",
        destination: "http://localhost:2007/api/submit",
      },
    ];
  },
};

export default nextConfig;
