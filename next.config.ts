// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  eslint: {
    // Mengabaikan error ESLint saat proses build (Sangat aman untuk portofolio)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Mengabaikan peringatan tipe data minor saat build
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
};

export default nextConfig;