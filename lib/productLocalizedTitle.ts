import type { Product } from "@/data/products";
import { getProductDisplayName } from "@/data/productDetailProfiles";
import type { Locale } from "@/lib/i18n";

type LocalizedTerm = [es: string, ru: string, ar: string, fr: string, pt: string];
const localeIndex: Record<Exclude<Locale, "en">, number> = { es: 0, ru: 1, ar: 2, fr: 3, pt: 4 };

// Technical descriptors are translated independently of model codes. The
// segmented format avoids inventing model ratings or changing a manufacturer
// designation when several catalog items share one equipment family.
const terms: Record<string, LocalizedTerm> = {
  ironRemover: ["separador de hierro", "железоотделитель", "مزيل الحديد", "séparateur de fer", "separador de ferro"],
  magneticSeparator: ["separador magnético", "магнитный сепаратор", "فاصل مغناطيسي", "séparateur magnétique", "separador magnético"],
  magneticFilter: ["filtro magnético", "магнитный фильтр", "مرشح مغناطيسي", "filtre magnétique", "filtro magnético"],
  metalDetector: ["detector de metales", "металлодетектор", "كاشف معادن", "détecteur de métaux", "detector de metais"],
  eddySorter: ["separador por corrientes de Foucault", "вихретоковый сепаратор", "فاصل بالتيارات الدوامية", "séparateur à courants de Foucault", "separador por correntes de Foucault"],
  magneticDrum: ["tambor magnético", "магнитный барабан", "أسطوانة مغناطيسية", "tambour magnétique", "tambor magnético"],
  headPulley: ["polea magnética de cabeza", "головной магнитный шкив", "بكرة رأس مغناطيسية", "poulie magnétique de tête", "polia magnética de cabeça"],
  drawerMagnet: ["imán de cajón", "выдвижной магнит", "مغناطيس درج", "aimant à tiroir", "ímã de gaveta"],
  gridMagnet: ["rejilla magnética", "магнитная решётка", "شبكة مغناطيسية", "grille magnétique", "grade magnética"],
  magneticRod: ["barra magnética", "магнитный стержень", "قضيب مغناطيسي", "barre magnétique", "barra magnética"],
  magneticTrap: ["trampa magnética", "магнитная ловушка", "مصيدة مغناطيسية", "piège magnétique", "armadilha magnética"],
  pipeMagnet: ["imán para tubería", "трубопроводный магнит", "مغناطيس للأنابيب", "aimant pour conduite", "ímã para tubulação"],
  humpMagnet: ["imán de conducto en codo", "магнитный сепаратор для коленчатого канала", "مغناطيس لقناة منحنية", "aimant pour conduit coudé", "ímã para duto curvo"],
  screen: ["criba de alta frecuencia", "высокочастотный грохот", "غربال عالي التردد", "crible haute fréquence", "peneira de alta frequência"],
  controlBox: ["cuadro de control", "шкаф управления", "صندوق تحكم", "coffret de commande", "caixa de controle"],
  deslimingTank: ["tanque de deslamado magnético", "ёмкость магнитного обесшламливания", "خزان إزالة الطين مغناطيسيًا", "cuve de déschlammage magnétique", "tanque de deslamagem magnética"],
  tailingsRecovery: ["equipo de recuperación de relaves", "оборудование для извлечения из хвостов", "معدات استرداد المخلفات", "équipement de récupération des résidus", "equipamento de recuperação de rejeitos"],
  liftingMagnet: ["electroimán de elevación", "грузоподъёмный электромагнит", "مغناطيس كهربائي للرفع", "électroaimant de levage", "eletroímã de elevação"],
  steelConveyor: ["transportador de separación de acero inoxidable", "конвейер для отделения нержавеющей стали", "ناقل لفصل الفولاذ المقاوم للصدأ", "convoyeur de séparation de l'acier inoxydable", "transportador de separação de aço inoxidável"],
  channelSeparator: ["separador de metales en canal", "канальный сепаратор металла", "فاصل معادن للقناة", "séparateur de métaux en canal", "separador de metais em canal"],
  permanent: ["imán permanente", "постоянный магнит", "مغناطيس دائم", "aimant permanent", "ímã permanente"],
  electromagnetic: ["electromagnético", "электромагнитный", "كهرومغناطيسي", "électromagnétique", "eletromagnético"],
  selfDumping: ["de descarga automática", "с автоматической разгрузкой", "بتفريغ تلقائي", "à déchargement automatique", "de descarga automática"],
  selfCleaning: ["autolimpiante", "самоочищающийся", "ذاتي التنظيف", "autonettoyant", "autolimpante"],
  manualCleaning: ["limpieza manual", "ручная очистка", "تنظيف يدوي", "nettoyage manuel", "limpeza manual"],
  airCooled: ["refrigerado por aire", "воздушное охлаждение", "تبريد بالهواء", "refroidi par air", "resfriado a ar"],
  oilCooled: ["refrigerado por aceite", "масляное охлаждение", "تبريد بالزيت", "refroidi par huile", "resfriado a óleo"],
  selfCooled: ["autorrefrigerado", "самоохлаждение", "تبريد ذاتي", "à refroidissement autonome", "autorrefrigerado"],
  forcedOil: ["circulación forzada de aceite", "принудительная циркуляция масла", "دوران زيت قسري", "circulation d'huile forcée", "circulação forçada de óleo"],
  suspended: ["suspendido", "подвесной", "معلق", "suspendu", "suspenso"],
  overband: ["sobre cinta", "над конвейерной лентой", "فوق السير الناقل", "au-dessus de la bande", "sobre correia"],
  wet: ["proceso húmedo", "мокрый процесс", "عملية رطبة", "voie humide", "processo úmido"],
  dry: ["proceso seco", "сухой процесс", "عملية جافة", "voie sèche", "processo seco"],
  drum: ["de tambor", "барабанный", "أسطواني", "à tambour", "de tambor"],
  disc: ["de disco", "дисковый", "قرصي", "à disque", "de disco"],
  plate: ["de placa", "пластинчатый", "لوحي", "à plaque", "de placa"],
  roller: ["de rodillos", "роликовый", "بكرات", "à rouleaux", "de rolos"],
  belt: ["de banda", "ленточный", "بحزام", "à bande", "de correia"],
  pipeline: ["para tubería", "трубопроводный", "للأنابيب", "pour conduite", "para tubulação"],
  vertical: ["vertical", "вертикальный", "عمودي", "vertical", "vertical"],
  inclined: ["inclinado", "наклонный", "مائل", "incliné", "inclinado"],
  highGradient: ["alto gradiente", "высокоградиентный", "عالي التدرج", "à haut gradient", "alto gradiente"],
  countercurrent: ["contracorriente", "противоточный", "عكس التيار", "à contre-courant", "contracorrente"],
  semiCountercurrent: ["semicontracorriente", "полупротивоточный", "شبه عكس التيار", "semi-contre-courant", "semicontracorrente"],
  cocurrent: ["corriente directa", "прямоточный", "مع اتجاه التيار", "à co-courant", "corrente direta"],
  automatic: ["automático", "автоматический", "آلي", "automatique", "automático"],
  semiAutomatic: ["semiautomático", "полуавтоматический", "شبه آلي", "semi-automatique", "semiautomático"],
  online: ["en línea", "в потоке", "على الخط", "en ligne", "em linha"],
  rotary: ["rotativo", "роторный", "دوار", "rotatif", "rotativo"],
  concentrating: ["de concentración", "для концентрирования", "للتركيز", "de concentration", "de concentração"],
  preselection: ["de preselección", "для предварительной сепарации", "للفصل الأولي", "de présélection", "de pré-seleção"],
  coalWashing: ["para lavado de carbón", "для углеобогащения", "لغسل الفحم", "pour lavage du charbon", "para lavagem de carvão"],
  mining: ["para minería", "для горной промышленности", "للتعدين", "pour exploitation minière", "para mineração"],
  explosionProof: ["antideflagrante", "взрывозащищённый", "مقاوم للانفجار", "antidéflagrant", "à prova de explosão"],
  neodymium: ["de neodimio", "неодимовый", "نيوديميوم", "au néodyme", "de neodímio"],
  strong: ["alta intensidad", "высокой интенсивности", "عالي الشدة", "haute intensité", "alta intensidade"],
  integralChannel: ["canal integral", "интегрированный канал", "قناة مدمجة", "canal intégré", "canal integral"],
  window: ["de ventana", "оконного типа", "بفتحة نافذة", "à fenêtre", "de janela"],
  eccentric: ["excéntrico", "эксцентриковый", "لامركزي", "excentrique", "excêntrico"],
  fullMagnetic: ["totalmente magnético", "полностью магнитный", "مغناطيسي بالكامل", "entièrement magnétique", "totalmente magnético"],
  semiMagnetic: ["semimagnético", "полумагнитный", "شبه مغناطيسي", "semi-magnétique", "semimagnético"],
  upwardSuction: ["succión ascendente", "всасывание снизу вверх", "شفط صاعد", "aspiration ascendante", "sucção ascendente"],
  tailings: ["para relaves", "для хвостов", "للمخلفات", "pour résidus", "para rejeitos"],
  rectifier: ["rectificador", "выпрямитель", "مقوم", "redresseur", "retificador"],
  round: ["circular", "круглый", "دائري", "circulaire", "circular"]
};

function equipmentType(name: string) {
  if (/control box/i.test(name)) return "controlBox";
  if (/lifting magnet/i.test(name)) return "liftingMagnet";
  if (/stainless steel separation conveyor/i.test(name)) return "steelConveyor";
  if (/high frequency screen/i.test(name)) return "screen";
  if (/desliming tank/i.test(name)) return "deslimingTank";
  if (/tailings recovery machine/i.test(name)) return "tailingsRecovery";
  if (/head pulley/i.test(name)) return "headPulley";
  if (/eddy current/i.test(name)) return "eddySorter";
  if (/metal detector/i.test(name)) return "metalDetector";
  if (/channel metal separator/i.test(name)) return "channelSeparator";
  if (/magnetic filter/i.test(name)) return "magneticFilter";
  if (/filter bar|neodymium rod|magnetic rod/i.test(name)) return "magneticRod";
  if (/magnetic grid/i.test(name)) return "gridMagnet";
  if (/magnetic trap/i.test(name)) return "magneticTrap";
  if (/rotary pipe magnet/i.test(name)) return "pipeMagnet";
  if (/drawer magnet/i.test(name)) return "drawerMagnet";
  if (/hump magnet/i.test(name)) return "humpMagnet";
  if (/drum magnet|magnetic drum/i.test(name)) return "magneticDrum";
  if (/iron remover/i.test(name)) return "ironRemover";
  return "magneticSeparator";
}

const attributes: [key: string, pattern: RegExp][] = [
  ["explosionProof", /explosion.proof/i],
  ["mining", /\bmining\b/i],
  ["permanent", /\bpermanent\b/i],
  ["electromagnetic", /electromagnet/i],
  ["selfDumping", /self.dumping/i],
  ["selfCleaning", /self.cleaning/i],
  ["manualCleaning", /manual.cleaning|manual.self.dumping/i],
  ["forcedOil", /forced oil circulation/i],
  ["oilCooled", /oil.cooled/i],
  ["airCooled", /air.cooled/i],
  ["selfCooled", /self.cooling/i],
  ["suspended", /suspended/i],
  ["overband", /overband/i],
  ["wet", /\bwet\b/i],
  ["dry", /\bdry\b/i],
  ["drum", /\bdrum\b/i],
  ["disc", /\bdisc\b/i],
  ["plate", /\bplate\b/i],
  ["roller", /\broller\b/i],
  ["belt", /\bbelt\b/i],
  ["pipeline", /pipeline/i],
  ["vertical", /vertical/i],
  ["inclined", /inclined/i],
  ["highGradient", /high.gradient/i],
  ["semiCountercurrent", /semi.countercurrent/i],
  ["countercurrent", /countercurrent/i],
  ["cocurrent", /co.current|downstream/i],
  ["semiAutomatic", /semi.automatic/i],
  ["automatic", /automatic/i],
  ["online", /online/i],
  ["rotary", /rotary/i],
  ["concentrating", /concentrated/i],
  ["preselection", /pre.selection|pre selection/i],
  ["coalWashing", /coal washing/i],
  ["neodymium", /neodymium/i],
  ["strong", /super strong|strong roller|strong 6000/i],
  ["integralChannel", /integral channel/i],
  ["window", /window/i],
  ["eccentric", /eccentric/i],
  ["fullMagnetic", /full magnetic|fully magnetic/i],
  ["semiMagnetic", /semi.magnetic/i],
  ["upwardSuction", /upward suction/i],
  ["tailings", /tailing/i],
  ["rectifier", /rectifier/i],
  ["round", /\bround\b/i]
];

export function getLocalizedProductTitle(product: Pick<Product, "slug" | "name">, locale: Locale) {
  const displayName = getProductDisplayName(product);
  if (locale === "en") return displayName;
  const index = localeIndex[locale];
  const original = product.name || displayName;
  const model = original.match(/^([A-Z][A-Z0-9-]{2,})\b/)?.[1] || "";
  const base = equipmentType(original);
  const descriptorKeys = attributes
    .filter(([key, pattern]) => pattern.test(original) && !(key === "drum" && base === "magneticDrum") && !(key === "electromagnetic" && base === "liftingMagnet") && !(key === "countercurrent" && /semi.countercurrent/i.test(original)) && !(key === "automatic" && /semi.automatic/i.test(original)))
    .map(([key]) => key);
  const gaussRange = original.match(/\b\d{4,5}\s*[-–]\s*\d{4,5}\s*Gauss\b/i)?.[0];
  const parts = [model, terms[base][index], ...descriptorKeys.map((key) => terms[key][index]), gaussRange]
    .filter(Boolean);
  return parts.join(" · ");
}
