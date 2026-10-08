"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

type HomeCard = { slug: string; image: string; title: string; summary: string };

const tabs = [[0, 1, 2], [0, 4, 5], [1], [2, 4, 5], [3]];

const facts: Record<Locale, { labels: [string, string, string]; values: [string, string, string][] }> = {
  en: { labels: ["Application", "Installation", "Feature"], values: [["Conveyor protection", "Suspended overhead", "Removes ferrous metal"], ["Conveyor systems", "Conveyor head", "Continuous iron removal"], ["Dry bulk materials", "Inline processing", "Continuous separation"]] },
  es: { labels: ["Aplicación", "Instalación", "Función"], values: [["Protección de cintas", "Suspendido sobre la cinta", "Retira metales ferrosos"], ["Sistemas de cintas", "Cabezal de la cinta", "Extracción continua de hierro"], ["Materiales secos a granel", "Proceso en línea", "Separación continua"]] },
  ru: { labels: ["Применение", "Установка", "Функция"], values: [["Защита конвейера", "Подвес над лентой", "Удаление черных металлов"], ["Конвейерные системы", "Головная часть ленты", "Непрерывное удаление железа"], ["Сухие сыпучие материалы", "В составе линии", "Непрерывная сепарация"]] },
  ar: { labels: ["التطبيق", "التركيب", "الوظيفة"], values: [["حماية السير الناقل", "معلّق فوق السير", "إزالة المعادن الحديدية"], ["أنظمة النقل", "عند رأس السير الناقل", "إزالة مستمرة للحديد"], ["مواد جافة سائبة", "ضمن خط المعالجة", "فصل مستمر"]] },
  fr: { labels: ["Application", "Installation", "Fonction"], values: [["Protection des convoyeurs", "Suspendu au-dessus du tapis", "Retrait des métaux ferreux"], ["Systèmes de convoyage", "En tête de convoyeur", "Extraction continue du fer"], ["Produits secs en vrac", "Intégré à la ligne", "Séparation continue"]] },
  pt: { labels: ["Aplicação", "Instalação", "Função"], values: [["Proteção de correias", "Suspenso sobre a correia", "Remove metais ferrosos"], ["Sistemas transportadores", "Cabeceira da correia", "Remoção contínua de ferro"], ["Materiais secos a granel", "Integrado à linha", "Separação contínua"]] }
};

export function HomeProductShowcase({ locale, cards }: { locale: Locale; cards: HomeCard[] }) {
  const [active, setActive] = useState(0);
  const ui = getPublicUi(locale);
  const cardFacts = facts[locale];
  const visible = tabs[active].map((index) => ({ ...cards[index], index })).filter((card) => card.slug);

  return (
    <>
      <div className="home2-tabs" role="tablist" aria-label={ui.categories}>
        {tabs.map((_, index) => <button key={index} type="button" role="tab" aria-selected={active === index} className={active === index ? "is-active" : ""} onClick={() => setActive(index)}>{ui.homeCategories[index]}</button>)}
        <Link href={localizeHref("/request-quote", locale)}>{ui.homeCategories[5]}</Link>
      </div>
      <div className="home2-product-grid" role="tabpanel" aria-label={ui.homeCategories[active]} key={active}>
        {visible.map((card) => <article className="home2-product-card" key={card.slug}>
          <Link href={localizeHref(`/products/${card.slug}`, locale)} className="home2-product-image" aria-label={card.title}>
            <Image src={card.image} fill sizes="(max-width: 700px) 90vw, (max-width: 1050px) 45vw, 30vw" alt={card.title} loading="lazy" />
          </Link>
          <div className="home2-product-body">
            <h3><Link href={localizeHref(`/products/${card.slug}`, locale)}>{card.title}</Link></h3>
            <p>{card.summary}</p>
            {card.index < 3 ? <dl className="home2-product-facts">{cardFacts.labels.map((label, factIndex) => <div key={label}><dt>{label}</dt><dd>{cardFacts.values[card.index][factIndex]}</dd></div>)}</dl> : null}
            <Link href={localizeHref(`/products/${card.slug}`, locale)} className="home2-card-link">{locale === "en" ? "View Products" : ui.allProducts} <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </article>)}
      </div>
    </>
  );
}
