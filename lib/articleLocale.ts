import type { Locale } from "@/lib/i18n";

const articleLabels: Record<Locale, {
  by: string;
  contents: string;
  inGuide: string;
  recommended: string;
  related: string;
  technicalGuides: string;
  industryNews: string;
}> = {
  en: { by: "By", contents: "Article contents", inGuide: "In this guide", recommended: "Recommended reading", related: "Related products, solutions and articles", technicalGuides: "Technical guides", industryNews: "Industry news" },
  es: { by: "Por", contents: "Contenido del artículo", inGuide: "En esta guía", recommended: "Lecturas recomendadas", related: "Productos, soluciones y artículos relacionados", technicalGuides: "Guías técnicas", industryNews: "Noticias del sector" },
  ru: { by: "Автор:", contents: "Содержание статьи", inGuide: "В этом руководстве", recommended: "Рекомендуем прочитать", related: "Связанные продукты, решения и статьи", technicalGuides: "Технические руководства", industryNews: "Новости отрасли" },
  ar: { by: "بقلم", contents: "محتويات المقال", inGuide: "في هذا الدليل", recommended: "قراءات مقترحة", related: "منتجات وحلول ومقالات ذات صلة", technicalGuides: "أدلة فنية", industryNews: "أخبار القطاع" },
  fr: { by: "Par", contents: "Sommaire de l'article", inGuide: "Dans ce guide", recommended: "Lectures recommandées", related: "Produits, solutions et articles associés", technicalGuides: "Guides techniques", industryNews: "Actualités du secteur" },
  pt: { by: "Por", contents: "Conteúdo do artigo", inGuide: "Neste guia", recommended: "Leituras recomendadas", related: "Produtos, soluções e artigos relacionados", technicalGuides: "Guias técnicos", industryNews: "Notícias do setor" }
};

export function getArticleLabels(locale: Locale) {
  return articleLabels[locale];
}
