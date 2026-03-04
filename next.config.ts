import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },

  /**
   * Native Node.js modules used server-side.
   * better-sqlite3 is a native addon and must not be bundled by webpack.
   * It is only loaded when DATABASE_URL is unset (local SQLite fallback).
   */
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
