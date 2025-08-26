import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/morse_letter",
        destination: "http://localhost:2007/api/morse_letter", // or whatever port your Flask server runs on
      },
      {
        source: "/api/submit",
        destination: "http://localhost:2007/api/submit",
      },
    ];
  },
};

export default nextConfig;
