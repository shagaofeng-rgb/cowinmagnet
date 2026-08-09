import Link from "next/link";
import { getProductResearchCards } from "@/lib/productResearch";

export const dynamic = "force-dynamic";
export const metadata = { title: "Product Research Review | COWIN Admin" };

function confirmed(card) {
  return card?.supplier_confirmation?.confirmed === true || card?.supplier_confirmation?.confirmed === "true";
}

export default async function ProductResearchPage({ searchParams }) {
  const cards = await getProductResearchCards();
  const params = await searchParams;
  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">Private product data</p>
          <h1>Product research and supplier confirmation</h1>
          <p>Source records, supplier approval and technical facts remain private. Only approved facts can be used by public product pages.</p>
        </div>
        <Link className="admin-submit-button" href="/admin/products">Back to products</Link>
      </header>
      {params?.saved ? <div className="admin-alert">Research card saved. Public facts are available only after supplier confirmation and published review status.</div> : null}
      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div><p className="eyebrow">Research registry</p><h2>{cards.length} product cards</h2></div>
          <span className="admin-result-count">{cards.filter(confirmed).length} supplier-confirmed</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Family</th><th>Sources</th><th>Confirmed facts</th><th>Review status</th><th>Supplier confirmation</th></tr></thead>
            <tbody>{cards.map((card) => <tr key={card.product_id}>
              <td><strong>{card.public_name}</strong><br /><small>{card.product_id}</small></td>
              <td>{card.product_type}</td><td>{card.source_count}</td><td>{card.confirmed_fact_count}</td>
              <td>{card.public_content_status}</td><td>{confirmed(card) ? "Confirmed" : "Pending"}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>
      <section className="admin-panel">
        <p className="eyebrow">Review update</p>
        <h2>Confirm one product after supplier approval</h2>
        <p>Use this only with an approved supplier datasheet or drawing. The entered values are private until both supplier confirmation and Published review status are selected.</p>
        <form className="admin-cms-form admin-cms-form-wide" method="post" action="/api/admin/product-research">
          <label>Product slug<input name="productSlug" required placeholder="Choose a product slug from the registry" /></label>
          <label>Approved by<input name="approvedBy" placeholder="Reviewer name or supplier contact reference" /></label>
          <label>Approved datasheet URL (private)<input name="approvedDatasheetUrl" type="url" placeholder="https://..." /></label>
          <label>Approved drawing URL (private)<input name="approvedDrawingUrl" type="url" placeholder="https://..." /></label>
          <label>Review status<select name="publicContentStatus" defaultValue="review"><option value="review">Review</option><option value="published">Published after confirmation</option></select></label>
          <label>Supplier confirmation<select name="supplierConfirmed" defaultValue="false"><option value="false">Pending</option><option value="true">Confirmed</option></select></label>
          <label className="admin-cms-span-2">Confirmed technical facts only<textarea name="confirmedSpecifications" rows={7} placeholder={"Belt Width: 800 mm\nSuspension Height: 300 mm"} /></label>
          <p className="admin-muted admin-cms-span-2">This review form is private and never appears in public HTML. A product can publish technical values only when the supplier confirmation is true and the review status is Published.</p>
          <button className="admin-submit-button admin-cms-span-2" type="submit">Save private review</button>
        </form>
      </section>
    </div>
  );
}
