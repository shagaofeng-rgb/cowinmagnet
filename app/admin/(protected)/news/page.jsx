import Link from "next/link";
import { newsCategories } from "@/data/contentHub";
import { cmsStorageMode, getCmsItems } from "@/lib/cmsStore";
import AdminDateRangeFilter from "@/components/admin/AdminDateRangeFilter";
import AdminEditorDrawer from "@/components/admin/AdminEditorDrawer";
import { getAdminDateRange } from "@/lib/adminDateRange";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "新闻管理 | Cowinmagnet 后台"
};

function statusMessage(searchParams) {
  if (searchParams?.saved === "news") return "新闻已保存。已发布内容会同步到前台新闻页面，草稿仅在后台保留。";
  if (searchParams?.status === "draft" || searchParams?.status === "offline") return "新闻已设为草稿，前台不再显示。";
  if (searchParams?.status === "publish") return "新闻已发布，前台 News 页面会自动读取。";
  if (searchParams?.deleted === "news") return "新闻已归档，前台不再显示，历史内容仍保留在后台数据库。";
  if (searchParams?.error) return "请至少填写新闻标题，系统会自动生成页面链接。";
  return "";
}

function StatusBadge({ status }) {
  if (status === "archived") return <span className="admin-customer-tag returning">已归档</span>;
  const published = status === "published";
  return <span className={`admin-customer-tag ${published ? "new" : "returning"}`}>{published ? "已发布" : "草稿"}</span>;
}

const pageSizeOptions = [10, 20, 50, 100];

function pageSizeValue(value) {
  const size = Number(value || 10);
  return pageSizeOptions.includes(size) ? size : 10;
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
        <select name="pageSize" defaultValue={pageSize} form="news-filter-form">
          {pageSizeOptions.map((option) => <option value={option} key={option}>{option} 条</option>)}
        </select>
      </label>
      <a className={page <= 1 ? "is-disabled" : ""} href={queryString(params, { page: Math.max(1, page - 1) })}>上一页</a>
      <span>第 {page} / {totalPages} 页</span>
      <a className={page >= totalPages ? "is-disabled" : ""} href={queryString(params, { page: Math.min(totalPages, page + 1) })}>下一页</a>
    </div>
  );
}

function ImageStatus({ post }) {
  const image = post.sourceImage || {};
  const status = image.imageStatus || (post.coverImage ? "valid" : "none");
  const mode = image.imageUsageMode || (post.coverImage ? "remote" : "none");
  const statusLabel = { valid: "正常", synced: "已同步", review_required: "待复核", failed: "加载失败", none: "无图片" }[status] || "待复核";
  const modeLabel = { remote: "远程图片", "controlled-storage": "本地图片", "processed-proxy": "已处理图片", review: "待复核", none: "未使用" }[mode] || "其他来源";
  return (
    <div className="admin-muted">
      <strong>{statusLabel}</strong> / {modeLabel}
      {image.imageWidth && image.imageHeight ? <span> - {image.imageWidth}x{image.imageHeight}</span> : null}
      {image.sourceName ? <span> - {image.sourceName}</span> : null}
      {image.fetchedAt ? <span> - {new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "short", timeStyle: "medium" }).format(new Date(image.fetchedAt))}</span> : null}
      {image.originalImageUrl ? (
        <>
          <br />
          <a href={image.originalImageUrl} target="_blank" rel="noopener noreferrer nofollow">原始图片</a>
        </>
      ) : null}
      {image.localImageUrl ? (
        <>
          {" | "}
          <a href={image.localImageUrl} target="_blank" rel="noopener noreferrer">本地图片</a>
        </>
      ) : null}
      {image.sourcePageUrl ? (
        <>
          {" | "}
          <a href={image.sourcePageUrl} target="_blank" rel="noopener noreferrer nofollow">来源页面</a>
        </>
      ) : null}
      {image.imageFailureReason ? (
        <>
          <br />
          <span>图片备注：{image.imageFailureReason}</span>
        </>
      ) : null}
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(`${String(value).slice(0, 10)}T00:00:00Z`).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

export default async function AdminNewsPage({ searchParams }) {
  const params = await searchParams;
  const range = getAdminDateRange(params, { allowAll: true, defaultPreset: "all" });
  const uploadedNews = await getCmsItems("news", { includeInactive: true, requireDatabase: true });
  const query = String(params?.q || "").trim().toLowerCase();
  const status = String(params?.status || "all");
  const category = String(params?.category || "all");
  const view = params?.view === "images" ? "images" : "list";
  const pageSize = pageSizeValue(params?.pageSize);
  const page = pageValue(params?.page);

  const filteredNews = uploadedNews
    .filter((post) => {
      const date = new Date(post.updatedAt || post.createdAt || post.publishedAt || 0);
      return !Number.isNaN(date.getTime()) && date >= range.startDate && date <= range.endDate;
    })
    .filter((post) => (status === "all" ? true : post.status === status))
    .filter((post) => (category === "all" ? true : post.category === category))
    .filter((post) => {
      if (!query) return true;
      return [post.title, post.excerpt, post.categoryTitle, post.category, post.author, post.source]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
  const totalPages = Math.max(1, Math.ceil(filteredNews.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageNews = filteredNews.slice((safePage - 1) * pageSize, safePage * pageSize);
  const filterParams = { q: params?.q || "", status, category, view, pageSize, range: range.preset, start: range.preset === "custom" ? range.startInput : "", end: range.preset === "custom" ? range.endInput : "" };

  return (
    <div className="admin-page admin-news-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">新闻管理</p>
          <h1>新闻发布与管理</h1>
          <p>
            新闻用于行业动态、技术趋势、公司观点和项目消息；博客用于产品知识、技术教程和应用方案。
          </p>
        </div>
        <div className={cmsStorageMode() === "database" ? "admin-status good" : "admin-status"}>
          {cmsStorageMode() === "database" ? "内容状态正常" : "内容暂不可用"}
        </div>
      </header>
      <AdminDateRangeFilter range={range} allowAll />

      {statusMessage(params) ? <div className="admin-alert">{statusMessage(params)}</div> : null}

      <AdminEditorDrawer title="新增新闻">
        <p className="admin-muted">
          填写已有的链接标识可更新对应新闻。未选择发布时间时，默认使用创建当天。
        </p>
        <form className="admin-cms-form admin-cms-form-wide" action="/api/admin/content/news" method="post" encType="multipart/form-data">
          <label>
            新闻标题 *
            <input name="title" required placeholder="Magnetic Separation Market Update" />
          </label>
          <label>
            页面链接标识（Slug）
            <input name="slug" placeholder="留空则自动生成" />
          </label>
          <label>
            新闻分类
            <select name="categoryBundle" defaultValue={`${newsCategories[0]?.slug || ""}|||${newsCategories[0]?.title || ""}`}>
              {newsCategories.map((item) => (
                <option value={`${item.slug}|||${item.title}`} key={item.slug}>{item.title}</option>
              ))}
            </select>
          </label>
          <label>
            新分类名称
            <input name="newCategoryTitle" placeholder="填写后会创建自定义 News 分类" />
          </label>
          <label>
            分类说明
            <input name="categoryDescription" placeholder="用于前台分类说明，可选" />
          </label>
          <label>
            发布时间
            <input name="publishedAt" type="date" />
          </label>
          <label>
            发布状态
            <select name="status" defaultValue="published">
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
            </select>
          </label>
          <label>
            封面图
            <input name="image" type="file" accept="image/*" />
          </label>
          <label>
            作者
            <input name="author" placeholder="David Sha / Cowinmagnet Team" />
          </label>
          <label>
            来源
            <input name="source" placeholder="Company insight / Industry source" />
          </label>
          <label>
            标签
            <input name="tags" placeholder="recycling, mining, magnetic separator" />
          </label>
          <label>
            图片 ALT
            <input name="coverAlt" placeholder="描述图片内容，供无障碍阅读和搜索展示使用" />
          </label>
          <label className="admin-cms-span-2">
            图片说明
            <input name="imageCaption" placeholder="展示在图片下方的说明" />
          </label>
          <label className="admin-cms-span-2">
            新闻摘要
            <textarea name="excerpt" rows={3} placeholder="用于新闻卡片和页面简介的简短摘要" />
          </label>
          <label>
            SEO Title
            <input name="seoTitle" placeholder="留空则使用新闻标题" />
          </label>
          <label>
            SEO Description
            <input name="seoDescription" placeholder="留空则使用新闻摘要" />
          </label>
          <label className="admin-cms-span-2">
            正文内容 *
            <textarea
              name="content"
              required
              rows={14}
              placeholder={"第一行可以作为段落标题，下面写正文。\n\nWhat Happened\n写行业新闻事实摘要。\n\nWhy Buyers Should Care\n写对海外采购商的影响。\n\nCowinmagnet Viewpoint\n写我们自己的观点、分析和建议。"}
            />
          </label>
          <button className="admin-submit-button admin-cms-span-2" type="submit">保存新闻</button>
        </form>
      </AdminEditorDrawer>

      <nav className="admin-content-tabs" aria-label="新闻管理分类">
        <Link href={queryString(filterParams, { view: "list", page: 1 })} aria-current={view === "list" ? "page" : undefined}>新闻列表</Link>
        <Link href={queryString(filterParams, { view: "images", page: 1 })} aria-current={view === "images" ? "page" : undefined}>图片管理</Link>
      </nav>

      {view === "list" ? <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">新闻列表</p>
            <h2>已上传新闻</h2>
            <p>按标题、状态、分类和发布时间查找新闻。归档后仍可查看历史记录。</p>
          </div>
          <span className="admin-result-count">{filteredNews.length} / {uploadedNews.length} 条</span>
        </div>

        <form id="news-filter-form" className="admin-filter-bar" method="get">
          <input name="q" defaultValue={params?.q || ""} placeholder="搜索标题、摘要、作者、来源" />
          <select name="status" defaultValue={status}>
            <option value="all">全部状态</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
            <option value="archived">已归档</option>
          </select>
          <select name="category" defaultValue={category}>
            <option value="all">全部分类</option>
            {newsCategories.map((item) => (
              <option value={item.slug} key={item.slug}>{item.title}</option>
            ))}
          </select>
          <input type="hidden" name="page" value="1" />
          <input type="hidden" name="view" value={view} />
          <button type="submit">查询</button>
        </form>

        {pageNews.length ? (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>状态</th>
                    <th>新闻标题</th>
                    <th>分类</th>
                    <th>发布时间</th>
                    <th>Slug</th>
                    <th>前台链接</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {pageNews.map((post) => (
                    <tr key={post.slug}>
                      <td><StatusBadge status={post.status} /></td>
                      <td>
                        {post.title}
                      </td>
                      <td>{post.categoryTitle || post.category}</td>
                      <td>{formatDate(post.publishedAt)}</td>
                      <td>{post.slug}</td>
                      <td>
                        {post.status === "published" ? (
                          <Link href={`/en/news/${post.slug}`} target="_blank">打开</Link>
                        ) : (
                          <span className="admin-muted">前台隐藏</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <form action={`/api/admin/content/news/${post.slug}`} method="post">
                            <input type="hidden" name="action" value={post.status === "published" ? "draft" : "publish"} />
                            <button type="submit">{post.status === "published" ? "设为草稿" : "发布"}</button>
                          </form>
                          <form action={`/api/admin/content/news/${post.slug}`} method="post">
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
            <Pagination params={filterParams} page={safePage} totalPages={totalPages} total={filteredNews.length} pageSize={pageSize} />
          </>
        ) : (
          <div className="admin-empty">当前筛选条件下没有新闻。</div>
        )}
      </section> : null}

      {view === "images" ? <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">新闻图片</p>
            <h2>图片来源与使用状态</h2>
            <p className="admin-muted">查看封面图、来源链接、尺寸和使用状态。</p>
          </div>
        </div>

        <form id="news-filter-form" className="admin-filter-bar" method="get">
          <input name="q" defaultValue={params?.q || ""} placeholder="搜索标题、摘要、作者、来源" />
          <select name="status" defaultValue={status}>
            <option value="all">全部状态</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
            <option value="archived">已归档</option>
          </select>
          <select name="category" defaultValue={category}>
            <option value="all">全部分类</option>
            {newsCategories.map((item) => <option value={item.slug} key={item.slug}>{item.title}</option>)}
          </select>
          <input type="hidden" name="view" value={view} />
          <input type="hidden" name="page" value="1" />
          <button type="submit">查询</button>
        </form>

        {pageNews.length ? (
          <><div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>新闻</th>
                  <th>当前图片</th>
                  <th>来源资料</th>
                  <th>图片操作</th>
                </tr>
              </thead>
              <tbody>
                {pageNews.map((post) => (
                  <tr key={`image-${post.slug}`}>
                    <td>{post.title}</td>
                    <td>
                      {post.coverImage ? <a href={post.coverImage} target="_blank" rel="noopener noreferrer nofollow">查看当前图片</a> : <span className="admin-muted">暂无图片</span>}
                      <ImageStatus post={post} />
                    </td>
                    <td>
                      {post.sourceImage?.sourcePageUrl ? <a href={post.sourceImage.sourcePageUrl} target="_blank" rel="noopener noreferrer nofollow">来源页面</a> : <span className="admin-muted">暂无来源页面</span>}
                      {post.sourceImage?.originalImageUrl ? <><br /><a href={post.sourceImage.originalImageUrl} target="_blank" rel="noopener noreferrer nofollow">原始图片链接</a></> : null}
                      {post.sourceImage?.localImageUrl ? <><br /><a href={post.sourceImage.localImageUrl} target="_blank" rel="noopener noreferrer">本地图片链接</a></> : null}
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <form action={`/api/admin/content/news/${post.slug}`} method="post">
                          <input type="hidden" name="action" value="use-remote-image" />
                          <button type="submit">使用远程图片</button>
                        </form>
                        <form action={`/api/admin/content/news/${post.slug}`} method="post">
                          <input type="hidden" name="action" value="save-local-image" />
                          <button type="submit">保存本地图片</button>
                        </form>
                        <form action={`/api/admin/content/news/${post.slug}`} method="post">
                          <input type="hidden" name="action" value="remove-image" />
                          <button className="danger" type="submit">移除图片</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination params={filterParams} page={safePage} totalPages={totalPages} total={filteredNews.length} pageSize={pageSize} /></>
        ) : (
          <div className="admin-empty">暂无需要管理的新闻图片。</div>
        )}
      </section> : null}

    </div>
  );
}
