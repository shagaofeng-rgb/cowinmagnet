import type { Locale } from "@/lib/i18n";

type LegalDocument = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
};

type LegalKind = "privacy" | "terms" | "editorial";

// These are reviewed, close translations of the English policies. Keep the
// {email} placeholder as a link in the rendered document.
const documents: Record<Locale, Record<LegalKind, LegalDocument>> = {
  en: {
    privacy: {
      eyebrow: "Privacy", title: "Privacy Policy",
      intro: "COWIN MAGNET uses this website to receive B2B product inquiries, understand website performance, and respond to buyer requests. We only collect information that helps us communicate about magnetic separation equipment and related service needs.",
      sections: [
        { heading: "Information We Receive", body: "Inquiry forms may collect your name, company, email, phone, country, product interest, application details, and message content. Website analytics may record page views, referrer information, device type, browser type, approximate region, and campaign parameters." },
        { heading: "How We Use Information", body: "We use inquiry information to answer product questions, prepare selection support, follow up on quotations, and maintain internal service records. Analytics information is used to improve page performance, SEO/GEO quality, campaign attribution, and website reliability." },
        { heading: "Sharing and Retention", body: "We do not sell website inquiry data. Information may be processed by hosting, email, analytics, and database service providers that support the website. Business inquiry records are retained as long as needed for communication, compliance, and service continuity." },
        { heading: "Contact", body: "For privacy-related questions, contact us at {email}." }
      ]
    },
    terms: {
      eyebrow: "Terms", title: "Terms of Use",
      intro: "This website provides product information, application notes, industry content, and inquiry channels for B2B buyers. By using the website, you agree to use the content for lawful business evaluation and communication.",
      sections: [
        { heading: "Product Information", body: "Product pages and technical descriptions are for general selection reference. Final equipment configuration, dimensions, magnetic strength, installation method, and quotation details must be confirmed according to the buyer's actual working conditions." },
        { heading: "News and External Sources", body: "News pages may summarize public industry information and include source links. External websites are controlled by their own operators. We review sources for relevance, but buyers should verify critical market, regulatory, and technical information before making decisions." },
        { heading: "Website Availability", body: "We work to keep the website, forms, and data systems available, but temporary interruptions may occur during maintenance, hosting incidents, network issues, or third-party service limits." },
        { heading: "Contact", body: "For questions about these terms, contact COWIN MAGNET at {email}." }
      ]
    },
    editorial: {
      eyebrow: "Editorial policy", title: "How COWIN MAGNET publishes technical content",
      intro: "COWIN MAGNET publishes practical material for industrial buyers. Content is prepared from approved product information, clearly attributed sources where a news item depends on external reporting, and editorial review for accuracy and relevance.",
      sections: [
        { heading: "Accuracy and boundaries", body: "Configuration, performance and suitability depend on material and site conditions. We do not present unverified technical figures, certifications, customer projects or commercial commitments as facts." },
        { heading: "News and guidance", body: "News pages distinguish sourced facts from editorial analysis. Technical and procurement guides focus on selection questions and do not use unrelated current events as evidence." },
        { heading: "Corrections", body: "To report an accuracy issue, contact {email}. We retain publication dates and update material content when a correction is verified." }
      ]
    }
  },
  es: {
    privacy: {
      eyebrow: "Privacidad", title: "Política de privacidad",
      intro: "COWIN MAGNET utiliza este sitio web para recibir consultas B2B sobre productos, conocer el rendimiento del sitio y responder a las solicitudes de los compradores. Solo recopilamos información que nos ayuda a comunicarnos sobre equipos de separación magnética y servicios relacionados.",
      sections: [
        { heading: "Información que recibimos", body: "Los formularios de consulta pueden recopilar su nombre, empresa, correo electrónico, teléfono, país, productos de interés, detalles de la aplicación y contenido del mensaje. Los análisis del sitio pueden registrar páginas vistas, sitio de procedencia, tipo de dispositivo y navegador, región aproximada y parámetros de campaña." },
        { heading: "Cómo utilizamos la información", body: "Utilizamos la información de las consultas para responder preguntas sobre productos, ayudar en la selección, dar seguimiento a cotizaciones y mantener registros internos de servicio. Los datos analíticos se utilizan para mejorar el rendimiento de las páginas, la calidad SEO/GEO, la atribución de campañas y la fiabilidad del sitio." },
        { heading: "Comunicación y conservación", body: "No vendemos los datos de las consultas recibidas en el sitio. La información puede ser tratada por proveedores de alojamiento, correo electrónico, análisis y bases de datos que dan soporte al sitio. Conservamos los registros de consultas comerciales durante el tiempo necesario para la comunicación, el cumplimiento de obligaciones y la continuidad del servicio." },
        { heading: "Contacto", body: "Para consultas sobre privacidad, escríbanos a {email}." }
      ]
    },
    terms: {
      eyebrow: "Condiciones", title: "Condiciones de uso",
      intro: "Este sitio web ofrece información sobre productos, notas de aplicación, contenido sectorial y canales de consulta para compradores B2B. Al utilizarlo, usted acepta usar su contenido para evaluación comercial y comunicación lícitas.",
      sections: [
        { heading: "Información sobre productos", body: "Las páginas de productos y las descripciones técnicas sirven como referencia general para la selección. La configuración final del equipo, las dimensiones, la intensidad magnética, el método de instalación y los detalles de la cotización deben confirmarse según las condiciones reales de trabajo del comprador." },
        { heading: "Noticias y fuentes externas", body: "Las páginas de noticias pueden resumir información sectorial pública e incluir enlaces a las fuentes. Los sitios externos están bajo el control de sus respectivos operadores. Revisamos la pertinencia de las fuentes, pero los compradores deben verificar la información crítica de mercado, normativa y técnica antes de tomar decisiones." },
        { heading: "Disponibilidad del sitio", body: "Trabajamos para mantener disponibles el sitio, los formularios y los sistemas de datos, pero pueden producirse interrupciones temporales por mantenimiento, incidencias del alojamiento, problemas de red o limitaciones de servicios de terceros." },
        { heading: "Contacto", body: "Para consultas sobre estas condiciones, escriba a COWIN MAGNET a {email}." }
      ]
    },
    editorial: {
      eyebrow: "Política editorial", title: "Cómo publica COWIN MAGNET el contenido técnico",
      intro: "COWIN MAGNET publica contenido práctico para compradores industriales. El contenido se prepara a partir de información aprobada sobre productos, fuentes claramente atribuidas cuando una noticia se basa en información externa y una revisión editorial de precisión y pertinencia.",
      sections: [
        { heading: "Precisión y límites", body: "La configuración, el rendimiento y la idoneidad dependen del material y de las condiciones del sitio. No presentamos como hechos cifras técnicas, certificaciones, proyectos de clientes ni compromisos comerciales no verificados." },
        { heading: "Noticias y guías", body: "Las noticias distinguen los hechos respaldados por fuentes del análisis editorial. Las guías técnicas y de compra se centran en cuestiones de selección y no utilizan acontecimientos actuales no relacionados como prueba." },
        { heading: "Correcciones", body: "Para comunicar un problema de precisión, escriba a {email}. Conservamos las fechas de publicación y actualizamos el contenido sustancial cuando se verifica una corrección." }
      ]
    }
  },
  ru: {
    privacy: {
      eyebrow: "Конфиденциальность", title: "Политика конфиденциальности",
      intro: "COWIN MAGNET использует этот сайт для получения запросов о продукции от корпоративных покупателей, анализа работы сайта и ответа на обращения. Мы собираем только сведения, необходимые для общения по вопросам оборудования для магнитной сепарации и связанных услуг.",
      sections: [
        { heading: "Какие сведения мы получаем", body: "Формы запросов могут собирать ваше имя, название компании, адрес электронной почты, телефон, страну, интересующую продукцию, сведения о применении и текст сообщения. Системы аналитики сайта могут фиксировать просмотры страниц, источник перехода, тип устройства и браузера, приблизительный регион и параметры рекламной кампании." },
        { heading: "Как мы используем сведения", body: "Сведения из запросов используются для ответов на вопросы о продукции, помощи в подборе, последующей работы с коммерческими предложениями и ведения внутренних записей об обслуживании. Аналитические данные помогают улучшать работу страниц, качество SEO/GEO, оценку источников рекламного трафика и надёжность сайта." },
        { heading: "Передача и хранение", body: "Мы не продаём данные запросов, полученных через сайт. Сведения могут обрабатываться поставщиками услуг хостинга, электронной почты, аналитики и баз данных, обеспечивающими работу сайта. Записи деловых запросов хранятся столько, сколько необходимо для общения, соблюдения требований и непрерывности обслуживания." },
        { heading: "Контакты", body: "По вопросам конфиденциальности пишите на {email}." }
      ]
    },
    terms: {
      eyebrow: "Условия", title: "Условия использования",
      intro: "Этот сайт предоставляет корпоративным покупателям сведения о продукции, материалы по применению, отраслевой контент и способы отправки запросов. Используя сайт, вы соглашаетесь использовать материалы для законной деловой оценки и общения.",
      sections: [
        { heading: "Сведения о продукции", body: "Страницы продукции и технические описания предназначены для общего ознакомления при подборе. Окончательную комплектацию оборудования, размеры, магнитную силу, способ установки и условия коммерческого предложения необходимо подтверждать с учётом фактических условий эксплуатации покупателя." },
        { heading: "Новости и внешние источники", body: "Новостные страницы могут кратко излагать общедоступную отраслевую информацию и содержать ссылки на источники. Внешние сайты контролируются их владельцами. Мы оцениваем релевантность источников, однако перед принятием решений покупателям следует проверять важные рыночные, нормативные и технические сведения." },
        { heading: "Доступность сайта", body: "Мы стремимся обеспечивать доступность сайта, форм и систем данных, но возможны временные перерывы из-за обслуживания, сбоев хостинга, проблем сети или ограничений сторонних сервисов." },
        { heading: "Контакты", body: "По вопросам этих условий обращайтесь в COWIN MAGNET по адресу {email}." }
      ]
    },
    editorial: {
      eyebrow: "Редакционная политика", title: "Как COWIN MAGNET публикует технические материалы",
      intro: "COWIN MAGNET публикует практические материалы для промышленных покупателей. Они готовятся на основе одобренных сведений о продукции, чётко указанных источников, если новость опирается на внешние сообщения, и редакционной проверки точности и актуальности.",
      sections: [
        { heading: "Точность и ограничения", body: "Комплектация, эффективность и пригодность зависят от материала и условий объекта. Мы не выдаём непроверенные технические показатели, сертификаты, проекты клиентов или коммерческие обязательства за установленные факты." },
        { heading: "Новости и рекомендации", body: "В новостях факты с указанием источников отделяются от редакционного анализа. Технические руководства и материалы по закупкам посвящены вопросам подбора и не используют посторонние текущие события в качестве доказательств." },
        { heading: "Исправления", body: "Чтобы сообщить о неточности, напишите на {email}. Мы сохраняем даты публикации и обновляем существенные материалы после проверки исправления." }
      ]
    }
  },
  ar: {
    privacy: {
      eyebrow: "الخصوصية", title: "سياسة الخصوصية",
      intro: "تستخدم COWIN MAGNET هذا الموقع لتلقي استفسارات المنتجات بين الشركات، وفهم أداء الموقع، والرد على طلبات المشترين. ولا نجمع إلا المعلومات التي تساعدنا على التواصل بشأن معدات الفصل المغناطيسي واحتياجات الخدمات المرتبطة بها.",
      sections: [
        { heading: "المعلومات التي نتلقاها", body: "قد تجمع نماذج الاستفسار اسمك واسم شركتك وبريدك الإلكتروني ورقم هاتفك وبلدك والمنتجات التي تهمك وتفاصيل التطبيق ومحتوى رسالتك. وقد تسجل أدوات تحليل الموقع مشاهدات الصفحات ومصدر الزيارة ونوع الجهاز والمتصفح والمنطقة التقريبية ومعلمات الحملة." },
        { heading: "كيفية استخدام المعلومات", body: "نستخدم معلومات الاستفسارات للإجابة عن أسئلة المنتجات، وتقديم المساعدة في اختيار المعدات، ومتابعة عروض الأسعار، والاحتفاظ بسجلات الخدمة الداخلية. ونستخدم بيانات التحليل لتحسين أداء الصفحات وجودة SEO/GEO ونسب الزيارات إلى الحملات وموثوقية الموقع." },
        { heading: "المشاركة والاحتفاظ", body: "لا نبيع بيانات الاستفسارات الواردة عبر الموقع. وقد تُعالَج المعلومات لدى مزودي خدمات الاستضافة والبريد الإلكتروني والتحليل وقواعد البيانات الذين يدعمون الموقع. ونحتفظ بسجلات الاستفسارات التجارية ما دامت لازمة للتواصل والامتثال واستمرارية الخدمة." },
        { heading: "الاتصال", body: "للاستفسارات المتعلقة بالخصوصية، راسلنا على {email}." }
      ]
    },
    terms: {
      eyebrow: "الشروط", title: "شروط الاستخدام",
      intro: "يوفر هذا الموقع معلومات عن المنتجات وملاحظات عن التطبيقات ومحتوى قطاعيًا وقنوات للاستفسار للمشترين من الشركات. وباستخدامك الموقع، فإنك توافق على استعمال المحتوى للتقييم التجاري والتواصل بطريقة مشروعة.",
      sections: [
        { heading: "معلومات المنتجات", body: "تُقدَّم صفحات المنتجات والأوصاف الفنية مرجعًا عامًا لاختيار المعدات. ويجب تأكيد التكوين النهائي للمعدات والأبعاد والقوة المغناطيسية وطريقة التركيب وتفاصيل عرض السعر وفق ظروف التشغيل الفعلية لدى المشتري." },
        { heading: "الأخبار والمصادر الخارجية", body: "قد تلخّص صفحات الأخبار معلومات قطاعية متاحة للعموم وتتضمن روابط للمصادر. وتخضع المواقع الخارجية لإدارة مشغليها. نراجع صلة المصادر بالموضوع، لكن ينبغي للمشترين التحقق من المعلومات السوقية والتنظيمية والفنية المهمة قبل اتخاذ القرارات." },
        { heading: "توفر الموقع", body: "نسعى إلى إبقاء الموقع والنماذج وأنظمة البيانات متاحة، لكن قد تحدث انقطاعات مؤقتة أثناء الصيانة أو بسبب أعطال الاستضافة أو مشكلات الشبكة أو قيود خدمات الأطراف الثالثة." },
        { heading: "الاتصال", body: "للاستفسار عن هذه الشروط، تواصل مع COWIN MAGNET عبر {email}." }
      ]
    },
    editorial: {
      eyebrow: "السياسة التحريرية", title: "كيف تنشر COWIN MAGNET المحتوى الفني",
      intro: "تنشر COWIN MAGNET مواد عملية للمشترين الصناعيين. ويُعَد المحتوى اعتمادًا على معلومات المنتجات المعتمدة، مع نسبة المصادر بوضوح حين تعتمد الأخبار على تقارير خارجية، ومراجعة تحريرية للدقة والصلة بالموضوع.",
      sections: [
        { heading: "الدقة والحدود", body: "يعتمد التكوين والأداء والملاءمة على المادة وظروف الموقع. ولا نعرض أرقامًا فنية أو شهادات أو مشاريع عملاء أو التزامات تجارية غير مؤكدة على أنها حقائق." },
        { heading: "الأخبار والإرشادات", body: "تميّز صفحات الأخبار بين الحقائق المسندة إلى مصادر والتحليل التحريري. وتركز الأدلة الفنية وأدلة الشراء على أسئلة الاختيار، ولا تستخدم أحداثًا جارية لا صلة لها بالموضوع دليلًا." },
        { heading: "التصحيحات", body: "للإبلاغ عن مشكلة في الدقة، راسلنا على {email}. نحتفظ بتواريخ النشر ونحدّث المحتوى الجوهري عند التحقق من التصحيح." }
      ]
    }
  },
  fr: {
    privacy: {
      eyebrow: "Confidentialité", title: "Politique de confidentialité",
      intro: "COWIN MAGNET utilise ce site pour recevoir les demandes B2B concernant ses produits, comprendre les performances du site et répondre aux acheteurs. Nous ne recueillons que les informations utiles aux échanges sur les équipements de séparation magnétique et les services associés.",
      sections: [
        { heading: "Informations reçues", body: "Les formulaires de demande peuvent recueillir votre nom, votre société, votre adresse e-mail, votre numéro de téléphone, votre pays, les produits qui vous intéressent, des précisions sur l'application et le contenu de votre message. Les outils d'analyse du site peuvent enregistrer les pages consultées, la provenance de la visite, le type d'appareil et de navigateur, la région approximative et les paramètres de campagne." },
        { heading: "Utilisation des informations", body: "Nous utilisons les informations des demandes pour répondre aux questions sur les produits, apporter une aide au choix, assurer le suivi des devis et conserver des dossiers de service internes. Les données d'analyse servent à améliorer les performances des pages, la qualité SEO/GEO, l'attribution des campagnes et la fiabilité du site." },
        { heading: "Partage et conservation", body: "Nous ne vendons pas les données des demandes reçues sur le site. Les informations peuvent être traitées par les prestataires d'hébergement, d'e-mail, d'analyse et de base de données qui assurent le fonctionnement du site. Les dossiers de demandes commerciales sont conservés aussi longtemps que nécessaire pour les échanges, le respect des obligations et la continuité du service." },
        { heading: "Contact", body: "Pour toute question relative à la confidentialité, écrivez-nous à {email}." }
      ]
    },
    terms: {
      eyebrow: "Conditions", title: "Conditions d'utilisation",
      intro: "Ce site fournit aux acheteurs B2B des informations sur les produits, des notes d'application, du contenu sectoriel et des moyens de nous contacter. En l'utilisant, vous acceptez d'employer son contenu pour une évaluation commerciale et des échanges licites.",
      sections: [
        { heading: "Informations sur les produits", body: "Les pages produits et les descriptions techniques constituent des références générales pour le choix des équipements. La configuration définitive, les dimensions, la force magnétique, la méthode d'installation et les détails du devis doivent être confirmés en fonction des conditions de travail réelles de l'acheteur." },
        { heading: "Actualités et sources externes", body: "Les pages d'actualités peuvent résumer des informations sectorielles publiques et fournir des liens vers leurs sources. Les sites externes sont gérés par leurs propres exploitants. Nous vérifions la pertinence des sources, mais les acheteurs doivent contrôler les informations importantes concernant le marché, la réglementation et la technique avant de prendre une décision." },
        { heading: "Disponibilité du site", body: "Nous veillons à maintenir disponibles le site, les formulaires et les systèmes de données, mais des interruptions temporaires peuvent survenir lors de la maintenance, d'incidents d'hébergement, de problèmes de réseau ou de limitations de services tiers." },
        { heading: "Contact", body: "Pour toute question sur ces conditions, contactez COWIN MAGNET à {email}." }
      ]
    },
    editorial: {
      eyebrow: "Politique éditoriale", title: "Comment COWIN MAGNET publie ses contenus techniques",
      intro: "COWIN MAGNET publie des contenus pratiques destinés aux acheteurs industriels. Ils sont élaborés à partir d'informations approuvées sur les produits, de sources clairement citées lorsqu'une actualité repose sur des informations externes, et d'une vérification éditoriale de leur exactitude et de leur pertinence.",
      sections: [
        { heading: "Exactitude et limites", body: "La configuration, les performances et l'adéquation dépendent du matériau et des conditions du site. Nous ne présentons pas comme des faits des données techniques, certifications, projets clients ou engagements commerciaux non vérifiés." },
        { heading: "Actualités et conseils", body: "Les actualités distinguent les faits sourcés de l'analyse éditoriale. Les guides techniques et d'achat portent sur les questions de sélection et n'utilisent pas des événements d'actualité sans rapport comme preuves." },
        { heading: "Corrections", body: "Pour signaler une inexactitude, écrivez à {email}. Nous conservons les dates de publication et mettons à jour le contenu substantiel lorsqu'une correction est vérifiée." }
      ]
    }
  },
  pt: {
    privacy: {
      eyebrow: "Privacidade", title: "Política de privacidade",
      intro: "A COWIN MAGNET utiliza este site para receber consultas B2B sobre produtos, compreender o desempenho do site e responder às solicitações dos compradores. Recolhemos apenas informações que nos ajudam a comunicar sobre equipamentos de separação magnética e necessidades de serviços relacionadas.",
      sections: [
        { heading: "Informações recebidas", body: "Os formulários de consulta podem recolher o seu nome, empresa, e-mail, telefone, país, produtos de interesse, detalhes da aplicação e conteúdo da mensagem. A análise do site pode registar visualizações de páginas, origem da visita, tipo de dispositivo e navegador, região aproximada e parâmetros da campanha." },
        { heading: "Como utilizamos as informações", body: "Utilizamos as informações das consultas para responder a perguntas sobre produtos, ajudar na seleção, acompanhar orçamentos e manter registos internos de atendimento. Os dados analíticos servem para melhorar o desempenho das páginas, a qualidade SEO/GEO, a atribuição de campanhas e a fiabilidade do site." },
        { heading: "Partilha e conservação", body: "Não vendemos dados de consultas recebidas pelo site. As informações podem ser tratadas por fornecedores de alojamento, e-mail, análise e bases de dados que dão suporte ao site. Os registos de consultas comerciais são conservados pelo tempo necessário à comunicação, ao cumprimento de obrigações e à continuidade do serviço." },
        { heading: "Contacto", body: "Para questões de privacidade, escreva-nos para {email}." }
      ]
    },
    terms: {
      eyebrow: "Termos", title: "Termos de utilização",
      intro: "Este site fornece aos compradores B2B informações sobre produtos, notas de aplicação, conteúdos setoriais e canais de consulta. Ao utilizá-lo, concorda em usar os conteúdos para avaliação comercial e comunicação lícitas.",
      sections: [
        { heading: "Informações sobre produtos", body: "As páginas de produtos e as descrições técnicas servem de referência geral para a seleção. A configuração final do equipamento, as dimensões, a força magnética, o método de instalação e os detalhes do orçamento devem ser confirmados de acordo com as condições reais de trabalho do comprador." },
        { heading: "Notícias e fontes externas", body: "As páginas de notícias podem resumir informações setoriais públicas e incluir ligações para as fontes. Os sites externos são controlados pelos respetivos operadores. Avaliamos a pertinência das fontes, mas os compradores devem confirmar informações importantes de mercado, regulamentares e técnicas antes de tomar decisões." },
        { heading: "Disponibilidade do site", body: "Trabalhamos para manter o site, os formulários e os sistemas de dados disponíveis, mas podem ocorrer interrupções temporárias durante a manutenção, incidentes de alojamento, problemas de rede ou limitações de serviços de terceiros." },
        { heading: "Contacto", body: "Para questões sobre estes termos, contacte a COWIN MAGNET através de {email}." }
      ]
    },
    editorial: {
      eyebrow: "Política editorial", title: "Como a COWIN MAGNET publica conteúdo técnico",
      intro: "A COWIN MAGNET publica materiais práticos para compradores industriais. O conteúdo é preparado com base em informações aprovadas sobre os produtos, fontes claramente identificadas quando uma notícia depende de informações externas e revisão editorial quanto à exatidão e pertinência.",
      sections: [
        { heading: "Exatidão e limites", body: "A configuração, o desempenho e a adequação dependem do material e das condições do local. Não apresentamos como factos números técnicos, certificações, projetos de clientes ou compromissos comerciais não verificados." },
        { heading: "Notícias e orientações", body: "As notícias distinguem factos documentados da análise editorial. Os guias técnicos e de compras concentram-se nas questões de seleção e não usam acontecimentos atuais sem relação como prova." },
        { heading: "Correções", body: "Para comunicar uma inexatidão, escreva para {email}. Mantemos as datas de publicação e atualizamos o conteúdo substancial quando uma correção é verificada." }
      ]
    }
  }
};

export function getLegalDocument(locale: Locale, kind: LegalKind): LegalDocument {
  return documents[locale][kind];
}
