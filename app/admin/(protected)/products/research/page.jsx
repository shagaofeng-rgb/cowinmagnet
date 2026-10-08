import Link from "next/link";
import { getProductResearchCards } from "@/lib/productResearch";

export const dynamic = "force-dynamic";
export const metadata = { title: "产品资料审核 | Cowinmagnet 后台" };

const PAGE_SIZE = 20;

function pageNumber(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : 1;
}

function reviewStatus(value) {
  return { draft: "草稿", review: "审核中", published: "已发布" }[value] || "待审核";
}

function confirmed(card) {
  return card?.supplier_confirmation?.confirmed === true || card?.supplier_confirmation?.confirmed === "true";
}

export default async function ProductResearchPage({ searchParams }) {
  const cards = await getProductResearchCards();
  const params = await searchParams;
  const totalPages = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
  const page = Math.min(pageNumber(params?.page), totalPages);
  const pageCards = cards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">产品资料</p>
          <h1>产品资料与供应商确认</h1>
          <p>在这里核对供应商文件和技术参数。只有完成确认并审核发布的资料才会用于前台产品页面。</p>
        </div>
        <Link className="admin-submit-button" href="/admin/products">返回产品管理</Link>
      </header>
      {params?.saved ? <div className="admin-alert success">产品资料已保存。完成供应商确认和发布审核后，相关参数才会在前台展示。</div> : null}
      {params?.error ? <div className="admin-alert warning">请选择有效的产品并填写必要信息。</div> : null}
      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div><p className="eyebrow">资料列表</p><h2>产品资料（{cards.length}）</h2></div>
          <span className="admin-result-count">已获供应商确认 {cards.filter(confirmed).length}</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>产品</th><th>类型</th><th>资料来源</th><th>已确认参数</th><th>审核状态</th><th>供应商确认</th></tr></thead>
            <tbody>{pageCards.map((card) => <tr key={card.product_id}>
              <td><strong>{card.public_name}</strong><br /><small>{card.product_id}</small></td>
              <td>{card.product_type}</td><td>{card.source_count}</td><td>{card.confirmed_fact_count}</td>
              <td>{reviewStatus(card.public_content_status)}</td><td>{confirmed(card) ? "已确认" : "待确认"}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <nav className="admin-pagination" aria-label="产品资料分页">
          <span>共 {cards.length} 条，每页 {PAGE_SIZE} 条</span>
          {page > 1 ? <Link href={`?page=${page - 1}`}>上一页</Link> : <span>上一页</span>}
          <span>第 {page} / {totalPages} 页</span>
          {page < totalPages ? <Link href={`?page=${page + 1}`}>下一页</Link> : <span>下一页</span>}
        </nav>
      </section>
      <section className="admin-panel">
        <p className="eyebrow">资料审核</p>
        <h2>确认产品技术资料</h2>
        <p>请依据供应商确认的参数表或图纸填写。未完成供应商确认及发布审核前，所填参数不会在前台展示。</p>
        <form className="admin-cms-form admin-cms-form-wide" method="post" action="/api/admin/product-research">
          <label>产品链接标识（Slug）<input name="productSlug" required placeholder="填写资料列表中的产品链接标识" /></label>
          <label>确认人<input name="approvedBy" placeholder="填写审核人或供应商联系人" /></label>
          <label>已确认参数表链接（仅后台）<input name="approvedDatasheetUrl" type="url" placeholder="https://..." /></label>
          <label>已确认图纸链接（仅后台）<input name="approvedDrawingUrl" type="url" placeholder="https://..." /></label>
          <label>审核状态<select name="publicContentStatus" defaultValue="review"><option value="review">审核中</option><option value="published">确认后发布</option></select></label>
          <label>供应商确认<select name="supplierConfirmed" defaultValue="false"><option value="false">待确认</option><option value="true">已确认</option></select></label>
          <label className="admin-cms-span-2">已确认技术参数<textarea name="confirmedSpecifications" rows={7} placeholder={"Belt Width: 800 mm\nSuspension Height: 300 mm"} /></label>
          <p className="admin-muted admin-cms-span-2">此表单仅供内部审核。只有供应商状态为“已确认”且审核状态为“确认后发布”时，技术参数才会在产品页面使用。</p>
          <button className="admin-submit-button admin-cms-span-2" type="submit">保存审核资料</button>
        </form>
      </section>
    </div>
  );
}
