/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [52, 72, 96, 128, 256, 320]
  },
  async redirects() {
    return [
      {
        source: "/:locale/news/recycling-metal-contamination-costs",
        destination: "/:locale/news/ai-metal-recovery-platforms-recycling",
        permanent: true
      },
      {
        source: "/:locale/news/conveyor-protection-mining-cement",
        destination: "/:locale/news/tramp-metal-control-conexpo-aggregates",
        permanent: true
      },
      {
        source: "/:locale/news/magnetic-separator-selection-trends",
        destination: "/:locale/news/rare-earth-magnet-recycling-supply-chain",
        permanent: true
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        source: "/:file(robots.txt|sitemap.xml)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
