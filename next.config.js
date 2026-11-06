/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["sharp"],
  outputFileTracingIncludes: {
    "/api/news-image": ["./node_modules/sharp/**/*", "./node_modules/@img/**/*"]
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "laikegeo.oss-cn-shanghai.aliyuncs.com",
        pathname: "/uploads/**"
      }
    ]
  },
  async redirects() {
    return [
      {
        source: "/inquiry",
        destination: "/en/request-quote",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/inquiry",
        destination: "/:locale/request-quote",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/products/permanent-magnetic-drum",
        destination: "/:locale/products/dry-drum-magnetic-separator",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/products/dry-magnetic-separator",
        destination: "/:locale/products/dry-drum-magnetic-separator",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/products/air-cooled-electromagnetic-separator",
        destination: "/:locale/products/rcda-type-air-cooled-electromagnetic-iron-remover",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/products/magnetic-grid-magnetic-grate",
        destination: "/:locale/products/magnetic-grid",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/products/eddy-current-separator",
        destination: "/:locale/products/eccentric-eddy-current-separator",
        permanent: true
      },
      {
        // Historical automation configuration exposed this filename. The
        // current segmented sitemap contains the canonical Blog URLs.
        source: "/blog-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true
      },
      {
        source: "/product/ElectromagneticSeries",
        destination: "/en/products?q=electromagnetic",
        permanent: true
      },
      {
        source: "/en/product/ElectromagneticSeries",
        destination: "/en/products?q=electromagnetic",
        permanent: true
      },
      {
        source: "/blog/magnetic-separator-for-waste-recycling-lines",
        destination: "/en/blog/magnetic-separator-for-recycling-selection-and-application-guidelines",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/blog/magnetic-separator-for-waste-recycling-lines",
        destination: "/:locale/blog/magnetic-separator-for-recycling-selection-and-application-guidelines",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/blog-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true
      },
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
        source: "/:locale(en|es|ru|ar|fr|pt)/industries/food-processing",
        destination: "/:locale/industries/food",
        permanent: true
      },
      {
        source: "/industries/food-processing",
        destination: "/en/industries/food",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/applications/waste-processing",
        destination: "/:locale/industries/recycling",
        permanent: true
      },
      {
        source: "/applications/waste-processing",
        destination: "/en/industries/recycling",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/applications/incineration-plant",
        destination: "/:locale/industries/recycling",
        permanent: true
      },
      {
        source: "/applications/incineration-plant",
        destination: "/en/industries/recycling",
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
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/products/electromagnetic-control-cabinet",
        destination: "/:locale/products/kgla-series-rectifier-control-box",
        permanent: true
      },
      {
        source: "/products/electromagnetic-control-cabinet",
        destination: "/en/products/kgla-series-rectifier-control-box",
        permanent: true
      },
      {
        source: "/:locale(en|es|ru|ar|fr|pt)/products/automatic-cleaning-magnetic-separators-for-iron-scrap-waste",
        destination: "/:locale/products/rcyd-type-permanent-magnet-self-dumping-iron-remover",
        permanent: true
      },
      {
        source: "/products/automatic-cleaning-magnetic-separators-for-iron-scrap-waste",
        destination: "/en/products/rcyd-type-permanent-magnet-self-dumping-iron-remover",
        permanent: true
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
      },
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
