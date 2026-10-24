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

  const [productsResult, newsResult, cmsProductsResult, cmsNewsResult] = await Promise.allSettled([
    getProductsWithCms(),
    getNewsPosts(),
    getCmsItems("product", { includeInactive: true, requireDatabase: true }),
    getCmsItems("news", { includeInactive: true, requireDatabase: true })
  ]);
  const contentAvailable = cmsProductsResult.status === "fulfilled" && cmsNewsResult.status === "fulfilled";

  return Response.json({
    products: contentAvailable && productsResult.status === "fulfilled" ? productsResult.value.length : null,
    blogPosts: blogPosts.length,
    newsPosts: contentAvailable && newsResult.status === "fulfilled" ? newsResult.value.length : null,
    applications: applications.length,
    cmsProducts: cmsProductsResult.status === "fulfilled" ? cmsProductsResult.value.length : null,
    cmsNews: cmsNewsResult.status === "fulfilled" ? cmsNewsResult.value.length : null,
    cmsStorageMode: cmsStorageMode()
  }, { headers: { "Cache-Control": "no-store" } });
}
