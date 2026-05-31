import { BarList } from "@/components/admin/AdminWidgets";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Visitor Journeys | Cowinmagnet Admin"
};

export default async function JourneysPage() {
  const { journeys } = await getAnalyticsSnapshot();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">Journeys</p>
          <h1>Buyer Page Paths</h1>
          <p>See which pages commonly lead buyers toward product details, inquiry pages and contact actions.</p>
        </div>
      </header>

      <section className="admin-panel">
        {journeys.length ? (
          <BarList rows={journeys.map((item) => ({ label: item.route, value: item.value }))} />
        ) : (
          <div className="admin-empty">
            More journey data will appear after visitors browse multiple pages in one session.
          </div>
        )}
      </section>
    </div>
  );
}
