import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "msmoveissobmedida.com.br",
        "www.msmoveissobmedida.com.br",
      ],
    },
  },
  serverExternalPackages: ["imapflow", "mailparser"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
