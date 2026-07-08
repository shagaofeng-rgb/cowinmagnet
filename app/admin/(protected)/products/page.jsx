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
  if (searchParams?.deleted === "product") return "产品已归档，前台不再显示，历史数据仍保留在后台数据库。";
  if (searchParams?.error) return "请至少填写产品标题，系统会自动生成链接。";
  return "";
}

function StatusBadge({ status }) {
  if (status === "archived") return <span className="admin-customer-tag returning">已归档</span>;
  const offline = status === "offline";
  return <span className={`admin-customer-tag ${offline ? "returning" : "new"}`}>{offline ? "已下架" : "已上架"}</span>;
}

const pageSizeOptions = [10, 20, 50, 100];

function pageSizeValue(value) {
  const size = Number(value || 20);
  return pageSizeOptions.includes(size) ? size : 20;
}

function pageValue(value) {
  return Math.max(1, Number(value || 1) || 1);
}

function queryString(params, overrides = {}) {
  const next = new URLSearchParams();
  Object.entries({ ...params, ...overrides }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== "") next.set(key, String(value));
  });
  return `?${next.toString()}`;
}

function Pagination({ params, page, totalPages, total, pageSize }) {
  return (
    <div className="admin-pagination">
      <span>共 {total} 条</span>
      <label className="admin-page-size">
        每页
        <select name="pageSize" defaultValue={pageSize} form="product-filter-form">
          {pageSizeOptions.map((option) => <option value={option} key={option}>{option} 条</option>)}
        </select>
      </label>
      <a className={page <= 1 ? "is-disabled" : ""} href={queryString(params, { page: Math.max(1, page - 1) })}>上一页</a>
      <span>第 {page} / {totalPages} 页</span>
      <a className={page >= totalPages ? "is-disabled" : ""} href={queryString(params, { page: Math.min(totalPages, page + 1) })}>下一页</a>
    </div>
  );
}

export default async function AdminProductsPage({ searchParams }) {
  const params = await searchParams;
  const uploadedProducts = await getCmsItems("product", { includeInactive: true });
  const query = String(params?.q || "").trim().toLowerCase();
  const status = String(params?.status || "all");
  const pageSize = pageSizeValue(params?.pageSize);
  const page = pageValue(params?.page);
  const filteredProducts = uploadedProducts
    .filter((product) => (status === "all" ? true : product.status === status))
    .filter((product) => {
      if (!query) return true;
      return [product.title, product.shortTitle, product.categoryTitle, product.slug, product.summary]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize);
  const filterParams = { q: params?.q || "", status, pageSize };

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
            <p>只展示后台上传的产品。原始产品库仍由代码维护；归档不会删除历史数据。</p>
          </div>
          <span className="admin-result-count">{filteredProducts.length} / {uploadedProducts.length} 条</span>
        </div>
        <form id="product-filter-form" className="admin-filter-bar" method="get">
          <input name="q" defaultValue={params?.q || ""} placeholder="搜索产品名称、分类、Slug、摘要" />
          <select name="status" defaultValue={status}>
            <option value="all">全部状态</option>
            <option value="published">已上架</option>
            <option value="offline">已下架</option>
            <option value="archived">已归档</option>
          </select>
          <input type="hidden" name="page" value="1" />
          <button type="submit">查询</button>
        </form>
        {pageProducts.length ? (
          <>
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
                  {pageProducts.map((product) => (
                    <tr key={product.slug}>
                      <td><StatusBadge status={product.status} /></td>
                      <td>{product.title}</td>
                      <td>{product.categoryTitle}</td>
                      <td>
                        {product.status === "offline" || product.status === "archived" ? (
                          <span className="admin-muted">前台隐藏</span>
                        ) : (
                          <Link href={`/en/products/${product.slug}`} target="_blank">打开</Link>
                        )}
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <form action={`/api/admin/content/products/${product.slug}`} method="post">
                            <input type="hidden" name="action" value={product.status === "published" ? "offline" : "publish"} />
                            <button type="submit">{product.status === "published" ? "下架" : "上架"}</button>
                          </form>
                          <form action={`/api/admin/content/products/${product.slug}`} method="post">
                            <input type="hidden" name="action" value="delete" />
                            <button className="danger" type="submit">归档</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination params={filterParams} page={safePage} totalPages={totalPages} total={filteredProducts.length} pageSize={pageSize} />
          </>
        ) : (
          <div className="admin-empty">当前筛选条件下没有后台上传产品。</div>
        )}
      </section>
    </div>
  );
}
