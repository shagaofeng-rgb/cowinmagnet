"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { getDictionary, localizeHref, type Locale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";
import { homeProductFamilies, type HomeProductFamily } from "@/lib/homeProductTaxonomy";

type HomeCard = { slug: string; image: string; title: string; summary: string; family: HomeProductFamily; featuredIndex: number };
const PRODUCTS_PER_PAGE = 3;

const facts: Record<Locale, { labels: [string, string, string]; values: [string, string, string][] }> = {
  en: { labels: ["Application", "Installation", "Feature"], values: [["Conveyor protection", "Suspended overhead", "Removes ferrous metal"], ["Conveyor systems", "Conveyor head", "Continuous iron removal"], ["Dry bulk materials", "Inline processing", "Continuous separation"]] },
  es: { labels: ["Aplicación", "Instalación", "Función"], values: [["Protección de cintas", "Suspendido sobre la cinta", "Retira metales ferrosos"], ["Sistemas de cintas", "Cabezal de la cinta", "Extracción continua de hierro"], ["Materiales secos a granel", "Proceso en línea", "Separación continua"]] },
  ru: { labels: ["Применение", "Установка", "Функция"], values: [["Защита конвейера", "Подвес над лентой", "Удаление черных металлов"], ["Конвейерные системы", "Головная часть ленты", "Непрерывное удаление железа"], ["Сухие сыпучие материалы", "В составе линии", "Непрерывная сепарация"]] },
  ar: { labels: ["التطبيق", "التركيب", "الوظيفة"], values: [["حماية السير الناقل", "معلّق فوق السير", "إزالة المعادن الحديدية"], ["أنظمة النقل", "عند رأس السير الناقل", "إزالة مستمرة للحديد"], ["مواد جافة سائبة", "ضمن خط المعالجة", "فصل مستمر"]] },
  fr: { labels: ["Application", "Installation", "Fonction"], values: [["Protection des convoyeurs", "Suspendu au-dessus du tapis", "Retrait des métaux ferreux"], ["Systèmes de convoyage", "En tête de convoyeur", "Extraction continue du fer"], ["Produits secs en vrac", "Intégré à la ligne", "Séparation continue"]] },
  pt: { labels: ["Aplicação", "Instalação", "Função"], values: [["Proteção de correias", "Suspenso sobre a correia", "Remove metais ferrosos"], ["Sistemas transportadores", "Cabeceira da correia", "Remoção contínua de ferro"], ["Materiais secos a granel", "Integrado à linha", "Separação contínua"]] }
};

export function HomeProductShowcase({ locale, cards }: { locale: Locale; cards: HomeCard[] }) {
  const [active, setActive] = useState<HomeProductFamily | "all">("all");
  const [page, setPage] = useState(1);
  const ui = getPublicUi(locale);
  const { viewProduct } = getDictionary(locale).common;
  const cardFacts = facts[locale];
  const categories = homeProductFamilies.filter((family) => cards.some((card) => card.family === family));
  const filtered = active === "all" ? cards : cards.filter((card) => card.family === active);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  const categoryLabel = (family: HomeProductFamily) => ui.homeCategories[homeProductFamilies.indexOf(family) + 1];
  const selectedLabel = active === "all" ? ui.homeCategories[0] : categoryLabel(active);
  const start = filtered.length ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0;
  const end = Math.min(currentPage * PRODUCTS_PER_PAGE, filtered.length);

  function selectCategory(family: HomeProductFamily | "all") {
    setActive(family);
    setPage(1);
  }

  return (
    <div className="home2-catalog-layout">
      <aside className="home2-catalog-filter">
        <h3 className="home2-filter-label">{ui.categories}</h3>
        <div className="home2-tabs" role="group" aria-label={ui.categories}>
          <button type="button" aria-pressed={active === "all"} className={active === "all" ? "is-active" : ""} onClick={() => selectCategory("all")}>
            <span>{ui.homeCategories[0]}</span> <small>{cards.length}</small>
          </button>
          {categories.map((family) => (
            <button key={family} type="button" aria-pressed={active === family} className={active === family ? "is-active" : ""} onClick={() => selectCategory(family)}>
              <span>{categoryLabel(family)}</span> <small>{cards.filter((card) => card.family === family).length}</small>
            </button>
          ))}
        </div>
      </aside>
      <div className="home2-product-results">
        <div className="home2-product-grid" key={`${active}-${currentPage}`}>
          {visible.map((card) => {
            const href = localizeHref(`/products/${card.slug}`, locale);

            return (
              <article className="home2-product-card" key={card.slug}>
                <Link href={href} className="home2-product-image" aria-label={card.title}>
                  <Image src={card.image} fill sizes="(max-width: 760px) 32vw, (max-width: 1020px) 30vw, 355px" alt={card.title} loading="lazy" />
                </Link>
                <div className="home2-product-body">
                  <span className="home2-card-tag">{categoryLabel(card.family)}</span>
                  <h3><Link href={href}>{card.title}</Link></h3>
                  <p>{card.summary}</p>
                  {card.featuredIndex >= 0 && card.featuredIndex < 3 ? (
                    <dl className="home2-product-facts">
                      {cardFacts.labels.map((label, factIndex) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{cardFacts.values[card.featuredIndex][factIndex]}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  <Link href={href} className="home2-card-link">{viewProduct} <ArrowRight size={16} aria-hidden="true" /></Link>
                </div>
              </article>
            );
          })}
        </div>
        <div className="home2-product-pagination" role="group" aria-label={`${ui.catalog} ${selectedLabel}`}>
          <p aria-live="polite" aria-atomic="true">{ui.catalogCount.replace("{start}", String(start)).replace("{end}", String(end)).replace("{total}", String(filtered.length))}</p>
          <div className="home2-product-pagination-controls">
            <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>{ui.previous}</button>
            <label className="home2-page-select">
              <span>{ui.page}</span>
              <select value={currentPage} onChange={(event) => setPage(Number(event.target.value))} aria-label={`${ui.page} ${selectedLabel}`}>
                {Array.from({ length: totalPages }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
              </select>
              <span>/ {totalPages}</span>
            </label>
            <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages}>{ui.next}</button>
          </div>
          <Link href={localizeHref("/products", locale)}>{ui.catalog} <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
  );
}
