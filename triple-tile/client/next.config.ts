import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/get_triple_flag",
        destination: "http://localhost:2007/get_triple_flag", // Flask
      },
      {
        source: "/api/submit",
        destination: "http://localhost:2007/api/submit",
      },
    ];
  },
};

export default nextConfig;
