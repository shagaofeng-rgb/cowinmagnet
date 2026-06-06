import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/adminApi";
import { fileToDataUrl, parseLines, parseSpecifications, saveCmsItem, slugify } from "@/lib/cmsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function value(formData, key) {
  return String(formData.get(key) || "").trim();
}

export async function POST(request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const title = value(formData, "title");
  const slug = slugify(value(formData, "slug") || title);

  if (!title || !slug) {
    redirect("/admin/products?error=product-required");
  }

  const [selectedCategoryId = "", selectedCategoryTitle = ""] = value(formData, "categoryBundle").split("|||");
  const categoryId = slugify(value(formData, "newCategoryTitle") || selectedCategoryId || "uploaded-products");
  const categoryTitle = value(formData, "newCategoryTitle") || selectedCategoryTitle || "Uploaded Products";
  const imageFile = formData.get("image");
  const image = await fileToDataUrl(imageFile);

  await saveCmsItem({
    type: "product",
    slug,
    title,
    shortTitle: value(formData, "shortTitle") || title,
    categoryId,
    categoryTitle,
    categoryDescription: value(formData, "categoryDescription"),
    summary: value(formData, "summary"),
    overview: value(formData, "overview"),
    application: value(formData, "application"),
    image,
    imageAlt: value(formData, "imageAlt") || `${title} product image`,
    features: parseLines(value(formData, "features")),
    specifications: parseSpecifications(value(formData, "specifications")),
    publishedAt: value(formData, "publishedAt") || new Date().toISOString().slice(0, 10),
    status: "published",
    href: `/products/${slug}`
  });

  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/en/products");
  revalidatePath(`/en/products/${slug}`);
  redirect("/admin/products?saved=product");
}
