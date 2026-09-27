import { getProductFamily, type ProductFamily } from "@/data/productDetailProfiles";
import type { Product } from "@/data/products";
import type { Locale } from "@/lib/i18n";

// Deliberately describe the equipment family, not an unverified model rating.
// Model names and numeric specifications remain in their published form.
const summaries: Record<Locale, Record<ProductFamily, string>> = {
  en: {
    suspended: "Overhead equipment for ferrous-metal removal from conveyor-fed bulk material. Final selection depends on the material, belt and installation.",
    "mineral-processing": "Magnetic separation equipment for a defined mineral-processing stage. Feed condition and separation target determine the configuration.",
    filtering: "Magnetic filtration for a specified powder, granule, liquid or slurry flow. Flow behavior and cleaning access must be reviewed.",
    "recycling-sorting": "Metal-sorting equipment for prepared recycling feed. The feed size and upstream separation stages must be confirmed.",
    "metal-detection": "Metal detection for a defined material path. Opening size, target metal and response method must be confirmed.",
    "explosion-control": "Electrical or control equipment whose suitability depends on the specified installation and operating conditions.",
    lifting: "Magnetic lifting equipment that requires review of the load, surface contact, duty cycle and operating method."
  },
  es: {
    suspended: "Equipo suspendido para retirar metales ferrosos de materiales a granel en cintas. La selección depende del material, la cinta y la instalación.",
    "mineral-processing": "Equipo de separación magnética para una etapa concreta del proceso mineral. El estado de alimentación y el objetivo definen la configuración.",
    filtering: "Filtración magnética para un flujo definido de polvo, gránulos, líquido o lodo. Deben revisarse el flujo y el acceso para limpieza.",
    "recycling-sorting": "Equipo de clasificación de metales para materiales de reciclaje preparados. Deben confirmarse el tamaño de alimentación y las etapas anteriores.",
    "metal-detection": "Detección de metales en un flujo de material definido. Deben confirmarse la abertura, el metal objetivo y la respuesta requerida.",
    "explosion-control": "Equipo eléctrico o de control cuya idoneidad depende de las condiciones de instalación y operación especificadas.",
    lifting: "Equipo de elevación magnética que requiere revisar la carga, el contacto superficial, el ciclo de trabajo y la operación."
  },
  ru: {
    suspended: "Подвесное оборудование для удаления железных включений из сыпучих материалов на конвейере. Подбор зависит от материала, ленты и установки.",
    "mineral-processing": "Оборудование магнитной сепарации для определенной стадии переработки минералов. Условия подачи и цель разделения определяют конфигурацию.",
    filtering: "Магнитная фильтрация для заданного потока порошка, гранул, жидкости или пульпы. Нужно проверить характер потока и доступ для очистки.",
    "recycling-sorting": "Оборудование сортировки металлов для подготовленного вторсырья. Необходимо подтвердить размер фракции и предыдущие стадии сепарации.",
    "metal-detection": "Обнаружение металла в заданном потоке материала. Необходимо определить размер проема, целевой металл и способ реагирования.",
    "explosion-control": "Электрооборудование или аппаратура управления, пригодность которых зависит от заданных условий установки и эксплуатации.",
    lifting: "Магнитное подъемное оборудование требует проверки груза, контакта с поверхностью, рабочего цикла и способа эксплуатации."
  },
  ar: {
    suspended: "معدات معلقة لإزالة المعادن الحديدية من المواد السائبة على السيور. يعتمد الاختيار على المادة والسير وطريقة التركيب.",
    "mineral-processing": "معدات فصل مغناطيسي لمرحلة محددة من معالجة المعادن. تحدد حالة التغذية وهدف الفصل التكوين المناسب.",
    filtering: "ترشيح مغناطيسي لتدفق محدد من مسحوق أو حبيبات أو سائل أو معلق. يجب مراجعة سلوك التدفق وإمكانية التنظيف.",
    "recycling-sorting": "معدات فرز معادن لمواد إعادة تدوير محضرة. يجب تأكيد حجم التغذية ومراحل الفصل السابقة.",
    "metal-detection": "كشف المعادن في مسار مادة محدد. يجب تحديد حجم الفتحة والمعدن المستهدف وطريقة الاستجابة.",
    "explosion-control": "معدات كهربائية أو للتحكم تعتمد ملاءمتها على ظروف التركيب والتشغيل المحددة.",
    lifting: "معدات رفع مغناطيسية تتطلب مراجعة الحمولة والتلامس السطحي ودورة العمل وطريقة التشغيل."
  },
  fr: {
    suspended: "Équipement suspendu pour retirer les métaux ferreux du vrac sur convoyeur. Le choix dépend du matériau, de la bande et de l'installation.",
    "mineral-processing": "Équipement de séparation magnétique destiné à une étape définie du traitement des minerais. L'alimentation et l'objectif déterminent la configuration.",
    filtering: "Filtration magnétique pour un flux défini de poudre, granulés, liquide ou pulpe. Le comportement du flux et l'accès au nettoyage doivent être étudiés.",
    "recycling-sorting": "Équipement de tri des métaux pour des matières recyclables préparées. La granulométrie et les étapes de séparation en amont doivent être confirmées.",
    "metal-detection": "Détection des métaux dans un trajet de matériau défini. Il faut confirmer l'ouverture, le métal cible et la réponse attendue.",
    "explosion-control": "Équipement électrique ou de commande dont l'adéquation dépend des conditions d'installation et de fonctionnement précisées.",
    lifting: "Équipement de levage magnétique nécessitant l'étude de la charge, du contact de surface, du cycle de service et de l'utilisation."
  },
  pt: {
    suspended: "Equipamento suspenso para remover metais ferrosos de materiais a granel em correias. A seleção depende do material, da correia e da instalação.",
    "mineral-processing": "Equipamento de separação magnética para uma etapa definida do processamento mineral. A alimentação e o objetivo determinam a configuração.",
    filtering: "Filtração magnética para um fluxo definido de pó, grânulos, líquido ou polpa. É preciso avaliar o fluxo e o acesso para limpeza.",
    "recycling-sorting": "Equipamento de classificação de metais para recicláveis preparados. O tamanho da alimentação e as etapas anteriores devem ser confirmados.",
    "metal-detection": "Detecção de metais em um trajeto definido de material. É preciso confirmar a abertura, o metal-alvo e a resposta necessária.",
    "explosion-control": "Equipamento elétrico ou de controle cuja adequação depende das condições específicas de instalação e operação.",
    lifting: "Equipamento de elevação magnética que exige avaliação da carga, contato superficial, ciclo de trabalho e modo de operação."
  }
};

// A few catalog names do not fit the seven broad editorial families. Keep
// their localized descriptions specific enough to avoid describing a screen,
// pulley or roller as an overhead iron remover.
const specialSummaries: Record<Locale, Record<"pulley" | "screen" | "otherSeparator", string>> = {
  en: {
    pulley: "A magnetic head pulley separates ferrous material at a conveyor discharge. Final selection depends on the conveyed material, pulley dimensions and line arrangement.",
    screen: "High-frequency screening equipment for a defined mineral-processing stage. Feed size, moisture, screening target and site conditions determine the configuration.",
    otherSeparator: "Separation equipment for a defined material path. The feed, target metal or mineral and process arrangement must be confirmed before configuration."
  },
  es: {
    pulley: "Una polea magnética de cabeza separa materiales ferrosos en la descarga de una cinta. La selección depende del material, las dimensiones de la polea y la disposición de la línea.",
    screen: "Equipo de cribado de alta frecuencia para una etapa definida del proceso mineral. El tamaño y la humedad de alimentación, el objetivo de cribado y las condiciones del sitio determinan la configuración.",
    otherSeparator: "Equipo de separación para un flujo definido de material. Deben confirmarse la alimentación, el metal o mineral objetivo y la disposición del proceso antes de configurar el equipo."
  },
  ru: {
    pulley: "Головной магнитный барабан отделяет железные материалы на выходе конвейера. Подбор зависит от материала, размеров барабана и компоновки линии.",
    screen: "Высокочастотное грохочение для определённой стадии переработки минералов. Конфигурацию определяют размер и влажность питания, цель грохочения и условия объекта.",
    otherSeparator: "Оборудование для разделения в заданном потоке материала. Перед выбором конфигурации необходимо определить характеристики питания, целевой металл или минерал и схему процесса."
  },
  ar: {
    pulley: "تفصل بكرة الرأس المغناطيسية المواد الحديدية عند مخرج السير الناقل. يعتمد الاختيار على المادة وأبعاد البكرة وترتيب الخط.",
    screen: "معدات غربلة عالية التردد لمرحلة محددة من معالجة المعادن. يحدد حجم التغذية ورطوبتها وهدف الغربلة وظروف الموقع التكوين المناسب.",
    otherSeparator: "معدات فصل لمسار مادة محدد. يجب تأكيد خصائص التغذية والمعدن أو الخام المستهدف وترتيب العملية قبل تحديد التكوين."
  },
  fr: {
    pulley: "Une poulie magnétique de tête sépare les matières ferreuses à la sortie d'un convoyeur. Le choix dépend du matériau, des dimensions de la poulie et de l'agencement de la ligne.",
    screen: "Équipement de criblage haute fréquence pour une étape définie du traitement des minerais. La granulométrie, l'humidité de l'alimentation, l'objectif de criblage et les conditions du site déterminent la configuration.",
    otherSeparator: "Équipement de séparation pour un flux de matière défini. L'alimentation, le métal ou minerai ciblé et l'agencement du procédé doivent être confirmés avant de définir la configuration."
  },
  pt: {
    pulley: "Uma polia magnética de cabeça separa materiais ferrosos na descarga do transportador. A seleção depende do material, das dimensões da polia e da disposição da linha.",
    screen: "Equipamento de peneiramento de alta frequência para uma etapa definida do processamento mineral. Tamanho e umidade da alimentação, objetivo do peneiramento e condições do local determinam a configuração.",
    otherSeparator: "Equipamento de separação para um fluxo definido de material. É preciso confirmar a alimentação, o metal ou mineral-alvo e a disposição do processo antes de definir a configuração."
  }
};

export function getLocalizedProductSummary(product: Product, locale: Locale) {
  if (/\bhead pulley\b/i.test(product.name)) return specialSummaries[locale].pulley;
  if (/\bhigh frequency screen\b/i.test(product.name)) return specialSummaries[locale].screen;
  if (/(roller.*magnetic separator|roller.*automatic|integral channel metal separator|online magnetic separat|upward suction magnetic separat)/i.test(product.name)) return specialSummaries[locale].otherSeparator;
  return summaries[locale][getProductFamily(product)];
}
