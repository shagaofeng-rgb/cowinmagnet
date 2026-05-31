/** @type {import('next').NextConfig} */
const nextConfig = {
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
      }
    ];
  }
};

export default nextConfig;
