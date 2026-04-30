import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable serverless function compilation
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg", "bcryptjs"],
  
  // Image optimization for Vercel
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Optimizations for Vercel deployment
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  // Redirect old domain
  redirects: async () => [
    {
      source: "/:path*",
      has: [
        {
          type: "host",
          value: "saaviya.in",
        },
      ],
      destination: "https://www.saaviya.in/:path*",
      permanent: true,
    },
  ],

  // Rewrites for API
  rewrites: async () => ({
    beforeFiles: [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ],
  }),

  // Headers for performance
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      {
        source: "/public/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
