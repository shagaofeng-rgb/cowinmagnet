import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BlogImage } from "@/components/BlogImage";

export function InnerArticleCard({ href, title, category, excerpt, image, alt, date, action, featured = false, priority = false }: {
  href: string; title: string; category: string; excerpt: string; image?: string; alt?: string; date?: string; action: string; featured?: boolean; priority?: boolean;
}) {
  return <article className={`blog-card inner-article-card${featured ? " inner-article-featured" : ""}`}>
    {image ? <Link href={href} className="blog-card-image" aria-label={title}><BlogImage src={image} width={800} height={450} alt={alt || title} priority={priority} /></Link> : <div className="inner-article-no-image"><BookOpen size={34} aria-hidden /></div>}
    <div className="blog-card-body">
      <div className="blog-card-meta"><span lang="en">{category}</span>{date ? <time dateTime={date}>{date.slice(0, 10)}</time> : null}</div>
      <h3 lang="en"><Link href={href}>{title}</Link></h3><p lang="en">{excerpt}</p>
      <Link className={featured ? "btn btn-primary" : "text-link"} href={href}>{action}<ArrowRight size={16} aria-hidden /></Link>
    </div>
  </article>;
}
