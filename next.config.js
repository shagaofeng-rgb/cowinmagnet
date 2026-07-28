/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["sharp"],
  outputFileTracingIncludes: {
    "/api/news-image": ["./node_modules/sharp/**/*", "./node_modules/@img/**/*"]
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // News and externally published Blog posts use this validated local proxy
    // for source images. The proxy requires query parameters, so allow only
    // this pathname rather than broadly allowing local API image URLs.
    localPatterns: [{ pathname: "/api/news-image" }]
  },
  async redirects() {
    return [
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/products/conveyor-metal-detector",
        destination: "/:locale/products/dls-type-window-metal-detector",
        permanent: true
      },
      {
        source: "/products/conveyor-metal-detector",
        destination: "/products/dls-type-window-metal-detector",
        permanent: true
      }
    ];
  },
  async headers() {
    return [
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
