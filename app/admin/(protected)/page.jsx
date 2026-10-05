import AdminDateRangeFilter from "@/components/admin/AdminDateRangeFilter";
import { AdminOverviewRealtime } from "@/components/admin/AdminRealtimePanels";
import { applications } from "@/data/applications";
import { blogPosts } from "@/data/blogs";
import { getNewsPosts } from "@/data/contentHub";
import { getProductsWithCms } from "@/lib/productCms";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";
import { cmsStorageMode, getCmsItems } from "@/lib/cmsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "数据总览 | Cowinmagnet 后台"
};

export default async function AdminOverviewPage({ searchParams }) {
  const range = getAdminDateRange(await searchParams);
  const rangeKey = `${range.preset}:${range.startInput}:${range.endInput}`;
  const [data, allProducts, allNews, cmsProducts, cmsNews] = await Promise.all([
    getAnalyticsSnapshot(range),
    getProductsWithCms(),
    getNewsPosts(),
    getCmsItems("product", { includeInactive: true, requireDatabase: true }),
    getCmsItems("news", { includeInactive: true, requireDatabase: true })
  ]);

  return (
    <div className="admin-page admin-overview">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">数据总览</p>
          <h1>分析画布</h1>
          <p>从流量趋势、来源渠道到用户行为，全面洞察网站表现，助力市场策略优化。</p>
        </div>
        <AdminDateRangeFilter key={rangeKey} range={range} />
      </header>

      <AdminOverviewRealtime
        key={rangeKey}
        initialData={data}
        contentStats={{
          products: allProducts.length,
          blogPosts: blogPosts.length,
          newsPosts: allNews.length,
          applications: applications.length,
          cmsProducts: cmsProducts.length,
          cmsNews: cmsNews.length,
          cmsStorageMode: cmsStorageMode()
        }}
      />
    </div>
  );
}
