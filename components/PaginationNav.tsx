import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

type PaginationNavProps = {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  label: string;
  summary?: string;
  locale?: Locale;
};

function visiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages: Array<number | "ellipsis"> = [1];
  if (currentPage > 4) pages.push("ellipsis");
  for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page += 1) {
    pages.push(page);
  }
  if (currentPage < totalPages - 3) pages.push("ellipsis");
  pages.push(totalPages);
  return pages;
}

export function PaginationNav({ currentPage, totalPages, hrefForPage, label, summary, locale = "en" }: PaginationNavProps) {
  if (totalPages <= 1) return null;
  const ui = getPublicUi(locale);

  return (
    <nav className="content-pagination" aria-label={label}>
      {currentPage > 1 ? <Link href={hrefForPage(currentPage - 1)}>{ui.previous}</Link> : <span className="is-disabled" aria-disabled="true">{ui.previous}</span>}
      <ol>
        {visiblePages(currentPage, totalPages).map((page, index) => (
          page === "ellipsis" ? <li key={`ellipsis-${index}`}><span className="is-ellipsis" aria-hidden="true">…</span></li> : (
            <li key={page}>
              {page === currentPage ? <span className="is-current" aria-current="page">{page}</span> : <Link href={hrefForPage(page)} aria-label={`${ui.page} ${page}`}>{page}</Link>}
            </li>
          )
        ))}
      </ol>
      {currentPage < totalPages ? <Link href={hrefForPage(currentPage + 1)}>{ui.next}</Link> : <span className="is-disabled" aria-disabled="true">{ui.next}</span>}
      {summary ? <p>{summary}</p> : null}
    </nav>
  );
}
