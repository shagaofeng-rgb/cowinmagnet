import type { Locale } from "@/lib/i18n";

const labels: Record<Locale, { product: string; industry: string; link: string }> = {
  en: { product: "", industry: "", link: "View the English original" },
  es: { product: "El resumen traducido no sustituye la ficha técnica completa. Los detalles específicos del modelo están disponibles en la versión original en inglés.", industry: "La descripción traducida resume esta aplicación. Los detalles técnicos completos están disponibles en la versión original en inglés.", link: "Ver la versión original en inglés" },
  ru: { product: "Переведённое краткое описание не заменяет полную техническую информацию. Подробные сведения о модели доступны в английском оригинале.", industry: "Переведённое описание кратко излагает применение. Полные технические сведения доступны в английском оригинале.", link: "Открыть английский оригинал" },
  ar: { product: "لا يحل الملخص المترجم محل المعلومات الفنية الكاملة. تتوفر التفاصيل الخاصة بالطراز في النسخة الإنجليزية الأصلية.", industry: "يلخص الوصف المترجم هذا التطبيق. تتوفر التفاصيل الفنية الكاملة في النسخة الإنجليزية الأصلية.", link: "عرض النسخة الإنجليزية الأصلية" },
  fr: { product: "Ce résumé traduit ne remplace pas la fiche technique complète. Les détails propres au modèle figurent dans la version originale en anglais.", industry: "Cette présentation traduite résume l'application. Les détails techniques complets figurent dans la version originale en anglais.", link: "Voir la version originale en anglais" },
  pt: { product: "Este resumo traduzido não substitui a ficha técnica completa. Os detalhes específicos do modelo estão disponíveis na versão original em inglês.", industry: "Esta descrição traduzida resume a aplicação. Os detalhes técnicos completos estão disponíveis na versão original em inglês.", link: "Ver a versão original em inglês" }
};

export function getOriginalContentLabels(locale: Locale) {
  return labels[locale];
}
