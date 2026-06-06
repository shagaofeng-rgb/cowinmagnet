import Link from "next/link";
import { productCategories } from "@/data/productCatalog";
import { cmsStorageMode, getCmsItems } from "@/lib/cmsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "产品管理 | Cowinmagnet 后台"
};

function statusMessage(searchParams) {
  if (searchParams?.saved === "product") return "产品已保存并上架，前台产品中心会自动读取。";
  if (searchParams?.status === "offline") return "产品已下架，前台不再显示。";
  if (searchParams?.status === "publish") return "产品已重新上架。";
  if (searchParams?.deleted === "product") return "产品已删除。";
  if (searchParams?.error) return "请至少填写产品标题，系统会自动生成链接。";
  return "";
}

function StatusBadge({ status }) {
  const offline = status === "offline";
  return <span className={`admin-customer-tag ${offline ? "returning" : "new"}`}>{offline ? "已下架" : "已上架"}</span>;
}

export default async function AdminProductsPage({ searchParams }) {
  const params = await searchParams;
  const uploadedProducts = await getCmsItems("product", { includeInactive: true });

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">产品管理</p>
          <h1>上传产品与管理上架状态</h1>
          <p>这里专门管理产品。新增产品后会进入产品中心和产品详情页；下架后前台隐藏，删除后后台也不保留。</p>
        </div>
        <div className={cmsStorageMode() === "database" ? "admin-status good" : "admin-status"}>
          {cmsStorageMode() === "database" ? "数据库持久化" : "本地文件模式"}
        </div>
      </header>

      {statusMessage(params) ? <div className="admin-alert">{statusMessage(params)}</div> : null}

      <section className="admin-panel">
        <p className="eyebrow">上传产品</p>
        <h2>新增产品页面</h2>
        <form className="admin-cms-form admin-cms-form-wide" action="/api/admin/content/products" method="post" encType="multipart/form-data">
          <label>
            产品标题 *
            <input name="title" required placeholder="Suspended Permanent Magnetic Separator" />
          </label>
          <label>
            短标题
            <input name="shortTitle" placeholder="Suspended Permanent Magnet" />
          </label>
          <label>
            URL Slug
            <input name="slug" placeholder="auto-generate-if-empty" />
          </label>
          <label>
            产品分类
            <select name="categoryBundle" defaultValue={`${productCategories[0]?.id || ""}|||${productCategories[0]?.title || ""}`}>
              {productCategories.map((category) => (
                <option value={`${category.id}|||${category.title}`} key={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            新分类名称
            <input name="newCategoryTitle" placeholder="填写后会自动创建新分类" />
          </label>
          <label>
            分类说明
            <input name="categoryDescription" placeholder="用于产品分类页说明，可选" />
          </label>
          <label>
            产品图片
            <input name="image" type="file" accept="image/*" />
          </label>
          <label>
            图片 ALT
            <input name="imageAlt" placeholder="Describe the product image for SEO" />
          </label>
          <label className="admin-cms-span-2">
            摘要 *
            <textarea name="summary" required rows={3} placeholder="Brief buyer-focused product summary." />
          </label>
          <label className="admin-cms-span-2">
            应用场景
            <input name="application" placeholder="Recycling, mining, quarry, cement..." />
          </label>
          <label className="admin-cms-span-2">
            详细介绍
            <textarea name="overview" rows={6} placeholder="写产品详情、工作方式、适用工况和选型说明。" />
          </label>
          <label>
            核心特点
            <textarea name="features" rows={6} placeholder={"每行一个特点\nAutomatic cleaning\nCustomized belt width"} />
          </label>
          <label>
            参数
            <textarea name="specifications" rows={6} placeholder={"每行一个参数，格式：参数名: 参数值\nMagnet Type: Permanent magnet\nBelt Width: 500-2000 mm"} />
          </label>
          <button className="admin-submit-button admin-cms-span-2" type="submit">保存并上架产品</button>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">已上传产品</p>
            <h2>产品列表</h2>
            <p>只展示后台上传的产品。原始产品库仍由代码维护。</p>
          </div>
        </div>
        {uploadedProducts.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>状态</th>
                  <th>产品</th>
                  <th>分类</th>
                  <th>前台链接</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {uploadedProducts.map((product) => (
                  <tr key={product.slug}>
                    <td><StatusBadge status={product.status} /></td>
                    <td>{product.title}</td>
                    <td>{product.categoryTitle}</td>
                    <td>
                      {product.status === "offline" ? (
                        <span className="admin-muted">已下架</span>
                      ) : (
                        <Link href={`/en/products/${product.slug}`} target="_blank">打开</Link>
                      )}
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <form action={`/api/admin/content/products/${product.slug}`} method="post">
                          <input type="hidden" name="action" value={product.status === "offline" ? "publish" : "offline"} />
                          <button type="submit">{product.status === "offline" ? "上架" : "下架"}</button>
                        </form>
                        <form action={`/api/admin/content/products/${product.slug}`} method="post">
                          <input type="hidden" name="action" value="delete" />
                          <button className="danger" type="submit">删除</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">还没有从后台上传的新产品。</div>
        )}
      </section>
    </div>
  );
}
