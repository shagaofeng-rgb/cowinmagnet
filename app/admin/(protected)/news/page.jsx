import Link from "next/link";
import { newsCategories } from "@/data/contentHub";
import { cmsStorageMode, getCmsItems } from "@/lib/cmsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "新闻管理 | Cowinmagnet 后台"
};

function statusMessage(searchParams) {
  if (searchParams?.saved === "news") return "新闻已保存。Published 状态会同步到前台 News 页面，Draft 状态仅后台保留。";
  if (searchParams?.status === "draft" || searchParams?.status === "offline") return "新闻已设为草稿，前台不再显示。";
  if (searchParams?.status === "publish") return "新闻已发布，前台 News 页面会自动读取。";
  if (searchParams?.deleted === "news") return "新闻已删除。";
  if (searchParams?.error) return "请至少填写新闻标题，系统会自动生成 URL Slug。";
  return "";
}

function StatusBadge({ status }) {
  const published = status === "published";
  return <span className={`admin-customer-tag ${published ? "new" : "returning"}`}>{published ? "Published" : "Draft"}</span>;
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
  const uploadedNews = await getCmsItems("news", { includeInactive: true });
  const query = String(params?.q || "").trim().toLowerCase();
  const status = String(params?.status || "all");
  const category = String(params?.category || "all");

  const filteredNews = uploadedNews
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

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">新闻管理</p>
          <h1>News 发布与管理</h1>
          <p>
            News 用于行业新闻、市场动态、技术趋势、公司观点和项目动态。Blog 继续用于产品知识、技术教程和应用方案，两者内容类型分开管理。
          </p>
        </div>
        <div className={cmsStorageMode() === "database" ? "admin-status good" : "admin-status"}>
          {cmsStorageMode() === "database" ? "数据库持久化" : "本地文件模式"}
        </div>
      </header>

      {statusMessage(params) ? <div className="admin-alert">{statusMessage(params)}</div> : null}

      <section className="admin-panel">
        <p className="eyebrow">创建 / 覆盖 News</p>
        <h2>新增新闻内容</h2>
        <p className="admin-muted">
          如果填写已存在的 Slug，系统会覆盖该新闻内容，可作为编辑使用。未选择发布时间时，默认使用创建当天。
        </p>
        <form className="admin-cms-form admin-cms-form-wide" action="/api/admin/content/news" method="post" encType="multipart/form-data">
          <label>
            Title 新闻标题 *
            <input name="title" required placeholder="Magnetic Separation Market Update" />
          </label>
          <label>
            Slug URL 别名
            <input name="slug" placeholder="auto-generate-if-empty" />
          </label>
          <label>
            Category 新闻分类
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
            Publish Date 发布时间
            <input name="publishedAt" type="date" />
          </label>
          <label>
            Status 发布状态
            <select name="status" defaultValue="published">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <label>
            Cover Image 封面图
            <input name="image" type="file" accept="image/*" />
          </label>
          <label>
            Author 作者
            <input name="author" placeholder="David Sha / Cowinmagnet Team" />
          </label>
          <label>
            Source 来源
            <input name="source" placeholder="Company insight / Industry source" />
          </label>
          <label>
            Tags 标签
            <input name="tags" placeholder="recycling, mining, magnetic separator" />
          </label>
          <label>
            图片 ALT
            <input name="coverAlt" placeholder="Describe the news image for SEO" />
          </label>
          <label className="admin-cms-span-2">
            图片说明
            <input name="imageCaption" placeholder="Caption displayed under the image" />
          </label>
          <label className="admin-cms-span-2">
            Excerpt 新闻摘要
            <textarea name="excerpt" rows={3} placeholder="Short summary for news cards and SEO description." />
          </label>
          <label>
            SEO Title
            <input name="seoTitle" placeholder="Leave empty to use the news title" />
          </label>
          <label>
            SEO Description
            <input name="seoDescription" placeholder="Leave empty to use the excerpt" />
          </label>
          <label className="admin-cms-span-2">
            Content 正文内容 *
            <textarea
              name="content"
              required
              rows={14}
              placeholder={"第一行可以作为段落标题，下面写正文。\n\nWhat Happened\n写行业新闻事实摘要。\n\nWhy Buyers Should Care\n写对海外采购商的影响。\n\nCowinmagnet Viewpoint\n写我们自己的观点、分析和建议。"}
            />
          </label>
          <button className="admin-submit-button admin-cms-span-2" type="submit">保存 News</button>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">News 列表</p>
            <h2>已上传新闻</h2>
            <p>支持搜索、状态筛选、分类筛选和按发布时间倒序展示。</p>
          </div>
        </div>

        <form className="admin-filter-bar" method="get">
          <input name="q" defaultValue={params?.q || ""} placeholder="搜索标题、摘要、作者、来源" />
          <select name="status" defaultValue={status}>
            <option value="all">全部状态</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select name="category" defaultValue={category}>
            <option value="all">全部分类</option>
            {newsCategories.map((item) => (
              <option value={item.slug} key={item.slug}>{item.title}</option>
            ))}
          </select>
          <button type="submit">查询</button>
        </form>

        {filteredNews.length ? (
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
                {filteredNews.map((post) => (
                  <tr key={post.slug}>
                    <td><StatusBadge status={post.status} /></td>
                    <td>{post.title}</td>
                    <td>{post.categoryTitle || post.category}</td>
                    <td>{formatDate(post.publishedAt)}</td>
                    <td>{post.slug}</td>
                    <td>
                      {post.status === "published" ? (
                        <Link href={`/en/news/${post.slug}`} target="_blank">打开</Link>
                      ) : (
                        <span className="admin-muted">草稿未展示</span>
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
          <div className="admin-empty">当前筛选条件下没有后台上传的 News。</div>
        )}
      </section>
    </div>
  );
}
