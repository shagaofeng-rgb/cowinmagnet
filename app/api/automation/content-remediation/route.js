import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cronAuth";
import { markArticleNeedsRevision, remediateRcddGuide, verifyRemediatedArticle } from "@/lib/contentRemediation";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request) {
  if (!isCronAuthorized(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const result = await remediateRcddGuide();
    revalidatePath(`/en/news/${result.slug}`);
    revalidatePath("/en/news");
    revalidatePath("/news-sitemap.xml");
    const delivery = await verifyRemediatedArticle({ slug: result.slug });
    if (!delivery.passed) {
      await markArticleNeedsRevision(result.slug, delivery);
      return NextResponse.json({ success: false, error: "Frontend health verification failed; article was held for revision.", data: { slug: result.slug, delivery } }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json({ success: true, data: { slug: result.slug, validation: { passed: result.validation.passed, warnings: result.validation.warnings }, delivery } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Content remediation failed" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
