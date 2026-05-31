"use client";

export default function AdminError({ error, reset }) {
  return (
    <div className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">Error</p>
        <h1>Analytics failed to load</h1>
        <p>{error?.message || "Please try again."}</p>
        <button className="admin-ghost-button" type="button" onClick={reset}>
          Retry
        </button>
      </section>
    </div>
  );
}
