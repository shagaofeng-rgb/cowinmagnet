import { listInquirySubmissions } from "@/lib/inquiryStore";
import { safeSitePath } from "@/lib/siteUrlSafety";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "客户表单 | Cowinmagnet 后台"
};

const statusLabels = {
  all: "全部状态",
  new: "新询盘",
  pending: "待联系",
  contacted: "已联系",
  qualified: "有效线索",
  quoted: "报价中",
  won: "已成交",
  lost: "未成交",
  spam: "垃圾信息",
  archived: "已归档"
};

const pageSizeOptions = [10, 20, 50, 100];

function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date(value));
}

function text(value) {
  return String(value || "").trim() || "-";
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
        <select name="pageSize" defaultValue={pageSize} form="inquiry-filter-form">
          {pageSizeOptions.map((option) => (
            <option value={option} key={option}>{option} 条</option>
          ))}
        </select>
      </label>
      <a className={page <= 1 ? "is-disabled" : ""} href={queryString(params, { page: Math.max(1, page - 1) })}>上一页</a>
      <span>第 {page} / {totalPages} 页</span>
      <a className={page >= totalPages ? "is-disabled" : ""} href={queryString(params, { page: Math.min(totalPages, page + 1) })}>下一页</a>
    </div>
  );
}

export default async function AdminInquiriesPage({ searchParams }) {
  const params = await searchParams;
  const query = String(params?.q || "");
  const status = String(params?.status || "all");
  const country = String(params?.country || "all");
  const page = Number(params?.page || 1);
  const pageSize = Number(params?.pageSize || 20);
  const data = await listInquirySubmissions({ q: query, status, country, page, pageSize });
  const filterParams = { q: query, status, country, pageSize: data.pageSize };
  const countries = [...new Set(data.rows.map((item) => item.country).filter(Boolean))].sort();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">客户表单</p>
          <h1>询盘与客户线索管理</h1>
          <p>网站表单提交会先写入持久化数据库，再发送邮件通知。邮件失败也不会丢失客户线索。</p>
        </div>
        <div className={data.storageMode === "database" ? "admin-status good" : "admin-status"}>
          {data.storageMode === "database" ? "数据库持久化" : "本地文件模式"}
        </div>
      </header>

      {params?.updated ? <div className="admin-alert success">询盘状态已更新。</div> : null}

      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">服务端筛选</p>
            <h2>客户提交记录</h2>
            <p>支持关键词、状态、国家筛选和服务端分页；不会一次性加载全部历史数据到浏览器。</p>
          </div>
          <span className="admin-result-count">{data.total} 条记录</span>
        </div>

        <form id="inquiry-filter-form" className="admin-filter-bar admin-filter-bar-inquiries" method="get">
          <input name="q" defaultValue={query} placeholder="搜索姓名、公司、邮箱、电话、国家、页面、留言" />
          <select name="status" defaultValue={status}>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option value={value} key={value}>{label}</option>
            ))}
          </select>
          <select name="country" defaultValue={country}>
            <option value="all">全部国家</option>
            {countries.map((item) => (
              <option value={item} key={item}>{item}</option>
            ))}
          </select>
          <input type="hidden" name="page" value="1" />
          <button type="submit">查询</button>
        </form>

        {data.rows.length ? (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>提交时间</th>
                    <th>状态</th>
                    <th>客户</th>
                    <th>联系方式</th>
                    <th>国家</th>
                    <th>来源页面</th>
                    <th>留言</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDateTime(item.submittedAt)}</td>
                      <td><span className={`admin-customer-tag ${item.status === "new" ? "new" : "returning"}`}>{statusLabels[item.status] || item.status}</span></td>
                      <td>
                        <a className="admin-inquiry-link" href={`/admin/inquiries/${encodeURIComponent(item.id)}`}>
                          <strong>{text(item.name)}</strong>
                        </a>
                        <br />
                        <span className="admin-muted">{text(item.company)}</span>
                      </td>
                      <td>
                        <a href={`mailto:${item.email}`}>{text(item.email)}</a>
                        <br />
                        <span>{text(item.phone)}</span>
                      </td>
                      <td>{text(item.country)}</td>
                      <td>
                        {safeSitePath(item.sourcePath) ? <a href={safeSitePath(item.sourcePath)} target="_blank" rel="noopener noreferrer">{safeSitePath(item.sourcePath)}</a> : "-"}
                        <br />
                        <span className="admin-muted">{text(item.channel)}</span>
                      </td>
                      <td className="admin-message-cell">{text(item.message)}</td>
                      <td>
                        <form className="admin-inline-form" action={`/api/admin/inquiries/${item.id}`} method="post">
                          <select name="status" defaultValue={item.status}>
                            {Object.entries(statusLabels).filter(([value]) => value !== "all").map(([value, label]) => (
                              <option value={value} key={value}>{label}</option>
                            ))}
                          </select>
                          <button type="submit">保存</button>
                        </form>
                        <a className="admin-detail-link" href={`/admin/inquiries/${encodeURIComponent(item.id)}`}>查看详情</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination params={filterParams} page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} />
          </>
        ) : (
          <div className="admin-empty">当前筛选条件下没有客户表单记录。</div>
        )}
      </section>
    </div>
  );
}
