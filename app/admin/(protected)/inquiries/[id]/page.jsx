import Link from "next/link";
import { notFound } from "next/navigation";
import { getInquirySubmissionDetail } from "@/lib/inquiryStore";
import { safeSitePath, safeSiteUrl } from "@/lib/siteUrlSafety";

export const dynamic = "force-dynamic";

const statusLabels = {
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

const eventLabels = {
  page_view: "浏览页面",
  session_end: "结束浏览",
  scroll_depth: "页面滚动",
  form_submit: "提交表单",
  submit_inquiry: "提交询盘",
  form_success: "表单提交成功",
  click_whatsapp: "点击 WhatsApp",
  click_email: "点击邮箱",
  click_phone: "点击电话",
  outbound_link_click: "点击外部链接"
};

function text(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || "-";
  return String(value || "").trim() || "-";
}

function formatDateTime(value) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "-";
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

function touchSummary(touch = {}) {
  return [touch.channel, touch.source, touch.medium, touch.campaign]
    .filter(Boolean)
    .map(String)
    .join(" · ") || "未记录";
}

function detailsFromPayload(inquiry) {
  const payload = inquiry.payload || {};
  const fields = [
    ["意向产品", payload.productName || payload.productRequirement || payload.requiredProduct],
    ["产品型号", payload.productModel],
    ["产品系列", payload.productFamily],
    ["应用行业", payload.applicationIndustry || payload.industry],
    ["处理物料", payload.materialType || payload.material],
    ["皮带宽度", payload.beltWidth],
    ["安装位置", payload.installationPosition || payload.installation],
    ["预计数量", payload.expectedQuantity],
    ["选型信息", payload.selectionDetails],
    ["附件说明", payload.attachmentNote],
    ["客户类型", payload.buyerType]
  ];

  return fields.filter(([, value]) => text(value) !== "-");
}

function VisitorHistory({ visitorHistory }) {
  if (visitorHistory.matchMethod === "unavailable") {
    return (
      <div className="admin-history-empty">
        该历史表单提交时尚未保存可验证的访客标识，因此不能安全关联浏览轨迹。新提交的表单将自动保存访客和会话标识。
      </div>
    );
  }

  if (!visitorHistory.available) {
    return <div className="admin-history-empty">分析数据库暂未连接，当前无法读取访客浏览记录。</div>;
  }

  if (!visitorHistory.events.length) {
    return <div className="admin-history-empty">已保存访客标识，但在提交前 90 天至提交后 30 天内没有可用访问事件。</div>;
  }

  return (
    <div className="admin-visitor-history">
      {visitorHistory.events.map((event, index) => {
        const eventTouch = event.attribution?.sessionTouch || event.attribution?.lastTouch || {};
        const context = [event.channel || eventTouch.channel, event.country, event.device, event.browser]
          .filter(Boolean)
          .join(" · ");
        return (
          <article className="admin-visitor-event" key={`${event.timestamp}-${event.type}-${index}`}>
            <div className="admin-visitor-event-head">
              <strong>{eventLabels[event.type] || event.type}</strong>
              <time dateTime={event.timestamp}>{formatDateTime(event.timestamp)}</time>
            </div>
            <p>{text(text(event.pageTitle) !== "-" ? event.pageTitle : event.page)}</p>
            <div className="admin-visitor-event-meta">
              {event.page ? <span>{event.page}</span> : null}
              {event.previousPage ? <span>来自 {event.previousPage}</span> : null}
              {context ? <span>{context}</span> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default async function AdminInquiryDetailPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const detail = await getInquirySubmissionDetail(id);
  if (!detail) notFound();

  const { inquiry, visitorHistory } = detail;
  const payloadDetails = detailsFromPayload(inquiry);
  const detailPath = `/admin/inquiries/${encodeURIComponent(inquiry.id)}`;
  const attribution = inquiry.attribution || {};
  const sourcePath = safeSitePath(inquiry.sourcePath);
  const pageUrl = safeSiteUrl(inquiry.pageUrl);

  return (
    <div className="admin-page admin-inquiry-detail-page">
      <header className="admin-page-head admin-detail-head">
        <div>
          <Link className="admin-back-link" href="/admin/inquiries">返回客户表单</Link>
          <p className="eyebrow">客户线索详情</p>
          <h1>{text(inquiry.name)}</h1>
          <p>提交于 {formatDateTime(inquiry.submittedAt)}。客户浏览轨迹只按本次表单保存的访客或会话标识关联。</p>
        </div>
        <div className="admin-detail-status">
          <span className={`admin-customer-tag ${inquiry.status === "new" ? "new" : "returning"}`}>
            {statusLabels[inquiry.status] || inquiry.status}
          </span>
          <form className="admin-detail-status-form" action={`/api/admin/inquiries/${encodeURIComponent(inquiry.id)}`} method="post">
            <input type="hidden" name="returnTo" value={detailPath} />
            <select name="status" defaultValue={inquiry.status} aria-label="更新询盘状态">
              {Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
            <button type="submit">保存状态</button>
          </form>
        </div>
      </header>

      {query?.updated ? <div className="admin-alert success">询盘状态已更新。</div> : null}

      <div className="admin-detail-layout">
        <section className="admin-panel admin-detail-section">
          <div className="admin-panel-headline">
            <div>
              <p className="eyebrow">客户资料</p>
              <h2>联系与项目需求</h2>
            </div>
            <span className="admin-result-count">{inquiry.formType || "inquiry"}</span>
          </div>

          <div className="admin-detail-field-grid">
            <div><span>姓名</span><strong>{text(inquiry.name)}</strong></div>
            <div><span>公司</span><strong>{text(inquiry.company)}</strong></div>
            <div><span>邮箱</span><strong><a href={`mailto:${inquiry.email}`}>{text(inquiry.email)}</a></strong></div>
            <div><span>电话 / WhatsApp</span><strong>{text(inquiry.phone)}</strong></div>
            <div><span>国家 / 地区</span><strong>{text(inquiry.country)}</strong></div>
            <div><span>来源渠道</span><strong>{text(inquiry.channel)}</strong></div>
          </div>

          {payloadDetails.length ? (
            <>
              <h3 className="admin-detail-subheading">产品与选型信息</h3>
              <div className="admin-detail-field-grid">
                {payloadDetails.map(([label, value]) => <div key={label}><span>{label}</span><strong>{text(value)}</strong></div>)}
              </div>
            </>
          ) : null}

          <h3 className="admin-detail-subheading">客户留言</h3>
          <div className="admin-detail-message">{text(inquiry.message)}</div>
        </section>

        <aside className="admin-panel admin-detail-section">
          <div className="admin-panel-headline">
            <div>
              <p className="eyebrow">来源归因</p>
              <h2>访问与营销来源</h2>
            </div>
          </div>
          <dl className="admin-detail-definition-list">
            <div><dt>来源页面</dt><dd>{sourcePath ? <a href={sourcePath} target="_blank" rel="noopener noreferrer">{sourcePath}</a> : "-"}</dd></div>
            <div><dt>页面地址</dt><dd>{pageUrl ? <a href={pageUrl} target="_blank" rel="noopener noreferrer">打开来源页</a> : "-"}</dd></div>
            <div><dt>首次来源</dt><dd>{touchSummary(attribution.firstTouch)}</dd></div>
            <div><dt>最近来源</dt><dd>{touchSummary(attribution.lastTouch)}</dd></div>
            <div><dt>本次会话</dt><dd>{touchSummary(attribution.sessionTouch)}</dd></div>
            <div><dt>记录方式</dt><dd>{detail.storageMode === "database" ? "数据库持久化" : "本地文件模式"}</dd></div>
          </dl>
        </aside>
      </div>

      <section className="admin-panel admin-detail-section admin-detail-history-section">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">真实分析事件</p>
            <h2>客户访客浏览记录</h2>
            <p>显示提交前 90 天至提交后 30 天内，由同一访客或同一会话标识直接关联的事件；不通过 IP、邮箱或推测方式合并客户。</p>
          </div>
          <span className="admin-result-count">{visitorHistory.events.length} 条事件</span>
        </div>
        <VisitorHistory visitorHistory={visitorHistory} />
      </section>
    </div>
  );
}
