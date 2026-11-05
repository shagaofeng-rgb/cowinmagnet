import type { Product } from "@/data/products";
import { getProductFamily } from "@/data/productDetailProfiles";
import type { Locale } from "@/lib/i18n";

export const applications = ["metal-removal", "material-purity", "recovery", "process-protection"] as const;
export const installations = ["suspended", "inline", "conveyor-head", "wet-process"] as const;
export const filters = {
  en: ["Application", "Installation", "Metal removal", "Material purification", "Recycling and recovery", "Process protection", "Suspended", "In-line", "Conveyor head", "Wet process", "Reset filters"],
  es: ["Aplicación", "Instalación", "Eliminación de metales", "Purificación de materiales", "Reciclaje y recuperación", "Protección del proceso", "Suspendido", "En línea", "Cabezal de cinta", "Proceso húmedo", "Restablecer filtros"],
  fr: ["Application", "Installation", "Élimination des métaux", "Purification des matériaux", "Recyclage et récupération", "Protection du procédé", "Suspendu", "En ligne", "Tête de convoyeur", "Procédé humide", "Réinitialiser les filtres"],
  pt: ["Aplicação", "Instalação", "Remoção de metais", "Purificação de materiais", "Reciclagem e recuperação", "Proteção do processo", "Suspenso", "Em linha", "Cabeça da esteira", "Processo a úmido", "Redefinir filtros"],
  ru: ["Применение", "Монтаж", "Удаление металла", "Очистка материала", "Переработка и извлечение", "Защита процесса", "Подвесной", "В линии", "Головной барабан", "Мокрый процесс", "Сбросить фильтры"],
  ar: ["التطبيق", "التركيب", "إزالة المعادن", "تنقية المواد", "إعادة التدوير والاسترجاع", "حماية العملية", "معلق", "داخل الخط", "رأس الناقل", "المعالجة الرطبة", "إعادة ضبط الفلاتر"],
} satisfies Record<Locale, string[]>;

export function getCatalogueFacets(product: Product) {
  const family = getProductFamily(product);
  const slug = product.slug;
  const application = new Set<string>();
  const installation = new Set<string>();
  if (["suspended", "filtering", "explosion-control"].includes(family)) application.add("metal-removal");
  if (["filtering", "mineral-processing"].includes(family)) application.add("material-purity");
  if (["recycling-sorting", "mineral-processing"].includes(family)) application.add("recovery");
  if (["suspended", "metal-detection", "filtering"].includes(family)) application.add("process-protection");
  if (family === "suspended" && /rcy|rcd|overband|suspend/.test(slug)) installation.add("suspended");
  if (family === "filtering" && /pipe|pipeline|trap|grid|hump|drawer|grate/.test(slug)) installation.add("inline");
  if (/magnetic-head-pulley|fully-magnetic-drum/.test(slug)) installation.add("conveyor-head");
  if (family === "mineral-processing" && /wet|slurry|countercurrent/.test(slug)) installation.add("wet-process");
  return { application, installation };
}
