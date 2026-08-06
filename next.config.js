/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["sharp"],
  outputFileTracingIncludes: {
    "/api/news-image": ["./node_modules/sharp/**/*", "./node_modules/@img/**/*"]
  },
  images: {
    formats: ["image/avif", "image/webp"]
  },
  async redirects() {
    return [
      {
        source: "/applications",
        destination: "/en/industries",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/applications",
        destination: "/:locale/industries",
        permanent: true
      },
      {
        source: "/applications/recycling",
        destination: "/en/industries/recycling",
        permanent: true
      },
      {
        source: "/applications/mining",
        destination: "/en/industries/mining",
        permanent: true
      },
      {
        source: "/applications/aggregate-cement",
        destination: "/en/industries/cement-aggregate",
        permanent: true
      },
      {
        source: "/applications/food-processing",
        destination: "/en/industries/food",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/applications/recycling",
        destination: "/:locale/industries/recycling",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/applications/mining",
        destination: "/:locale/industries/mining",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/applications/aggregate-cement",
        destination: "/:locale/industries/cement-aggregate",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/applications/food-processing",
        destination: "/:locale/industries/food",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/products/conveyor-metal-detector",
        destination: "/:locale/products/dls-type-window-metal-detector",
        permanent: true
      },
      {
        source: "/products/conveyor-metal-detector",
        destination: "/en/products/dls-type-window-metal-detector",
        permanent: true
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/videos/cowinmagnet-home-product-showcase-2026.mp4",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }]
      },
      {
        source: "/videos/cowinmagnet-home-product-showcase-2026.en.vtt",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }]
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
