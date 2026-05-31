export default function SimpleLocalizedPage({ page }) {
  return (
    <main className="simple-page">
      <section className="simple-hero">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <p>{page.intro}</p>
      </section>
      <section className="simple-card-grid">
        {page.cards.map(([title, text]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
