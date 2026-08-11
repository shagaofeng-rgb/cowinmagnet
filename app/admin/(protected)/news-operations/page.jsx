import Link from "next/link";
import { getNewsOperationsDashboard } from "@/lib/newsOperations";

export const dynamic = "force-dynamic";

function date(value) {
  return value ? new Date(value).toLocaleString("zh-CN", { hour12: false }) : "-";
}

export default async function NewsOperationsPage() {
  let dashboard = null;
  let storageError = null;
  try {
    dashboard = await getNewsOperationsDashboard();
  } catch (error) {
    storageError = error instanceof Error ? error.message : "News operations storage is unavailable";
  }

  if (!dashboard) {
    return <div className="admin-page"><header className="admin-page-head"><div><p className="eyebrow">NEWS OPERATIONS</p><h1>News automatic operations</h1><p>The News operations store is unavailable. No fallback data is shown for this private administrative view.</p></div></header><div className="admin-alert">{storageError}</div></div>;
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">NEWS OPERATIONS</p>
          <h1>News automatic operations</h1>
          <p>12-hour candidate ingestion and 48-hour frontend-verified publication are isolated from Blog automation.</p>
        </div>
        <div className="admin-status good">{dashboard.storageMode}</div>
      </header>

      <section className="admin-panel">
        <h2>Active site</h2>
        <p className="admin-muted">site_id: <code>{dashboard.siteId}</code>. Candidates remain private until a publication run verifies the public News list, detail page and News sitemap.</p>
        <Link href="/admin/news">Open News content management</Link>
      </section>

      <section className="admin-panel">
        <h2>Approved sources</h2>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Source</th><th>Type</th><th>Trust</th><th>Status</th></tr></thead><tbody>
          {dashboard.sources.map((source) => <tr key={source.id}><td>{source.name}<br /><small>{source.domain}</small></td><td>{source.source_type}</td><td>{source.source_trust_score}</td><td>{source.active && source.allowed ? "Active" : "Disabled"}</td></tr>)}
        </tbody></table></div>
      </section>

      <section className="admin-panel">
        <h2>Recent candidate decisions</h2>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Candidate</th><th>Source</th><th>Score</th><th>State</th></tr></thead><tbody>
          {dashboard.candidates.map((candidate) => <tr key={candidate.id}><td>{candidate.title}</td><td>{candidate.publisher}</td><td>{candidate.candidateScore ?? candidate.candidate_score}</td><td>{candidate.status}{candidate.rejectionReason ? `: ${candidate.rejectionReason}` : ""}</td></tr>)}
        </tbody></table></div>
      </section>

      <section className="admin-panel">
        <h2>Run history</h2>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Run</th><th>Started</th><th>Status</th><th>Details</th></tr></thead><tbody>
          {dashboard.runs.map((run) => <tr key={run.id}><td>{run.run_type}</td><td>{date(run.started_at)}</td><td>{run.status}</td><td>{run.error_summary || "-"}</td></tr>)}
        </tbody></table></div>
      </section>
    </div>
  );
}
