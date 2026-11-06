export const marketingConsentCookie = "cowin_marketing";
export const marketingPreferenceEvent = "cowin-marketing-preferences";

export function hasMarketingConsent(cookieHeader = "") {
  return cookieHeader.split(";").some((cookie) => cookie.trim() === `${marketingConsentCookie}=allow`);
}

const copy = {
  en: ["Advertising preferences", "Allow Meta to measure website visits and inquiry actions for advertising.", "Allow", "Decline"],
  es: ["Preferencias de publicidad", "Permite que Meta mida las visitas y las solicitudes con fines publicitarios.", "Permitir", "Rechazar"],
  ru: ["Настройки рекламы", "Разрешить Meta измерять посещения сайта и отправку запросов для рекламы.", "Разрешить", "Отклонить"],
  ar: ["تفضيلات الإعلانات", "اسمح لشركة Meta بقياس زيارات الموقع وإرسال طلبات عروض الأسعار لأغراض إعلانية.", "سماح", "رفض"],
  fr: ["Préférences publicitaires", "Autoriser Meta à mesurer les visites et les demandes de devis à des fins publicitaires.", "Autoriser", "Refuser"],
  pt: ["Preferências de publicidade", "Permitir que a Meta meça visitas e pedidos de orçamento para fins publicitários.", "Permitir", "Recusar"]
};

export function getMarketingCopy(locale) {
  return copy[locale] || copy.en;
}
