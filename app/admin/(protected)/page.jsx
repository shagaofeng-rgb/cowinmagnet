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
  const [data, allProducts, allNews, cmsProducts, cmsNews] = await Promise.all([
    getAnalyticsSnapshot(range),
    getProductsWithCms(),
    getNewsPosts(),
    getCmsItems("product", { includeInactive: true }),
    getCmsItems("news", { includeInactive: true })
  ]);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">数据总览</p>
          <h1>网站数据总览</h1>
          <p>集中查看 B2B 访客行为、询盘信号、SEO 搜索表现、页面转化和前台内容同步状态。</p>
        </div>
        <AdminDateRangeFilter range={range} />
      </header>

      <AdminOverviewRealtime
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
