import { applications } from "@/data/applications";
import { blogPosts } from "@/data/blogs";
import { getNewsPosts } from "@/data/contentHub";
import { requireAdminApi } from "@/lib/adminApi";
import { getProductsWithCms } from "@/lib/productCms";
import { cmsStorageMode, getCmsItems } from "@/lib/cmsStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const [allProducts, allNews, cmsProducts, cmsNews] = await Promise.all([
    getProductsWithCms(),
    getNewsPosts(),
    getCmsItems("product", { includeInactive: true }),
    getCmsItems("news", { includeInactive: true })
  ]);

  return Response.json({
    products: allProducts.length,
    blogPosts: blogPosts.length,
    newsPosts: allNews.length,
    applications: applications.length,
    cmsProducts: cmsProducts.length,
    cmsNews: cmsNews.length,
    cmsStorageMode: cmsStorageMode()
  });
}
