export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  imageGallery?: string[];
  summary: string;
  keywords: string[];
  features: string[];
  principle: string;
  specs: { label: string; value: string }[];
  applications: string[];
  installation: string;
  customization: string[];
  faqs: { question: string; answer: string }[];
  sourceUrls?: string[];
  sourceSite?: string;
};

export const productCategories = [
  "Suspended & Self-Unloading Iron Removers",
  "Magnetic Separation Equipment",
  "Metal Detection & Recycling Sorting",
  "Magnetic Components & Filters",
  "Industry Application Equipment"
];

export const products: Product[] = [
  {
    "slug": "rcyd-type-permanent-magnet-self-dumping-iron-remover",
    "name": "RCYD type permanent magnet self dumping iron remover",
    "category": "Suspended & Self-Unloading Iron Removers",
    "image": "/assets/products/rcyd-type-permanent-magnet-self-dumping-iron-remover/rcyd-type-permanent-magnet-self-dumping-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcyd-type-permanent-magnet-self-dumping-iron-remover/rcyd-type-permanent-magnet-self-dumping-iron-remover-01.jpg",
      "/assets/products/rcyd-type-permanent-magnet-self-dumping-iron-remover/rcyd-type-permanent-magnet-self-dumping-iron-remover-02.png",
      "/assets/products/rcyd-type-permanent-magnet-self-dumping-iron-remover/rcyd-type-permanent-magnet-self-dumping-iron-remover-03.png",
      "/assets/products/rcyd-type-permanent-magnet-self-dumping-iron-remover/rcyd-type-permanent-magnet-self-dumping-iron-remover-07.png",
      "/assets/products/rcyd-type-permanent-magnet-self-dumping-iron-remover/rcyd-type-permanent-magnet-self-dumping-iron-remover-05.png",
      "/assets/products/rcyd-type-permanent-magnet-self-dumping-iron-remover/rcyd-type-permanent-magnet-self-dumping-iron-remover-09.jpg",
      "/assets/products/rcyd-type-permanent-magnet-self-dumping-iron-remover/rcyd-type-permanent-magnet-self-dumping-iron-remover-04.png",
      "/assets/products/rcyd-type-permanent-magnet-self-dumping-iron-remover/rcyd-type-permanent-magnet-self-dumping-iron-remover-08.jpg",
      "/assets/products/rcyd-type-permanent-magnet-self-dumping-iron-remover/rcyd-type-permanent-magnet-self-dumping-iron-remover-06.png"
    ],
    "summary": "product overview： 1、 Explanation The RCYD permanent magnet self dumping iron remover is equivalent to the RCYC series model and is suitable for removing iron from conveyor belts in various industries. It can achieve continuous suction and disposal of iron.",
    "keywords": [
      "RCYD type permanent magnet self dumping iron remover",
      "General iron removal equipment",
      "ore"
    ],
    "features": [
      "The RCYD permanent magnet self dumping iron remover is equivalent to the RCYC series model and is suitable for removing iron from conveyor belts in various industries",
      "It can achieve continuous suction and disposal of iron",
      "The belt has an automatic correction function, which is reliable in operation and easy to maintain",
      "The internal magnetic circuit adopts a perfect magnetic pole structure to ensure the long-term operation of the whole machine without faults in harsh environments",
      "It has explosion-proof and armored types"
    ],
    "principle": "product overview： 1、 Explanation The RCYD permanent magnet self dumping iron remover is equivalent to the RCYC series model and is suitable for removing iron from conveyor belts in various industries. It can achieve continuous suction and disposal of iron. The belt has an automatic correction function, which is reliable in operation and easy to maintain. The internal magnetic circuit adopts a perfect magnetic pole structure to ensure the long-term operation of the whole machine without faults in harsh environments. It has explosion-proof and armored types. 2、 Schematic diagram 3、 Main technical parameters 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "RCYC"
      },
      {
        "label": "Model",
        "value": "RCYD"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: RCYC",
      "Model: RCYD"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/60.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover",
    "name": "RCDD type self cooling self dumping electromagnetic iron remover",
    "category": "Suspended & Self-Unloading Iron Removers",
    "image": "/assets/products/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover-01.jpg",
      "/assets/products/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover-06.png",
      "/assets/products/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover-03.png",
      "/assets/products/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover-02.png",
      "/assets/products/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover-04.png",
      "/assets/products/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover-05.png",
      "/assets/products/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover-08.jpg",
      "/assets/products/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The RCDD self cooling self dumping electromagnetic iron remover is a device used for automatically removing impurities of iron from powdered or block shaped non-magnetic materials. It is internally cast with electrical",
    "keywords": [
      "RCDD type self cooling self dumping electromagnetic iron remover",
      "General iron removal equipment"
    ],
    "features": [
      "The RCDD self cooling self dumping electromagnetic iron remover is a device used for automatically removing impurities of iron from powdered or block shaped non-magnetic materials",
      "It is internally cast with electrical specific resin and features a self cooling fully sealed structure"
    ],
    "principle": "product overview： 1、 Explanation The RCDD self cooling self dumping electromagnetic iron remover is a device used for automatically removing impurities of iron from powdered or block shaped non-magnetic materials. It is internally cast with electrical specific resin and features a self cooling fully sealed structure. It has the advantages of high magnetic penetration depth, strong suction, dust prevention, rain resistance, corrosion resistance, and automatic belt correction, and can still operate reliably in extremely harsh environments. 2、 Schematic diagram 3、 Main technical parameters Note: All models in this series are designed with extra strong T1, T2, and T3 products that are higher than the national standard. The rated magnetic field strength at the lifting height is 90mT, 120mT, and 150mT, respectively. 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "RCDD"
      }
    ],
    "applications": [
      "General iron removal equipment"
    ],
    "installation": "",
    "customization": [
      "Model: RCDD"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/49.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcyb-type-permanent-magnet-manual-iron-remover",
    "name": "RCYB type permanent magnet manual iron remover",
    "category": "Suspended & Self-Unloading Iron Removers",
    "image": "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-01.jpg",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-02.png",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-03.png",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-04.png",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-05.png",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-06.png",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-08.jpg",
      "/assets/products/rcyb-type-permanent-magnet-manual-iron-remover/rcyb-type-permanent-magnet-manual-iron-remover-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The RCYB type permanent magnet manual iron remover adopts a composite magnetic system composed of special permanent magnets such as neodymium iron boron with high coercivity and high remanence inside. Suitable for removing",
    "keywords": [
      "RCYB type permanent magnet manual iron remover",
      "General iron removal equipment",
      "ore"
    ],
    "features": [
      "The RCYB type permanent magnet manual iron remover adopts a composite magnetic system composed of special permanent magnets such as neodymium iron boron with high coercivity and high remanence inside",
      "Suitable for removing iron from non-magnetic materials on belt conveyors, vibrating conveyors, electromagnetic vibrating feeders, and discharge chutes",
      "It can remove 0.1-35kg of ferromagnetic material, and the internal permanent magnet system has a service life of more than 10 years",
      "All technical indicators of this product comply with the JB/T8711-2012 standard",
      "It has the advantages of maintenance free, strong magnetic force, long service life, simple"
    ],
    "principle": "product overview： 1、 Explanation The RCYB type permanent magnet manual iron remover adopts a composite magnetic system composed of special permanent magnets such as neodymium iron boron with high coercivity and high remanence inside. Suitable for removing iron from non-magnetic materials on belt conveyors, vibrating conveyors, electromagnetic vibrating feeders, and discharge chutes. It can remove 0.1-35kg of ferromagnetic material, and the internal permanent magnet system has a service life of more than 10 years. All technical indicators of this product comply with the JB/T8711-2012 standard. It has the advantages of maintenance free, strong magnetic force, long service life, simple installation, convenient use, and reliable operation. When the permanent magnet adsorbs a large amount of ferromagnetic material, it can be manually removed with a non-magnetic scraper or gloves, which is suitable for non continuous work and situations with low iron content. 2、 Schematic diagram 3、 Main technical parameters Note: All models in this series are designed with extra strong T1, T2, and T3 products that are higher than the national standard. The rated magnetic field strength at the lifting height is 90mT, 120mT, and 150mT, respectively. 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "JB/T8711"
      },
      {
        "label": "Model",
        "value": "RCYB"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: JB/T8711",
      "Model: RCYB"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/58.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcdb-type-self-cooling-plate-electromagnetic-iron-remover",
    "name": "RCDB type self cooling plate electromagnetic iron remover",
    "category": "Suspended & Self-Unloading Iron Removers",
    "image": "/assets/products/rcdb-type-self-cooling-plate-electromagnetic-iron-remover/rcdb-type-self-cooling-plate-electromagnetic-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcdb-type-self-cooling-plate-electromagnetic-iron-remover/rcdb-type-self-cooling-plate-electromagnetic-iron-remover-01.jpg",
      "/assets/products/rcdb-type-self-cooling-plate-electromagnetic-iron-remover/rcdb-type-self-cooling-plate-electromagnetic-iron-remover-02.png",
      "/assets/products/rcdb-type-self-cooling-plate-electromagnetic-iron-remover/rcdb-type-self-cooling-plate-electromagnetic-iron-remover-05.png",
      "/assets/products/rcdb-type-self-cooling-plate-electromagnetic-iron-remover/rcdb-type-self-cooling-plate-electromagnetic-iron-remover-03.png",
      "/assets/products/rcdb-type-self-cooling-plate-electromagnetic-iron-remover/rcdb-type-self-cooling-plate-electromagnetic-iron-remover-04.png",
      "/assets/products/rcdb-type-self-cooling-plate-electromagnetic-iron-remover/rcdb-type-self-cooling-plate-electromagnetic-iron-remover-07.jpg",
      "/assets/products/rcdb-type-self-cooling-plate-electromagnetic-iron-remover/rcdb-type-self-cooling-plate-electromagnetic-iron-remover-06.jpg"
    ],
    "summary": "product overview： 1、 Explanation The RCDB type self cooling disc electromagnetic iron remover is equivalent to the PDC series disc electromagnetic iron remover and the RCDY series electromagnetic iron remover. It is an iron removal device used to remove",
    "keywords": [
      "RCDB type self cooling plate electromagnetic iron remover",
      "General iron removal equipment"
    ],
    "features": [
      "The RCDB type self cooling disc electromagnetic iron remover is equivalent to the PDC series disc electromagnetic iron remover and the RCDY series electromagnetic iron remover",
      "It is an iron removal device used to remove impurities from non-magnetic materials in powder or block form",
      "It can still operate reliably in extremely harsh environments",
      "The equipment of the walking device can be chosen by the customer themselves"
    ],
    "principle": "product overview： 1、 Explanation The RCDB type self cooling disc electromagnetic iron remover is equivalent to the PDC series disc electromagnetic iron remover and the RCDY series electromagnetic iron remover. It is an iron removal device used to remove impurities from non-magnetic materials in powder or block form. It is internally cast with electrical specific resin and has a self cooling fully sealed structure, which has the characteristics of high magnetic penetration depth, strong suction, dust prevention, rain resistance, corrosion resistance, etc. It can still operate reliably in extremely harsh environments. The equipment of the walking device can be chosen by the customer themselves. 2、 Schematic diagram 3、 Main technical parameters Note: RCDB-3~RCDB-8 models do not require wave fin heat sinks on the body shell. The RCDB-10 to RCDB-18 models are equipped with wavy fin heat sinks to increase the heat dissipation area. 2. All models in this series are designed with extra strong T1, T2, and T3 products that are higher than the national standard. The rated magnetic field strength at the lifting height is 90mT, 120mT, and 150mT, respectively. 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "PDC"
      },
      {
        "label": "Model",
        "value": "RCDB"
      },
      {
        "label": "Model",
        "value": "RCDB-10"
      },
      {
        "label": "Model",
        "value": "RCDB-18"
      },
      {
        "label": "Model",
        "value": "RCDB-3"
      },
      {
        "label": "Model",
        "value": "RCDB-8"
      },
      {
        "label": "Model",
        "value": "RCDY"
      }
    ],
    "applications": [
      "General iron removal equipment"
    ],
    "installation": "",
    "customization": [
      "Model: PDC",
      "Model: RCDB",
      "Model: RCDB-10",
      "Model: RCDB-18",
      "Model: RCDB-3",
      "Model: RCDB-8",
      "Model: RCDY"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/57.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "belt-high-gradient-magnetic-separator",
    "name": "Belt High Gradient Magnetic Separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/belt-high-gradient-magnetic-separator/belt-high-gradient-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/belt-high-gradient-magnetic-separator/belt-high-gradient-magnetic-separator-01.jpg",
      "/assets/products/belt-high-gradient-magnetic-separator/belt-high-gradient-magnetic-separator-02.jpg",
      "/assets/products/belt-high-gradient-magnetic-separator/belt-high-gradient-magnetic-separator-09.jpg",
      "/assets/products/belt-high-gradient-magnetic-separator/belt-high-gradient-magnetic-separator-06.jpg",
      "/assets/products/belt-high-gradient-magnetic-separator/belt-high-gradient-magnetic-separator-05.jpg",
      "/assets/products/belt-high-gradient-magnetic-separator/belt-high-gradient-magnetic-separator-07.jpg",
      "/assets/products/belt-high-gradient-magnetic-separator/belt-high-gradient-magnetic-separator-03.jpg",
      "/assets/products/belt-high-gradient-magnetic-separator/belt-high-gradient-magnetic-separator-04.jpg",
      "/assets/products/belt-high-gradient-magnetic-separator/belt-high-gradient-magnetic-separator-08.jpg"
    ],
    "summary": "Belt High Gradient Magnetic Separator is a high performance magnetic separation equipment designed for small size ore(size less than 2mm) processing and magnetic material separating from mineral.",
    "keywords": [
      "Belt High Gradient Magnetic Separator",
      "Mining Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "mineral",
      "metal recycling"
    ],
    "features": [],
    "principle": "products_details.css?v=1764035205000&tenantId=233649&viewType=1\" rel=\"stylesheet\" type=\"text/css\" /> chnmag@chnmag.com  Search Determine Cancel $('.diaBtn').on('click', function () { $(this).siblings('.lay').removeClass('hiden'); }); $('.p_searchBtn').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); $('.closse').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); ; Home Metal Recycling  Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Mining Industry  Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Food Industry  Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Company Blog Contacts var _li =$('.navUl').children('.navLi'); _li.each(function(i, e) { $(this).addClass('tplink'+(i+1)); } ); $('.navBtn').on('click',function(){ $(this).siblings('.tNav').toggleClass('tNavHeight'); } ); $('.navSliBtn').on('click',function(){ $('.tNav').removeClass('tNavHeight'); } ); $('.iconJt').on('click',function(){ $(this).toggleClass('iconJtRotate') .parents('.navLi').siblings('.navLi') .find('.slidBox').slideUp().end() .find('.tNavH').removeClass('tNavHBac').end() .find('.iconJt').removeClass('iconJtRotate').end().end().end() .parent('.tNavH').addClass('tNavHBac').siblings('.slidBox').slideToggle(); } ); $(\"div[id^='c_portalResnav_main']\").attr(\"loaded\",\"true\"); Home Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet Company Blog Contacts  Home Metal Recycling  Eccentric Eddy Current Separator Permanent",
    "specs": [],
    "applications": [
      "Mining Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "mineral",
      "metal recycling"
    ],
    "installation": "",
    "customization": [],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Belt-High-Gradient-Magnetic-Separator-26.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "disc-magnetic-separator-for-tailing",
    "name": "Disc Magnetic Separator for Tailing",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/disc-magnetic-separator-for-tailing/disc-magnetic-separator-for-tailing-01.jpg",
    "imageGallery": [
      "/assets/products/disc-magnetic-separator-for-tailing/disc-magnetic-separator-for-tailing-01.jpg",
      "/assets/products/disc-magnetic-separator-for-tailing/disc-magnetic-separator-for-tailing-02.jpg",
      "/assets/products/disc-magnetic-separator-for-tailing/disc-magnetic-separator-for-tailing-03.jpg",
      "/assets/products/disc-magnetic-separator-for-tailing/disc-magnetic-separator-for-tailing-04.jpg",
      "/assets/products/disc-magnetic-separator-for-tailing/disc-magnetic-separator-for-tailing-05.jpg",
      "/assets/products/disc-magnetic-separator-for-tailing/disc-magnetic-separator-for-tailing-08.jpg",
      "/assets/products/disc-magnetic-separator-for-tailing/disc-magnetic-separator-for-tailing-06.jpg",
      "/assets/products/disc-magnetic-separator-for-tailing/disc-magnetic-separator-for-tailing-07.jpg"
    ],
    "summary": "Iron ore tailing recovery machine is used in iron mine to recover magnetic minerals from the tailing and reduce ore wastage. In this way, the resource can be fully used.",
    "keywords": [
      "Disc Magnetic Separator for Tailing",
      "Mining Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "mineral",
      "metal recycling"
    ],
    "features": [],
    "principle": "Iron ore tailing recovery machine is used in iron mine to recover magnetic minerals from the tailing and reduce ore wastage. In this way, the resource can be fully used. At present, it is the newest equipment applied to tailing recovery and it plays an irreplaceable role in ore dressing line because of its high recovery rate which has made a new record in China. Operating Principle Iron ore tailing recovery machine is composed of five main parts which are magnetic plates, ore-unloading equipment, ore collector, chute and body frame. After the pulp flows into the chute from one port of it, the magnetic materials will be absorbed on the surface of the magnetic plate fixed in the chute, and the nonmagnetic pulp will be discharged from the other port of it. Under the action of rotating magnetic plates, the magnetic materials are exposed from the pulp level and enter the unloading area. Being thrown into the ore collector by the ore-unloading chute, the magnetic materials will be collected and output by the ore collector.",
    "specs": [],
    "applications": [
      "Mining Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "mineral",
      "metal recycling"
    ],
    "installation": "",
    "customization": [],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Disc-Magnetic-Separator-for-Tailing-28.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "dry-drum-magnetic-separator",
    "name": "Dry Drum Magnetic Separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-01.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-02.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-04.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-03.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-05.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-06.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-07.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-08.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-16.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-12.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-13.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-09.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-11.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-14.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-10.jpg",
      "/assets/products/dry-drum-magnetic-separator/dry-drum-magnetic-separator-15.jpg"
    ],
    "summary": "Dry Drum Magnetic Separator is a high-efficiency ore concentration machine used to remove, purify, or separate magnetic materials in dry processing lines.",
    "keywords": [
      "Dry Drum Magnetic Separator",
      "Mining Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "features": [],
    "principle": "The equipment separates magnetic minerals or ferrous particles from dry bulk material by using a magnetic drum. Magnetic material is attracted to the drum surface and discharged separately from non-magnetic material.",
    "specs": [
      {
        "label": "Model",
        "value": "QJ-CGT"
      }
    ],
    "applications": [
      "Mining Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [
      "Model: QJ-CGT"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Dry-Drum-Magnetic-Separator-24.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "wet-drum-magnetic-separator",
    "name": "Wet Drum Magnetic Separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-01.jpg",
      "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-02.jpg",
      "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-03.jpg",
      "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-04.jpg",
      "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-05.jpg",
      "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-06.jpg",
      "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-07.jpg",
      "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-08.jpg",
      "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-09.jpg"
    ],
    "summary": "Wet permanent Drum Magnetic Separator are used in Dense Media Separation (DMS) plants for the recovery of magnetic particles from the dilute medium. They must recover the maximum amount of magnetic particles at the highest possible density.",
    "keywords": [
      "Wet Drum Magnetic Separator",
      "Mining Industry",
      "mining",
      "recycling",
      "coal",
      "food",
      "ore",
      "mineral",
      "metal recycling"
    ],
    "features": [],
    "principle": "products_details.css?v=1764035205000&tenantId=233649&viewType=1\" rel=\"stylesheet\" type=\"text/css\" /> chnmag@chnmag.com  Search Determine Cancel $('.diaBtn').on('click', function () { $(this).siblings('.lay').removeClass('hiden'); }); $('.p_searchBtn').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); $('.closse').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); ; Home Metal Recycling  Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Mining Industry  Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Food Industry  Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Company Blog Contacts var _li =$('.navUl').children('.navLi'); _li.each(function(i, e) { $(this).addClass('tplink'+(i+1)); } ); $('.navBtn').on('click',function(){ $(this).siblings('.tNav').toggleClass('tNavHeight'); } ); $('.navSliBtn').on('click',function(){ $('.tNav').removeClass('tNavHeight'); } ); $('.iconJt').on('click',function(){ $(this).toggleClass('iconJtRotate') .parents('.navLi').siblings('.navLi') .find('.slidBox').slideUp().end() .find('.tNavH').removeClass('tNavHBac').end() .find('.iconJt').removeClass('iconJtRotate').end().end().end() .parent('.tNavH').addClass('tNavHBac').siblings('.slidBox').slideToggle(); } ); $(\"div[id^='c_portalResnav_main']\").attr(\"loaded\",\"true\"); Home Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet Company Blog Contacts  Home Metal Recycling  Eccentric Eddy Current Separator Permanent",
    "specs": [
      {
        "label": "Model",
        "value": "CTB"
      },
      {
        "label": "Model",
        "value": "CTN"
      },
      {
        "label": "Model",
        "value": "CTS"
      },
      {
        "label": "Model",
        "value": "DMS"
      },
      {
        "label": "Model",
        "value": "QJ-CT(S"
      }
    ],
    "applications": [
      "Mining Industry",
      "mining",
      "recycling",
      "coal",
      "food",
      "ore",
      "mineral",
      "metal recycling"
    ],
    "installation": "",
    "customization": [
      "Model: CTB",
      "Model: CTN",
      "Model: CTS",
      "Model: DMS",
      "Model: QJ-CT(S"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Wet-Drum-Magnetic-Separator-25.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "cbz-type-rotary-automatic-magnetic-separator",
    "name": "CBZ type rotary automatic magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/cbz-type-rotary-automatic-magnetic-separator/cbz-type-rotary-automatic-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/cbz-type-rotary-automatic-magnetic-separator/cbz-type-rotary-automatic-magnetic-separator-01.jpg",
      "/assets/products/cbz-type-rotary-automatic-magnetic-separator/cbz-type-rotary-automatic-magnetic-separator-02.png",
      "/assets/products/cbz-type-rotary-automatic-magnetic-separator/cbz-type-rotary-automatic-magnetic-separator-03.png",
      "/assets/products/cbz-type-rotary-automatic-magnetic-separator/cbz-type-rotary-automatic-magnetic-separator-06.png",
      "/assets/products/cbz-type-rotary-automatic-magnetic-separator/cbz-type-rotary-automatic-magnetic-separator-07.jpg",
      "/assets/products/cbz-type-rotary-automatic-magnetic-separator/cbz-type-rotary-automatic-magnetic-separator-04.png",
      "/assets/products/cbz-type-rotary-automatic-magnetic-separator/cbz-type-rotary-automatic-magnetic-separator-08.jpg",
      "/assets/products/cbz-type-rotary-automatic-magnetic-separator/cbz-type-rotary-automatic-magnetic-separator-09.png",
      "/assets/products/cbz-type-rotary-automatic-magnetic-separator/cbz-type-rotary-automatic-magnetic-separator-10.png",
      "/assets/products/cbz-type-rotary-automatic-magnetic-separator/cbz-type-rotary-automatic-magnetic-separator-11.png",
      "/assets/products/cbz-type-rotary-automatic-magnetic-separator/cbz-type-rotary-automatic-magnetic-separator-05.png"
    ],
    "summary": "product overview： 1、 Characteristics The CBZ rotary automatic magnetic separator can be installed in assembly lines to remove fine and very fine iron metal impurities from bulk materials. The automatic timing controller can set the cleaning time interval",
    "keywords": [
      "CBZ type rotary automatic magnetic separator",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "chemical",
      "food",
      "ore",
      "pharmaceutical",
      "recycling",
      "wood"
    ],
    "features": [
      "The CBZ rotary automatic magnetic separator can be installed in assembly lines to remove fine and very fine iron metal impurities from bulk materials",
      "The automatic timing controller can set the cleaning time interval based on the iron content",
      "Its strong magnetism can remove ferromagnetic substances from flowing, dry, flowable, powdery, fine particles (particle diameter<6mm), and thin sheet-like materials"
    ],
    "principle": "product overview： 1、 Characteristics The CBZ rotary automatic magnetic separator can be installed in assembly lines to remove fine and very fine iron metal impurities from bulk materials. The automatic timing controller can set the cleaning time interval based on the iron content. Its strong magnetism can remove ferromagnetic substances from flowing, dry, flowable, powdery, fine particles (particle diameter<6mm), and thin sheet-like materials. Installation method: free fall, pipeline series for conveying materials, single machine use for bulk materials. Application industries: Food industry, chemical industry, pharmaceutical industry, plastic industry, wood industry, recycling industry, packaging industry, quartz sand iron removal, potassium feldspar iron removal, mica iron removal, micro powder iron removal, fly ash iron removal, and all 10-500 mesh fine powder materials for iron removal. Product Description: The CBZ rotary automatic magnetic separator is mainly used to separate ferromagnetic impurities in materials that are prone to clumping or adhesion. The rotating magnetic rod driven by the motor can prevent material blockage, ensuring that the product can fully contact the magnet during the flow process. Product advantages: The cleaning of the system is fully automated, and the magnetic core sealed in the stainless steel shell shuttles back and forth between the work area and the cleaning area. The powerful magnetic force can automatically remove the adsorbed iron according to the set time. ◇ Standard caliber (mm): 150, 200, 250, 300, 350, 400, 450, 500. Customized according to customer on-site requirements. Unloading method: timed control, automatic clearing, adjustable interval time. 2、 Schematic diagram 3、 Schematic diagram 4、 Industry Applications",
    "specs": [
      {
        "label": "Installation method",
        "value": "free fall, pipeline series for conveying materials, single machine use for bulk materials."
      },
      {
        "label": "Application industries",
        "value": "Food industry, chemical industry, pharmaceutical industry, plastic industry, wood industry, recycling industry, packaging industry, quartz sand iron removal, potassium feldspar iron removal, mica iron removal, micro powder iron removal, fly ash iron removal, and all 10-500 mesh fine powder materials for iron removal."
      },
      {
        "label": "Standard caliber (mm)",
        "value": "150, 200, 250, 300, 350, 400, 450,"
      },
      {
        "label": "Unloading method",
        "value": "timed control, automatic clearing, adjustable interval time."
      },
      {
        "label": "Product Description",
        "value": "The CBZ rotary automatic magnetic separator is mainly used to separate ferromagnetic impurities in materials that are prone to clumping or adhesion. The rotating magnetic rod driven by the motor can prevent material blockage, ensuring that the product can fully contact the magnet during the flow process."
      },
      {
        "label": "Product advantages",
        "value": "The cleaning of the system is fully automated, and the magnetic core sealed in the stainless steel shell shuttles back and forth between the work area and the cleaning area. The powerful magnetic force can automatically remove the adsorbed iron according to the set time. ◇"
      },
      {
        "label": "Model",
        "value": "CBZ"
      }
    ],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "chemical",
      "food",
      "ore",
      "pharmaceutical",
      "recycling",
      "wood"
    ],
    "installation": "Installation method: free fall, pipeline series for conveying materials, single machine use for bulk materials.",
    "customization": [
      "Installation method: free fall, pipeline series for conveying materials, single machine use for bulk materials.",
      "Application industries: Food industry, chemical industry, pharmaceutical industry, plastic industry, wood industry, recycling industry, packaging industry, quartz sand iron removal, potassium feldspar iron removal, mica iron removal, micro powder iron removal, fly ash iron removal, and all 10-500 mesh fine powder materials for iron removal.",
      "Product Description: The CBZ rotary automatic magnetic separator is mainly used to separate ferromagnetic impurities in materials that are prone to clumping or adhesion. The rotating magnetic rod driven by the motor can prevent material blockage, ensuring that the product can fully contact the magnet during the flow process.",
      "Model: CBZ"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/23.html",
      "https://www.cnmagnetics.com/n-15/66.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "cgb-type-rotary-semi-automatic-magnetic-separator",
    "name": "CGB type rotary semi-automatic magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-01.jpg",
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-02.png",
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-03.png",
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-07.png",
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-04.png",
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-08.jpg",
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-05.png",
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-09.jpg",
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-06.png",
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-10.png",
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-12.png",
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-11.png",
      "/assets/products/cgb-type-rotary-semi-automatic-magnetic-separator/cgb-type-rotary-semi-automatic-magnetic-separator-13.png"
    ],
    "summary": "product overview： 1、 Explanation The CGB rotary semi-automatic magnetic separator is mainly used to separate ferromagnetic impurities in materials that are prone to clumping or adhesion. The rotating magnetic rod driven by the motor can prevent material",
    "keywords": [
      "CGB type rotary semi-automatic magnetic separator",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "chemical",
      "food",
      "pharmaceutical",
      "recycling",
      "wood"
    ],
    "features": [
      "The CGB rotary semi-automatic magnetic separator is mainly used to separate ferromagnetic impurities in materials that are prone to clumping or adhesion",
      "The rotating magnetic rod driven by the motor can prevent material blockage, ensuring that the product can fully contact the magnet during the flow process"
    ],
    "principle": "product overview： 1、 Explanation The CGB rotary semi-automatic magnetic separator is mainly used to separate ferromagnetic impurities in materials that are prone to clumping or adhesion. The rotating magnetic rod driven by the motor can prevent material blockage, ensuring that the product can fully contact the magnet during the flow process. Installation method: free fall, pipeline series for conveying materials, single machine use for bulk materials. Application industries: Food industry, chemical industry, pharmaceutical industry, plastic industry, wood industry, recycling industry, packaging industry, quartz sand iron removal, potassium feldspar iron removal, mica iron removal, micro powder iron removal, fly ash iron removal, and all 10-500 mesh fine powder materials for iron removal. Its strong magnetism can remove flowing, dry, flowable, powdery, and fine particles (particle diameter<6mm), as well as ferromagnetic substances in thin sheet materials. ◇ Standard caliber (mm): 150, 200, 250, 300, 350, 400, 450, 500. Customized according to customer on-site requirements. Unloading method: manual clearing. 2、 Schematic diagram 3、 Industry Applications",
    "specs": [
      {
        "label": "Installation method",
        "value": "free fall, pipeline series for conveying materials, single machine use for bulk materials."
      },
      {
        "label": "Standard caliber (mm)",
        "value": "150, 200, 250, 300, 350, 400, 450,"
      },
      {
        "label": "Unloading method",
        "value": "manual clearing."
      },
      {
        "label": "Model",
        "value": "CGB"
      }
    ],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "chemical",
      "food",
      "pharmaceutical",
      "recycling",
      "wood"
    ],
    "installation": "Installation method: free fall, pipeline series for conveying materials, single machine use for bulk materials.",
    "customization": [
      "Installation method: free fall, pipeline series for conveying materials, single machine use for bulk materials.",
      "Model: CGB"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/25.html",
      "https://www.cnmagnetics.com/n-15/63.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "cqz-type-fully-automatic-online-magnetic-separator",
    "name": "CQZ type fully automatic online magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/cqz-type-fully-automatic-online-magnetic-separator/cqz-type-fully-automatic-online-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separator/cqz-type-fully-automatic-online-magnetic-separator-01.jpg",
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separator/cqz-type-fully-automatic-online-magnetic-separator-02.png",
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separator/cqz-type-fully-automatic-online-magnetic-separator-03.png",
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separator/cqz-type-fully-automatic-online-magnetic-separator-05.png",
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separator/cqz-type-fully-automatic-online-magnetic-separator-07.jpg",
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separator/cqz-type-fully-automatic-online-magnetic-separator-04.png",
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separator/cqz-type-fully-automatic-online-magnetic-separator-06.jpg"
    ],
    "summary": "product overview： 1、 Explanation The CQZ type fully automatic online magnetic separator is installed in the assembly line to achieve real-time automatic removal of iron from materials online. The automatic timing controller can be set for continuous automatic",
    "keywords": [
      "CQZ type fully automatic online magnetic separator",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "recycling",
      "food",
      "pharmaceutical",
      "chemical",
      "wood",
      "ore"
    ],
    "features": [
      "The CQZ type fully automatic online magnetic separator is installed in the assembly line to achieve real-time automatic removal of iron from materials online",
      "The automatic timing controller can be set for continuous automatic real-time cleaning, or the cleaning time interval can be set according to the iron content",
      "Its powerful magnetic field can remove ferromagnetic substances from flowing, dry, flowable, powdery, and fine particles"
    ],
    "principle": "product overview： 1、 Explanation The CQZ type fully automatic online magnetic separator is installed in the assembly line to achieve real-time automatic removal of iron from materials online. The automatic timing controller can be set for continuous automatic real-time cleaning, or the cleaning time interval can be set according to the iron content. Its powerful magnetic field can remove ferromagnetic substances from flowing, dry, flowable, powdery, and fine particles. 2、 Schematic diagram 3、 Installation method Free fall, pipeline series for conveying materials, and standalone use of bulk materials. 4、 Application industry Iron removal from fine powder materials such as food, carbon black, activated carbon, chemical industry, pharmaceutical industry, plastic industry, wood industry, recycling industry, packaging industry, quartz sand iron removal, potassium feldspar iron removal, mica iron removal, micro powder iron removal, fly ash iron removal, etc. 5、 Product Description The CQZ fully automatic online magnetic separator is mainly used to separate ferromagnetic impurities in powdered materials. It is arranged in a staggered manner with at least four layers of magnetic rods, ensuring that the material can fully contact the magnets during the falling process. At least four drawer style magnetic rod groups can be set to continuously and alternately unload iron. When one layer is extracted for unloading iron, the other three layers can still ensure that the falling iron is adsorbed. 6、 Product advantages The cleaning of the system is fully automated, and the fully sealed structural design ensures that there is no opening or closing action during the unloading process, allowing the entire operation and unloading work to be carried out in a sealed state. The magnetic core set outside the sealed shell shuttles back and forth between the working area and the cleaning area, and the strong magnetic force can automatically detach the adsorbed iron according to the set trajectory to the cleaning area. Fully sealed iron collector, quick opening and cleaning, saving time, effort and trouble. 7、 Main technical parameters The flexible and versatile layer design can accommodate up to ten layers of staggered arrangement, resulting in a higher iron removal rate. Multiple standard calibers to choose from: 200 * 200mm, 300 * 300mm, 400 * 400mm, 500 * 500mm, 600 * 600mm, 700",
    "specs": [
      {
        "label": "Model",
        "value": "CQZ"
      }
    ],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "recycling",
      "food",
      "pharmaceutical",
      "chemical",
      "wood",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: CQZ"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-15/65.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "ctn-wet-full-countercurrent-magnetic-separator",
    "name": "CTN wet full countercurrent magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-01.jpg",
      "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-02.png",
      "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-04.png",
      "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-06.png",
      "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-08.jpg",
      "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-03.png",
      "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-05.png",
      "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-10.png",
      "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-09.jpg",
      "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-07.jpg",
      "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-12.png",
      "/assets/products/ctn-wet-full-countercurrent-magnetic-separator/ctn-wet-full-countercurrent-magnetic-separator-11.png"
    ],
    "summary": "product overview： 1、 Explanation The core technology of CTN wet full countercurrent magnetic separator adopts computer simulation design of magnetic circuit, which makes the magnetic field distribution in the magnetic separation zone more uniform, without",
    "keywords": [
      "CTN wet full countercurrent magnetic separator",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "mineral",
      "ore"
    ],
    "features": [
      "The magnetic system is designed with a large angle, and the surface magnetic field strength of the drum can reach 6000gs",
      "Special wear-resistant treatment is applied to the surface of the groove and drum, with multiple options for wear resistance, greatly extending the lifespan of the entire machine"
    ],
    "principle": "product overview： 1、 Explanation The core technology of CTN wet full countercurrent magnetic separator adopts computer simulation design of magnetic circuit, which makes the magnetic field distribution in the magnetic separation zone more uniform, without empty magnetic zone. The magnetic system is designed with a large angle, and the surface magnetic field strength of the drum can reach 6000gs. Special wear-resistant treatment is applied to the surface of the groove and drum, with multiple options for wear resistance, greatly extending the lifespan of the entire machine. 2、 Schematic diagram 3、 Scope of application Suitable for wet separation of magnetic minerals mixed in fine-grained non-magnetic minerals with a particle size of 3-0mm. Especially suitable for iron removal and purification operations in non-metallic minerals such as quartz sand and potassium feldspar. This machine can continuously feed and discharge ore, with high magnetic field strength and gradient, and has high processing capacity. 4、 Principle The principle is that when the slurry enters the magnetic field zone, strong magnetic minerals are adsorbed on the surface of the cylinder, weak magnetic and non-magnetic minerals are washed away by water flow, and the magnetic minerals adsorbed on the surface of the cylinder are carried out of the magnetic field zone by the rotation of the cylinder and washed into the concentrate tank with washing water to complete the sorting operation. 5、 Main technical parameters 6、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "CTN"
      }
    ],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "mineral",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: CTN"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/18.html",
      "https://www.cnmagnetics.com/n-15/68.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "cts-type-wet-co-current-magnetic-separator",
    "name": "CTS type wet co current magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/cts-type-wet-co-current-magnetic-separator/cts-type-wet-co-current-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/cts-type-wet-co-current-magnetic-separator/cts-type-wet-co-current-magnetic-separator-01.jpg",
      "/assets/products/cts-type-wet-co-current-magnetic-separator/cts-type-wet-co-current-magnetic-separator-02.png",
      "/assets/products/cts-type-wet-co-current-magnetic-separator/cts-type-wet-co-current-magnetic-separator-06.png",
      "/assets/products/cts-type-wet-co-current-magnetic-separator/cts-type-wet-co-current-magnetic-separator-08.jpg",
      "/assets/products/cts-type-wet-co-current-magnetic-separator/cts-type-wet-co-current-magnetic-separator-07.jpg",
      "/assets/products/cts-type-wet-co-current-magnetic-separator/cts-type-wet-co-current-magnetic-separator-04.png",
      "/assets/products/cts-type-wet-co-current-magnetic-separator/cts-type-wet-co-current-magnetic-separator-10.png",
      "/assets/products/cts-type-wet-co-current-magnetic-separator/cts-type-wet-co-current-magnetic-separator-03.png",
      "/assets/products/cts-type-wet-co-current-magnetic-separator/cts-type-wet-co-current-magnetic-separator-09.png",
      "/assets/products/cts-type-wet-co-current-magnetic-separator/cts-type-wet-co-current-magnetic-separator-05.png",
      "/assets/products/cts-type-wet-co-current-magnetic-separator/cts-type-wet-co-current-magnetic-separator-11.png"
    ],
    "summary": "product overview： 1、 Explanation The CTS wet co current magnetic separator is used in chemical and other industries to separate fine-grained ferromagnetic substances mixed in the solution. As required by the process, magnetic powder added as a coagulation",
    "keywords": [
      "CTS type wet co current magnetic separator",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "chemical",
      "mineral"
    ],
    "features": [
      "The CTS wet co current magnetic separator is used in chemical and other industries to separate fine-grained ferromagnetic substances mixed in the solution",
      "As required by the process, magnetic powder added as a coagulation medium should be separated from liquid, and recycled magnetic powder should be reused",
      "Especially suitable for separating liquids with high flow rates, high concentrations, and high magnetic content",
      "This machine can work continuously and fully automatically, with high processing capacity",
      "The downstream tank structure is mainly designed for separating magnetic substances in liquids that do not allow secondary water addition as an auxiliary medium",
      "The magnetic minerals adsorbed on the surface of the cylinder rotate with the cylinder and are carried out of the magnetic field area",
      "They are scraped off by a scraper or the original liquid is flushed into the magnetic material tank to complete the sorting operation"
    ],
    "principle": "product overview： 1、 Explanation The CTS wet co current magnetic separator is used in chemical and other industries to separate fine-grained ferromagnetic substances mixed in the solution. As required by the process, magnetic powder added as a coagulation medium should be separated from liquid, and recycled magnetic powder should be reused. Especially suitable for separating liquids with high flow rates, high concentrations, and high magnetic content. This machine can work continuously and fully automatically, with high processing capacity. The downstream tank structure is mainly designed for separating magnetic substances in liquids that do not allow secondary water addition as an auxiliary medium. The principle is that when the liquid naturally flows into the magnetic field area of the equipment from the inlet at a higher position, the strong magnetic minerals are adsorbed on the surface of the cylinder, and the liquid flows out from the lower outlet in a self flowing state. The magnetic minerals adsorbed on the surface of the cylinder rotate with the cylinder and are carried out of the magnetic field area. They are scraped off by a scraper or the original liquid is flushed into the magnetic material tank to complete the sorting operation. 2、 Schematic diagram 3、 Main technical parameters 4、 Application site",
    "specs": [
      {
        "label": "Model",
        "value": "CTS"
      }
    ],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "chemical",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: CTS"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/22.html",
      "https://www.cnmagnetics.com/n-15/72.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "cxj-drum-type-automatic-magnetic-separator",
    "name": "CXJ drum type automatic magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/cxj-drum-type-automatic-magnetic-separator/cxj-drum-type-automatic-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/cxj-drum-type-automatic-magnetic-separator/cxj-drum-type-automatic-magnetic-separator-01.jpg",
      "/assets/products/cxj-drum-type-automatic-magnetic-separator/cxj-drum-type-automatic-magnetic-separator-02.png",
      "/assets/products/cxj-drum-type-automatic-magnetic-separator/cxj-drum-type-automatic-magnetic-separator-03.png",
      "/assets/products/cxj-drum-type-automatic-magnetic-separator/cxj-drum-type-automatic-magnetic-separator-04.png",
      "/assets/products/cxj-drum-type-automatic-magnetic-separator/cxj-drum-type-automatic-magnetic-separator-06.png",
      "/assets/products/cxj-drum-type-automatic-magnetic-separator/cxj-drum-type-automatic-magnetic-separator-09.png",
      "/assets/products/cxj-drum-type-automatic-magnetic-separator/cxj-drum-type-automatic-magnetic-separator-08.jpg",
      "/assets/products/cxj-drum-type-automatic-magnetic-separator/cxj-drum-type-automatic-magnetic-separator-07.jpg",
      "/assets/products/cxj-drum-type-automatic-magnetic-separator/cxj-drum-type-automatic-magnetic-separator-05.png",
      "/assets/products/cxj-drum-type-automatic-magnetic-separator/cxj-drum-type-automatic-magnetic-separator-10.png",
      "/assets/products/cxj-drum-type-automatic-magnetic-separator/cxj-drum-type-automatic-magnetic-separator-11.png"
    ],
    "summary": "product overview： 1、 Characteristics The CXJ drum type automatic magnetic separator (from single drum to triple drum) is a magnetic separation equipment that continuously and automatically removes iron from dry powder. It adopts a unique magnetic circuit",
    "keywords": [
      "CXJ drum type automatic magnetic separator",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "chemical",
      "mineral",
      "ore"
    ],
    "features": [
      "The CXJ drum type automatic magnetic separator (from single drum to triple drum) is a magnetic separation equipment that continuously and automatically removes iron from dry powder",
      "It adopts a unique magnetic circuit design internally, using high-performance permanent magnet neodymium iron boron material as the magnetic source",
      "The magnetic field is strong, the suction force is large, and the iron removal rate is high",
      "The feeding method adopts our company's unique uniform vibration feeding device, which ensures uniform feeding and is more conducive to separation after entering the magnetic separation zone",
      "It has the characteristics of maintenance free, energy-saving, safe and reliable use, and can adjust and control the feeding amount, suitable for the requirements of different particles",
      "The product is widely used in industries such as abrasives, refractory materials, non-metallic mineral processing, carbon black, grain, feed, chemical raw materials, etc"
    ],
    "principle": "product overview： 1、 Characteristics The CXJ drum type automatic magnetic separator (from single drum to triple drum) is a magnetic separation equipment that continuously and automatically removes iron from dry powder. It adopts a unique magnetic circuit design internally, using high-performance permanent magnet neodymium iron boron material as the magnetic source. The magnetic field is strong, the suction force is large, and the iron removal rate is high. The feeding method adopts our company's unique uniform vibration feeding device, which ensures uniform feeding and is more conducive to separation after entering the magnetic separation zone. It has the characteristics of maintenance free, energy-saving, safe and reliable use, and can adjust and control the feeding amount, suitable for the requirements of different particles. The product is widely used in industries such as abrasives, refractory materials, non-metallic mineral processing, carbon black, grain, feed, chemical raw materials, etc. 2、 Schematic diagram 3、 Main technical parameters 4、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "CXJ"
      }
    ],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "chemical",
      "mineral",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: CXJ"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/24.html",
      "https://www.cnmagnetics.com/n-15/73.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "dcz-type-dry-fully-automatic-magnetic-separator",
    "name": "DCZ type dry fully automatic magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/dcz-type-dry-fully-automatic-magnetic-separator/dcz-type-dry-fully-automatic-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separator/dcz-type-dry-fully-automatic-magnetic-separator-01.jpg",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separator/dcz-type-dry-fully-automatic-magnetic-separator-02.png",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separator/dcz-type-dry-fully-automatic-magnetic-separator-03.png",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separator/dcz-type-dry-fully-automatic-magnetic-separator-06.png",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separator/dcz-type-dry-fully-automatic-magnetic-separator-04.png",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separator/dcz-type-dry-fully-automatic-magnetic-separator-08.jpg",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separator/dcz-type-dry-fully-automatic-magnetic-separator-07.jpg",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separator/dcz-type-dry-fully-automatic-magnetic-separator-05.png"
    ],
    "summary": "product overview： 1、 Explanation The DCZ dry fully automatic magnetic separator is suitable for removing various powdered materials that have passed 10-1500 mesh, such as lithium battery positive electrode ternary materials, lithium manganese oxide, lithium",
    "keywords": [
      "DCZ type dry fully automatic magnetic separator",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "coal",
      "food",
      "pharmaceutical",
      "chemical",
      "ceramic",
      "ore",
      "mineral"
    ],
    "features": [],
    "principle": "product overview： 1、 Explanation The DCZ dry fully automatic magnetic separator is suitable for removing various powdered materials that have passed 10-1500 mesh, such as lithium battery positive electrode ternary materials, lithium manganese oxide, lithium carbonate, lithium iron phosphate, lithium cobalt oxide, nickel cobalt manganese hydroxide ternary precursors, monohydrate lithium hydroxide, lithium mica, manganese carbonate, monohydrate lithium hydroxide, lithium mica, ternary precursors, nickel cobalt manganese hydroxide, electrolytic manganese dioxide, electrolytic metal manganese, lithium grade cobalt chloride, cobalt hydroxide, battery material waste residue, silicoaluminate, ceramic powder, quartz sand, potassium feldspar, bauxite and other new energy, high-purity quartz, mineral powder, chemical, electronic, food, pharmaceutical and other industries. Material. 2、 Schematic diagram 3、 Characteristics Imported confidential grade oxide film coil winding. The condensation system with patented technology ensures a constant temperature rise of less than 50 ℃ at room temperature, reducing magnetic losses by 40%. Imported confidential magnetic media and processing technology, with a constant working state and a 20% increase in magnetic saturation. Based on the material characteristics of the lithium battery industry, specialized magnetic media structure design and configuration optimization are carried out to achieve a balanced increase of 20% in processing capacity and effectiveness. The effect is still significant at a particle size of μ m. The patented coil winding technology and connection method increase the magnetic flux density by 20%. Fully automatic intelligent control operating system, local and remote control, with three modes of operation: physical keys, touch screen, and software. Optional dedicated material channel wear-resistant coating, with a theoretical hardness of HV1200 and does not affect the original characteristics of any raw materials. 4、 Main technical parameters 5、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "DCZ"
      },
      {
        "label": "Model",
        "value": "HV1200"
      }
    ],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "coal",
      "food",
      "pharmaceutical",
      "chemical",
      "ceramic",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: DCZ",
      "Model: HV1200"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-15/74.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "gls-type-integral-channel-metal-separator",
    "name": "GLS type integral channel metal separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/gls-type-integral-channel-metal-separator/gls-type-integral-channel-metal-separator-01.jpg",
    "imageGallery": [
      "/assets/products/gls-type-integral-channel-metal-separator/gls-type-integral-channel-metal-separator-01.jpg",
      "/assets/products/gls-type-integral-channel-metal-separator/gls-type-integral-channel-metal-separator-02.png",
      "/assets/products/gls-type-integral-channel-metal-separator/gls-type-integral-channel-metal-separator-04.png",
      "/assets/products/gls-type-integral-channel-metal-separator/gls-type-integral-channel-metal-separator-05.png",
      "/assets/products/gls-type-integral-channel-metal-separator/gls-type-integral-channel-metal-separator-03.png",
      "/assets/products/gls-type-integral-channel-metal-separator/gls-type-integral-channel-metal-separator-06.png",
      "/assets/products/gls-type-integral-channel-metal-separator/gls-type-integral-channel-metal-separator-07.png",
      "/assets/products/gls-type-integral-channel-metal-separator/gls-type-integral-channel-metal-separator-09.jpg",
      "/assets/products/gls-type-integral-channel-metal-separator/gls-type-integral-channel-metal-separator-08.jpg"
    ],
    "summary": "product overview： 1、 Explanation ◇ Dual frequency or multi frequency technology can be selected. Shell material: stainless steel (standard type), PP, PS and other materials can also be selected.",
    "keywords": [
      "GLS type integral channel metal separator",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Metal detection and separation equipment for the food",
      "pharmaceutical",
      "and chemical industries"
    ],
    "features": [
      "Can be applied to bulk materials and post packaging testing. High strength noise resistance, suitable for vibration, impact, and temperature changes in industrial sites",
      "Conveyor belts and separation devices can be provided according to customer requirements, and integrated conveyor belts and removal devices are optional",
      "Optional for special occasions, such as high temperature and highly corrosive environments. Optional for use in dust explosion-proof areas, compliant with Atex Zone"
    ],
    "principle": "product overview： 1、 Explanation ◇ Dual frequency or multi frequency technology can be selected. Shell material: stainless steel (standard type), PP, PS and other materials can also be selected. Complies with multiple international standards and regulations: IFS, HACCP。 ◇ It has high detection accuracy and stability, with a minimum accuracy of 0.23mm iron ball. The detection coil uses a completely sealed method inside, which has high stability and can effectively prevent the outward diffusion of electromagnetic waves, thereby reducing false alarms caused by the movement of metal components externally. Product effect compensation function: It can automatically learn and compress product effects. Product tracking function: It can automatically adjust and compensate internally based on changes in product effects. Protection level: IP65。 Optional IP67 rating. Temperature range for detecting materials: -20-80 ℃; If the temperature exceeds this range, special high-temperature options can be selected. Optional Chinese operation interface, multiple exclusion methods to choose from. 2、 Characteristics Can be applied to bulk materials and post packaging testing. High strength noise resistance, suitable for vibration, impact, and temperature changes in industrial sites. ◇ Conveyor belts and separation devices can be provided according to customer requirements, and integrated conveyor belts and removal devices are optional. ◇ Optional for special occasions, such as high temperature and highly corrosive environments. Optional for use in dust explosion-proof areas, compliant with Atex Zone 22. 3、 Schematic diagram 4、 Main technical parameters 5、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "HACCP"
      },
      {
        "label": "Model",
        "value": "IFS"
      },
      {
        "label": "Model",
        "value": "IP65"
      },
      {
        "label": "Model",
        "value": "IP67"
      }
    ],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Metal detection and separation equipment for the food",
      "pharmaceutical",
      "and chemical industries"
    ],
    "installation": "",
    "customization": [
      "Model: HACCP",
      "Model: IFS",
      "Model: IP65",
      "Model: IP67"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-15/62.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "cgt-type-super-strong-full-magnetic-drum",
    "name": "CGT type super strong full magnetic drum",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/cgt-type-super-strong-full-magnetic-drum/cgt-type-super-strong-full-magnetic-drum-01.jpg",
    "imageGallery": [
      "/assets/products/cgt-type-super-strong-full-magnetic-drum/cgt-type-super-strong-full-magnetic-drum-01.jpg",
      "/assets/products/cgt-type-super-strong-full-magnetic-drum/cgt-type-super-strong-full-magnetic-drum-02.png",
      "/assets/products/cgt-type-super-strong-full-magnetic-drum/cgt-type-super-strong-full-magnetic-drum-03.png",
      "/assets/products/cgt-type-super-strong-full-magnetic-drum/cgt-type-super-strong-full-magnetic-drum-04.png",
      "/assets/products/cgt-type-super-strong-full-magnetic-drum/cgt-type-super-strong-full-magnetic-drum-06.png",
      "/assets/products/cgt-type-super-strong-full-magnetic-drum/cgt-type-super-strong-full-magnetic-drum-05.png",
      "/assets/products/cgt-type-super-strong-full-magnetic-drum/cgt-type-super-strong-full-magnetic-drum-07.jpg",
      "/assets/products/cgt-type-super-strong-full-magnetic-drum/cgt-type-super-strong-full-magnetic-drum-10.png",
      "/assets/products/cgt-type-super-strong-full-magnetic-drum/cgt-type-super-strong-full-magnetic-drum-08.jpg",
      "/assets/products/cgt-type-super-strong-full-magnetic-drum/cgt-type-super-strong-full-magnetic-drum-09.png",
      "/assets/products/cgt-type-super-strong-full-magnetic-drum/cgt-type-super-strong-full-magnetic-drum-11.png"
    ],
    "summary": "product overview： 1、 Explanation CGT type super strong full magnetic drum is mainly used to remove ferromagnetic impurities in powder, sheet and granular raw materials, and is widely used in industries such as ceramics, power, mining, plastics, chemicals,",
    "keywords": [
      "CGT type super strong full magnetic drum",
      "General iron removal equipment",
      "Metal industry magnetic separation equipment",
      "ceramic",
      "chemical",
      "food",
      "mining",
      "ore",
      "pharmaceutical"
    ],
    "features": [
      "2、 Principle The CGT type super strong all magnetic drum can be installed on the motor of the conveyor equipment to form a magnetic separator with the conveyor belt",
      "3、 Characteristics No energy consumption, no pollution, simple structure, easy to use, more thorough iron removal, and more significant effect",
      "This product uses rare earth alloy neodymium iron boron as the magnetic source and is made using a special manufacturing method",
      "Strong magnetic force, long service life, specifications and styles can be customized according to customer requirements and on-site conditions",
      "Suitable for occasions with stricter iron removal requirements and larger iron removal quantities"
    ],
    "principle": "product overview： 1、 Explanation CGT type super strong full magnetic drum is mainly used to remove ferromagnetic impurities in powder, sheet and granular raw materials, and is widely used in industries such as ceramics, power, mining, plastics, chemicals, rubber, pharmaceuticals, food, environmental protection, pigments, dyes, electronics, metallurgy, etc. 2、 Principle The CGT type super strong all magnetic drum can be installed on the motor of the conveyor equipment to form a magnetic separator with the conveyor belt. When substances containing iron pass through, they are attracted by the magnetic drum and scraped off by external forces such as scrapers to separate the impurities from the material, ensuring the integrity of the equipment and the safety of the product. 3、 Characteristics No energy consumption, no pollution, simple structure, easy to use, more thorough iron removal, and more significant effect. This product uses rare earth alloy neodymium iron boron as the magnetic source and is made using a special manufacturing method. Strong magnetic force, long service life, specifications and styles can be customized according to customer requirements and on-site conditions. Suitable for occasions with stricter iron removal requirements and larger iron removal quantities. 4、 Schematic diagram 5、 Main technical parameters 6、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "CGT"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "Metal industry magnetic separation equipment",
      "ceramic",
      "chemical",
      "food",
      "mining",
      "ore",
      "pharmaceutical"
    ],
    "installation": "",
    "customization": [
      "Model: CGT"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/11.html",
      "https://www.cnmagnetics.com/n-14/54.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "ctz-type-midfield-strong-semi-magnetic-drum",
    "name": "CTZ type midfield strong semi magnetic drum",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/ctz-type-midfield-strong-semi-magnetic-drum/ctz-type-midfield-strong-semi-magnetic-drum-01.jpg",
    "imageGallery": [
      "/assets/products/ctz-type-midfield-strong-semi-magnetic-drum/ctz-type-midfield-strong-semi-magnetic-drum-01.jpg",
      "/assets/products/ctz-type-midfield-strong-semi-magnetic-drum/ctz-type-midfield-strong-semi-magnetic-drum-03.png",
      "/assets/products/ctz-type-midfield-strong-semi-magnetic-drum/ctz-type-midfield-strong-semi-magnetic-drum-04.png",
      "/assets/products/ctz-type-midfield-strong-semi-magnetic-drum/ctz-type-midfield-strong-semi-magnetic-drum-06.png",
      "/assets/products/ctz-type-midfield-strong-semi-magnetic-drum/ctz-type-midfield-strong-semi-magnetic-drum-02.png",
      "/assets/products/ctz-type-midfield-strong-semi-magnetic-drum/ctz-type-midfield-strong-semi-magnetic-drum-05.png",
      "/assets/products/ctz-type-midfield-strong-semi-magnetic-drum/ctz-type-midfield-strong-semi-magnetic-drum-07.jpg",
      "/assets/products/ctz-type-midfield-strong-semi-magnetic-drum/ctz-type-midfield-strong-semi-magnetic-drum-08.jpg",
      "/assets/products/ctz-type-midfield-strong-semi-magnetic-drum/ctz-type-midfield-strong-semi-magnetic-drum-09.png",
      "/assets/products/ctz-type-midfield-strong-semi-magnetic-drum/ctz-type-midfield-strong-semi-magnetic-drum-10.png"
    ],
    "summary": "product overview： 1、 Explanation The CTZ type mid field strong semi magnetic drum (with CTZ type mid field strong full magnetic drum structure and RCT type parameters equivalent) is commonly used for purifying powdered, granular, and small block materials, or",
    "keywords": [
      "CTZ type midfield strong semi magnetic drum",
      "General iron removal equipment",
      "Metal industry magnetic separation equipment",
      "ceramic",
      "chemical",
      "food",
      "glass",
      "mineral",
      "mining",
      "recycling"
    ],
    "features": [
      "It plays a reliable protective role in preventing damage and wear to crushers, grinders, and presses",
      "It is easy to install, has strong suction, consumes no energy, works continuously, and is easy to operate",
      "Designed according to the TD-75 belt conveyor standard, it can meet the requirements of users for high field strength and deep iron removal",
      "Widely used in metallurgy, ceramics, abrasives, grinding tools, diamond sand, non-metallic minerals, refractory materials, mining, food, chemical, glass, building materials and other industries"
    ],
    "principle": "product overview： 1、 Explanation The CTZ type mid field strong semi magnetic drum (with CTZ type mid field strong full magnetic drum structure and RCT type parameters equivalent) is commonly used for purifying powdered, granular, and small block materials, or for recycling iron. It plays a reliable protective role in preventing damage and wear to crushers, grinders, and presses. It is easy to install, has strong suction, consumes no energy, works continuously, and is easy to operate. Designed according to the TD-75 belt conveyor standard, it can meet the requirements of users for high field strength and deep iron removal. Widely used in metallurgy, ceramics, abrasives, grinding tools, diamond sand, non-metallic minerals, refractory materials, mining, food, chemical, glass, building materials and other industries. 2、 Schematic diagram 3、 Main technical parameters 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "CTZ"
      },
      {
        "label": "Model",
        "value": "RCT"
      },
      {
        "label": "Model",
        "value": "TD-75"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "Metal industry magnetic separation equipment",
      "ceramic",
      "chemical",
      "food",
      "glass",
      "mineral",
      "mining",
      "recycling"
    ],
    "installation": "",
    "customization": [
      "Model: CTZ",
      "Model: RCT",
      "Model: TD-75"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/12.html",
      "https://www.cnmagnetics.com/n-14/56.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "rcda-type-air-cooled-electromagnetic-iron-remover",
    "name": "RCDA type air-cooled electromagnetic iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcda-type-air-cooled-electromagnetic-iron-remover/rcda-type-air-cooled-electromagnetic-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcda-type-air-cooled-electromagnetic-iron-remover/rcda-type-air-cooled-electromagnetic-iron-remover-01.jpg",
      "/assets/products/rcda-type-air-cooled-electromagnetic-iron-remover/rcda-type-air-cooled-electromagnetic-iron-remover-02.png",
      "/assets/products/rcda-type-air-cooled-electromagnetic-iron-remover/rcda-type-air-cooled-electromagnetic-iron-remover-03.png",
      "/assets/products/rcda-type-air-cooled-electromagnetic-iron-remover/rcda-type-air-cooled-electromagnetic-iron-remover-06.png",
      "/assets/products/rcda-type-air-cooled-electromagnetic-iron-remover/rcda-type-air-cooled-electromagnetic-iron-remover-08.jpg",
      "/assets/products/rcda-type-air-cooled-electromagnetic-iron-remover/rcda-type-air-cooled-electromagnetic-iron-remover-05.png",
      "/assets/products/rcda-type-air-cooled-electromagnetic-iron-remover/rcda-type-air-cooled-electromagnetic-iron-remover-04.png",
      "/assets/products/rcda-type-air-cooled-electromagnetic-iron-remover/rcda-type-air-cooled-electromagnetic-iron-remover-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The RCDA air-cooled electromagnetic iron remover is suitable for use in outdoor or various light dust environments. The coil has undergone special treatment, is resistant to oxidation, corrosion, and has good insulation",
    "keywords": [
      "RCDA type air-cooled electromagnetic iron remover",
      "General iron removal equipment"
    ],
    "features": [
      "The RCDA air-cooled electromagnetic iron remover is suitable for use in outdoor or various light dust environments",
      "The coil has undergone special treatment, is resistant to oxidation, corrosion, and has good insulation performance; Large heat dissipation area, stable temperature rise, and good air cooling effect",
      "Axial flow fan forced air cooling, with large air volume, enables fast heat dissipation and low temperature rise of the iron remover, ensuring long-term trouble free operation of the iron remover"
    ],
    "principle": "product overview： 1、 Explanation The RCDA air-cooled electromagnetic iron remover is suitable for use in outdoor or various light dust environments. The coil has undergone special treatment, is resistant to oxidation, corrosion, and has good insulation performance; Large heat dissipation area, stable temperature rise, and good air cooling effect. The RCDA-T ultra strong air-cooled electromagnetic iron remover has a unique internal magnetic circuit design, deep magnetic penetration, and high suction force, which is much greater than the national standard iron remover. Axial flow fan forced air cooling, with large air volume, enables fast heat dissipation and low temperature rise of the iron remover, ensuring long-term trouble free operation of the iron remover. 2、 Schematic diagram 3、 Main technical parameters 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "RCDA"
      },
      {
        "label": "Model",
        "value": "RCDA-T"
      }
    ],
    "applications": [
      "General iron removal equipment"
    ],
    "installation": "",
    "customization": [
      "Model: RCDA",
      "Model: RCDA-T"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/41.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover",
    "name": "RCDC type air-cooled self dumping electromagnetic iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover-01.jpg",
      "/assets/products/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover-02.png",
      "/assets/products/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover-03.png",
      "/assets/products/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover-04.png",
      "/assets/products/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover-10.jpg",
      "/assets/products/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover-06.png",
      "/assets/products/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover-08.png",
      "/assets/products/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover-09.jpg",
      "/assets/products/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover-05.png",
      "/assets/products/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover-07.png"
    ],
    "summary": "product overview： 1、 Explanation The RCDC air-cooled self dumping electromagnetic iron remover is an iron unloading mechanism composed of a drive motor, a drum, and an iron unloading tape with a scraper added to the RCDA series iron remover. During the",
    "keywords": [
      "RCDC type air-cooled self dumping electromagnetic iron remover",
      "General iron removal equipment"
    ],
    "features": [
      "The RCDC air-cooled self dumping electromagnetic iron remover is an iron unloading mechanism composed of a drive motor, a drum, and an iron unloading tape with a scraper added to the RCDA series iron remover"
    ],
    "principle": "product overview： 1、 Explanation The RCDC air-cooled self dumping electromagnetic iron remover is an iron unloading mechanism composed of a drive motor, a drum, and an iron unloading tape with a scraper added to the RCDA series iron remover. During the working process, the iron unloading mechanism automatically unloads the ferromagnetic substances adsorbed by the iron unloading belt into the iron collection box, without the need for power outage and manual cleaning, achieving automatic iron removal. 2、 Schematic diagram 3、 Main technical parameters 4、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "RCDA"
      },
      {
        "label": "Model",
        "value": "RCDC"
      }
    ],
    "applications": [
      "General iron removal equipment"
    ],
    "installation": "",
    "customization": [
      "Model: RCDA",
      "Model: RCDC"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/42.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcde-type-oil-cooled-electromagnetic-iron-remover",
    "name": "RCDE type oil cooled electromagnetic iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcde-type-oil-cooled-electromagnetic-iron-remover/rcde-type-oil-cooled-electromagnetic-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcde-type-oil-cooled-electromagnetic-iron-remover/rcde-type-oil-cooled-electromagnetic-iron-remover-01.jpg",
      "/assets/products/rcde-type-oil-cooled-electromagnetic-iron-remover/rcde-type-oil-cooled-electromagnetic-iron-remover-04.png",
      "/assets/products/rcde-type-oil-cooled-electromagnetic-iron-remover/rcde-type-oil-cooled-electromagnetic-iron-remover-03.png",
      "/assets/products/rcde-type-oil-cooled-electromagnetic-iron-remover/rcde-type-oil-cooled-electromagnetic-iron-remover-07.png",
      "/assets/products/rcde-type-oil-cooled-electromagnetic-iron-remover/rcde-type-oil-cooled-electromagnetic-iron-remover-02.png",
      "/assets/products/rcde-type-oil-cooled-electromagnetic-iron-remover/rcde-type-oil-cooled-electromagnetic-iron-remover-06.png",
      "/assets/products/rcde-type-oil-cooled-electromagnetic-iron-remover/rcde-type-oil-cooled-electromagnetic-iron-remover-05.png",
      "/assets/products/rcde-type-oil-cooled-electromagnetic-iron-remover/rcde-type-oil-cooled-electromagnetic-iron-remover-08.jpg",
      "/assets/products/rcde-type-oil-cooled-electromagnetic-iron-remover/rcde-type-oil-cooled-electromagnetic-iron-remover-09.jpg"
    ],
    "summary": "product overview： 1、 Explanation The RCDE oil cooled electromagnetic iron remover adopts advanced internal and external oil circulation heat dissipation pipe design and unique winding technology of internal excitation coil. It has a fully sealed structure and",
    "keywords": [
      "RCDE type oil cooled electromagnetic iron remover",
      "General iron removal equipment"
    ],
    "features": [
      "high magnetic force, dust and rain resistance, corrosion resistance, and long continuous working service life. 2、"
    ],
    "principle": "product overview： 1、 Explanation The RCDE oil cooled electromagnetic iron remover adopts advanced internal and external oil circulation heat dissipation pipe design and unique winding technology of internal excitation coil. It has a fully sealed structure and features high magnetic force, dust and rain resistance, corrosion resistance, and long continuous working service life. 2、 Schematic diagram 3、 Main technical parameters 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "RCDE"
      }
    ],
    "applications": [
      "General iron removal equipment"
    ],
    "installation": "",
    "customization": [
      "Model: RCDE"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/55.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover",
    "name": "RCDF oil cooled self dumping electromagnetic iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover-01.jpg",
      "/assets/products/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover-02.png",
      "/assets/products/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover-03.png",
      "/assets/products/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover-04.png",
      "/assets/products/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover-07.png",
      "/assets/products/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover-05.png",
      "/assets/products/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover-08.jpg",
      "/assets/products/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover-09.jpg",
      "/assets/products/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover-06.png"
    ],
    "summary": "product overview： 1、 Explanation The RCDF oil cooled self dumping electromagnetic iron remover is an iron unloading mechanism composed of a drive motor, a drum, and an iron unloading tape with a scraper added to the RCDE series iron remover. It has the",
    "keywords": [
      "RCDF oil cooled self dumping electromagnetic iron remover",
      "General iron removal equipment"
    ],
    "features": [
      "The RCDF oil cooled self dumping electromagnetic iron remover is an iron unloading mechanism composed of a drive motor, a drum, and an iron unloading tape with a scraper added to the RCDE series iron remover",
      "It has the advantages of high magnetic force, fast heat dissipation, dust prevention, rain resistance, corrosion resistance, continuous operation, and low maintenance costs"
    ],
    "principle": "product overview： 1、 Explanation The RCDF oil cooled self dumping electromagnetic iron remover is an iron unloading mechanism composed of a drive motor, a drum, and an iron unloading tape with a scraper added to the RCDE series iron remover. It has the advantages of high magnetic force, fast heat dissipation, dust prevention, rain resistance, corrosion resistance, continuous operation, and low maintenance costs. 2、 Schematic diagram 3、 Main technical parameters 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "RCDE"
      },
      {
        "label": "Model",
        "value": "RCDF"
      }
    ],
    "applications": [
      "General iron removal equipment"
    ],
    "installation": "",
    "customization": [
      "Model: RCDE",
      "Model: RCDF"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/40.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover",
    "name": "RCDFJ type forced oil circulation self dumping electromagnetic iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover-01.jpg",
      "/assets/products/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover-02.png",
      "/assets/products/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover-03.png",
      "/assets/products/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover-04.png",
      "/assets/products/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover-05.png",
      "/assets/products/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover-07.png",
      "/assets/products/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover-08.jpg",
      "/assets/products/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover-09.jpg",
      "/assets/products/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover/rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover-06.png"
    ],
    "summary": "product overview： 1、 Explanation The RCDFJ type forced oil circulation self dumping electromagnetic iron remover is suitable for places with particularly high requirements for iron removal, such as coal transportation ports, large thermal power plants, and",
    "keywords": [
      "RCDFJ type forced oil circulation self dumping electromagnetic iron remover",
      "General iron removal equipment",
      "coal",
      "power plant"
    ],
    "features": [
      "Used for hanging above large conveyor belts, it can effectively remove small iron parts such as detonators and blasting lines in coal, playing an important role in removing impurities and improving material quality",
      "It has automatic iron unloading, easy maintenance, a drum shaped structure with automatic correction function, and a specially designed fully sealed bearing seat, which can adapt to applications with high dust on site"
    ],
    "principle": "product overview： 1、 Explanation The RCDFJ type forced oil circulation self dumping electromagnetic iron remover is suitable for places with particularly high requirements for iron removal, such as coal transportation ports, large thermal power plants, and coal mines. Used for hanging above large conveyor belts, it can effectively remove small iron parts such as detonators and blasting lines in coal, playing an important role in removing impurities and improving material quality. It has automatic iron unloading, easy maintenance, a drum shaped structure with automatic correction function, and a specially designed fully sealed bearing seat, which can adapt to applications with high dust on site. 2、 Schematic diagram 3、 Main technical parameters 4、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "RCDFJ"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "coal",
      "power plant"
    ],
    "installation": "",
    "customization": [
      "Model: RCDFJ"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/52.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcps-self-dumping-disc-type-permanent-magnet-iron-remover",
    "name": "RCPS self dumping disc type permanent magnet iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcps-self-dumping-disc-type-permanent-magnet-iron-remover/rcps-self-dumping-disc-type-permanent-magnet-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcps-self-dumping-disc-type-permanent-magnet-iron-remover/rcps-self-dumping-disc-type-permanent-magnet-iron-remover-01.jpg",
      "/assets/products/rcps-self-dumping-disc-type-permanent-magnet-iron-remover/rcps-self-dumping-disc-type-permanent-magnet-iron-remover-02.png",
      "/assets/products/rcps-self-dumping-disc-type-permanent-magnet-iron-remover/rcps-self-dumping-disc-type-permanent-magnet-iron-remover-05.png",
      "/assets/products/rcps-self-dumping-disc-type-permanent-magnet-iron-remover/rcps-self-dumping-disc-type-permanent-magnet-iron-remover-03.png",
      "/assets/products/rcps-self-dumping-disc-type-permanent-magnet-iron-remover/rcps-self-dumping-disc-type-permanent-magnet-iron-remover-04.png",
      "/assets/products/rcps-self-dumping-disc-type-permanent-magnet-iron-remover/rcps-self-dumping-disc-type-permanent-magnet-iron-remover-06.jpg",
      "/assets/products/rcps-self-dumping-disc-type-permanent-magnet-iron-remover/rcps-self-dumping-disc-type-permanent-magnet-iron-remover-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The RCPS self dumping disc type permanent magnet iron remover is an efficient iron remover developed by our company. The internal magnetic materials of this device are all made of high-strength rare earth \"neodymium iron boron",
    "keywords": [
      "RCPS self dumping disc type permanent magnet iron remover",
      "General iron removal equipment",
      "ore"
    ],
    "features": [
      "The RCPS self dumping disc type permanent magnet iron remover is an efficient iron remover developed by our company",
      "The internal magnetic materials of this device are all made of high-strength rare earth \"neodymium iron boron magnetic king\" to form a strong magnetic core",
      "The magnet structure is arranged in a fan-shaped radial pattern",
      "The working face disk is driven by a reduction motor to rotate by gears, and there is a fixed stainless steel scraper on the working face at the bottom of the disk",
      "When the disk rotates, it is forced to automatically unload iron"
    ],
    "principle": "product overview： 1、 Explanation The RCPS self dumping disc type permanent magnet iron remover is an efficient iron remover developed by our company. The internal magnetic materials of this device are all made of high-strength rare earth \"neodymium iron boron magnetic king\" to form a strong magnetic core. The magnet structure is arranged in a fan-shaped radial pattern. The working face disk is driven by a reduction motor to rotate by gears, and there is a fixed stainless steel scraper on the working face at the bottom of the disk. When the disk rotates, it is forced to automatically unload iron. Compared with the rubber belt unloading method, the torque force during rotation of the gear structure can exceed 12 times. 2、 Schematic diagram 三、特点 Due to the fact that the working face is entirely made of stainless steel material and features a sealed gearbox, it can adapt to extremely harsh environments such as steel slag, slag, and other high-temperature environments, or special harsh environments such as outdoor, humid, splashed water, corrosion, high temperature, high dust, and large inclination angles. The whole machine has a small volume, easy transportation, reasonable structure, small installation space, and light weight. It can basically adapt to installation in all positions such as narrow space belt conveyor tunnels. 4、 Main technical parameters",
    "specs": [
      {
        "label": "Model",
        "value": "RCPS"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: RCPS"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/39.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rct-type-fully-magnetic-drum",
    "name": "RCT type fully magnetic drum",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rct-type-fully-magnetic-drum/rct-type-fully-magnetic-drum-01.jpg",
    "imageGallery": [
      "/assets/products/rct-type-fully-magnetic-drum/rct-type-fully-magnetic-drum-01.jpg",
      "/assets/products/rct-type-fully-magnetic-drum/rct-type-fully-magnetic-drum-02.png",
      "/assets/products/rct-type-fully-magnetic-drum/rct-type-fully-magnetic-drum-06.png",
      "/assets/products/rct-type-fully-magnetic-drum/rct-type-fully-magnetic-drum-03.png",
      "/assets/products/rct-type-fully-magnetic-drum/rct-type-fully-magnetic-drum-08.jpg",
      "/assets/products/rct-type-fully-magnetic-drum/rct-type-fully-magnetic-drum-05.png",
      "/assets/products/rct-type-fully-magnetic-drum/rct-type-fully-magnetic-drum-04.png",
      "/assets/products/rct-type-fully-magnetic-drum/rct-type-fully-magnetic-drum-07.jpg",
      "/assets/products/rct-type-fully-magnetic-drum/rct-type-fully-magnetic-drum-09.png",
      "/assets/products/rct-type-fully-magnetic-drum/rct-type-fully-magnetic-drum-10.png",
      "/assets/products/rct-type-fully-magnetic-drum/rct-type-fully-magnetic-drum-11.png"
    ],
    "summary": "product overview： 1、 Explanation RCT type fully magnetic drum is equivalent to RCTG series, also known as magnetic pulley or dry bulk magnetic separator. It uses high-performance strong magnetic materials internally to form a strong magnetic system, which has",
    "keywords": [
      "RCT type fully magnetic drum",
      "General iron removal equipment",
      "Metal industry magnetic separation equipment",
      "cement",
      "chemical",
      "mining"
    ],
    "features": [
      "RCT type fully magnetic drum is equivalent to RCTG series, also known as magnetic pulley or dry bulk magnetic separator",
      "It can also be used in conjunction with specialized belt conveyors"
    ],
    "principle": "product overview： 1、 Explanation RCT type fully magnetic drum is equivalent to RCTG series, also known as magnetic pulley or dry bulk magnetic separator. It uses high-performance strong magnetic materials internally to form a strong magnetic system, which has the characteristics of high magnetic field strength, large depth, simple structure, easy use, no maintenance required, no power consumption, and low demagnetization rate for long-term use. It can be used for iron selection in industries such as cement, magnetic separation, mining, steel, chemical, refractory materials, and waste treatment, and can be used in conjunction with TD-75 and AD-80 universal fixed belt conveyors to replace the driving wheel. It can also be used in conjunction with specialized belt conveyors. 2、 Schematic diagram 3、 Main technical parameters 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "AD-80"
      },
      {
        "label": "Model",
        "value": "RCT"
      },
      {
        "label": "Model",
        "value": "RCTG"
      },
      {
        "label": "Model",
        "value": "TD-75"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "Metal industry magnetic separation equipment",
      "cement",
      "chemical",
      "mining"
    ],
    "installation": "",
    "customization": [
      "Model: AD-80",
      "Model: RCT",
      "Model: RCTG",
      "Model: TD-75"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/14.html",
      "https://www.cnmagnetics.com/n-14/51.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "rcya-type-inclined-pipeline-permanent-magnet-iron-remover",
    "name": "RCYA type inclined pipeline permanent magnet iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcya-type-inclined-pipeline-permanent-magnet-iron-remover/rcya-type-inclined-pipeline-permanent-magnet-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcya-type-inclined-pipeline-permanent-magnet-iron-remover/rcya-type-inclined-pipeline-permanent-magnet-iron-remover-01.jpg",
      "/assets/products/rcya-type-inclined-pipeline-permanent-magnet-iron-remover/rcya-type-inclined-pipeline-permanent-magnet-iron-remover-02.png",
      "/assets/products/rcya-type-inclined-pipeline-permanent-magnet-iron-remover/rcya-type-inclined-pipeline-permanent-magnet-iron-remover-06.png",
      "/assets/products/rcya-type-inclined-pipeline-permanent-magnet-iron-remover/rcya-type-inclined-pipeline-permanent-magnet-iron-remover-03.png",
      "/assets/products/rcya-type-inclined-pipeline-permanent-magnet-iron-remover/rcya-type-inclined-pipeline-permanent-magnet-iron-remover-04.png",
      "/assets/products/rcya-type-inclined-pipeline-permanent-magnet-iron-remover/rcya-type-inclined-pipeline-permanent-magnet-iron-remover-05.png",
      "/assets/products/rcya-type-inclined-pipeline-permanent-magnet-iron-remover/rcya-type-inclined-pipeline-permanent-magnet-iron-remover-08.jpg",
      "/assets/products/rcya-type-inclined-pipeline-permanent-magnet-iron-remover/rcya-type-inclined-pipeline-permanent-magnet-iron-remover-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The RCYA inclined pipeline permanent magnet iron remover is divided into two types: RCYAl and RCYA2, which include non-magnetic pipelines and permanent magnets. It is specially designed for removing non-magnetic materials in",
    "keywords": [
      "RCYA type inclined pipeline permanent magnet iron remover",
      "General iron removal equipment",
      "cement",
      "coal",
      "chemical"
    ],
    "features": [
      "The RCYA inclined pipeline permanent magnet iron remover is divided into two types: RCYAl and RCYA2, which include non-magnetic pipelines and permanent magnets",
      "It is specially designed for removing non-magnetic materials in closed pipelines",
      "The interior of the permanent magnet iron remover is composed of high-performance rare earth strong magnetic materials to form a composite magnetic system",
      "It has the characteristics of small size, high magnetic force, light weight, clean iron removal, convenience, no energy consumption, and long service life",
      "Suitable for situations where there is no conveyor belt and only a discharge chute can be provided",
      "When bulk materials pass through, iron impurities are adsorbed by high magnetic field permanent magnets",
      "When removing iron impurities, the pipeline dedicated door is opened to manually remove the impurities"
    ],
    "principle": "product overview： 1、 Explanation The RCYA inclined pipeline permanent magnet iron remover is divided into two types: RCYAl and RCYA2, which include non-magnetic pipelines and permanent magnets. It is specially designed for removing non-magnetic materials in closed pipelines. The interior of the permanent magnet iron remover is composed of high-performance rare earth strong magnetic materials to form a composite magnetic system. It has the characteristics of small size, high magnetic force, light weight, clean iron removal, convenience, no energy consumption, and long service life. Suitable for situations where there is no conveyor belt and only a discharge chute can be provided. When bulk materials pass through, iron impurities are adsorbed by high magnetic field permanent magnets. When removing iron impurities, the pipeline dedicated door is opened to manually remove the impurities. This device is suitable for applications with low iron content and is mainly used to remove impurities in the discharge pipelines of industries such as cement, chemical, coal, plastics, refractory materials, and building materials. 2、 Schematic diagram 3、 Main technical parameters of RCYA1 type 4、 Main technical parameters of RCYA2 type",
    "specs": [
      {
        "label": "Model",
        "value": "RCYA"
      },
      {
        "label": "Model",
        "value": "RCYA1"
      },
      {
        "label": "Model",
        "value": "RCYA2"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "cement",
      "coal",
      "chemical"
    ],
    "installation": "",
    "customization": [
      "Model: RCYA",
      "Model: RCYA1",
      "Model: RCYA2"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/48.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcydii-type-permanent-magnet-self-dumping-iron-remover",
    "name": "RCYDII type permanent magnet self dumping iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcydii-type-permanent-magnet-self-dumping-iron-remover/rcydii-type-permanent-magnet-self-dumping-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcydii-type-permanent-magnet-self-dumping-iron-remover/rcydii-type-permanent-magnet-self-dumping-iron-remover-01.jpg",
      "/assets/products/rcydii-type-permanent-magnet-self-dumping-iron-remover/rcydii-type-permanent-magnet-self-dumping-iron-remover-02.png",
      "/assets/products/rcydii-type-permanent-magnet-self-dumping-iron-remover/rcydii-type-permanent-magnet-self-dumping-iron-remover-03.png",
      "/assets/products/rcydii-type-permanent-magnet-self-dumping-iron-remover/rcydii-type-permanent-magnet-self-dumping-iron-remover-07.png",
      "/assets/products/rcydii-type-permanent-magnet-self-dumping-iron-remover/rcydii-type-permanent-magnet-self-dumping-iron-remover-04.png",
      "/assets/products/rcydii-type-permanent-magnet-self-dumping-iron-remover/rcydii-type-permanent-magnet-self-dumping-iron-remover-09.jpg",
      "/assets/products/rcydii-type-permanent-magnet-self-dumping-iron-remover/rcydii-type-permanent-magnet-self-dumping-iron-remover-06.png",
      "/assets/products/rcydii-type-permanent-magnet-self-dumping-iron-remover/rcydii-type-permanent-magnet-self-dumping-iron-remover-05.png",
      "/assets/products/rcydii-type-permanent-magnet-self-dumping-iron-remover/rcydii-type-permanent-magnet-self-dumping-iron-remover-08.jpg"
    ],
    "summary": "product overview： 1、 Explanation Compared with the RCYD type permanent magnet self dumping iron remover, the RCYDII type permanent magnet self dumping iron remover has a shorter frame and is suitable for situations where installation space is limited. It is",
    "keywords": [
      "RCYDII type permanent magnet self dumping iron remover",
      "General iron removal equipment",
      "ore"
    ],
    "features": [
      "Compared with the RCYD type permanent magnet self dumping iron remover, the RCYDII type permanent magnet self dumping iron remover has a shorter frame and is suitable for situations where"
    ],
    "principle": "product overview： 1、 Explanation Compared with the RCYD type permanent magnet self dumping iron remover, the RCYDII type permanent magnet self dumping iron remover has a shorter frame and is suitable for situations where installation space is limited. It is composed of high-performance permanent magnet cores, scrap iron belts, reduction motors, frames, rollers, and other parts, and is used in conjunction with various conveyors. It is suitable for removing iron from conveyor belts in various industries. It can achieve continuous suction and disposal of iron. The belt has automatic correction function, low noise, reliable operation, and simple maintenance. The internal magnetic circuit adopts computer simulation design and a perfect dual pole structure to ensure the long-term operation of the whole machine without faults in harsh environments. It has explosion-proof and armored types. 2、 Schematic diagram 3、 Main technical parameters Note: All models in this series are designed with extra strong T1, T2, and T3 products that are higher than the national standard. The rated magnetic field strength at the lifting height is 90mT, 120mT, and 150mT, respectively. 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "RCYD"
      },
      {
        "label": "Model",
        "value": "RCYDII"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: RCYD",
      "Model: RCYDII"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/43.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcye-type-permanent-magnet-self-dumping-iron-remover",
    "name": "RCYE type permanent magnet self dumping iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcye-type-permanent-magnet-self-dumping-iron-remover/rcye-type-permanent-magnet-self-dumping-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcye-type-permanent-magnet-self-dumping-iron-remover/rcye-type-permanent-magnet-self-dumping-iron-remover-01.jpg",
      "/assets/products/rcye-type-permanent-magnet-self-dumping-iron-remover/rcye-type-permanent-magnet-self-dumping-iron-remover-02.png",
      "/assets/products/rcye-type-permanent-magnet-self-dumping-iron-remover/rcye-type-permanent-magnet-self-dumping-iron-remover-03.png",
      "/assets/products/rcye-type-permanent-magnet-self-dumping-iron-remover/rcye-type-permanent-magnet-self-dumping-iron-remover-06.png",
      "/assets/products/rcye-type-permanent-magnet-self-dumping-iron-remover/rcye-type-permanent-magnet-self-dumping-iron-remover-04.png",
      "/assets/products/rcye-type-permanent-magnet-self-dumping-iron-remover/rcye-type-permanent-magnet-self-dumping-iron-remover-05.png",
      "/assets/products/rcye-type-permanent-magnet-self-dumping-iron-remover/rcye-type-permanent-magnet-self-dumping-iron-remover-08.jpg",
      "/assets/products/rcye-type-permanent-magnet-self-dumping-iron-remover/rcye-type-permanent-magnet-self-dumping-iron-remover-07.jpg",
      "/assets/products/rcye-type-permanent-magnet-self-dumping-iron-remover/rcye-type-permanent-magnet-self-dumping-iron-remover-09.png",
      "/assets/products/rcye-type-permanent-magnet-self-dumping-iron-remover/rcye-type-permanent-magnet-self-dumping-iron-remover-10.png",
      "/assets/products/rcye-type-permanent-magnet-self-dumping-iron-remover/rcye-type-permanent-magnet-self-dumping-iron-remover-11.png"
    ],
    "summary": "product overview： 1、 Explanation This machine uses high-strength rare earth neodymium iron boron to form a strong magnetic core, which has a strong magnetic field and high magnetic field gradient. Suitable for installation in narrow spaces with limited space,",
    "keywords": [
      "RCYE type permanent magnet self dumping iron remover",
      "General iron removal equipment",
      "Metal industry magnetic separation equipment",
      "ore"
    ],
    "features": [
      "This machine uses high-strength rare earth neodymium iron boron to form a strong magnetic core, which has a strong magnetic field and high magnetic field gradient"
    ],
    "principle": "product overview： 1、 Explanation This machine uses high-strength rare earth neodymium iron boron to form a strong magnetic core, which has a strong magnetic field and high magnetic field gradient. Suitable for installation in narrow spaces with limited space, the device itself is lightweight and easy to hang and install. Easy to move and switch to another location for work. ◇ Simple structure, easy maintenance, simplified components, and reduced maintenance costs. ◇ Using a shaft driven motor, it effectively solves chain breakage, chain drop, or belt breakage and slipping faults in chain wheel and chain drive. The automatic iron unloading tape adopts a high-strength circular integrated rubber belt, and the built-in scraper easily completes the iron unloading operation. Stainless steel protective plates are designed around the magnetic core to effectively prevent damage and accidental injury caused by splashing ferromagnetic materials during iron unloading. ◇ It can support installation brackets, which can meet different installation methods and protect the belt from external damage, extending the life of the belt. ◇ Suitable size and performance can be customized according to the user's on-site space and requirements. 2、 Schematic diagram 3、 Main technical parameters Note: This equipment is designed with extra strong T1, T2, and T3 products that are higher than the national standard. The rated magnetic field strength at the lifting height is 90mT, 120mT, and 150mT, respectively. 4、 Industry Applications",
    "specs": [],
    "applications": [
      "General iron removal equipment",
      "Metal industry magnetic separation equipment",
      "ore"
    ],
    "installation": "",
    "customization": [],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/5.html",
      "https://www.cnmagnetics.com/n-14/61.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "rcyf-type-vertical-pipeline-permanent-magnet-iron-remover",
    "name": "RCYF type vertical pipeline permanent magnet iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover-01.jpg",
      "/assets/products/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover-02.png",
      "/assets/products/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover-03.png",
      "/assets/products/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover-06.png",
      "/assets/products/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover-04.png",
      "/assets/products/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover-07.jpg",
      "/assets/products/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover-05.png",
      "/assets/products/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover-08.jpg"
    ],
    "summary": "product overview： 1、 Explanation The RCYF vertical pipeline permanent magnet iron remover is suitable for removing iron from powdered, granular, and block materials in industries such as cement, building materials, chemical, grain, plastics, coal, refractory",
    "keywords": [
      "RCYF type vertical pipeline permanent magnet iron remover",
      "General iron removal equipment",
      "cement",
      "coal",
      "chemical"
    ],
    "features": [
      "It can be connected to conveying pipelines and installed vertically for use"
    ],
    "principle": "product overview： 1、 Explanation The RCYF vertical pipeline permanent magnet iron remover is suitable for removing iron from powdered, granular, and block materials in industries such as cement, building materials, chemical, grain, plastics, coal, refractory materials, etc. It can be connected to conveying pipelines and installed vertically for use. 2、 Schematic diagram 3、 Main technical parameters 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "RCYF"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "cement",
      "coal",
      "chemical"
    ],
    "installation": "",
    "customization": [
      "Model: RCYF"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/46.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover",
    "name": "RCYG type pipeline self dumping permanent magnet iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover-01.jpg",
      "/assets/products/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover-02.png",
      "/assets/products/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover-03.png",
      "/assets/products/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover-06.png",
      "/assets/products/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover-04.png",
      "/assets/products/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover-07.jpg",
      "/assets/products/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover-08.jpg",
      "/assets/products/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover-05.png"
    ],
    "summary": "product overview： 1、 Explanation The RCYG pipeline self dumping permanent magnet iron remover is a high-performance automated iron removal equipment independently developed by our company. This equipment is mainly used for iron removal of cement, water slag,",
    "keywords": [
      "RCYG type pipeline self dumping permanent magnet iron remover",
      "General iron removal equipment",
      "cement",
      "food",
      "chemical",
      "ceramic",
      "glass",
      "ore"
    ],
    "features": [
      "The RCYG pipeline self dumping permanent magnet iron remover is a high-performance automated iron removal equipment independently developed by our company",
      "This equipment is mainly used for iron removal of cement, water slag, and other powdery and small granular materials",
      "The iron remover is connected in series with the lower outlet of the bucket elevator or with the conveyor chute",
      "By passing through the iron remover, the powder can automatically separate and discharge iron impurities such as iron segments, iron beans, and iron powder mixed in it, ensuring stable production operation",
      "This not only improves the purity of cement and other powder, but also reduces maintenance costs",
      "While removing iron, it can also automatically recycle iron impurities and turn waste into treasure",
      "The machine has stable performance, high iron removal rate, easy use, uses high-performance wear-resistant ceramics, does not affect the magnetic field, and has a wear-resistant life guarantee of more than 5 years",
      "It is a new generation of energy-saving and efficient iron removal equipment"
    ],
    "principle": "product overview： 1、 Explanation The RCYG pipeline self dumping permanent magnet iron remover is a high-performance automated iron removal equipment independently developed by our company. This equipment is mainly used for iron removal of cement, water slag, and other powdery and small granular materials. The iron remover is connected in series with the lower outlet of the bucket elevator or with the conveyor chute. By passing through the iron remover, the powder can automatically separate and discharge iron impurities such as iron segments, iron beans, and iron powder mixed in it, ensuring stable production operation. This not only improves the purity of cement and other powder, but also reduces maintenance costs. While removing iron, it can also automatically recycle iron impurities and turn waste into treasure. The machine has stable performance, high iron removal rate, easy use, uses high-performance wear-resistant ceramics, does not affect the magnetic field, and has a wear-resistant life guarantee of more than 5 years. It is a new generation of energy-saving and efficient iron removal equipment. The product is widely used in industries such as cement, ceramics, building materials, chemicals, food, glass, metallurgy, steel, and electricity. 2、 Schematic diagram 3、 Usage conditions ◇ Material temperature: ≤ 125 ℃ (high-temperature resistant magnets can be used when exceeding this temperature); Pipeline inclination angle: 55 ° -60 ° (optimal installation angle); ◇ Negative pressure of pipeline: ≥- 50Pa； ◇ Environmental temperature: ≤ 45 ℃; ◇ Place of use: Indoor (rainproof facilities are required for outdoor use); The best installation position: the lower outlet of the bucket elevator. 4、 Main technical parameters 5、 Application industry",
    "specs": [
      {
        "label": "Installation position",
        "value": "the lower outlet of the bucket elevator."
      },
      {
        "label": "Model",
        "value": "RCYG"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "cement",
      "food",
      "chemical",
      "ceramic",
      "glass",
      "ore"
    ],
    "installation": "Installation position: the lower outlet of the bucket elevator.",
    "customization": [
      "Model: RCYG"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/59.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcyp-type-permanent-magnet-manual-self-dumping-iron-remover",
    "name": "RCYP type permanent magnet manual self dumping iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover-01.jpg",
      "/assets/products/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover-02.png",
      "/assets/products/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover-03.png",
      "/assets/products/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover-06.png",
      "/assets/products/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover-04.png",
      "/assets/products/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover-08.jpg",
      "/assets/products/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover-05.png",
      "/assets/products/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The RCYP type permanent magnet manual self dumping iron remover is suitable for situations where the conveyor belt is narrow, the material is thin, and there is less impurity iron. This machine has a simple structure, reliable",
    "keywords": [
      "RCYP type permanent magnet manual self dumping iron remover",
      "General iron removal equipment"
    ],
    "features": [
      "The RCYP type permanent magnet manual self dumping iron remover is suitable for situations where the conveyor belt is narrow, the material is thin, and there is less impurity iron",
      "This machine has a simple structure, reliable operation, economic practicality, maintenance free, and no noise",
      "When the accumulation of ferromagnetic debris at the bottom of the magnet reaches a certain level, manually shake the handle to drive the scraper and remove the scrap iron"
    ],
    "principle": "product overview： 1、 Explanation The RCYP type permanent magnet manual self dumping iron remover is suitable for situations where the conveyor belt is narrow, the material is thin, and there is less impurity iron. This machine has a simple structure, reliable operation, economic practicality, maintenance free, and no noise. When the accumulation of ferromagnetic debris at the bottom of the magnet reaches a certain level, manually shake the handle to drive the scraper and remove the scrap iron. 2、 Schematic diagram 3、 Main technical parameters Note: All models in this series are designed with extra strong T1, T2, and T3 products that are higher than the national standard. The rated magnetic field strength at the lifting height is 90mT, 120mT, and 150mT, respectively. 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "RCYP"
      }
    ],
    "applications": [
      "General iron removal equipment"
    ],
    "installation": "",
    "customization": [
      "Model: RCYP"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/44.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rcyz-type-vertical-pipeline-permanent-magnet-iron-remover",
    "name": "RCYZ type vertical pipeline permanent magnet iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover-01.jpg",
      "/assets/products/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover-02.png",
      "/assets/products/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover-03.png",
      "/assets/products/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover-04.png",
      "/assets/products/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover-06.png",
      "/assets/products/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover-05.png",
      "/assets/products/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover-08.jpg",
      "/assets/products/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover/rcyz-type-vertical-pipeline-permanent-magnet-iron-remover-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The RCYZ vertical pipeline permanent magnet iron remover is an energy-saving device that uses permanent magnet materials to generate a strong magnetic field attraction. The interior is composed of a ring-shaped magnetic system",
    "keywords": [
      "RCYZ type vertical pipeline permanent magnet iron remover",
      "General iron removal equipment",
      "cement",
      "food",
      "chemical",
      "ceramic"
    ],
    "features": [
      "The RCYZ vertical pipeline permanent magnet iron remover is an energy-saving device that uses permanent magnet materials to generate a strong magnetic field attraction",
      "The interior is composed of a ring-shaped magnetic system made of neodymium iron boron material, with a conical shape, reasonable structure, and high magnetic field strength"
    ],
    "principle": "product overview： 1、 Explanation The RCYZ vertical pipeline permanent magnet iron remover is an energy-saving device that uses permanent magnet materials to generate a strong magnetic field attraction. The interior is composed of a ring-shaped magnetic system made of neodymium iron boron material, with a conical shape, reasonable structure, and high magnetic field strength. Can be connected to solid-state raw material conveying equipment, with a movable door buckle for easy removal of iron, suitable for removing iron from various solid small particles and powder materials in industries such as food, flour, ceramics, chemicals, cement, building materials, quartz sand, etc. 2、 Schematic diagram 3、 Main technical parameters 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "RCYZ"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "cement",
      "food",
      "chemical",
      "ceramic"
    ],
    "installation": "",
    "customization": [
      "Model: RCYZ"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/47.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "cqz-type-fully-automatic-online-magnetic-separation",
    "name": "CQZ type fully automatic online magnetic separation",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/cqz-type-fully-automatic-online-magnetic-separation/cqz-type-fully-automatic-online-magnetic-separation-01.jpg",
    "imageGallery": [
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separation/cqz-type-fully-automatic-online-magnetic-separation-01.jpg",
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separation/cqz-type-fully-automatic-online-magnetic-separation-02.png",
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separation/cqz-type-fully-automatic-online-magnetic-separation-03.png",
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separation/cqz-type-fully-automatic-online-magnetic-separation-05.png",
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separation/cqz-type-fully-automatic-online-magnetic-separation-04.png",
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separation/cqz-type-fully-automatic-online-magnetic-separation-07.jpg",
      "/assets/products/cqz-type-fully-automatic-online-magnetic-separation/cqz-type-fully-automatic-online-magnetic-separation-06.jpg"
    ],
    "summary": "product overview： 1、 Explanation The CQZ type fully automatic online magnetic separator is installed in the assembly line to achieve real-time automatic removal of iron from materials online. The automatic timing controller can be set for continuous automatic",
    "keywords": [
      "CQZ type fully automatic online magnetic separation",
      "Non metallic industry magnetic separation equipment",
      "recycling",
      "food",
      "pharmaceutical",
      "chemical",
      "wood",
      "ore"
    ],
    "features": [
      "The CQZ type fully automatic online magnetic separator is installed in the assembly line to achieve real-time automatic removal of iron from materials online",
      "The automatic timing controller can be set for continuous automatic real-time cleaning, or the cleaning time interval can be set according to the iron content",
      "Its powerful magnetic field can remove ferromagnetic substances from flowing, dry, flowable, powdery, and fine particles"
    ],
    "principle": "product overview： 1、 Explanation The CQZ type fully automatic online magnetic separator is installed in the assembly line to achieve real-time automatic removal of iron from materials online. The automatic timing controller can be set for continuous automatic real-time cleaning, or the cleaning time interval can be set according to the iron content. Its powerful magnetic field can remove ferromagnetic substances from flowing, dry, flowable, powdery, and fine particles. 2、 Schematic diagram 3、 Installation method Free fall, pipeline series for conveying materials, and standalone use of bulk materials. 4、 Application industry Iron removal from fine powder materials such as food, carbon black, activated carbon, chemical industry, pharmaceutical industry, plastic industry, wood industry, recycling industry, packaging industry, quartz sand iron removal, potassium feldspar iron removal, mica iron removal, micro powder iron removal, fly ash iron removal, etc. 5、 Product Description The CQZ fully automatic online magnetic separator is mainly used to separate ferromagnetic impurities in powdered materials. It is arranged in a staggered manner with at least four layers of magnetic rods, ensuring that the material can fully contact the magnets during the falling process. At least four drawer style magnetic rod groups can be set to continuously and alternately unload iron. When one layer is extracted for unloading iron, the other three layers can still ensure that the falling iron is adsorbed. 6、 Product advantages The cleaning of the system is fully automated, and the fully sealed structural design ensures that there is no opening or closing action during the unloading process, allowing the entire operation and unloading work to be carried out in a sealed state. The magnetic core set outside the sealed shell shuttles back and forth between the working area and the cleaning area, and the strong magnetic force can automatically detach the adsorbed iron according to the set trajectory to the cleaning area. Fully sealed iron collector, quick opening and cleaning, saving time, effort and trouble. 7、 Main technical parameters The flexible and versatile layer design can accommodate up to ten layers of staggered arrangement, resulting in a higher iron removal rate. Multiple standard calibers to choose from: 200 * 200mm, 300 * 300mm, 400 * 400mm, 500 * 500mm, 600 * 600mm, 700",
    "specs": [
      {
        "label": "Model",
        "value": "CQZ"
      }
    ],
    "applications": [
      "Non metallic industry magnetic separation equipment",
      "recycling",
      "food",
      "pharmaceutical",
      "chemical",
      "wood",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: CQZ"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/19.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "ctb-wet-semi-countercurrent-magnetic-separator",
    "name": "CTB wet semi countercurrent magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/ctb-wet-semi-countercurrent-magnetic-separator/ctb-wet-semi-countercurrent-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/ctb-wet-semi-countercurrent-magnetic-separator/ctb-wet-semi-countercurrent-magnetic-separator-01.jpg",
      "/assets/products/ctb-wet-semi-countercurrent-magnetic-separator/ctb-wet-semi-countercurrent-magnetic-separator-02.png",
      "/assets/products/ctb-wet-semi-countercurrent-magnetic-separator/ctb-wet-semi-countercurrent-magnetic-separator-05.png",
      "/assets/products/ctb-wet-semi-countercurrent-magnetic-separator/ctb-wet-semi-countercurrent-magnetic-separator-03.png",
      "/assets/products/ctb-wet-semi-countercurrent-magnetic-separator/ctb-wet-semi-countercurrent-magnetic-separator-04.png",
      "/assets/products/ctb-wet-semi-countercurrent-magnetic-separator/ctb-wet-semi-countercurrent-magnetic-separator-07.jpg",
      "/assets/products/ctb-wet-semi-countercurrent-magnetic-separator/ctb-wet-semi-countercurrent-magnetic-separator-06.jpg"
    ],
    "summary": "product overview： 1、 Explanation The CTB wet semi countercurrent magnetic separator is suitable for the scanning and selection of strong magnetic materials with a particle size of 0.5mm or less in wet separation, especially for the selection of minerals with",
    "keywords": [
      "CTB wet semi countercurrent magnetic separator",
      "Non metallic industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "features": [
      "Or remove the strong magnetic minerals mixed in non-magnetic minerals",
      "The CTB wet semi countercurrent magnetic separator can obtain high-quality iron concentrate and achieve good recovery rate, so the semi countercurrent magnetic separator has been widely used in production practice",
      "This machine can continuously feed and discharge ore, with high magnetic field strength and gradient, and has high processing capacity",
      "Multiple units can be connected in series and parallel to achieve multiple scanning and selection"
    ],
    "principle": "product overview： 1、 Explanation The CTB wet semi countercurrent magnetic separator is suitable for the scanning and selection of strong magnetic materials with a particle size of 0.5mm or less in wet separation, especially for the selection of minerals with a particle size of 0.15~0mm. Or remove the strong magnetic minerals mixed in non-magnetic minerals. The CTB wet semi countercurrent magnetic separator can obtain high-quality iron concentrate and achieve good recovery rate, so the semi countercurrent magnetic separator has been widely used in production practice. This machine can continuously feed and discharge ore, with high magnetic field strength and gradient, and has high processing capacity. Multiple units can be connected in series and parallel to achieve multiple scanning and selection. The principle is that when the slurry enters the magnetic field zone, strong magnetic minerals are adsorbed on the surface of the cylinder, weak magnetic and non-magnetic minerals are washed away by water flow, and the magnetic minerals adsorbed on the surface of the cylinder are carried out of the magnetic field zone by the rotation of the cylinder and washed into the concentrate tank with washing water to complete the sorting operation. 2、 Schematic diagram 3、 Main technical parameters 4、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "CTB"
      }
    ],
    "applications": [
      "Non metallic industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: CTB"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/20.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "dcx-wet-fully-automatic-magnetic-separator",
    "name": "DCX wet fully automatic magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/dcx-wet-fully-automatic-magnetic-separator/dcx-wet-fully-automatic-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/dcx-wet-fully-automatic-magnetic-separator/dcx-wet-fully-automatic-magnetic-separator-01.jpg",
      "/assets/products/dcx-wet-fully-automatic-magnetic-separator/dcx-wet-fully-automatic-magnetic-separator-02.png",
      "/assets/products/dcx-wet-fully-automatic-magnetic-separator/dcx-wet-fully-automatic-magnetic-separator-03.png",
      "/assets/products/dcx-wet-fully-automatic-magnetic-separator/dcx-wet-fully-automatic-magnetic-separator-06.png",
      "/assets/products/dcx-wet-fully-automatic-magnetic-separator/dcx-wet-fully-automatic-magnetic-separator-04.png",
      "/assets/products/dcx-wet-fully-automatic-magnetic-separator/dcx-wet-fully-automatic-magnetic-separator-07.jpg",
      "/assets/products/dcx-wet-fully-automatic-magnetic-separator/dcx-wet-fully-automatic-magnetic-separator-08.jpg",
      "/assets/products/dcx-wet-fully-automatic-magnetic-separator/dcx-wet-fully-automatic-magnetic-separator-05.png"
    ],
    "summary": "product overview： 1、 Explanation The DCX wet fully automatic magnetic separator is widely used to remove iron powder, micro iron powder, magnetic substances, etc. from slurries and glazes in industries such as ceramics, mining, chemical, electronics, and food.",
    "keywords": [
      "DCX wet fully automatic magnetic separator",
      "Non metallic industry magnetic separation equipment",
      "mining",
      "food",
      "chemical",
      "ceramic"
    ],
    "features": [
      "The DCX wet fully automatic magnetic separator is widely used to remove iron powder, micro iron powder, magnetic substances, etc",
      "from slurries and glazes in industries such as ceramics, mining, chemical, electronics, and food",
      "With a simple and convenient fully automatic electromagnetic separator, it can remove ferromagnetic substances with a mesh size of 10-1500 from various slurries"
    ],
    "principle": "product overview： 1、 Explanation The DCX wet fully automatic magnetic separator is widely used to remove iron powder, micro iron powder, magnetic substances, etc. from slurries and glazes in industries such as ceramics, mining, chemical, electronics, and food. Specially developed and manufactured for the selection of raw material slurries (temperature below 60 degrees Celsius) for the ceramic and alumina industries, high-end ceramics, high-voltage electric ceramics, kaolin and other industries. With a simple and convenient fully automatic electromagnetic separator, it can remove ferromagnetic substances with a mesh size of 10-1500 from various slurries. 2、 Schematic diagram 3、 Characteristics Using 25 # transformer oil as the electromagnetic winding insulation oil, forced circulation heat dissipation, oil temperature rise ≤ 60 ℃. The magnetic medium is made of stainless high magnetic conductivity material, with magnetic properties 15% higher than the excitation magnetic field strength. Low energy consumption, high magnetic field gradient, uniform magnetic field distribution, effective magnetic field length, and significant iron removal effect. The fully automatic iron removal feature eliminates the need for manual operation, making iron removal convenient, fast, and thorough, with no residual iron powder or slurry loss. Cleaning is also convenient and fast, saving work time. The fully automatic process of feeding, discharging, and unloading iron adopts advanced computer programming, the system is stable, and the control panel can be set freely, which is convenient and fast. The valve adopts a reliable electromagnetic valve and achieves fully automatic operation through programming control. The device comes with a clean water tank and is precisely controlled through programming and valves to achieve iron unloading with minimal water usage. 4、 Main technical parameters 5、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "DCX"
      }
    ],
    "applications": [
      "Non metallic industry magnetic separation equipment",
      "mining",
      "food",
      "chemical",
      "ceramic"
    ],
    "installation": "",
    "customization": [
      "Model: DCX"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/36.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "dcz-type-dry-fully-automatic-magnetic-separation",
    "name": "DCZ type dry fully automatic magnetic separation",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/dcz-type-dry-fully-automatic-magnetic-separation/dcz-type-dry-fully-automatic-magnetic-separation-01.jpg",
    "imageGallery": [
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separation/dcz-type-dry-fully-automatic-magnetic-separation-01.jpg",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separation/dcz-type-dry-fully-automatic-magnetic-separation-02.png",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separation/dcz-type-dry-fully-automatic-magnetic-separation-06.png",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separation/dcz-type-dry-fully-automatic-magnetic-separation-03.png",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separation/dcz-type-dry-fully-automatic-magnetic-separation-04.png",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separation/dcz-type-dry-fully-automatic-magnetic-separation-08.jpg",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separation/dcz-type-dry-fully-automatic-magnetic-separation-07.jpg",
      "/assets/products/dcz-type-dry-fully-automatic-magnetic-separation/dcz-type-dry-fully-automatic-magnetic-separation-05.png"
    ],
    "summary": "product overview： 1、 Explanation The DCZ dry fully automatic magnetic separator is suitable for removing various powdered materials that have passed 10-1500 mesh, such as lithium battery positive electrode ternary materials, lithium manganese oxide, lithium",
    "keywords": [
      "DCZ type dry fully automatic magnetic separation",
      "Non metallic industry magnetic separation equipment",
      "coal",
      "food",
      "pharmaceutical",
      "chemical",
      "ceramic",
      "ore",
      "mineral"
    ],
    "features": [
      "Fully automatic intelligent control operating system, local and remote control, with three modes of operation: physical keys, touch screen, and software",
      "Optional dedicated material channel wear-resistant coating, with a theoretical hardness of HV1200 and does not affect the original characteristics of any raw materials. 4、 Main technical parameters 5、 Product shooting"
    ],
    "principle": "product overview： 1、 Explanation The DCZ dry fully automatic magnetic separator is suitable for removing various powdered materials that have passed 10-1500 mesh, such as lithium battery positive electrode ternary materials, lithium manganese oxide, lithium carbonate, lithium iron phosphate, lithium cobalt oxide, nickel cobalt manganese hydroxide ternary precursors, monohydrate lithium hydroxide, lithium mica, manganese carbonate, monohydrate lithium hydroxide, lithium mica, ternary precursors, nickel cobalt manganese hydroxide, electrolytic manganese dioxide, electrolytic metal manganese, lithium grade cobalt chloride, cobalt hydroxide, battery material waste residue, silicoaluminate, ceramic powder, quartz sand, potassium feldspar, bauxite and other new energy, high-purity quartz, mineral powder, chemical, electronic, food, pharmaceutical and other industries. Material. 2、 Schematic diagram 3、 Characteristics Imported confidential grade oxide film coil winding. The condensation system with patented technology ensures a constant temperature rise of less than 50 ℃ at room temperature, reducing magnetic losses by 40%. Imported confidential magnetic media and processing technology, with a constant working state and a 20% increase in magnetic saturation. Based on the material characteristics of the lithium battery industry, specialized magnetic media structure design and configuration optimization are carried out to achieve a balanced increase of 20% in processing capacity and effectiveness. The effect is still significant at a particle size of μ m. The patented coil winding technology and connection method increase the magnetic flux density by 20%. ◇ Fully automatic intelligent control operating system, local and remote control, with three modes of operation: physical keys, touch screen, and software. ◇ Optional dedicated material channel wear-resistant coating, with a theoretical hardness of HV1200 and does not affect the original characteristics of any raw materials. 4、 Main technical parameters 5、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "DCZ"
      },
      {
        "label": "Model",
        "value": "HV1200"
      }
    ],
    "applications": [
      "Non metallic industry magnetic separation equipment",
      "coal",
      "food",
      "pharmaceutical",
      "chemical",
      "ceramic",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: DCZ",
      "Model: HV1200"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/31.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "gtc-wet-plate-magnetic-separator",
    "name": "GTC wet plate magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/gtc-wet-plate-magnetic-separator/gtc-wet-plate-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/gtc-wet-plate-magnetic-separator/gtc-wet-plate-magnetic-separator-01.jpg",
      "/assets/products/gtc-wet-plate-magnetic-separator/gtc-wet-plate-magnetic-separator-04.png",
      "/assets/products/gtc-wet-plate-magnetic-separator/gtc-wet-plate-magnetic-separator-02.png",
      "/assets/products/gtc-wet-plate-magnetic-separator/gtc-wet-plate-magnetic-separator-03.png",
      "/assets/products/gtc-wet-plate-magnetic-separator/gtc-wet-plate-magnetic-separator-08.png",
      "/assets/products/gtc-wet-plate-magnetic-separator/gtc-wet-plate-magnetic-separator-05.png",
      "/assets/products/gtc-wet-plate-magnetic-separator/gtc-wet-plate-magnetic-separator-09.jpg",
      "/assets/products/gtc-wet-plate-magnetic-separator/gtc-wet-plate-magnetic-separator-10.jpg",
      "/assets/products/gtc-wet-plate-magnetic-separator/gtc-wet-plate-magnetic-separator-06.png",
      "/assets/products/gtc-wet-plate-magnetic-separator/gtc-wet-plate-magnetic-separator-07.png"
    ],
    "summary": "product overview： 1、 Explanation The GTC wet plate magnetic separator is mainly suitable for magnetic separation of weak magnetic minerals with particle size below 5mm and iron removal of non-metallic minerals, such as mica powder, quartz sand, potassium",
    "keywords": [
      "GTC wet plate magnetic separator",
      "Non metallic industry magnetic separation equipment",
      "coal",
      "ore",
      "mineral"
    ],
    "features": [
      "It can also be used for iron removal operations on materials such as coal, non-metallic minerals, and building materials"
    ],
    "principle": "product overview： 1、 Explanation The GTC wet plate magnetic separator is mainly suitable for magnetic separation of weak magnetic minerals with particle size below 5mm and iron removal of non-metallic minerals, such as mica powder, quartz sand, potassium feldspar, nepheline, fluorite, sillimanite, spodumene, kaolin, manganese ore, weak magnetite, magnetite, roasted ore, ilmenite, hematite, limonite, siderite, ilmenite, chromite, scheelite, tantalum niobium ore, red mud, etc. It can also be used for iron removal operations on materials such as coal, non-metallic minerals, and building materials. 2、 Schematic diagram 3、 Working principle The GTC wet plate magnetic separator is mainly composed of a bracket, plate magnetic separation system, feed mixing system, water source system, iron unloading system, regulating system and other structures. During operation, the flow of materials and the iron unloading system form a reverse flow pattern. Non magnetic substances flow naturally to the discharge port based on the principles of physical structure, and are completely discharged after being washed and unloaded. Magnetic substances are adsorbed by a strong magnetic field over long distances, long areas, and multiple times. They are then transported in reverse through the iron unloading system to the iron outlet, where they are completely discharged after being washed and unloaded. 4、 Main technical parameters 5、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "GTC"
      }
    ],
    "applications": [
      "Non metallic industry magnetic separation equipment",
      "coal",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: GTC"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/35.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "hjlh-wet-vertical-ring-high-gradient-magnetic-separator",
    "name": "HJLH wet vertical ring high gradient magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/hjlh-wet-vertical-ring-high-gradient-magnetic-separator/hjlh-wet-vertical-ring-high-gradient-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/hjlh-wet-vertical-ring-high-gradient-magnetic-separator/hjlh-wet-vertical-ring-high-gradient-magnetic-separator-01.jpg",
      "/assets/products/hjlh-wet-vertical-ring-high-gradient-magnetic-separator/hjlh-wet-vertical-ring-high-gradient-magnetic-separator-02.png",
      "/assets/products/hjlh-wet-vertical-ring-high-gradient-magnetic-separator/hjlh-wet-vertical-ring-high-gradient-magnetic-separator-05.png",
      "/assets/products/hjlh-wet-vertical-ring-high-gradient-magnetic-separator/hjlh-wet-vertical-ring-high-gradient-magnetic-separator-03.png",
      "/assets/products/hjlh-wet-vertical-ring-high-gradient-magnetic-separator/hjlh-wet-vertical-ring-high-gradient-magnetic-separator-04.png",
      "/assets/products/hjlh-wet-vertical-ring-high-gradient-magnetic-separator/hjlh-wet-vertical-ring-high-gradient-magnetic-separator-06.jpg",
      "/assets/products/hjlh-wet-vertical-ring-high-gradient-magnetic-separator/hjlh-wet-vertical-ring-high-gradient-magnetic-separator-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation Our company's HJLH wet vertical ring high gradient magnetic separator belongs to independent innovation and research and development, and has obtained a national utility model patent. Its technological innovation adopts simple",
    "keywords": [
      "HJLH wet vertical ring high gradient magnetic separator",
      "Non metallic industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "features": [
      "Our company's HJLH wet vertical ring high gradient magnetic separator belongs to independent innovation and research and development, and has obtained a national utility model patent",
      "Its technological innovation adopts simple and easily accessible water as the cooling medium, and the excitation coil uses thick hollow tube wires",
      "The water flow directly passes through the center of the hollow tube wire, and the heat of the coil is conducted to the water in the most direct way, using the rapid circulation of the water flow to take away the heat",
      "Using patented technology, it completely avoids the formation of scale during the water flow process, completely solves the problem of pipeline blockage, and enables the equipment to maintain long-term stable operation",
      "The excitation coil is wound with a magnetic pipeline with patented technology, advanced insulation technology, and the performance of the material ensures the service life of the coil",
      "Magnetic media have independent intellectual property rights and are made of imported materials",
      "Through independent design and research and development experiments, they can generate high gradient magnetic fields with an induced magnetic field strength of 2T",
      "It converts electrical energy into magnetic energy based on the principle of electromagnetic induction, and has the characteristics of large processing capacity and high efficiency"
    ],
    "principle": "product overview： 1、 Explanation Our company's HJLH wet vertical ring high gradient magnetic separator belongs to independent innovation and research and development, and has obtained a national utility model patent. Its technological innovation adopts simple and easily accessible water as the cooling medium, and the excitation coil uses thick hollow tube wires. The water flow directly passes through the center of the hollow tube wire, and the heat of the coil is conducted to the water in the most direct way, using the rapid circulation of the water flow to take away the heat. Using patented technology, it completely avoids the formation of scale during the water flow process, completely solves the problem of pipeline blockage, and enables the equipment to maintain long-term stable operation. The excitation coil is wound with a magnetic pipeline with patented technology, advanced insulation technology, and the performance of the material ensures the service life of the coil. Magnetic media have independent intellectual property rights and are made of imported materials. Through independent design and research and development experiments, they can generate high gradient magnetic fields with an induced magnetic field strength of 2T. It converts electrical energy into magnetic energy based on the principle of electromagnetic induction, and has the characteristics of large processing capacity and high efficiency. This machine is suitable for mineral processing plants with high requirements for processing capacity and purification rate. This machine achieves the purpose of iron selection by generating a strong magnetic field through a sorting ring. The magnetic field can be adjusted appropriately according to the magnetism of iron in the ore, making it flexible to use. Compared with traditional magnetic separators, it also saves some energy. 2、 Schematic diagram 3、 Scope of use The HJLH vertical ring high gradient magnetic separator is suitable for wet separation and magnetic separation of fine weakly magnetic minerals with a mesh size of around -200, and can also be used for magnetic separation and iron purification of non-metallic minerals. For example: ◇ Black metal: recovery of pseudo hematite, hematite, limonite, siderite, manganese ore, etc. Non ferrous metals: separation of minerals such as scheelite and garnet. Rare metals: recovery of ores such as",
    "specs": [
      {
        "label": "Model",
        "value": "HJLH"
      }
    ],
    "applications": [
      "Non metallic industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: HJLH"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/34.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "hjpc-wet-disc-magnetic-separation",
    "name": "HJPC wet disc magnetic separation",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/hjpc-wet-disc-magnetic-separation/hjpc-wet-disc-magnetic-separation-01.jpg",
    "imageGallery": [
      "/assets/products/hjpc-wet-disc-magnetic-separation/hjpc-wet-disc-magnetic-separation-01.jpg",
      "/assets/products/hjpc-wet-disc-magnetic-separation/hjpc-wet-disc-magnetic-separation-02.png",
      "/assets/products/hjpc-wet-disc-magnetic-separation/hjpc-wet-disc-magnetic-separation-05.png",
      "/assets/products/hjpc-wet-disc-magnetic-separation/hjpc-wet-disc-magnetic-separation-04.png",
      "/assets/products/hjpc-wet-disc-magnetic-separation/hjpc-wet-disc-magnetic-separation-03.png",
      "/assets/products/hjpc-wet-disc-magnetic-separation/hjpc-wet-disc-magnetic-separation-07.jpg",
      "/assets/products/hjpc-wet-disc-magnetic-separation/hjpc-wet-disc-magnetic-separation-06.jpg"
    ],
    "summary": "product overview： 1、 Explanation The HJPC wet disc magnetic separator is a new type of high gradient magnetic separation equipment independently developed by our company, with a high magnetic field strength of 16000 GS. It is a device specifically designed",
    "keywords": [
      "HJPC wet disc magnetic separation",
      "Non metallic industry magnetic separation equipment",
      "ceramic",
      "ore",
      "mineral"
    ],
    "features": [
      "The HJPC wet disc magnetic separator is a new type of high gradient magnetic separation equipment independently developed by our company, with a high magnetic field strength of 16000 GS",
      "It is a device specifically designed for cleaning weak magnetic iron in wet non-magnetic minerals",
      "Just connect it in series with the production process equipment, and the material flows through this equipment",
      "The lower half of the disk with strong suction force is immersed in the material",
      "When the material passes through the gap between the disks, all materials passing through the disks are subjected to the action of the magnetic field",
      "Magnetic substances can be fully adsorbed, and weak magnetic iron is adsorbed on the surface of the disk by strong suction force",
      "With the rotation of the disk, the magnetic substance is carried out of the material circulation channel and forcibly removed by a special material and structure scraper",
      "This device has the characteristics of handling high flow rates, low iron content, and the ability to clean weak magnetic iron"
    ],
    "principle": "product overview： 1、 Explanation The HJPC wet disc magnetic separator is a new type of high gradient magnetic separation equipment independently developed by our company, with a high magnetic field strength of 16000 GS. It is a device specifically designed for cleaning weak magnetic iron in wet non-magnetic minerals. Just connect it in series with the production process equipment, and the material flows through this equipment. The lower half of the disk with strong suction force is immersed in the material. When the material passes through the gap between the disks, all materials passing through the disks are subjected to the action of the magnetic field. Magnetic substances can be fully adsorbed, and weak magnetic iron is adsorbed on the surface of the disk by strong suction force. With the rotation of the disk, the magnetic substance is carried out of the material circulation channel and forcibly removed by a special material and structure scraper. This device has the characteristics of handling high flow rates, low iron content, and the ability to clean weak magnetic iron. Therefore, it is widely used in industries such as quartz sand, potassium feldspar, sodium feldspar, mica stone, silicon powder, ceramic slurry, etc. 2、 Schematic diagram 3、 Main technical parameters",
    "specs": [
      {
        "label": "Model",
        "value": "HJPC"
      }
    ],
    "applications": [
      "Non metallic industry magnetic separation equipment",
      "ceramic",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: HJPC"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/28.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "clt-type-magnetic-desliming-tank",
    "name": "CLT type magnetic desliming tank",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/clt-type-magnetic-desliming-tank/clt-type-magnetic-desliming-tank-01.jpg",
    "imageGallery": [
      "/assets/products/clt-type-magnetic-desliming-tank/clt-type-magnetic-desliming-tank-01.jpg",
      "/assets/products/clt-type-magnetic-desliming-tank/clt-type-magnetic-desliming-tank-02.png",
      "/assets/products/clt-type-magnetic-desliming-tank/clt-type-magnetic-desliming-tank-04.png",
      "/assets/products/clt-type-magnetic-desliming-tank/clt-type-magnetic-desliming-tank-05.png",
      "/assets/products/clt-type-magnetic-desliming-tank/clt-type-magnetic-desliming-tank-03.png",
      "/assets/products/clt-type-magnetic-desliming-tank/clt-type-magnetic-desliming-tank-06.jpg",
      "/assets/products/clt-type-magnetic-desliming-tank/clt-type-magnetic-desliming-tank-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The CLT type magnetic desliming tank is a separation equipment that combines magnetic and gravity forces, which can effectively separate the gangue and poor connected bodies contained in the concentrate. Its effective sorting",
    "keywords": [
      "CLT type magnetic desliming tank",
      "Metal industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "features": [
      "The CLT type magnetic desliming tank is a separation equipment that combines magnetic and gravity forces, which can effectively separate the gangue and poor connected bodies contained in the concentrate",
      "Its effective sorting particle size range is below 60 mesh",
      "Mainly used for separating magnetite, it can also be used for selection operations",
      "This machine can not only obtain qualified concentrate under relaxed particle size range conditions, but also improve the grade of iron ore powder by 1-2 percentage points compared to similar equipment",
      "This machine has the characteristics of simple structure, reliable process, convenience, and water and electricity conservation",
      "Widely used in magnetic separation technology",
      "It can remove mineral mud and fine-grained gangue, and can also be used as a concentration equipment before filtration"
    ],
    "principle": "product overview： 1、 Explanation The CLT type magnetic desliming tank is a separation equipment that combines magnetic and gravity forces, which can effectively separate the gangue and poor connected bodies contained in the concentrate. Its effective sorting particle size range is below 60 mesh. Mainly used for separating magnetite, it can also be used for selection operations. This machine can not only obtain qualified concentrate under relaxed particle size range conditions, but also improve the grade of iron ore powder by 1-2 percentage points compared to similar equipment. This machine has the characteristics of simple structure, reliable process, convenience, and water and electricity conservation. Widely used in magnetic separation technology. It can remove mineral mud and fine-grained gangue, and can also be used as a concentration equipment before filtration. 2、 Schematic diagram 3、 Main technical parameters",
    "specs": [
      {
        "label": "Model",
        "value": "CLT"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: CLT"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/9.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "ctb-type-semi-countercurrent-wet-selection-machine",
    "name": "CTB type semi countercurrent wet selection machine",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/ctb-type-semi-countercurrent-wet-selection-machine/ctb-type-semi-countercurrent-wet-selection-machine-01.jpg",
    "imageGallery": [
      "/assets/products/ctb-type-semi-countercurrent-wet-selection-machine/ctb-type-semi-countercurrent-wet-selection-machine-01.jpg",
      "/assets/products/ctb-type-semi-countercurrent-wet-selection-machine/ctb-type-semi-countercurrent-wet-selection-machine-02.png",
      "/assets/products/ctb-type-semi-countercurrent-wet-selection-machine/ctb-type-semi-countercurrent-wet-selection-machine-03.png",
      "/assets/products/ctb-type-semi-countercurrent-wet-selection-machine/ctb-type-semi-countercurrent-wet-selection-machine-06.png",
      "/assets/products/ctb-type-semi-countercurrent-wet-selection-machine/ctb-type-semi-countercurrent-wet-selection-machine-04.png",
      "/assets/products/ctb-type-semi-countercurrent-wet-selection-machine/ctb-type-semi-countercurrent-wet-selection-machine-08.jpg",
      "/assets/products/ctb-type-semi-countercurrent-wet-selection-machine/ctb-type-semi-countercurrent-wet-selection-machine-05.png",
      "/assets/products/ctb-type-semi-countercurrent-wet-selection-machine/ctb-type-semi-countercurrent-wet-selection-machine-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The CTB wet semi countercurrent magnetic separator is suitable for the scanning and selection of strong magnetic materials with a particle size of 0.5mm or less in wet separation, especially for the selection of minerals with",
    "keywords": [
      "CTB type semi countercurrent wet selection machine",
      "Metal industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "features": [
      "Or remove the strong magnetic minerals mixed in non-magnetic minerals",
      "The CTB wet semi countercurrent magnetic separator can obtain high-quality iron concentrate and achieve good recovery rate, so the semi countercurrent magnetic separator has been widely used in production practice",
      "This machine can continuously feed and discharge ore, with high magnetic field strength and gradient, and has high processing capacity",
      "Multiple units can be connected in series and parallel to achieve multiple scanning and selection"
    ],
    "principle": "product overview： 1、 Explanation The CTB wet semi countercurrent magnetic separator is suitable for the scanning and selection of strong magnetic materials with a particle size of 0.5mm or less in wet separation, especially for the selection of minerals with a particle size of 0.15~0mm. Or remove the strong magnetic minerals mixed in non-magnetic minerals. The CTB wet semi countercurrent magnetic separator can obtain high-quality iron concentrate and achieve good recovery rate, so the semi countercurrent magnetic separator has been widely used in production practice. This machine can continuously feed and discharge ore, with high magnetic field strength and gradient, and has high processing capacity. Multiple units can be connected in series and parallel to achieve multiple scanning and selection. The principle is that when the slurry enters the magnetic field zone, strong magnetic minerals are adsorbed on the surface of the cylinder, weak magnetic and non-magnetic minerals are washed away by water flow, and the magnetic minerals adsorbed on the surface of the cylinder are carried out of the magnetic field zone by the rotation of the cylinder and washed into the concentrate tank with washing water to complete the sorting operation. 2、 Schematic diagram 3、 Main technical parameters 4、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "CTB"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: CTB"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/4.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "ctdg-type-permanent-magnet-bulk-dry-magnetic-separator",
    "name": "CTDG type permanent magnet bulk dry magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator-01.jpg",
      "/assets/products/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator-02.png",
      "/assets/products/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator-06.png",
      "/assets/products/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator-04.png",
      "/assets/products/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator-08.jpg",
      "/assets/products/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator-03.png",
      "/assets/products/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator-07.jpg",
      "/assets/products/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator/ctdg-type-permanent-magnet-bulk-dry-magnetic-separator-05.png"
    ],
    "summary": "product overview： 1、 Explanation The CTDG type permanent magnet bulk dry magnetic separator is a new type of high-efficiency energy-saving mineral processing equipment. In addition to existing standardized products, magnetic separators (magnetic pulleys) with",
    "keywords": [
      "CTDG type permanent magnet bulk dry magnetic separator",
      "Metal industry magnetic separation equipment",
      "mining",
      "ore",
      "mineral"
    ],
    "features": [
      "The CTDG type permanent magnet bulk dry magnetic separator is a new type of high-efficiency energy-saving mineral processing equipment"
    ],
    "principle": "product overview： 1、 Explanation The CTDG type permanent magnet bulk dry magnetic separator is a new type of high-efficiency energy-saving mineral processing equipment. In addition to existing standardized products, magnetic separators (magnetic pulleys) with different magnetic induction strengths can also be designed and manufactured according to specific user requirements, suitable for different belt specifications. The product is widely used in metallurgy and other industries, and can meet the needs of large, medium, and small mining plants; The pre selection operation of each section after crushing the ore in the user's magnetic separation plant can remove the mixed waste rock, restore the geological grade, save energy consumption, and increase the processing capacity of the beneficiation plant; Used in mining sites to recover magnetite ore from waste rock and improve the utilization rate of ore resources; Used for recovering metallic iron from steel slag; Used for sorting useful metals in garbage disposal to improve the environment. 2、 Schematic diagram 3、 Main technical parameters 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "CTDG"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "mining",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: CTDG"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/10.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "ctn-type-full-countercurrent-wet-magnetic-separator",
    "name": "CTN type full countercurrent wet magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/ctn-type-full-countercurrent-wet-magnetic-separator/ctn-type-full-countercurrent-wet-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/ctn-type-full-countercurrent-wet-magnetic-separator/ctn-type-full-countercurrent-wet-magnetic-separator-01.jpg",
      "/assets/products/ctn-type-full-countercurrent-wet-magnetic-separator/ctn-type-full-countercurrent-wet-magnetic-separator-02.png",
      "/assets/products/ctn-type-full-countercurrent-wet-magnetic-separator/ctn-type-full-countercurrent-wet-magnetic-separator-04.png",
      "/assets/products/ctn-type-full-countercurrent-wet-magnetic-separator/ctn-type-full-countercurrent-wet-magnetic-separator-06.png",
      "/assets/products/ctn-type-full-countercurrent-wet-magnetic-separator/ctn-type-full-countercurrent-wet-magnetic-separator-03.png",
      "/assets/products/ctn-type-full-countercurrent-wet-magnetic-separator/ctn-type-full-countercurrent-wet-magnetic-separator-08.jpg",
      "/assets/products/ctn-type-full-countercurrent-wet-magnetic-separator/ctn-type-full-countercurrent-wet-magnetic-separator-07.jpg",
      "/assets/products/ctn-type-full-countercurrent-wet-magnetic-separator/ctn-type-full-countercurrent-wet-magnetic-separator-05.png"
    ],
    "summary": "product overview： 1、 Explanation The core technology of CTN wet full countercurrent magnetic separator adopts computer simulation design of magnetic circuit, which makes the magnetic field distribution in the magnetic separation zone more uniform, without",
    "keywords": [
      "CTN type full countercurrent wet magnetic separator",
      "Metal industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "features": [
      "The magnetic system is designed with a large angle, and the surface magnetic field strength of the drum can reach 6000gs",
      "Special wear-resistant treatment is applied to the surface of the groove and drum, with multiple options for wear resistance, greatly extending the lifespan of the entire machine"
    ],
    "principle": "product overview： 1、 Explanation The core technology of CTN wet full countercurrent magnetic separator adopts computer simulation design of magnetic circuit, which makes the magnetic field distribution in the magnetic separation zone more uniform, without empty magnetic zone. The magnetic system is designed with a large angle, and the surface magnetic field strength of the drum can reach 6000gs. Special wear-resistant treatment is applied to the surface of the groove and drum, with multiple options for wear resistance, greatly extending the lifespan of the entire machine. 2、 Schematic diagram 3、 Scope of application Suitable for wet separation of magnetic minerals mixed in fine-grained non-magnetic minerals with a particle size of 3-0mm. Especially suitable for iron removal and purification operations in non-metallic minerals such as quartz sand and potassium feldspar. This machine can continuously feed and discharge ore, with high magnetic field strength and gradient, and has high processing capacity. 4、 Principle The principle is that when the slurry enters the magnetic field zone, strong magnetic minerals are adsorbed on the surface of the cylinder, weak magnetic and non-magnetic minerals are washed away by water flow, and the magnetic minerals adsorbed on the surface of the cylinder are carried out of the magnetic field zone by the rotation of the cylinder and washed into the concentrate tank with washing water to complete the sorting operation. 5、 Main technical parameters 6、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "CTN"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: CTN"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/17.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "cts-type-downstream-wet-pre-selection-machine",
    "name": "CTS type downstream wet pre selection machine",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/cts-type-downstream-wet-pre-selection-machine/cts-type-downstream-wet-pre-selection-machine-01.jpg",
    "imageGallery": [
      "/assets/products/cts-type-downstream-wet-pre-selection-machine/cts-type-downstream-wet-pre-selection-machine-01.jpg",
      "/assets/products/cts-type-downstream-wet-pre-selection-machine/cts-type-downstream-wet-pre-selection-machine-02.png",
      "/assets/products/cts-type-downstream-wet-pre-selection-machine/cts-type-downstream-wet-pre-selection-machine-03.png",
      "/assets/products/cts-type-downstream-wet-pre-selection-machine/cts-type-downstream-wet-pre-selection-machine-06.png",
      "/assets/products/cts-type-downstream-wet-pre-selection-machine/cts-type-downstream-wet-pre-selection-machine-08.jpg",
      "/assets/products/cts-type-downstream-wet-pre-selection-machine/cts-type-downstream-wet-pre-selection-machine-04.png",
      "/assets/products/cts-type-downstream-wet-pre-selection-machine/cts-type-downstream-wet-pre-selection-machine-05.png",
      "/assets/products/cts-type-downstream-wet-pre-selection-machine/cts-type-downstream-wet-pre-selection-machine-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The CTS type downstream wet pre selection machine is suitable for pre selection and selection of coarse-grained strong magnetic materials with a particle size of 6-0mm, or for removing mixed strong magnetic minerals in",
    "keywords": [
      "CTS type downstream wet pre selection machine",
      "Metal industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "features": [
      "This machine can continuously feed and discharge ore, with high magnetic field strength, high magnetic field gradient, large working gap, and high processing capacity",
      "Multiple units can also work in series"
    ],
    "principle": "product overview： 1、 Explanation The CTS type downstream wet pre selection machine is suitable for pre selection and selection of coarse-grained strong magnetic materials with a particle size of 6-0mm, or for removing mixed strong magnetic minerals in non-magnetic minerals. This machine can continuously feed and discharge ore, with high magnetic field strength, high magnetic field gradient, large working gap, and high processing capacity. Multiple units can also work in series. The principle is that when the slurry enters the magnetic field zone, strong magnetic minerals are adsorbed on the surface of the cylinder, weak magnetic and non-magnetic minerals are washed away by water flow, and the magnetic minerals adsorbed on the surface of the cylinder are carried out of the magnetic field zone by the rotation of the cylinder and washed into the concentrate tank with washing water to complete the sorting operation. 2、 Schematic diagram 3、 Main technical parameters explain: According to the installation orientation, there are two types of structures: left and right. The average value and highest magnetic induction intensity value of the scanning area in the magnetic induction intensity of the cylinder table are determined based on the iron content of different minerals and different selection requirements. The magnetic field strength range can be produced from 1000GS to 8000GS. 4、 Application site",
    "specs": [
      {
        "label": "Model",
        "value": "CTS"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: CTS"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/3.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "ctzs-type-upward-suction-magnetic-separator",
    "name": "CTZS type upward suction magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/ctzs-type-upward-suction-magnetic-separator/ctzs-type-upward-suction-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/ctzs-type-upward-suction-magnetic-separator/ctzs-type-upward-suction-magnetic-separator-01.jpg",
      "/assets/products/ctzs-type-upward-suction-magnetic-separator/ctzs-type-upward-suction-magnetic-separator-02.png",
      "/assets/products/ctzs-type-upward-suction-magnetic-separator/ctzs-type-upward-suction-magnetic-separator-06.png",
      "/assets/products/ctzs-type-upward-suction-magnetic-separator/ctzs-type-upward-suction-magnetic-separator-04.png",
      "/assets/products/ctzs-type-upward-suction-magnetic-separator/ctzs-type-upward-suction-magnetic-separator-03.png",
      "/assets/products/ctzs-type-upward-suction-magnetic-separator/ctzs-type-upward-suction-magnetic-separator-05.png",
      "/assets/products/ctzs-type-upward-suction-magnetic-separator/ctzs-type-upward-suction-magnetic-separator-07.jpg",
      "/assets/products/ctzs-type-upward-suction-magnetic-separator/ctzs-type-upward-suction-magnetic-separator-08.jpg"
    ],
    "summary": "product overview： 1、 Explanation The CTZS type upward suction magnetic separator is a specialized equipment developed by our company for typical industries such as household waste classification, industrial waste classification, and scrap steel crushing",
    "keywords": [
      "CTZS type upward suction magnetic separator",
      "Metal industry magnetic separation equipment",
      "cement"
    ],
    "features": [
      "The CTZS upward suction magnetic separator has a unique magnetic circuit design, which can achieve both large magnetic penetration depth and high surface magnetic field. It adopts an upward suction"
    ],
    "principle": "product overview： 1、 Explanation The CTZS type upward suction magnetic separator is a specialized equipment developed by our company for typical industries such as household waste classification, industrial waste classification, and scrap steel crushing classification. It is used to automatically remove ferromagnetic substances from moving materials. Cooperate with conveyor belts or other feeding devices to achieve online separation of ferromagnetic metals and real-time transfer. Its powerful processing capacity and environmental adaptability make it widely used even in harsh environments. 2、 Characteristics The CTZS upward suction magnetic separator has a unique magnetic circuit design, which can achieve both large magnetic penetration depth and high surface magnetic field. It adopts an upward suction installation method, effectively penetrates thick material layers, and can effectively adsorb large iron blocks and weak magnetic iron. Adopting a large angle magnetic system design, the equipment body is equipped with star shaped paddles to achieve automatic online transfer or real-time iron unloading. The surface of the drum adopts a double-layer design, with the main layer thickened to prevent impact and the auxiliary layer wear-resistant. The auxiliary layer is easy to install and disassemble, with simple and convenient operation, easy replacement, no need for professional repair at the factory, and saves time, effort, and money. ◇ Install along the direction of belt feeding and match with any inclined belt and other feeding devices. The optional control part can be interlocked with the belt conveyor, achieving both on-site manual control and centralized control. 3、 Schematic diagram 4、 Main technical parameters 5、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "CTZS"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "cement"
    ],
    "installation": "",
    "customization": [
      "Model: CTZS"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/15.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "hcg-type-dry-pre-selection-machine",
    "name": "HCG type dry pre selection machine",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/hcg-type-dry-pre-selection-machine/hcg-type-dry-pre-selection-machine-01.jpg",
    "imageGallery": [
      "/assets/products/hcg-type-dry-pre-selection-machine/hcg-type-dry-pre-selection-machine-01.jpg",
      "/assets/products/hcg-type-dry-pre-selection-machine/hcg-type-dry-pre-selection-machine-05.png",
      "/assets/products/hcg-type-dry-pre-selection-machine/hcg-type-dry-pre-selection-machine-02.png",
      "/assets/products/hcg-type-dry-pre-selection-machine/hcg-type-dry-pre-selection-machine-07.jpg",
      "/assets/products/hcg-type-dry-pre-selection-machine/hcg-type-dry-pre-selection-machine-06.jpg",
      "/assets/products/hcg-type-dry-pre-selection-machine/hcg-type-dry-pre-selection-machine-03.png",
      "/assets/products/hcg-type-dry-pre-selection-machine/hcg-type-dry-pre-selection-machine-04.png"
    ],
    "summary": "product overview： 1、 Explanation The HCG type dry pre selection machine is mainly designed for pre selection of 5% -20% ultra-low grade, low-grade magnetite and dry powder ores, effectively improving the grinding grade, reducing the beneficiation cost, and",
    "keywords": [
      "HCG type dry pre selection machine",
      "Metal industry magnetic separation equipment",
      "ceramic",
      "ore"
    ],
    "features": [],
    "principle": "product overview： 1、 Explanation The HCG type dry pre selection machine is mainly designed for pre selection of 5% -20% ultra-low grade, low-grade magnetite and dry powder ores, effectively improving the grinding grade, reducing the beneficiation cost, and improving production efficiency. 2、 Schematic diagram 3、 Main technical parameters ◇ Good beneficiation effect: Unique magnetic system design effectively controls tailings while improving concentrate grade, achieving good beneficiation effect; ◇ Large processing capacity: By using a frequency converter to control the working speed, it is possible to achieve 1.5 times the processing capacity of equipment of the same specifications; ◇ Wear resistance: The cylinder watch is made of wear-resistant ceramics with a hardness of HRA ≥ 85, which can reach HRA92 or higher, and has superior performance that cannot be replaced by other wear-resistant metal materials; ◇ Wide application range: The unique material separation structure design can flexibly control the grade of fine and tailings, and can be widely used for pre enrichment of 0-12mm powder ore; 4、 Principle By utilizing the principle that magnetic substances can be attracted by permanent magnets, a semi-circular magnetic system is designed inside the drum through which the material flows to form a larger magnetic field. When the material flows through this magnetic field area, the magnetic ore is immediately captured by a strong magnetic force and adsorbed on the drum adsorption surface of the semi-circular magnetic system. When the magnetic ore is brought to the non-magnetic area in the lower part, it falls to the concentrate outlet under its own weight and is discharged. Non magnetic ores or ores with lower iron grades can freely flow through the magnetic field to the tailings outlet under the action of gravity for removal. 5、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "HCG"
      },
      {
        "label": "Model",
        "value": "HRA"
      },
      {
        "label": "Model",
        "value": "HRA92"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "ceramic",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: HCG",
      "Model: HRA",
      "Model: HRA92"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/6.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "hjlh-type-vertical-ring-high-gradient-magnetic-separation",
    "name": "HJLH type vertical ring high gradient magnetic separation",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/hjlh-type-vertical-ring-high-gradient-magnetic-separation/hjlh-type-vertical-ring-high-gradient-magnetic-separation-01.jpg",
    "imageGallery": [
      "/assets/products/hjlh-type-vertical-ring-high-gradient-magnetic-separation/hjlh-type-vertical-ring-high-gradient-magnetic-separation-01.jpg",
      "/assets/products/hjlh-type-vertical-ring-high-gradient-magnetic-separation/hjlh-type-vertical-ring-high-gradient-magnetic-separation-02.png",
      "/assets/products/hjlh-type-vertical-ring-high-gradient-magnetic-separation/hjlh-type-vertical-ring-high-gradient-magnetic-separation-05.png",
      "/assets/products/hjlh-type-vertical-ring-high-gradient-magnetic-separation/hjlh-type-vertical-ring-high-gradient-magnetic-separation-04.png",
      "/assets/products/hjlh-type-vertical-ring-high-gradient-magnetic-separation/hjlh-type-vertical-ring-high-gradient-magnetic-separation-07.jpg",
      "/assets/products/hjlh-type-vertical-ring-high-gradient-magnetic-separation/hjlh-type-vertical-ring-high-gradient-magnetic-separation-03.png",
      "/assets/products/hjlh-type-vertical-ring-high-gradient-magnetic-separation/hjlh-type-vertical-ring-high-gradient-magnetic-separation-06.jpg"
    ],
    "summary": "product overview： 1、 Explanation Our company's HJLH wet vertical ring high gradient magnetic separator belongs to independent innovation and research and development, and has obtained a national utility model patent. Its technological innovation adopts simple",
    "keywords": [
      "HJLH type vertical ring high gradient magnetic separation",
      "Metal industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "features": [
      "Our company's HJLH wet vertical ring high gradient magnetic separator belongs to independent innovation and research and development, and has obtained a national utility model patent",
      "Its technological innovation adopts simple and easily accessible water as the cooling medium, and the excitation coil uses thick hollow tube wires",
      "The water flow directly passes through the center of the hollow tube wire, and the heat of the coil is conducted to the water in the most direct way, using the rapid circulation of the water flow to take away the heat",
      "Using patented technology, it completely avoids the formation of scale during the water flow process, completely solves the problem of pipeline blockage, and enables the equipment to maintain long-term stable operation",
      "The excitation coil is wound with a magnetic pipeline with patented technology, advanced insulation technology, and the performance of the material ensures the service life of the coil",
      "Magnetic media have independent intellectual property rights and are made of imported materials",
      "Through independent design and research and development experiments, they can generate high gradient magnetic fields with an induced magnetic field strength of 2T",
      "It converts electrical energy into magnetic energy based on the principle of electromagnetic induction, and has the characteristics of large processing capacity and high efficiency"
    ],
    "principle": "product overview： 1、 Explanation Our company's HJLH wet vertical ring high gradient magnetic separator belongs to independent innovation and research and development, and has obtained a national utility model patent. Its technological innovation adopts simple and easily accessible water as the cooling medium, and the excitation coil uses thick hollow tube wires. The water flow directly passes through the center of the hollow tube wire, and the heat of the coil is conducted to the water in the most direct way, using the rapid circulation of the water flow to take away the heat. Using patented technology, it completely avoids the formation of scale during the water flow process, completely solves the problem of pipeline blockage, and enables the equipment to maintain long-term stable operation. The excitation coil is wound with a magnetic pipeline with patented technology, advanced insulation technology, and the performance of the material ensures the service life of the coil. Magnetic media have independent intellectual property rights and are made of imported materials. Through independent design and research and development experiments, they can generate high gradient magnetic fields with an induced magnetic field strength of 2T. It converts electrical energy into magnetic energy based on the principle of electromagnetic induction, and has the characteristics of large processing capacity and high efficiency. This machine is suitable for mineral processing plants with high requirements for processing capacity and purification rate. This machine achieves the purpose of iron selection by generating a strong magnetic field through a sorting ring. The magnetic field can be adjusted appropriately according to the magnetism of iron in the ore, making it flexible to use. Compared with traditional magnetic separators, it also saves some energy. 2、 Schematic diagram 3、 Scope of use The HJLH vertical ring high gradient magnetic separator is suitable for wet separation and magnetic separation of fine weakly magnetic minerals with a mesh size of around -200, and can also be used for magnetic separation and iron purification of non-metallic minerals. For example: ◇ Black metal: recovery of pseudo hematite, hematite, limonite, siderite, manganese ore, etc. Non ferrous metals: separation of minerals such as scheelite and garnet. Rare metals: recovery of ores such as",
    "specs": [
      {
        "label": "Model",
        "value": "HJLH"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: HJLH"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/13.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "ljk-type-magnetic-ore-special-iron-remover",
    "name": "LJK type magnetic ore special iron remover",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/ljk-type-magnetic-ore-special-iron-remover/ljk-type-magnetic-ore-special-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/ljk-type-magnetic-ore-special-iron-remover/ljk-type-magnetic-ore-special-iron-remover-01.jpg",
      "/assets/products/ljk-type-magnetic-ore-special-iron-remover/ljk-type-magnetic-ore-special-iron-remover-02.png",
      "/assets/products/ljk-type-magnetic-ore-special-iron-remover/ljk-type-magnetic-ore-special-iron-remover-05.png",
      "/assets/products/ljk-type-magnetic-ore-special-iron-remover/ljk-type-magnetic-ore-special-iron-remover-04.png",
      "/assets/products/ljk-type-magnetic-ore-special-iron-remover/ljk-type-magnetic-ore-special-iron-remover-03.png",
      "/assets/products/ljk-type-magnetic-ore-special-iron-remover/ljk-type-magnetic-ore-special-iron-remover-07.jpg",
      "/assets/products/ljk-type-magnetic-ore-special-iron-remover/ljk-type-magnetic-ore-special-iron-remover-06.jpg"
    ],
    "summary": "product overview： 1、 Explanation The LJK iron removal system is mainly suitable for removing iron from magnetic ore conveyor belts such as raw ore, sintered ore, pellet ore, and block ore. The LJK iron removal system relies on its unique magnetic circuit",
    "keywords": [
      "LJK type magnetic ore special iron remover",
      "Metal industry magnetic separation equipment",
      "ore"
    ],
    "features": [
      "It can effectively utilize the upper space of the belt, has strong adaptability to"
    ],
    "principle": "product overview： 1、 Explanation The LJK iron removal system is mainly suitable for removing iron from magnetic ore conveyor belts such as raw ore, sintered ore, pellet ore, and block ore. The LJK iron removal system relies on its unique magnetic circuit design to separate the selected materials multiple times, thereby separating the iron parts that cause damage to the production line from a large amount of strong magnetic materials with less ore content, achieving the goal of protecting the belt from scratches and protecting the subsequent crushing equipment. 2、 Schematic diagram 3、 Characteristics Adopting discontinuous excitation, low energy consumption, stable and reliable performance. The sorting zone has multiple composite magnetic systems, and the anti magnetic zone ensures the minimum amount of ore material carried out during iron removal. Continuous real-time monitoring of iron removal without any iron leakage. ◇ It can effectively utilize the upper space of the belt, has strong adaptability to installation sites, and occupies less land. ◇ Less supporting auxiliary equipment, more conducive to operation and maintenance. 4、 Main technical parameters",
    "specs": [
      {
        "label": "Model",
        "value": "LJK"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: LJK"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/2.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "nct-type-concentrated-magnetic-separator",
    "name": "NCT type concentrated magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/nct-type-concentrated-magnetic-separator/nct-type-concentrated-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/nct-type-concentrated-magnetic-separator/nct-type-concentrated-magnetic-separator-01.jpg",
      "/assets/products/nct-type-concentrated-magnetic-separator/nct-type-concentrated-magnetic-separator-02.png",
      "/assets/products/nct-type-concentrated-magnetic-separator/nct-type-concentrated-magnetic-separator-06.png",
      "/assets/products/nct-type-concentrated-magnetic-separator/nct-type-concentrated-magnetic-separator-08.jpg",
      "/assets/products/nct-type-concentrated-magnetic-separator/nct-type-concentrated-magnetic-separator-04.png",
      "/assets/products/nct-type-concentrated-magnetic-separator/nct-type-concentrated-magnetic-separator-05.png",
      "/assets/products/nct-type-concentrated-magnetic-separator/nct-type-concentrated-magnetic-separator-03.png",
      "/assets/products/nct-type-concentrated-magnetic-separator/nct-type-concentrated-magnetic-separator-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The NCT type concentrated magnetic separator is specifically designed for the concentration of low concentration slurry in the magnetic separation process, increasing the concentration of the slurry. Mainly used in the",
    "keywords": [
      "NCT type concentrated magnetic separator",
      "Metal industry magnetic separation equipment",
      "recycling",
      "ore",
      "mineral"
    ],
    "features": [
      "The NCT type concentrated magnetic separator is specifically designed for the concentration of low concentration slurry in the magnetic separation process, increasing the concentration of the slurry"
    ],
    "principle": "product overview： 1、 Explanation The NCT type concentrated magnetic separator is specifically designed for the concentration of low concentration slurry in the magnetic separation process, increasing the concentration of the slurry. Mainly used in the grinding and selection process to increase the slurry concentration when the coarse particle slurry of the screened material enters the ball milling operation after high-frequency screening, in order to improve the grinding efficiency of the ball milling and reduce production costs. At the same time, the fine-grained concentration magnetic separator is applied to increase the slurry concentration before the iron concentrate enters the filtration operation, in order to improve the operating efficiency and quality of the filter machine, and effectively reduce the moisture content of the iron concentrate powder. 2、 Schematic diagram 3、 Characteristics ◇ High concentrate discharge concentration: The magnetic system adopts a large angle design, which extends the selection length and unloading time. Optimization design of the tank, optimizing the discharge gap and unloading height of the tank to achieve a concentrate discharge concentration of over 68%. ◇ High recycling rate: The magnetic system adopts a high gradient design and a large angle structure, which effectively controls the grade of magnetic tailings and has a high recovery rate. It can directly dispose of tailings during concentration operations. The upper part of the drum of the coarse particle concentration magnetic separator is equipped with a floating filter press roller, which exerts a constant pressure on the surface of the drum to squeeze out the remaining moisture in the mineral powder. 4、 Main technical parameters 5、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "NCT"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "recycling",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: NCT"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/8.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "wbc-semi-magnetic-tailings-recovery-machine",
    "name": "WBC semi magnetic tailings recovery machine",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/wbc-semi-magnetic-tailings-recovery-machine/wbc-semi-magnetic-tailings-recovery-machine-01.jpg",
    "imageGallery": [
      "/assets/products/wbc-semi-magnetic-tailings-recovery-machine/wbc-semi-magnetic-tailings-recovery-machine-01.jpg",
      "/assets/products/wbc-semi-magnetic-tailings-recovery-machine/wbc-semi-magnetic-tailings-recovery-machine-06.png",
      "/assets/products/wbc-semi-magnetic-tailings-recovery-machine/wbc-semi-magnetic-tailings-recovery-machine-02.png",
      "/assets/products/wbc-semi-magnetic-tailings-recovery-machine/wbc-semi-magnetic-tailings-recovery-machine-04.png",
      "/assets/products/wbc-semi-magnetic-tailings-recovery-machine/wbc-semi-magnetic-tailings-recovery-machine-03.png",
      "/assets/products/wbc-semi-magnetic-tailings-recovery-machine/wbc-semi-magnetic-tailings-recovery-machine-08.jpg",
      "/assets/products/wbc-semi-magnetic-tailings-recovery-machine/wbc-semi-magnetic-tailings-recovery-machine-05.png",
      "/assets/products/wbc-semi-magnetic-tailings-recovery-machine/wbc-semi-magnetic-tailings-recovery-machine-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The WBC type semi magnetic tailings recovery machine is suitable for selecting magnetic minerals. It can enrich and recover magnetic minerals in tailings slurry or remove magnetic impurities from other suspensions.",
    "keywords": [
      "WBC semi magnetic tailings recovery machine",
      "Metal industry magnetic separation equipment",
      "mineral",
      "aggregate"
    ],
    "features": [
      "The WBC type semi magnetic tailings recovery machine is suitable for selecting magnetic minerals",
      "It can enrich and recover magnetic minerals in tailings slurry or remove magnetic impurities from other suspensions"
    ],
    "principle": "product overview： 1、 Explanation The WBC type semi magnetic tailings recovery machine is suitable for selecting magnetic minerals. It can enrich and recover magnetic minerals in tailings slurry or remove magnetic impurities from other suspensions. 2、 Schematic diagram 3、 Principle The WBC type semi magnetic tailings recovery machine uses neodymium iron boron as the magnetic material, and the sorting space has a medium magnetic zone and a weak magnetic zone, alternately forming a semi-circular magnetic system. The outer part of the magnetic system is equipped with a rotatable shell, which is fixed in place. A part of the shell is immersed in the slurry and continuously adsorbs magnetic particles in the slurry through continuous rotation. The magnetic particles roll continuously with the rotation of the shell, and their internal impurities are constantly cleaned and deslimed. The upper part of the semi-circular magnetic system has no magnetic field. When the magnetic material enters the non-magnetic area, it is discharged into the concentrate tank under the action of flushing water and material gravity. The magnetic disk is a ring-shaped semi magnetic structure, and the aggregate disk (shell) is fully sealed. The lower part of the aggregate disk is immersed in the slurry tank, and magnetic particles in the slurry are continuously adsorbed through continuous rotation. The magnetic disk has a medium magnetic field zone, a weak magnetic field zone, and a non-magnetic zone. The magnetic disk absorbs material in the magnetic zone and unloads material in the non-magnetic zone. The magnetic zone adopts multiple sets of magnetic pairs with opposite polarity arranged alternately. The magnetic material continuously rolls and flushes during the rotation of the aggregate tray, resulting in higher purity and better recovery effect of the recovered magnetic material compared to ordinary tailings recovery machines. 4、 Main technical parameters 5、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "WBC"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "mineral",
      "aggregate"
    ],
    "installation": "",
    "customization": [
      "Model: WBC"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/7.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "ctn-type-specialized-magnetic-separator-for-coal-washing",
    "name": "CTN type specialized magnetic separator for coal washing",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/ctn-type-specialized-magnetic-separator-for-coal-washing/ctn-type-specialized-magnetic-separator-for-coal-washing-01.jpg",
    "imageGallery": [
      "/assets/products/ctn-type-specialized-magnetic-separator-for-coal-washing/ctn-type-specialized-magnetic-separator-for-coal-washing-01.jpg",
      "/assets/products/ctn-type-specialized-magnetic-separator-for-coal-washing/ctn-type-specialized-magnetic-separator-for-coal-washing-02.png",
      "/assets/products/ctn-type-specialized-magnetic-separator-for-coal-washing/ctn-type-specialized-magnetic-separator-for-coal-washing-06.png",
      "/assets/products/ctn-type-specialized-magnetic-separator-for-coal-washing/ctn-type-specialized-magnetic-separator-for-coal-washing-03.png",
      "/assets/products/ctn-type-specialized-magnetic-separator-for-coal-washing/ctn-type-specialized-magnetic-separator-for-coal-washing-04.png",
      "/assets/products/ctn-type-specialized-magnetic-separator-for-coal-washing/ctn-type-specialized-magnetic-separator-for-coal-washing-08.jpg",
      "/assets/products/ctn-type-specialized-magnetic-separator-for-coal-washing/ctn-type-specialized-magnetic-separator-for-coal-washing-05.png",
      "/assets/products/ctn-type-specialized-magnetic-separator-for-coal-washing/ctn-type-specialized-magnetic-separator-for-coal-washing-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The CTN type coal washing specialized magnetic separator is a fully countercurrent wet magnetic separation equipment designed specifically for the recovery of magnetic media in heavy medium coal preparation plants. Its core",
    "keywords": [
      "CTN type specialized magnetic separator for coal washing",
      "Coal industry iron removal and magnetic separation equipment",
      "coal",
      "ore",
      "mineral"
    ],
    "features": [
      "The CTN type coal washing specialized magnetic separator is a fully countercurrent wet magnetic separation equipment designed specifically for the recovery of magnetic media in heavy medium coal preparation plants",
      "Its core technology uses computer simulation to design magnetic circuits, making the magnetic field distribution in the magnetic separation zone more uniform",
      "Our unique design generates the maximum magnetic field gradient in the separation tank, and optimizes the magnetic energy to not dissipate outside the medium flow layer",
      "Design more magnetic poles and angular gradients within the scanning area to achieve faster and more accurate separation of magnetic and non-magnetic materials",
      "Belonging to industry-leading technology",
      "Special wear-resistant treatment is applied to the surface of the groove and drum, with multiple options for wear resistance, greatly extending the lifespan of the entire machine",
      "This machine can continuously feed and discharge ore, and can also be used in series with double tubes to make sorting more efficient"
    ],
    "principle": "product overview： 1、 Explanation The CTN type coal washing specialized magnetic separator is a fully countercurrent wet magnetic separation equipment designed specifically for the recovery of magnetic media in heavy medium coal preparation plants. Its core technology uses computer simulation to design magnetic circuits, making the magnetic field distribution in the magnetic separation zone more uniform. Our unique design generates the maximum magnetic field gradient in the separation tank, and optimizes the magnetic energy to not dissipate outside the medium flow layer. Design more magnetic poles and angular gradients within the scanning area to achieve faster and more accurate separation of magnetic and non-magnetic materials. Belonging to industry-leading technology. Special wear-resistant treatment is applied to the surface of the groove and drum, with multiple options for wear resistance, greatly extending the lifespan of the entire machine. This machine can continuously feed and discharge ore, and can also be used in series with double tubes to make sorting more efficient. 2、 Schematic diagram 3、 Scope of application Suitable for wet separation of magnetic minerals mixed in fine-grained non-magnetic minerals with a particle size of 3-0mm. Especially suitable for iron removal and purification operations in non-metallic minerals such as quartz sand and potassium feldspar. This machine can continuously feed and discharge ore, with high magnetic field strength and gradient, and has high processing capacity. 4、 Principle The principle is that when the slurry enters the magnetic field zone, strong magnetic minerals are adsorbed on the surface of the cylinder, weak magnetic and non-magnetic minerals are washed away by water flow, and the magnetic minerals adsorbed on the surface of the cylinder are carried out of the magnetic field zone by the rotation of the cylinder and washed into the concentrate tank with washing water to complete the sorting operation. 5、 Main technical parameters 6、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "CTN"
      }
    ],
    "applications": [
      "Coal industry iron removal and magnetic separation equipment",
      "coal",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: CTN"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-16/78.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "hmdn-coal-washing-special-magnetic-separator",
    "name": "HMDN coal washing special magnetic separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/hmdn-coal-washing-special-magnetic-separator/hmdn-coal-washing-special-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/hmdn-coal-washing-special-magnetic-separator/hmdn-coal-washing-special-magnetic-separator-01.jpg",
      "/assets/products/hmdn-coal-washing-special-magnetic-separator/hmdn-coal-washing-special-magnetic-separator-02.png",
      "/assets/products/hmdn-coal-washing-special-magnetic-separator/hmdn-coal-washing-special-magnetic-separator-03.png",
      "/assets/products/hmdn-coal-washing-special-magnetic-separator/hmdn-coal-washing-special-magnetic-separator-05.jpg",
      "/assets/products/hmdn-coal-washing-special-magnetic-separator/hmdn-coal-washing-special-magnetic-separator-04.jpg"
    ],
    "summary": "product overview： 1、 Explanation: The HMDN coal washing special magnetic separator is a fully countercurrent wet magnetic separation equipment designed specifically for the recovery of magnetic media in heavy medium coal preparation plants. Drawing on",
    "keywords": [
      "HMDN coal washing special magnetic separator",
      "Coal industry iron removal and magnetic separation equipment",
      "coal",
      "ore",
      "mineral"
    ],
    "features": [
      ": The HMDN coal washing special magnetic separator is a fully countercurrent wet magnetic separation equipment designed specifically for the recovery of magnetic media in heavy medium coal preparation plants",
      "Drawing on advanced technology and design concepts from Europe and America, and after years of use and improvement by our company, the recovery rate has been greatly improved compared to similar equipment in China",
      "The heavy medium content in the feed slurry can range from 87-260kg/m, and the heavy medium recovery rate can reach 99.7% -99.9%",
      "The tank body is made of stainless steel material, which prolongs the service life of the whole machine",
      "This machine can continuously feed and discharge ore, and can also be used in series with double tubes to make sorting more efficient"
    ],
    "principle": "product overview： 1、 Explanation: The HMDN coal washing special magnetic separator is a fully countercurrent wet magnetic separation equipment designed specifically for the recovery of magnetic media in heavy medium coal preparation plants. Drawing on advanced technology and design concepts from Europe and America, and after years of use and improvement by our company, the recovery rate has been greatly improved compared to similar equipment in China. The heavy medium content in the feed slurry can range from 87-260kg/m, and the heavy medium recovery rate can reach 99.7% -99.9%. The tank body is made of stainless steel material, which prolongs the service life of the whole machine. This machine can continuously feed and discharge ore, and can also be used in series with double tubes to make sorting more efficient. The principle is that when the slurry enters the magnetic field zone, strong magnetic minerals are adsorbed on the surface of the cylinder, weak magnetic and non-magnetic minerals are washed away by water flow, and the magnetic minerals adsorbed on the surface of the cylinder are carried out of the magnetic field zone by the rotation of the cylinder and washed into the concentrate tank with washing water to complete the sorting operation.",
    "specs": [
      {
        "label": "Model",
        "value": "HMDN"
      }
    ],
    "applications": [
      "Coal industry iron removal and magnetic separation equipment",
      "coal",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: HMDN"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-16/79.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "suspended-permanent-magnetic-separator",
    "name": "Suspended Permanent Magnetic Separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/suspended-permanent-magnetic-separator.webp",
    "imageGallery": [
      "/assets/products/suspended-permanent-magnetic-separator.webp"
    ],
    "summary": "A suspended permanent magnet for reliable tramp iron capture where manual or periodic cleaning is acceptable.",
    "keywords": [
      "Suspended Permanent Magnetic Separator",
      "Suspended Permanent Magnet",
      "Permanent Magnet Series",
      "Quarry",
      "mining",
      "coal",
      "cement and aggregate handling"
    ],
    "features": [
      "Simple suspended installation by chain, cable or threaded mounting",
      "No power required for magnetic force generation",
      "Effective for environmental protection, resource recycling and paper industry lines",
      "Available for light-duty and heavy-duty separation conditions"
    ],
    "principle": "Suspended plate magnets are installed above conveyor belts to extract tramp metal from high-volume material flow. Heavy-duty ferrite magnet assemblies can remove iron from deeper material layers, while rare-earth versions are available for finer metal particles in thinner flows.",
    "specs": [
      {
        "label": "Cleaning Type",
        "value": "Manual or periodic cleaning"
      },
      {
        "label": "Magnet Type",
        "value": "Ferrite or rare-earth permanent magnet"
      },
      {
        "label": "Mounting",
        "value": "Eye bolts, chain, cable or threaded bolts"
      },
      {
        "label": "Applications",
        "value": "Conveyor belts, recycling, paper, aggregate handling"
      }
    ],
    "applications": [
      "Quarry",
      "mining",
      "coal",
      "cement and aggregate handling",
      "Permanent Magnet Series"
    ],
    "installation": "Mounting: Eye bolts, chain, cable or threaded bolts",
    "customization": [],
    "faqs": [],
    "sourceUrls": [],
    "sourceSite": ""
  },
  {
    "slug": "suspended-electromagnetic-conveyor-belt-separator",
    "name": "Suspended Electromagnetic Conveyor Belt Separator",
    "category": "Magnetic Separation Equipment",
    "image": "/assets/products/suspended-electromagnetic-conveyor-belt-separator.webp",
    "imageGallery": [
      "/assets/products/suspended-electromagnetic-conveyor-belt-separator.webp"
    ],
    "summary": "An electromagnetic conveyor belt separator for working conditions that require adjustable and powerful magnetic force.",
    "keywords": [
      "Suspended Electromagnetic Conveyor Belt Separator",
      "Suspended Electromagnetic Separator",
      "Electromagnetic Series",
      "High-capacity conveyors",
      "mining",
      "ports",
      "coal and heavy material handling"
    ],
    "features": [
      "Deep-penetrating electromagnetic field for heavy material streams",
      "Self-cleaning belt system for continuous discharge",
      "Suitable for cross-belt and inline conveyor layouts",
      "Protects crushers, mills, shredders and downstream processing equipment"
    ],
    "principle": "This suspended electromagnetic conveyor belt separator continuously removes ferrous tramp metal from bulk materials. It generates a deep electromagnetic field for large or buried iron contaminants such as steel fragments, bolts, nails, rebars and tramp iron.",
    "specs": [
      {
        "label": "Cleaning Type",
        "value": "Self-cleaning belt discharge"
      },
      {
        "label": "Magnet Type",
        "value": "Electromagnetic coil"
      },
      {
        "label": "Typical Layout",
        "value": "Cross-belt or inline conveyor installation"
      },
      {
        "label": "Applications",
        "value": "Mining, quarry, cement, RDF, coal, recycling, power generation"
      }
    ],
    "applications": [
      "High-capacity conveyors",
      "mining",
      "ports",
      "coal and heavy material handling",
      "Electromagnetic Series"
    ],
    "installation": "",
    "customization": [],
    "faqs": [],
    "sourceUrls": [],
    "sourceSite": ""
  },
  {
    "slug": "dls-type-window-metal-detector",
    "name": "DLS type window metal detector",
    "category": "Metal Detection & Recycling Sorting",
    "image": "/assets/products/dls-type-window-metal-detector/dls-type-window-metal-detector-01.jpg",
    "imageGallery": [
      "/assets/products/dls-type-window-metal-detector/dls-type-window-metal-detector-01.jpg",
      "/assets/products/dls-type-window-metal-detector/dls-type-window-metal-detector-02.png",
      "/assets/products/dls-type-window-metal-detector/dls-type-window-metal-detector-06.png",
      "/assets/products/dls-type-window-metal-detector/dls-type-window-metal-detector-03.png",
      "/assets/products/dls-type-window-metal-detector/dls-type-window-metal-detector-04.png",
      "/assets/products/dls-type-window-metal-detector/dls-type-window-metal-detector-05.png",
      "/assets/products/dls-type-window-metal-detector/dls-type-window-metal-detector-07.jpg",
      "/assets/products/dls-type-window-metal-detector/dls-type-window-metal-detector-09.png",
      "/assets/products/dls-type-window-metal-detector/dls-type-window-metal-detector-08.jpg",
      "/assets/products/dls-type-window-metal-detector/dls-type-window-metal-detector-10.png",
      "/assets/products/dls-type-window-metal-detector/dls-type-window-metal-detector-11.png"
    ],
    "summary": "product overview： 1、 Explanation Adopting a split structure, easy to install. Product tracking function: It can automatically adjust and compensate internally based on changes in product effects.",
    "keywords": [
      "DLS type window metal detector",
      "General iron removal equipment",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "ceramic",
      "recycling",
      "wood"
    ],
    "features": [
      "Adopting a split structure, easy to install",
      "Product tracking function: It can automatically adjust and compensate internally based on changes in product effects",
      "Adopting special design schemes can effectively eliminate interference caused by electromagnetic and ground vibrations",
      "Product effect compensation function: It can automatically learn and compress product effects",
      "Communication port: RS232，RS485， Ethernet connection mode can be selected",
      "Temperature range for detecting materials: -20-80 ℃",
      "If the temperature exceeds this range, special high-temperature options can be selected",
      "2、Scope of Application The DLS window type metal detector is mainly used in industrial sites to protect downstream important equipment, such as extruders, shredders, saw blades, and blades"
    ],
    "principle": "product overview： 1、 Explanation Adopting a split structure, easy to install. Product tracking function: It can automatically adjust and compensate internally based on changes in product effects. Adopting special design schemes can effectively eliminate interference caused by electromagnetic and ground vibrations. Product effect compensation function: It can automatically learn and compress product effects. Product tracking function: It can automatically adjust and compensate internally based on changes in product effects. Communication port: RS232，RS485， Ethernet connection mode can be selected. Temperature range for detecting materials: -20-80 ℃. If the temperature exceeds this range, special high-temperature options can be selected. 2、Scope of Application The DLS window type metal detector is mainly used in industrial sites to protect downstream important equipment, such as extruders, shredders, saw blades, and blades. Mainly used in the following industries: plastic and rubber industry, recycling industry, wood processing industry, building materials industry, ceramics industry, etc. 3、 Schematic diagram 4、 Main technical parameters 4、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "DLS"
      },
      {
        "label": "Model",
        "value": "RS232"
      },
      {
        "label": "Model",
        "value": "RS485"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "ceramic",
      "recycling",
      "wood"
    ],
    "installation": "",
    "customization": [
      "Model: DLS",
      "Model: RS232",
      "Model: RS485"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/37.html",
      "https://www.cnmagnetics.com/n-15/64.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "gjt-type-window-metal-detector",
    "name": "GJT type window metal detector",
    "category": "Metal Detection & Recycling Sorting",
    "image": "/assets/products/gjt-type-window-metal-detector/gjt-type-window-metal-detector-01.jpg",
    "imageGallery": [
      "/assets/products/gjt-type-window-metal-detector/gjt-type-window-metal-detector-01.jpg",
      "/assets/products/gjt-type-window-metal-detector/gjt-type-window-metal-detector-07.jpg",
      "/assets/products/gjt-type-window-metal-detector/gjt-type-window-metal-detector-08.jpg",
      "/assets/products/gjt-type-window-metal-detector/gjt-type-window-metal-detector-02.png",
      "/assets/products/gjt-type-window-metal-detector/gjt-type-window-metal-detector-04.png",
      "/assets/products/gjt-type-window-metal-detector/gjt-type-window-metal-detector-06.jpg",
      "/assets/products/gjt-type-window-metal-detector/gjt-type-window-metal-detector-05.jpg",
      "/assets/products/gjt-type-window-metal-detector/gjt-type-window-metal-detector-03.png"
    ],
    "summary": "product overview： 1、 Explanation The GJT window type metal detector is currently an excellent product in the field of metal detection in China. In the circuit design, a new metal detection technology - digital phase shifting and related detection technology -",
    "keywords": [
      "GJT type window metal detector",
      "General iron removal equipment",
      "mining",
      "cement",
      "food",
      "ore"
    ],
    "features": [
      "The GJT window type metal detector is currently an excellent product in the field of metal detection in China",
      "It is mainly used in belt conveyors in industries such as thermal power generation, cement, papermaking, mining, forestry, environmental protection, building materials, food processing, and grain",
      "Detection range: metals such as iron, aluminum, stainless steel, alloys, etc",
      "Timer function: After the relay is closed, it will release with a delay of 1-10 seconds",
      "Control output: One pair of relay contacts is normally open, and the other pair is normally closed"
    ],
    "principle": "product overview： 1、 Explanation The GJT window type metal detector is currently an excellent product in the field of metal detection in China. In the circuit design, a new metal detection technology - digital phase shifting and related detection technology - has been adopted, which has stable performance, high detection sensitivity, and strong anti-interference ability. It is mainly used in belt conveyors in industries such as thermal power generation, cement, papermaking, mining, forestry, environmental protection, building materials, food processing, and grain. It utilizes the change signals generated when metal enters the sensor electromagnetic field, processes them through electronic technology, and drives the actuator (electromagnet, motor switch) to operate, thereby eliminating harmful metals. Features: Quantitative sensitivity debugging; High sensitivity design can detect super large metals and sound and light alarms. Detection range: metals such as iron, aluminum, stainless steel, alloys, etc. Timer function: After the relay is closed, it will release with a delay of 1-10 seconds. Control output: One pair of relay contacts is normally open, and the other pair is normally closed. Installation method: The sensor is installed on the belt frame, and the amplitude of the belt frame should be less than 0.5mm. When the amplitude exceeds 0.5mm, the sensor bracket should be installed separately. 2、 Schematic diagram 3、 Main technical parameters 4、 Product shooting",
    "specs": [
      {
        "label": "Installation method",
        "value": "The sensor is installed on the belt frame, and the amplitude of the belt frame should be less than 0.5mm. When the amplitude exceeds 0.5mm, the sensor bracket should be installed separately."
      },
      {
        "label": "Model",
        "value": "GJT"
      }
    ],
    "applications": [
      "General iron removal equipment",
      "mining",
      "cement",
      "food",
      "ore"
    ],
    "installation": "Installation method: The sensor is installed on the belt frame, and the amplitude of the belt frame should be less than 0.5mm. When the amplitude exceeds 0.5mm, the sensor bracket should be installed separately.",
    "customization": [
      "Model: GJT"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/38.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "hecp-eddy-current-metal-sorting-machine",
    "name": "HECP eddy current metal sorting machine",
    "category": "Metal Detection & Recycling Sorting",
    "image": "/assets/products/hecp-eddy-current-metal-sorting-machine/hecp-eddy-current-metal-sorting-machine-01.jpg",
    "imageGallery": [
      "/assets/products/hecp-eddy-current-metal-sorting-machine/hecp-eddy-current-metal-sorting-machine-01.jpg",
      "/assets/products/hecp-eddy-current-metal-sorting-machine/hecp-eddy-current-metal-sorting-machine-02.png",
      "/assets/products/hecp-eddy-current-metal-sorting-machine/hecp-eddy-current-metal-sorting-machine-03.png",
      "/assets/products/hecp-eddy-current-metal-sorting-machine/hecp-eddy-current-metal-sorting-machine-04.png",
      "/assets/products/hecp-eddy-current-metal-sorting-machine/hecp-eddy-current-metal-sorting-machine-06.png",
      "/assets/products/hecp-eddy-current-metal-sorting-machine/hecp-eddy-current-metal-sorting-machine-07.jpg",
      "/assets/products/hecp-eddy-current-metal-sorting-machine/hecp-eddy-current-metal-sorting-machine-05.png",
      "/assets/products/hecp-eddy-current-metal-sorting-machine/hecp-eddy-current-metal-sorting-machine-08.jpg"
    ],
    "summary": "product overview： 1、 Explanation The HECP eddy current metal sorting machine can be widely used in various environmental protection fields and material processing in the non-ferrous metal processing industry. Its typical application is significant in the",
    "keywords": [
      "HECP eddy current metal sorting machine",
      "Metal industry magnetic separation equipment",
      "recycling",
      "glass",
      "wood",
      "ore"
    ],
    "features": [
      "The HECP eddy current metal sorting machine can be widely used in various environmental protection fields and material processing in the non-ferrous metal processing industry",
      "Due to the use of adjustable eccentric magnetic pole technology, it is the choice for separating granular and powdery metals",
      "Eccentric magnetic pole technology ensures that eddy currents are concentrated in the area where materials are subjected to concentrated forces",
      "The magnetic poles can be adjusted as needed to ensure more accurate separation points and parabolic trajectories",
      "The traditional concentric magnetic pole technology causes premature eddy current action time and distance, resulting in premature starting point of particle and powder metal bouncing",
      "The parabolic trajectory of particle and powder metal is weakened under material compression, making it difficult to effectively sort",
      "In contrast, eccentric magnetic pole technology maximizes the concentration of eddy current effects at the metal and material separation points, resulting in higher metal sorting rates and higher metal purity",
      "Adopting an intelligent control system, the operation is smoother and more reliable, and the operation is simpler"
    ],
    "principle": "product overview： 1、 Explanation The HECP eddy current metal sorting machine can be widely used in various environmental protection fields and material processing in the non-ferrous metal processing industry. Its typical application is significant in the recovery of various non-ferrous metals such as copper and aluminum in the following industries: ◇ Separation of granular and powdery non-ferrous metals in white household wires; ◇ Sort granular and powdery non-ferrous metals from scrap steel slices; Separate powdered non-ferrous metals from the plastic recycling production line; ◇ Separate granular non-ferrous metals from plastic door and window recycling; ◇ Separate granular and powdery non-ferrous metals from glass shards; ◇ Separate granular and powdery non-ferrous metals from boiler bottom ash; ◇ Separate granular and powdery non-ferrous metals from wood recycling; 2、 Technical features This machine is specifically designed for lightweight and small surface area granular and powdery metals, with better sorting efficiency than the HECS type. Due to the use of adjustable eccentric magnetic pole technology, it is the choice for separating granular and powdery metals. Eccentric magnetic pole technology ensures that eddy currents are concentrated in the area where materials are subjected to concentrated forces. The magnetic poles can be adjusted as needed to ensure more accurate separation points and parabolic trajectories. The traditional concentric magnetic pole technology causes premature eddy current action time and distance, resulting in premature starting point of particle and powder metal bouncing. The parabolic trajectory of particle and powder metal is weakened under material compression, making it difficult to effectively sort. In contrast, eccentric magnetic pole technology maximizes the concentration of eddy current effects at the metal and material separation points, resulting in higher metal sorting rates and higher metal purity. Adopting an intelligent control system, the operation is smoother and more reliable, and the operation is simpler. The bearing adopts unique patented cooling technology, which ensures more stable operation and longer service life. The magnetic poles are precision machined using CNC equipment and protected by special processes, making them more energy-efficient and environmentally friendly. The speed of the magnetic",
    "specs": [
      {
        "label": "Model",
        "value": "CNC"
      },
      {
        "label": "Model",
        "value": "HECP"
      },
      {
        "label": "Model",
        "value": "HECS"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "recycling",
      "glass",
      "wood",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: CNC",
      "Model: HECP",
      "Model: HECS"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/16.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "hecs-type-eddy-current-metal-sorting-machine",
    "name": "HECS type eddy current metal sorting machine",
    "category": "Metal Detection & Recycling Sorting",
    "image": "/assets/products/hecs-type-eddy-current-metal-sorting-machine/hecs-type-eddy-current-metal-sorting-machine-01.jpg",
    "imageGallery": [
      "/assets/products/hecs-type-eddy-current-metal-sorting-machine/hecs-type-eddy-current-metal-sorting-machine-01.jpg",
      "/assets/products/hecs-type-eddy-current-metal-sorting-machine/hecs-type-eddy-current-metal-sorting-machine-02.png",
      "/assets/products/hecs-type-eddy-current-metal-sorting-machine/hecs-type-eddy-current-metal-sorting-machine-04.png",
      "/assets/products/hecs-type-eddy-current-metal-sorting-machine/hecs-type-eddy-current-metal-sorting-machine-06.png",
      "/assets/products/hecs-type-eddy-current-metal-sorting-machine/hecs-type-eddy-current-metal-sorting-machine-05.png",
      "/assets/products/hecs-type-eddy-current-metal-sorting-machine/hecs-type-eddy-current-metal-sorting-machine-07.jpg",
      "/assets/products/hecs-type-eddy-current-metal-sorting-machine/hecs-type-eddy-current-metal-sorting-machine-08.jpg",
      "/assets/products/hecs-type-eddy-current-metal-sorting-machine/hecs-type-eddy-current-metal-sorting-machine-03.png"
    ],
    "summary": "product overview： 1、 Explanation The physical basis of the HECS eddy current metal sorting machine is based on two important physical phenomena: a time-varying alternating magnetic field always accompanies an alternating electric field; A current carrying",
    "keywords": [
      "HECS type eddy current metal sorting machine",
      "Metal industry magnetic separation equipment",
      "recycling",
      "glass",
      "wood",
      "ore"
    ],
    "features": [
      "On the other hand, the mirror magnetic field caused by eddy currents in conductors, which is opposite to the induced magnetic field, generates a repulsive force on the conductor",
      "The main distinguishing criterion is the ratio of material conductivity to density, with materials with higher ratio values being easier to separate than those with lower ratio values",
      "Separate the conductor from the material",
      "It can be widely used in environmental protection fields such as waste disposal, waste electrical appliance recycling, and material processing industries in the non-ferrous metal processing industry"
    ],
    "principle": "product overview： 1、 Explanation The physical basis of the HECS eddy current metal sorting machine is based on two important physical phenomena: a time-varying alternating magnetic field always accompanies an alternating electric field; A current carrying conductor generates a magnetic field. Therefore, if a conductor is exposed to an alternating magnetic field or an alternating magnetic field formed by the rotation of a fixed magnetic field, eddy currents perpendicular to the magnetic flux of the alternating magnetic field will be generated inside the conductor. On the other hand, the mirror magnetic field caused by eddy currents in conductors, which is opposite to the induced magnetic field, generates a repulsive force on the conductor. Copper, aluminum, and other materials will leap forward along their transport direction due to the repulsive force of the magnetic field, achieving separation from other non-metallic substances and achieving the purpose of sorting. The main distinguishing criterion is the ratio of material conductivity to density, with materials with higher ratio values being easier to separate than those with lower ratio values. Separate the conductor from the material. Scope of Application The HECS eddy current metal sorting machine is mainly used to recover various non-ferrous metals such as copper and aluminum from household waste, industrial waste, electronic waste treatment, glass shards, waste plastic doors and windows, boiler bottom ash, and waste car slices. It can be widely used in environmental protection fields such as waste disposal, waste electrical appliance recycling, and material processing industries in the non-ferrous metal processing industry. Specifically, it mainly refers to the following aspects: ◇ Electronic waste disposal (refrigerator dismantling line); ◇ Separate aluminum cans from iron metal; ◇ Separate non-ferrous metals from boiler bottom ash; ◇ Sort aluminum or copper blocks from scrap car slices; ◇ Separate non-ferrous metals from glass shards; Separate non-ferrous metal impurities in some production lines (such as plastic recycling production lines); ◇ Separate non-ferrous metals from plastic door and window recycling; ◇ Separate non-ferrous metals from wood; 3、 Schematic diagram 4、 Structural composition The HECS eddy current metal sorting machine consists of two parts: the main body of the sorting machine",
    "specs": [
      {
        "label": "Model",
        "value": "HECS"
      }
    ],
    "applications": [
      "Metal industry magnetic separation equipment",
      "recycling",
      "glass",
      "wood",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: HECS"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-12/1.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "drum-magnet",
    "name": "Drum Magnet",
    "category": "Metal Detection & Recycling Sorting",
    "image": "/assets/products/drum-magnet/drum-magnet-01.jpg",
    "imageGallery": [
      "/assets/products/drum-magnet/drum-magnet-01.jpg",
      "/assets/products/drum-magnet/drum-magnet-02.jpg",
      "/assets/products/drum-magnet/drum-magnet-03.jpg",
      "/assets/products/drum-magnet/drum-magnet-04.jpg",
      "/assets/products/drum-magnet/drum-magnet-05.jpg",
      "/assets/products/drum-magnet/drum-magnet-06.jpg",
      "/assets/products/drum-magnet/drum-magnet-08.jpg",
      "/assets/products/drum-magnet/drum-magnet-07.jpg",
      "/assets/products/drum-magnet/drum-magnet-09.jpg",
      "/assets/products/drum-magnet/drum-magnet-10.jpg",
      "/assets/products/drum-magnet/drum-magnet-11.jpg",
      "/assets/products/drum-magnet/drum-magnet-12.jpg",
      "/assets/products/drum-magnet/drum-magnet-13.jpg",
      "/assets/products/drum-magnet/drum-magnet-14.jpg",
      "/assets/products/drum-magnet/drum-magnet-15.jpg",
      "/assets/products/drum-magnet/drum-magnet-16.jpg",
      "/assets/products/drum-magnet/drum-magnet-20.jpg",
      "/assets/products/drum-magnet/drum-magnet-17.jpg",
      "/assets/products/drum-magnet/drum-magnet-18.jpg",
      "/assets/products/drum-magnet/drum-magnet-19.jpg"
    ],
    "summary": "CHNMAG Drum Magnet is a separation machine designed for the continuous extraction of ferrous metal contamination from dry bulk material. Material is fed uniformly to the drum magnet from a conveyor, vibration feeder or chute, ensuring continuous metal",
    "keywords": [
      "Drum Magnet",
      "Metal Recycling",
      "mining",
      "recycling",
      "food",
      "ore",
      "mineral",
      "metal recycling"
    ],
    "features": [],
    "principle": "CHNMAG Drum Magnet is a separation machine designed for the continuous extraction of ferrous metal contamination from dry bulk material. Material is fed uniformly to the drum magnet from a conveyor, vibration feeder or chute, ensuring continuous metal contamination removal. Working Principle As the outer stainless steel shell rotates, clean product material is allowed to free fall through the one side, while powerful magnets hold ferrous contamination to the point where the magnetism ends, discharging the metal trough the other side. Site Photo Top Feeding Drum Magnet is applicable for ferrous contamination materials are small or fine size, the magnet system of drum magnet will catch the ferrous pieces for particles when the material feeding on to the drum magnet surface, then material will stick to the drum magnet surface, rotates to the area where there is no magnetic field and finish the discharging of ferrous material. Bottom Feeding Drum Magnet Separator is efficient in handling large volumes of large size material encountered in scrap processing and mineral concentration applications where there is a need to extract ferrous parts from material stream such as scrap Shredding ,slag reclamation ,tramp iron removal ,ore cobbing. Drum Magnet with Housing is a standard up feeding drum magnet with stainless steel housing to cover all the machine, all the separation action will be processed within the housing, so there will be no dust or material splash out, the up feeding inlet and bottom outs can be connect to the pipe line or chute to fit in the existing system where small ferrous materials need to be sorted out.",
    "specs": [
      {
        "label": "Model",
        "value": "CHNMAG"
      }
    ],
    "applications": [
      "Metal Recycling",
      "mining",
      "recycling",
      "food",
      "ore",
      "mineral",
      "metal recycling"
    ],
    "installation": "",
    "customization": [
      "Model: CHNMAG"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Drum-Magnet-15.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "eccentric-eddy-current-separator",
    "name": "Eccentric Eddy Current Separator",
    "category": "Metal Detection & Recycling Sorting",
    "image": "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-01.jpg",
    "imageGallery": [
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-01.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-02.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-03.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-04.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-05.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-06.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-07.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-08.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-10.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-15.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-09.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-11.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-12.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-13.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-17.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-16.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-14.jpg",
      "/assets/products/eccentric-eddy-current-separator/eccentric-eddy-current-separator-18.jpg"
    ],
    "summary": "CHNMAG Eccentric Eddy Current Separator designed to separate valuable non-ferrous metals wherever non-ferrous metals have to be recovered or separated, e.g. where shredder material, municipal waste, WTE bottom ash, electronic scrap, wood chips, glass,",
    "keywords": [
      "Eccentric Eddy Current Separator",
      "Metal Recycling",
      "mining",
      "recycling",
      "food",
      "glass",
      "wood",
      "municipal waste",
      "electronic scrap",
      "foundry sand",
      "ore",
      "metal recycling"
    ],
    "features": [],
    "principle": "products_details.css?v=1764035205000&tenantId=233649&viewType=1\" rel=\"stylesheet\" type=\"text/css\" /> chnmag@chnmag.com  Search Determine Cancel $('.diaBtn').on('click', function () { $(this).siblings('.lay').removeClass('hiden'); }); $('.p_searchBtn').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); $('.closse').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); ; Home Metal Recycling  Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Mining Industry  Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Food Industry  Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Company Blog Contacts var _li =$('.navUl').children('.navLi'); _li.each(function(i, e) { $(this).addClass('tplink'+(i+1)); } ); $('.navBtn').on('click',function(){ $(this).siblings('.tNav').toggleClass('tNavHeight'); } ); $('.navSliBtn').on('click',function(){ $('.tNav').removeClass('tNavHeight'); } ); $('.iconJt').on('click',function(){ $(this).toggleClass('iconJtRotate') .parents('.navLi').siblings('.navLi') .find('.slidBox').slideUp().end() .find('.tNavH').removeClass('tNavHBac').end() .find('.iconJt').removeClass('iconJtRotate').end().end().end() .parent('.tNavH').addClass('tNavHBac').siblings('.slidBox').slideToggle(); } ); $(\"div[id^='c_portalResnav_main']\").attr(\"loaded\",\"true\"); Home Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet Company Blog Contacts  Home Metal Recycling  Eccentric Eddy Current Separator Permanent",
    "specs": [
      {
        "label": "Model",
        "value": "ASR"
      },
      {
        "label": "Model",
        "value": "CHNMAG"
      },
      {
        "label": "Model",
        "value": "MSW"
      },
      {
        "label": "Model",
        "value": "PET"
      },
      {
        "label": "Model",
        "value": "SEW"
      },
      {
        "label": "Model",
        "value": "SKF"
      },
      {
        "label": "Model",
        "value": "WEEE"
      },
      {
        "label": "Model",
        "value": "WTE"
      },
      {
        "label": "Applications",
        "value": "Eddy Current Separator Site Photo"
      }
    ],
    "applications": [
      "Metal Recycling",
      "mining",
      "recycling",
      "food",
      "glass",
      "wood",
      "municipal waste",
      "electronic scrap",
      "foundry sand",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [
      "Model: ASR",
      "Model: CHNMAG",
      "Model: MSW",
      "Model: PET",
      "Model: SEW",
      "Model: SKF",
      "Model: WEEE",
      "Model: WTE"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Eccentric-Eddy-Current-Separator-14.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "electromagnet-separator",
    "name": "Electromagnet Separator",
    "category": "Metal Detection & Recycling Sorting",
    "image": "/assets/products/electromagnet-separator/electromagnet-separator-01.jpg",
    "imageGallery": [
      "/assets/products/electromagnet-separator/electromagnet-separator-01.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-02.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-05.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-04.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-06.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-07.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-08.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-03.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-18.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-09.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-10.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-12.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-11.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-15.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-13.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-14.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-16.jpg",
      "/assets/products/electromagnet-separator/electromagnet-separator-17.jpg"
    ],
    "summary": "CHNMAG Suspended Electromagnet Separator engineered to provide ferrous metal separation performance. If your application requires increased suspension heights for the magnet or have a deep product burden, the suspended electromagnet separator is an ideal",
    "keywords": [
      "Electromagnet Separator",
      "Metal Recycling",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "features": [],
    "principle": "CHNMAG Suspended Electromagnet Separator engineered to provide ferrous metal separation performance. If your application requires increased suspension heights for the magnet or have a deep product burden, the suspended electromagnet separator is an ideal solution magnetically lifting ferrous metals out of bulk material due to its deep reaching magnetic field. CHNMAG QJRCDD Model Self Discharge Suspended Electromagnet Separator is suspend above belt or vibratory conveyors, pull out and discharge the ferrous metal automatically from electromagnet separator magnetic filed area via the rubber discharge belt. Features of Cross Belt Electromagnet Separator 1. Deep reaching magnetic coil design to penetrate heavy product burdens 2. Strong magnetic field intensity, high gradient and strong attractive force 3. Advanced Natural Air cooling system 3. Aromatically ferrous metal discharging requires no manpower to clean 4. Electromagnet separator can effectively pull out 0.1-50kgs metals 5. Stainless steel armoured belt is optional for belt protectio How to Install A Suspended Electromagnet Separator? The Suspended Electromagnet Separator also known as Overband Electromagnet normally have two ways of installation Cross Belt Position (perpendicular to the material transport flow) and Inline Position(parallel above the material transport flow) Cross Belt Position Inline Position CHNMAG QJRCDB Model Manual Unloading Suspended Electromagnet also used for the ferrous metal removing purpose from conveyor belt system. Compare to QJRCDD model self discharge electromagnet, this model of magnet requires manually discharge the metal pieces from magnet bottom after certain operation period. This model only applicable for the ferrous contentment is not high in the material stream.",
    "specs": [
      {
        "label": "Model",
        "value": "CHNMAG"
      },
      {
        "label": "Model",
        "value": "JSON"
      },
      {
        "label": "Model",
        "value": "QJRCDB"
      },
      {
        "label": "Model",
        "value": "QJRCDD"
      },
      {
        "label": "Model",
        "value": "UA-162924846"
      },
      {
        "label": "Cross Belt Position",
        "value": "Inline Position"
      }
    ],
    "applications": [
      "Metal Recycling",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [
      "Model: CHNMAG",
      "Model: JSON",
      "Model: QJRCDB",
      "Model: QJRCDD",
      "Model: UA-162924846"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Electromagnet-Separator-29.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "magnetic-head-pulley",
    "name": "Magnetic Head Pulley",
    "category": "Metal Detection & Recycling Sorting",
    "image": "/assets/products/magnetic-head-pulley/magnetic-head-pulley-01.jpg",
    "imageGallery": [
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-01.jpg",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-03.jpg",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-04.jpg",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-02.jpg",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-05.jpg",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-06.jpg",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-07.jpg",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-09.jpg",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-10.jpg",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-08.jpg",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-12.png",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-11.jpg",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-14.jpg",
      "/assets/products/magnetic-head-pulley/magnetic-head-pulley-13.png"
    ],
    "summary": "Magnetic Head Pulley also know as magnetic roller is a reliable solution for the continuous extraction of ferrous metals from a product stream. Magnetic pulley or magnetic roller are installed as a replacement head pulley at the discharge end of a conveyor to",
    "keywords": [
      "Magnetic Head Pulley",
      "Metal Recycling",
      "mining",
      "recycling",
      "cement",
      "food",
      "ore",
      "metal recycling"
    ],
    "features": [],
    "principle": "product stream. Magnetic pulley or magnetic roller are installed as a replacement head pulley at the discharge end of a conveyor to separate the ferrous material away from other materials.\"> window.onload=function(){ // 谷歌统计 window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-162924846-5') } window.siteIsPc=true; window.foreignList= []; window.tenant = {\"cdnFlag\":\"2\",\"createTime\":null,\"domain\":\"www.chnmag.com\",\"domainInfo\":null,\"foreign\":true,\"id\":233649,\"language\":\"en\",\"mobileDomain\":\"\",\"mobileStatus\":8,\"status\":6,\"templateCode\":\"global_site_advanced\",\"tenantCode\":\"100001_2103255008\",\"unittype\":\"100001\",\"verify\":\"76abbef3d4e123bec2a172bdd904ac76\",\"mverify\":\"\"}; window.commonShortUrl = (\"http://www.ceurl.cn\" == \"\") ? \"\" : \"http://www.ceurl.cn\" + \"/\"; window.upgradeVersion=\"e4a156357c415e7bbe4f2488a327595b\"; var isxinnet = \"false\"; window.noredirectCookieName = \"_noredirect\"; var visittrack_siteId = \"100001_2103255008\"; var visittrack_url = \"\"; var gatherScripts = \"\"; var unittype=window.tenant.unittype ; window.globalObj={}; window.globalObj.isOpenSSL = false; if(!(unittype == '100009'||unittype == '100084' ||unittype == '100007' )){ window.intelligetJump={\"identification\":\"false\"};//智能跳转 } if(unittype == '100001'){ window.getMultilingual={\"website\":\"\",\"switcher\":\"off\"};//多语言和获取网站url对象 } try{ var setDomain = window.location.hostname.replace(\"http://\", \"\").replace(\"https://\", \"\"); if (setDomain.match(/[a-z]+/) != null) { var domainArr = setDomain.split(\".\"); var preDomain=domainArr[domainArr.length - 2] + \".\" + domainArr[domainArr.length - 1]; if(/(com|cn|org|net|xin|edu|ac)\\..*/.test(preDomain)){ preDomain=domainArr[domainArr.length - 3]+\".\"+domainArr[domainArr.length - 2] + \".\" + domainArr[domainArr.length - 1]; } document.domain = preDomain; } }catch(e){ console.log(e); }",
    "specs": [
      {
        "label": "Model",
        "value": "JSON"
      },
      {
        "label": "Model",
        "value": "UA-162924846"
      }
    ],
    "applications": [
      "Metal Recycling",
      "mining",
      "recycling",
      "cement",
      "food",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [
      "Model: JSON",
      "Model: UA-162924846"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Magnetic-Head-Pulley-30.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "permanent-overband-magnetic-separator",
    "name": "Permanent Overband Magnetic Separator",
    "category": "Metal Detection & Recycling Sorting",
    "image": "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-01.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-03.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-02.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-04.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-05.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-06.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-07.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-08.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-09.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-10.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-11.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-12.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-13.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-14.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-15.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-16.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-18.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-17.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-19.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-20.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-21.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-22.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-23.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-26.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-24.jpg",
      "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-25.jpg"
    ],
    "summary": "QJRCY-L Permanent Overband Magnetic Separator also known as Cross Belt Magnetic Separator or Cross Belt Magnet designed with strong and stable magnetic strength equipped with a continuously discharge running belt, is used for pulling out tramp iron from belt",
    "keywords": [
      "Permanent Overband Magnetic Separator",
      "Metal Recycling",
      "mining",
      "recycling",
      "coal",
      "food",
      "wood",
      "ore",
      "metal recycling"
    ],
    "features": [],
    "principle": "QJRCY-L Permanent Overband Magnetic Separator also known as Cross Belt Magnetic Separator or Cross Belt Magnet designed with strong and stable magnetic strength equipped with a continuously discharge running belt, is used for pulling out tramp iron from belt conveyed material stream. The advanced design and structure make Overband Magnetic Separator aka cross belt magnet ideal for use in waste recycling, shredding, mining, wood chips and demolition applications. Features of QJRCY-L Permanent Overband Magnetic Separator: • Applicable for conveyor width from 500mm to 2000mm. • Deep reaching magnetic circuit design to penetrate heavy product burdens. • Stainless steel support frame. • Special sealed bearing block ensure the stable working in harsh environment. • Easy belt deviation adjustment with screw fasten. • Magnetic force will not decrease more than 5% within 8 years. Site Photos Optional Model of Overband Magnetic Separator • QJRCY-HL Cross Belt Magnet Equipped with Hydraulic Driven Motor This model of Cross Belt Magnet install hydraulic drive motor instead of normal electric motor as the driven power source of material discharge belt. This model of cross belt magnet is widely used when these is existing hydraulic system like mobile crusher or other occasions where the electric power supply is limited. • QJRCY-KL Cross Belt Magnet with Steel Armoured Belt This model of Cross Belt Magnetic Separator use stainless steel plates to cover the surface of material discharge rubber belt which will protect the rubber belt from damaging caused by sharp or heavy metal pieces and increase the life span of rubber running belt • QJRCY-PL Overband Magnetic Separator with Protection Housing This Overband Magnet model use a stainless steel housing to cover the belt running area to prevent man injury from touching the belt by accident. •QJRCY-L-T Overband Magnet with Rare Earth Magnet System Standard Cross Belt Magnet are use Ferrite Magnet as the magnetic power system which is quite sufficient for most application, but some applications when the material burden depth and material density is high ,like coal or mining industry, these application will require high magnetic power and deeper reach out of Cross Belt Magnetic Separator to pull the iron pieces out. Will recommend to use rare earth magnet system instead of ferrite magnet system when comes to these application.",
    "specs": [
      {
        "label": "Model",
        "value": "QJRCY-HL"
      },
      {
        "label": "Model",
        "value": "QJRCY-KL"
      },
      {
        "label": "Model",
        "value": "QJRCY-L"
      },
      {
        "label": "Model",
        "value": "QJRCY-PL"
      },
      {
        "label": "Cross Belt Position",
        "value": "Inline Position"
      }
    ],
    "applications": [
      "Metal Recycling",
      "mining",
      "recycling",
      "coal",
      "food",
      "wood",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [
      "Model: QJRCY-HL",
      "Model: QJRCY-KL",
      "Model: QJRCY-L",
      "Model: QJRCY-PL"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Permanent-Overband-Magnetic-Separator-16.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "stainless-steel-separation-conveyor",
    "name": "Stainless Steel Separation Conveyor",
    "category": "Metal Detection & Recycling Sorting",
    "image": "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-01.png",
    "imageGallery": [
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-01.png",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-03.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-02.png",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-04.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-06.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-05.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-07.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-08.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-11.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-10.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-09.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-13.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-12.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-14.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-15.jpg",
      "/assets/products/stainless-steel-separation-conveyor/stainless-steel-separation-conveyor-16.jpg"
    ],
    "summary": "CHNMAG QJSS Stainless steel separation conveyor is used for sorting out stainless steel or other weak magnetic materials after the separation process of primary magnetic separation and eddy current separation.",
    "keywords": [
      "Stainless Steel Separation Conveyor",
      "Metal Recycling",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "features": [],
    "principle": "products_details.css?v=1764035205000&tenantId=233649&viewType=1\" rel=\"stylesheet\" type=\"text/css\" /> chnmag@chnmag.com  Search Determine Cancel $('.diaBtn').on('click', function () { $(this).siblings('.lay').removeClass('hiden'); }); $('.p_searchBtn').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); $('.closse').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); ; Home Metal Recycling  Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Mining Industry  Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Food Industry  Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Company Blog Contacts var _li =$('.navUl').children('.navLi'); _li.each(function(i, e) { $(this).addClass('tplink'+(i+1)); } ); $('.navBtn').on('click',function(){ $(this).siblings('.tNav').toggleClass('tNavHeight'); } ); $('.navSliBtn').on('click',function(){ $('.tNav').removeClass('tNavHeight'); } ); $('.iconJt').on('click',function(){ $(this).toggleClass('iconJtRotate') .parents('.navLi').siblings('.navLi') .find('.slidBox').slideUp().end() .find('.tNavH').removeClass('tNavHBac').end() .find('.iconJt').removeClass('iconJtRotate').end().end().end() .parent('.tNavH').addClass('tNavHBac').siblings('.slidBox').slideToggle(); } ); $(\"div[id^='c_portalResnav_main']\").attr(\"loaded\",\"true\"); Home Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet Company Blog Contacts  Home Metal Recycling  Eccentric Eddy Current Separator Permanent",
    "specs": [
      {
        "label": "Model",
        "value": "ASR"
      },
      {
        "label": "Model",
        "value": "CHNMAG"
      },
      {
        "label": "Model",
        "value": "ICW"
      },
      {
        "label": "Model",
        "value": "QJSS"
      },
      {
        "label": "Model",
        "value": "VFD"
      },
      {
        "label": "Model",
        "value": "WEEE"
      }
    ],
    "applications": [
      "Metal Recycling",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [
      "Model: ASR",
      "Model: CHNMAG",
      "Model: ICW",
      "Model: QJSS",
      "Model: VFD",
      "Model: WEEE"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Stainless-Steel-Separation-Conveyor-17.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "cbs-drawer-type-magnetic-filter",
    "name": "CBS drawer type magnetic filter",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-01.jpg",
    "imageGallery": [
      "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-01.jpg",
      "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-02.png",
      "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-07.png",
      "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-03.png",
      "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-09.jpg",
      "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-08.jpg",
      "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-04.png",
      "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-10.png",
      "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-11.png",
      "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-06.png",
      "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-05.png",
      "/assets/products/cbs-drawer-type-magnetic-filter/cbs-drawer-type-magnetic-filter-12.png"
    ],
    "summary": "product overview： 1、 Explanation CBS drawer type magnetic filters are mainly used in highly sensitive applications such as food, pharmaceuticals, chemistry, quartz sand, ceramics, etc. Its strong and wear-resistant casing is made of rust proof stainless steel.",
    "keywords": [
      "CBS drawer type magnetic filter",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "ceramic",
      "chemical",
      "food",
      "pharmaceutical",
      "recycling",
      "wood"
    ],
    "features": [
      "CBS drawer type magnetic filters are mainly used in highly sensitive applications such as food, pharmaceuticals, chemistry, quartz sand, ceramics, etc",
      "Its strong and wear-resistant casing is made of rust proof stainless steel",
      "All surfaces and welded joints are seamless and highly mirror polished",
      "Its strong magnetism can even remove ferromagnetic substances from flowing, dry, flowable, powdery, fine particles (particle diameter<6mm), and thin sheet-like materials"
    ],
    "principle": "product overview： 1、 Explanation CBS drawer type magnetic filters are mainly used in highly sensitive applications such as food, pharmaceuticals, chemistry, quartz sand, ceramics, etc. Its strong and wear-resistant casing is made of rust proof stainless steel. All surfaces and welded joints are seamless and highly mirror polished. Its strong magnetism can even remove ferromagnetic substances from flowing, dry, flowable, powdery, fine particles (particle diameter<6mm), and thin sheet-like materials. Installation position: The pipeline body for free fall and vertical material transportation is connected in series. Application industries: Food industry, chemical industry, pharmaceutical industry, plastic industry, wood industry, recycling industry, packaging industry, quartz sand iron removal, potassium feldspar iron removal, mica iron removal, micro powder iron removal, fly ash iron removal, and all 10-500 mesh fine powder materials for iron removal. Standard caliber (mm): 80, 100, 120, 150, 200, 250, 300, 350, 400, 450, 500. Customized according to customer on-site requirements. Unloading method: manual clearing. 2、 Schematic diagram 3、 Industry Applications",
    "specs": [
      {
        "label": "Installation position",
        "value": "The pipeline body for free fall and vertical material transportation is connected in series."
      },
      {
        "label": "Application industries",
        "value": "Food industry, chemical industry, pharmaceutical industry, plastic industry, wood industry, recycling industry, packaging industry, quartz sand iron removal, potassium feldspar iron removal, mica iron removal, micro powder iron removal, fly ash iron removal, and all 10-500 mesh fine powder materials for iron removal."
      },
      {
        "label": "Standard caliber (mm)",
        "value": "80, 100, 120, 150, 200, 250, 300, 350, 400, 450,"
      },
      {
        "label": "Unloading method",
        "value": "manual clearing."
      },
      {
        "label": "Model",
        "value": "CBS"
      }
    ],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "ceramic",
      "chemical",
      "food",
      "pharmaceutical",
      "recycling",
      "wood"
    ],
    "installation": "Installation position: The pipeline body for free fall and vertical material transportation is connected in series.",
    "customization": [
      "Installation position: The pipeline body for free fall and vertical material transportation is connected in series.",
      "Application industries: Food industry, chemical industry, pharmaceutical industry, plastic industry, wood industry, recycling industry, packaging industry, quartz sand iron removal, potassium feldspar iron removal, mica iron removal, micro powder iron removal, fly ash iron removal, and all 10-500 mesh fine powder materials for iron removal.",
      "Model: CBS"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/26.html",
      "https://www.cnmagnetics.com/n-15/67.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "clc-type-wet-slot-magnetic-filter",
    "name": "CLC type wet slot magnetic filter",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/clc-type-wet-slot-magnetic-filter/clc-type-wet-slot-magnetic-filter-01.jpg",
    "imageGallery": [
      "/assets/products/clc-type-wet-slot-magnetic-filter/clc-type-wet-slot-magnetic-filter-01.jpg",
      "/assets/products/clc-type-wet-slot-magnetic-filter/clc-type-wet-slot-magnetic-filter-02.png",
      "/assets/products/clc-type-wet-slot-magnetic-filter/clc-type-wet-slot-magnetic-filter-04.png",
      "/assets/products/clc-type-wet-slot-magnetic-filter/clc-type-wet-slot-magnetic-filter-03.png",
      "/assets/products/clc-type-wet-slot-magnetic-filter/clc-type-wet-slot-magnetic-filter-06.jpg",
      "/assets/products/clc-type-wet-slot-magnetic-filter/clc-type-wet-slot-magnetic-filter-05.jpg"
    ],
    "summary": "product overview： 1、 Explanation CLC slot type magnetic filter is suitable for removing iron from slotted liquids and slurries, and is used to remove ferromagnetic impurities in liquids and slurries. It is widely used in industries such as ceramics, power,",
    "keywords": [
      "CLC type wet slot magnetic filter",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "mining",
      "food",
      "pharmaceutical",
      "chemical",
      "ceramic",
      "ore"
    ],
    "features": [
      "CLC slot type magnetic filter is suitable for removing iron from slotted liquids and slurries, and is used to remove ferromagnetic impurities in liquids and slurries",
      "It is widely used in industries such as ceramics, power, mining, plastics, chemicals, rubber, pharmaceuticals, food, environmental protection, pigments, dyes, electronics, metallurgy, etc"
    ],
    "principle": "product overview： 1、 Explanation CLC slot type magnetic filter is suitable for removing iron from slotted liquids and slurries, and is used to remove ferromagnetic impurities in liquids and slurries. It is widely used in industries such as ceramics, power, mining, plastics, chemicals, rubber, pharmaceuticals, food, environmental protection, pigments, dyes, electronics, metallurgy, etc. 2、 Schematic diagram 3、 Characteristics This product uses rare earth alloy neodymium iron boron as the magnetic source, with a long service life, no energy consumption, no pollution, simple structure, easy to use, and a fully grid arranged magnetic system, which fully utilizes the strong magnetic area. The multi-layer design and layer by layer filtration make the iron removal more thorough and the effect more significant. The surface material of the slot type magnetic filter is all made of SUS304 stainless steel, and the specifications and styles can be customized according to customer requirements and on-site conditions. 4、 Principle A slot type magnetic filter is a magnetic rod made of high-quality seamless stainless steel tubes and high-performance rare earth alloy neodymium iron boron, and manufactured using a special manufacturing method. It is installed in a chute made of high-quality stainless steel to form a magnetic filter. When a liquid or slurry containing iron passes through, it is attracted by a strong magnetic rod, firmly adsorbing the iron containing substance onto the magnetic rod to achieve the purpose of iron removal and ensure the safety of the product. 5、 Remarks The tank body can be customized according to the customer's on-site requirements. The height of each magnetic rod can be adjusted in a gradient arrangement according to the thickness of the fluid, effectively ensuring that all parts of the slot are covered by the magnetic field. There are two types: open type and sealed type. The diameter and quantity of magnetic rods can be customized according to on-site requirements. The maximum magnetic induction intensity on the surface of the magnetic rod reaches 12000GS 6、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "CLC"
      },
      {
        "label": "Model",
        "value": "SUS304"
      }
    ],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "mining",
      "food",
      "pharmaceutical",
      "chemical",
      "ceramic",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: CLC",
      "Model: SUS304"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-15/70.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "ctq-type-roller-automatic-magnetic-separator",
    "name": "CTQ type roller automatic magnetic separator",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/ctq-type-roller-automatic-magnetic-separator/ctq-type-roller-automatic-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/ctq-type-roller-automatic-magnetic-separator/ctq-type-roller-automatic-magnetic-separator-01.jpg",
      "/assets/products/ctq-type-roller-automatic-magnetic-separator/ctq-type-roller-automatic-magnetic-separator-02.png",
      "/assets/products/ctq-type-roller-automatic-magnetic-separator/ctq-type-roller-automatic-magnetic-separator-06.png",
      "/assets/products/ctq-type-roller-automatic-magnetic-separator/ctq-type-roller-automatic-magnetic-separator-04.png",
      "/assets/products/ctq-type-roller-automatic-magnetic-separator/ctq-type-roller-automatic-magnetic-separator-03.png",
      "/assets/products/ctq-type-roller-automatic-magnetic-separator/ctq-type-roller-automatic-magnetic-separator-07.jpg",
      "/assets/products/ctq-type-roller-automatic-magnetic-separator/ctq-type-roller-automatic-magnetic-separator-09.png",
      "/assets/products/ctq-type-roller-automatic-magnetic-separator/ctq-type-roller-automatic-magnetic-separator-08.jpg",
      "/assets/products/ctq-type-roller-automatic-magnetic-separator/ctq-type-roller-automatic-magnetic-separator-10.png",
      "/assets/products/ctq-type-roller-automatic-magnetic-separator/ctq-type-roller-automatic-magnetic-separator-05.png",
      "/assets/products/ctq-type-roller-automatic-magnetic-separator/ctq-type-roller-automatic-magnetic-separator-11.png"
    ],
    "summary": "product overview： 1、 Explanation Adopting a new type of special rare earth permanent magnet material, it has ultra-high magnetic field strength and high magnetic field gradient. The number of magnetic rollers can be customized to 1-10 according to customer",
    "keywords": [
      "CTQ type roller automatic magnetic separator",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "mineral",
      "ore"
    ],
    "features": [
      "Adopting a new type of special rare earth permanent magnet material, it has ultra-high magnetic field strength and high magnetic field gradient",
      "The number of magnetic rollers can be customized to 1-10 according to customer requirements",
      "◇ High strength ultra-thin conveyor and sorting tape",
      "The magnetic roller is protected by the conveyor belt, with no wear and is not easily demagnetized",
      "Independently design the feeding system to make the feeding more uniform, and control the feeding timing and quantity at any time",
      "A simple and practical self weight flat tape tensioning and correction mechanical device",
      "◇ No air gap, no material blockage, the maximum selected material degree can reach 50mm, and the sorting efficiency is high"
    ],
    "principle": "product overview： 1、 Explanation Adopting a new type of special rare earth permanent magnet material, it has ultra-high magnetic field strength and high magnetic field gradient. The number of magnetic rollers can be customized to 1-10 according to customer requirements. ◇ High strength ultra-thin conveyor and sorting tape. The magnetic roller is protected by the conveyor belt, with no wear and is not easily demagnetized. Independently design the feeding system to make the feeding more uniform, and control the feeding timing and quantity at any time. A simple and practical self weight flat tape tensioning and correction mechanical device. ◇ Adopting a new axial series pole repulsive magnetic structure, the magnetic induction intensity on the surface of the magnetic roller is 3-4 times higher than that of the electromagnetic strong magnetic machine in terms of magnetic field gradient. ◇ No air gap, no material blockage, the maximum selected material degree can reach 50mm, and the sorting efficiency is high. Low installation, maintenance, and production operation costs, easy to operate. 2、 Schematic diagram 三、应用范围 Mainly used for tailings disposal or selective purification of fine-grained weakly magnetic minerals (such as pyrite, manganese ore, etc.); Refining and processing of non-metallic mineral raw materials and products (such as rhodochrosite, sillimanite, kyanite, garnet, feldspar, quartz, rutile, zircon, corundum, diamond, etc.); Remove weak magnetic harmful impurities from various abrasive products, catalysts, and other materials. 4、 Main technical parameters 5、 Product shooting",
    "specs": [],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "mineral",
      "ore"
    ],
    "installation": "",
    "customization": [],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/29.html",
      "https://www.cnmagnetics.com/n-15/75.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "cyg-wet-pipeline-magnetic-filter",
    "name": "CYG wet pipeline magnetic filter",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/cyg-wet-pipeline-magnetic-filter/cyg-wet-pipeline-magnetic-filter-01.jpg",
    "imageGallery": [
      "/assets/products/cyg-wet-pipeline-magnetic-filter/cyg-wet-pipeline-magnetic-filter-01.jpg",
      "/assets/products/cyg-wet-pipeline-magnetic-filter/cyg-wet-pipeline-magnetic-filter-02.png",
      "/assets/products/cyg-wet-pipeline-magnetic-filter/cyg-wet-pipeline-magnetic-filter-03.png",
      "/assets/products/cyg-wet-pipeline-magnetic-filter/cyg-wet-pipeline-magnetic-filter-07.png",
      "/assets/products/cyg-wet-pipeline-magnetic-filter/cyg-wet-pipeline-magnetic-filter-06.png",
      "/assets/products/cyg-wet-pipeline-magnetic-filter/cyg-wet-pipeline-magnetic-filter-08.jpg",
      "/assets/products/cyg-wet-pipeline-magnetic-filter/cyg-wet-pipeline-magnetic-filter-05.png",
      "/assets/products/cyg-wet-pipeline-magnetic-filter/cyg-wet-pipeline-magnetic-filter-04.png",
      "/assets/products/cyg-wet-pipeline-magnetic-filter/cyg-wet-pipeline-magnetic-filter-09.jpg"
    ],
    "summary": "product overview： 1、 Explanation The CYG wet pipeline magnetic filter is suitable for removing small ferromagnetic metal particles from various liquid and paste products. The powerful magnetism can even remove low magnetic iron impurities from the product",
    "keywords": [
      "CYG wet pipeline magnetic filter",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "ceramic",
      "chemical",
      "food",
      "ore",
      "pharmaceutical"
    ],
    "features": [
      "Quick interface connection"
    ],
    "principle": "product overview： 1、 Explanation The CYG wet pipeline magnetic filter is suitable for removing small ferromagnetic metal particles from various liquid and paste products. The powerful magnetism can even remove low magnetic iron impurities from the product stream, ensuring fast and effective separation. 2、 Schematic diagram 3、 Scope of adaptation The CYG wet pipeline magnetic filter is widely suitable for industries such as food, plastics, chemicals, rubber, pharmaceuticals, ceramics, environmental protection, pigments, fuels, etc. 4、 Working principle The CYG wet pipeline magnetic filter is a magnetic rod made of high-quality seamless stainless steel pipes and rare earth alloy neodymium iron boron, and made by a special manufacturing method. It is installed in a body composed of high-quality seamless stainless steel pipes and installed in the production line conveying pipeline or discharge port with flanges. When the iron containing liquid or slurry passes through, it is attracted by the magnetic rod and firmly adsorbed on the pipe wall to ensure the integrity of the equipment and the safety of the product. 5、 Characteristics This product uses rare earth alloy neodymium iron boron as the magnetic source, with a long service life, no energy consumption, no pollution, simple structure, easy to use, and a fully grid arranged magnetic system, which fully utilizes the strong magnetic area. The multi-layer design and layer by layer filtration make the iron removal more thorough and the effect more significant. Surface material: SUS304 stainless steel. There are two types of interface methods: 1. flange connection; 2. Quick interface connection. Installation method: Connect horizontally or vertically with the material pipeline. Standard caliber (mm): 50, 80, 100, 120, 150, 200, 250, 300, 350, 400, 450, 500. Customized according to customer on-site requirements. Unloading method: manual clearing. 6、 Industry Applications",
    "specs": [
      {
        "label": "Installation method",
        "value": "Connect horizontally or vertically with the material pipeline."
      },
      {
        "label": "Standard caliber (mm)",
        "value": "50, 80, 100, 120, 150, 200, 250, 300, 350, 400, 450,"
      },
      {
        "label": "Unloading method",
        "value": "manual clearing."
      },
      {
        "label": "Material",
        "value": "SUS304 stainless steel. There are two types of interface methods"
      },
      {
        "label": "Model",
        "value": "CYG"
      },
      {
        "label": "Model",
        "value": "SUS304"
      }
    ],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "Non metallic industry magnetic separation equipment",
      "ceramic",
      "chemical",
      "food",
      "ore",
      "pharmaceutical"
    ],
    "installation": "Installation method: Connect horizontally or vertically with the material pipeline.",
    "customization": [
      "Installation method: Connect horizontally or vertically with the material pipeline.",
      "Material: SUS304 stainless steel. There are two types of interface methods",
      "Model: CYG",
      "Model: SUS304"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/27.html",
      "https://www.cnmagnetics.com/n-15/71.html"
    ],
    "sourceSite": "merged"
  },
  {
    "slug": "rcyz-type-pipeline-magnetic-filter",
    "name": "RCYZ type pipeline magnetic filter",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/rcyz-type-pipeline-magnetic-filter/rcyz-type-pipeline-magnetic-filter-01.jpg",
    "imageGallery": [
      "/assets/products/rcyz-type-pipeline-magnetic-filter/rcyz-type-pipeline-magnetic-filter-01.jpg",
      "/assets/products/rcyz-type-pipeline-magnetic-filter/rcyz-type-pipeline-magnetic-filter-02.png",
      "/assets/products/rcyz-type-pipeline-magnetic-filter/rcyz-type-pipeline-magnetic-filter-06.png",
      "/assets/products/rcyz-type-pipeline-magnetic-filter/rcyz-type-pipeline-magnetic-filter-03.png",
      "/assets/products/rcyz-type-pipeline-magnetic-filter/rcyz-type-pipeline-magnetic-filter-04.png",
      "/assets/products/rcyz-type-pipeline-magnetic-filter/rcyz-type-pipeline-magnetic-filter-08.jpg",
      "/assets/products/rcyz-type-pipeline-magnetic-filter/rcyz-type-pipeline-magnetic-filter-05.png",
      "/assets/products/rcyz-type-pipeline-magnetic-filter/rcyz-type-pipeline-magnetic-filter-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The RCYZ vertical pipeline permanent magnet iron remover is an energy-saving device that uses permanent magnet materials to generate a strong magnetic field attraction. The interior is composed of a ring-shaped magnetic system",
    "keywords": [
      "RCYZ type pipeline magnetic filter",
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "cement",
      "food",
      "chemical",
      "ceramic"
    ],
    "features": [
      "The RCYZ vertical pipeline permanent magnet iron remover is an energy-saving device that uses permanent magnet materials to generate a strong magnetic field attraction",
      "The interior is composed of a ring-shaped magnetic system made of neodymium iron boron material, with a conical shape, reasonable structure, and high magnetic field strength"
    ],
    "principle": "product overview： 1、 Explanation The RCYZ vertical pipeline permanent magnet iron remover is an energy-saving device that uses permanent magnet materials to generate a strong magnetic field attraction. The interior is composed of a ring-shaped magnetic system made of neodymium iron boron material, with a conical shape, reasonable structure, and high magnetic field strength. Can be connected to solid-state raw material conveying equipment, with a movable door buckle for easy removal of iron, suitable for removing iron from various solid small particles and powder materials in industries such as food, flour, ceramics, chemicals, cement, building materials, quartz sand, etc. 2、 Schematic diagram 3、 Main technical parameters 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "RCYZ"
      }
    ],
    "applications": [
      "Metal detection and separation equipment for the food, pharmaceutical, and chemical industries",
      "cement",
      "food",
      "chemical",
      "ceramic"
    ],
    "installation": "",
    "customization": [
      "Model: RCYZ"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-15/69.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "clc-type-slot-magnetic-filter",
    "name": "CLC type slot magnetic filter",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/clc-type-slot-magnetic-filter/clc-type-slot-magnetic-filter-01.jpg",
    "imageGallery": [
      "/assets/products/clc-type-slot-magnetic-filter/clc-type-slot-magnetic-filter-01.jpg",
      "/assets/products/clc-type-slot-magnetic-filter/clc-type-slot-magnetic-filter-02.png",
      "/assets/products/clc-type-slot-magnetic-filter/clc-type-slot-magnetic-filter-03.png",
      "/assets/products/clc-type-slot-magnetic-filter/clc-type-slot-magnetic-filter-05.png",
      "/assets/products/clc-type-slot-magnetic-filter/clc-type-slot-magnetic-filter-04.png",
      "/assets/products/clc-type-slot-magnetic-filter/clc-type-slot-magnetic-filter-07.jpg",
      "/assets/products/clc-type-slot-magnetic-filter/clc-type-slot-magnetic-filter-06.jpg"
    ],
    "summary": "product overview： 1、 Explanation CLC slot type magnetic filter is suitable for removing iron from slotted liquids and slurries, and is used to remove ferromagnetic impurities in liquids and slurries. It is widely used in industries such as ceramics, power,",
    "keywords": [
      "CLC type slot magnetic filter",
      "Non metallic industry magnetic separation equipment",
      "mining",
      "food",
      "pharmaceutical",
      "chemical",
      "ceramic",
      "ore"
    ],
    "features": [
      "CLC slot type magnetic filter is suitable for removing iron from slotted liquids and slurries, and is used to remove ferromagnetic impurities in liquids and slurries",
      "It is widely used in industries such as ceramics, power, mining, plastics, chemicals, rubber, pharmaceuticals, food, environmental protection, pigments, dyes, electronics, metallurgy, etc"
    ],
    "principle": "product overview： 1、 Explanation CLC slot type magnetic filter is suitable for removing iron from slotted liquids and slurries, and is used to remove ferromagnetic impurities in liquids and slurries. It is widely used in industries such as ceramics, power, mining, plastics, chemicals, rubber, pharmaceuticals, food, environmental protection, pigments, dyes, electronics, metallurgy, etc. 2、 Schematic diagram 3、 Characteristics This product uses rare earth alloy neodymium iron boron as the magnetic source, with a long service life, no energy consumption, no pollution, simple structure, easy to use, and a fully grid arranged magnetic system, which fully utilizes the strong magnetic area. The multi-layer design and layer by layer filtration make the iron removal more thorough and the effect more significant. The surface material of the slot type magnetic filter is all made of SUS304 stainless steel, and the specifications and styles can be customized according to customer requirements and on-site conditions. 4、 Principle A slot type magnetic filter is a magnetic rod made of high-quality seamless stainless steel tubes and high-performance rare earth alloy neodymium iron boron, and manufactured using a special manufacturing method. It is installed in a chute made of high-quality stainless steel to form a magnetic filter. When a liquid or slurry containing iron passes through, it is attracted by a strong magnetic rod, firmly adsorbing the iron containing substance onto the magnetic rod to achieve the purpose of iron removal and ensure the safety of the product. 5、 Remarks The tank body can be customized according to the customer's on-site requirements. The height of each magnetic rod can be adjusted in a gradient arrangement according to the thickness of the fluid, effectively ensuring that all parts of the slot are covered by the magnetic field. There are two types: open type and sealed type. The diameter and quantity of magnetic rods can be customized according to on-site requirements. The maximum magnetic induction intensity on the surface of the magnetic rod reaches 12000GS 6、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "CLC"
      },
      {
        "label": "Model",
        "value": "SUS304"
      }
    ],
    "applications": [
      "Non metallic industry magnetic separation equipment",
      "mining",
      "food",
      "pharmaceutical",
      "chemical",
      "ceramic",
      "ore"
    ],
    "installation": "",
    "customization": [
      "Model: CLC",
      "Model: SUS304"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/32.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "dhd-type-roller-type-automatic-magnetic-separator",
    "name": "DHD type roller type automatic magnetic separator",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/dhd-type-roller-type-automatic-magnetic-separator/dhd-type-roller-type-automatic-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/dhd-type-roller-type-automatic-magnetic-separator/dhd-type-roller-type-automatic-magnetic-separator-01.jpg",
      "/assets/products/dhd-type-roller-type-automatic-magnetic-separator/dhd-type-roller-type-automatic-magnetic-separator-04.png",
      "/assets/products/dhd-type-roller-type-automatic-magnetic-separator/dhd-type-roller-type-automatic-magnetic-separator-06.png",
      "/assets/products/dhd-type-roller-type-automatic-magnetic-separator/dhd-type-roller-type-automatic-magnetic-separator-02.png",
      "/assets/products/dhd-type-roller-type-automatic-magnetic-separator/dhd-type-roller-type-automatic-magnetic-separator-08.jpg",
      "/assets/products/dhd-type-roller-type-automatic-magnetic-separator/dhd-type-roller-type-automatic-magnetic-separator-03.png",
      "/assets/products/dhd-type-roller-type-automatic-magnetic-separator/dhd-type-roller-type-automatic-magnetic-separator-07.jpg",
      "/assets/products/dhd-type-roller-type-automatic-magnetic-separator/dhd-type-roller-type-automatic-magnetic-separator-05.png"
    ],
    "summary": "product overview： 1、 Explanation The magnetic system of the DHD type roller type automatic magnetic separator has been specially designed and belongs to the permanent magnet local semi closed magnetic system structure; The magnetic induction intensity is high",
    "keywords": [
      "DHD type roller type automatic magnetic separator",
      "Non metallic industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "features": [
      "The magnetic minerals are adsorbed on the surface of the magnetic roller and rotate to reach the concentrate area",
      "The brush removes the magnetic minerals adsorbed on the surface of the magnetic roller",
      "This machine has excellent sorting effect on small and medium-sized granular ores with low but uniform powder ore rate, high production efficiency, and simple and convenient operation",
      "Suitable for the purification and removal of magnetic substances from fine-grained non-magnetic ores such as silica powder, quartz, zircon, and feldspar"
    ],
    "principle": "product overview： 1、 Explanation The magnetic system of the DHD type roller type automatic magnetic separator has been specially designed and belongs to the permanent magnet local semi closed magnetic system structure; The magnetic induction intensity is high and can be adjusted within the range of 13000GS to 20000GS. After uniformly delivering the material to the magnetic separation area, the separation is achieved by utilizing the magnetic differences of the material to have different motion trajectories under the action of gravity and magnetic field force in the magnetic separation area of the equipment. The magnetic minerals are adsorbed on the surface of the magnetic roller and rotate to reach the concentrate area. The brush removes the magnetic minerals adsorbed on the surface of the magnetic roller. This machine has excellent sorting effect on small and medium-sized granular ores with low but uniform powder ore rate, high production efficiency, and simple and convenient operation. Suitable for the purification and removal of magnetic substances from fine-grained non-magnetic ores such as silica powder, quartz, zircon, and feldspar. 2、 Schematic diagram 3、 Main technical parameters 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "DHD"
      }
    ],
    "applications": [
      "Non metallic industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: DHD"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/33.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "dhj-type-strong-roller-automatic-magnetic-separator",
    "name": "DHJ type strong roller automatic magnetic separator",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/dhj-type-strong-roller-automatic-magnetic-separator/dhj-type-strong-roller-automatic-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/dhj-type-strong-roller-automatic-magnetic-separator/dhj-type-strong-roller-automatic-magnetic-separator-01.jpg",
      "/assets/products/dhj-type-strong-roller-automatic-magnetic-separator/dhj-type-strong-roller-automatic-magnetic-separator-02.png",
      "/assets/products/dhj-type-strong-roller-automatic-magnetic-separator/dhj-type-strong-roller-automatic-magnetic-separator-03.png",
      "/assets/products/dhj-type-strong-roller-automatic-magnetic-separator/dhj-type-strong-roller-automatic-magnetic-separator-06.png",
      "/assets/products/dhj-type-strong-roller-automatic-magnetic-separator/dhj-type-strong-roller-automatic-magnetic-separator-04.png",
      "/assets/products/dhj-type-strong-roller-automatic-magnetic-separator/dhj-type-strong-roller-automatic-magnetic-separator-08.jpg",
      "/assets/products/dhj-type-strong-roller-automatic-magnetic-separator/dhj-type-strong-roller-automatic-magnetic-separator-05.png",
      "/assets/products/dhj-type-strong-roller-automatic-magnetic-separator/dhj-type-strong-roller-automatic-magnetic-separator-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation The DHJ type strong roller automatic magnetic separator is a new type of dry sorting equipment independently developed by our company based on years of market experience. 1-10 layer structures can be produced according to",
    "keywords": [
      "DHJ type strong roller automatic magnetic separator",
      "Non metallic industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "features": [
      "The DHJ type strong roller automatic magnetic separator is a new type of dry sorting equipment independently developed by our company based on years of market experience",
      "1-10 layer structures can be produced according to demand to achieve multiple sorting of materials",
      "And it can be evenly sent to the magnetic separation area",
      "Under the action of gravity and magnetic field force in the magnetic separation area of the equipment, the separation is achieved by using the magnetic differences of the materials to have different motion trajectories",
      "The magnetic minerals are adsorbed on the surface of the magnetic roller and rotate to reach the concentrate area",
      "The brush will remove the magnetic minerals adsorbed on the surface of the magnetic roller",
      "This machine has excellent sorting effect on small and medium-sized granular ores with low but uniform powder ore rate, high production efficiency, and simple and convenient operation"
    ],
    "principle": "product overview： 1、 Explanation The DHJ type strong roller automatic magnetic separator is a new type of dry sorting equipment independently developed by our company based on years of market experience. 1-10 layer structures can be produced according to demand to achieve multiple sorting of materials. The operating principle is that the material falls into the uniform feeding device through the silo, and before entering the magnetic separation zone, the material and magnetic substances are vibrated by gravity and vibration through the feeding device, so that the adhered or wrapped magnetic substances are basically dispersed. And it can be evenly sent to the magnetic separation area. Under the action of gravity and magnetic field force in the magnetic separation area of the equipment, the separation is achieved by using the magnetic differences of the materials to have different motion trajectories. The magnetic minerals are adsorbed on the surface of the magnetic roller and rotate to reach the concentrate area. The brush will remove the magnetic minerals adsorbed on the surface of the magnetic roller. This machine has excellent sorting effect on small and medium-sized granular ores with low but uniform powder ore rate, high production efficiency, and simple and convenient operation. Especially for dry magnetic separation of manganese ore, hematite, pseudohematite, specularite, siderite, manganese ore, chromite goethite, limonite, siderite, chromite, niobium tantalum iron ore, titanium cerium iron ore, scheelite, itabirite, apatite, yttrium phosphate, olivine, sulfur copper germanium ore, iron white stone, biotite, epidote, serpentine, primary ilmenite, coastal sand ore, primary hematite, scheelite and most rock forming minerals - quartz, feldspar, calcite, biotite, amphibole, olivine, tourmaline, pyroxene, etc., it has significant effects. 2、 Schematic diagram 3、 Main technical parameters 4、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "DHJ"
      }
    ],
    "applications": [
      "Non metallic industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: DHJ"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/30.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "qcg-wet-roller-magnetic-separator",
    "name": "QCG wet roller magnetic separator",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/qcg-wet-roller-magnetic-separator/qcg-wet-roller-magnetic-separator-01.jpg",
    "imageGallery": [
      "/assets/products/qcg-wet-roller-magnetic-separator/qcg-wet-roller-magnetic-separator-01.jpg",
      "/assets/products/qcg-wet-roller-magnetic-separator/qcg-wet-roller-magnetic-separator-04.png",
      "/assets/products/qcg-wet-roller-magnetic-separator/qcg-wet-roller-magnetic-separator-02.png",
      "/assets/products/qcg-wet-roller-magnetic-separator/qcg-wet-roller-magnetic-separator-09.jpg",
      "/assets/products/qcg-wet-roller-magnetic-separator/qcg-wet-roller-magnetic-separator-07.png",
      "/assets/products/qcg-wet-roller-magnetic-separator/qcg-wet-roller-magnetic-separator-03.png",
      "/assets/products/qcg-wet-roller-magnetic-separator/qcg-wet-roller-magnetic-separator-05.png",
      "/assets/products/qcg-wet-roller-magnetic-separator/qcg-wet-roller-magnetic-separator-08.jpg",
      "/assets/products/qcg-wet-roller-magnetic-separator/qcg-wet-roller-magnetic-separator-06.png"
    ],
    "summary": "product overview： 1、 Explanation The QCG wet roller magnetic separator is a combination model developed by our company based on years of experience and customer on-site requirements. It can achieve multiple structures or combinations of different magnetic",
    "keywords": [
      "QCG wet roller magnetic separator",
      "Non metallic industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "features": [
      "The QCG wet roller magnetic separator is a combination model developed by our company based on years of experience and customer on-site requirements",
      "It can achieve multiple structures or combinations of different magnetic field strengths",
      "The principle is that the material enters the magnetic field area through the material bin and the guide plate",
      "The magnetic minerals are adsorbed on the surface of the magnetic roller and rotate to reach the concentrate area",
      "The brush removes the magnetic minerals adsorbed on the surface of the magnetic roller and drops them into the concentrate hopper under the spray of high-pressure water",
      "Some of the unadsorbed magnetic particles, non-magnetic particles, and weakly magnetic particles enter the next stage for further selection"
    ],
    "principle": "product overview： 1、 Explanation The QCG wet roller magnetic separator is a combination model developed by our company based on years of experience and customer on-site requirements. It can achieve multiple structures or combinations of different magnetic field strengths. The principle is that the material enters the magnetic field area through the material bin and the guide plate. The magnetic minerals are adsorbed on the surface of the magnetic roller and rotate to reach the concentrate area. The brush removes the magnetic minerals adsorbed on the surface of the magnetic roller and drops them into the concentrate hopper under the spray of high-pressure water. Some of the unadsorbed magnetic particles, non-magnetic particles, and weakly magnetic particles enter the next stage for further selection. At most, a combination of 10 rollers can be achieved, which can separate the material up to 10 times, especially for strong magnetic, medium magnetic, and weakly magnetic coexisting minerals with significant sorting effects. 2、 Schematic diagram 3、 Scope of application Mainly used for coarse selection, scanning selection, and fine selection of fine-grained weakly magnetic ores. It can effectively remove iron from manganese ore, hematite, pseudohematite, specularite, siderite, manganese ore, chromite goethite, limonite, siderite, chromite, niobium tantalum iron ore, titanium cerium iron ore, scheelite, itabirite, apatite, yttrium phosphate, olivine, chalcopyrite germanium ore, iron white stone, biotite, epidote, serpentine, primary ilmenite, coastal sand ore, primary rutile, scheelite, and non-metallic minerals. 4、 Main technical parameters 5、 Industry Applications",
    "specs": [
      {
        "label": "Model",
        "value": "QCG"
      }
    ],
    "applications": [
      "Non metallic industry magnetic separation equipment",
      "ore",
      "mineral"
    ],
    "installation": "",
    "customization": [
      "Model: QCG"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-13/21.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "drawer-magnet",
    "name": "Drawer Magnet",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/drawer-magnet/drawer-magnet-01.png",
    "imageGallery": [
      "/assets/products/drawer-magnet/drawer-magnet-01.png",
      "/assets/products/drawer-magnet/drawer-magnet-02.jpg",
      "/assets/products/drawer-magnet/drawer-magnet-04.jpg",
      "/assets/products/drawer-magnet/drawer-magnet-03.jpg",
      "/assets/products/drawer-magnet/drawer-magnet-05.jpg",
      "/assets/products/drawer-magnet/drawer-magnet-06.jpg",
      "/assets/products/drawer-magnet/drawer-magnet-07.jpg",
      "/assets/products/drawer-magnet/drawer-magnet-08.png"
    ],
    "summary": "Drawer magnets are designed for efficient fine iron and ferromagnetic contamination removing from a range of dry free flowing powder,scrap.granule product such as sugar, grain, tea, etc. They are widely used in field of ceramics, chemicals,",
    "keywords": [
      "Drawer Magnet",
      "Food Industry",
      "mining",
      "recycling",
      "food",
      "chemical",
      "ceramic",
      "ore",
      "metal recycling"
    ],
    "features": [],
    "principle": "product such as sugar, grain, tea, etc. They are widely used in field of ceramics, chemicals, pharmacyfood,plastic,rubber,dyestuff,mining,environmental protection,etc.\"> window.onload=function(){ // 谷歌统计 window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-162924846-5') } window.siteIsPc=true; window.foreignList= []; window.tenant = {\"cdnFlag\":\"2\",\"createTime\":null,\"domain\":\"www.chnmag.com\",\"domainInfo\":null,\"foreign\":true,\"id\":233649,\"language\":\"en\",\"mobileDomain\":\"\",\"mobileStatus\":8,\"status\":6,\"templateCode\":\"global_site_advanced\",\"tenantCode\":\"100001_2103255008\",\"unittype\":\"100001\",\"verify\":\"76abbef3d4e123bec2a172bdd904ac76\",\"mverify\":\"\"}; window.commonShortUrl = (\"http://www.ceurl.cn\" == \"\") ? \"\" : \"http://www.ceurl.cn\" + \"/\"; window.upgradeVersion=\"e4a156357c415e7bbe4f2488a327595b\"; var isxinnet = \"false\"; window.noredirectCookieName = \"_noredirect\"; var visittrack_siteId = \"100001_2103255008\"; var visittrack_url = \"\"; var gatherScripts = \"\"; var unittype=window.tenant.unittype ; window.globalObj={}; window.globalObj.isOpenSSL = false; if(!(unittype == '100009'||unittype == '100084' ||unittype == '100007' )){ window.intelligetJump={\"identification\":\"false\"};//智能跳转 } if(unittype == '100001'){ window.getMultilingual={\"website\":\"\",\"switcher\":\"off\"};//多语言和获取网站url对象 } try{ var setDomain = window.location.hostname.replace(\"http://\", \"\").replace(\"https://\", \"\"); if (setDomain.match(/[a-z]+/) != null) { var domainArr = setDomain.split(\".\"); var preDomain=domainArr[domainArr.length - 2] + \".\" + domainArr[domainArr.length - 1]; if(/(com|cn|org|net|xin|edu|ac)\\..*/.test(preDomain)){ preDomain=domainArr[domainArr.length - 3]+\".\"+domainArr[domainArr.length - 2] + \".\" + domainArr[domainArr.length - 1]; } document.domain = preDomain; } }catch(e){ console.log(e); }",
    "specs": [
      {
        "label": "Model",
        "value": "JSON"
      },
      {
        "label": "Model",
        "value": "SS304"
      },
      {
        "label": "Model",
        "value": "SS316"
      },
      {
        "label": "Model",
        "value": "UA-162924846"
      }
    ],
    "applications": [
      "Food Industry",
      "mining",
      "recycling",
      "food",
      "chemical",
      "ceramic",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [
      "Model: JSON",
      "Model: SS304",
      "Model: SS316",
      "Model: UA-162924846"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Drawer-Magnet-18.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "hump-magnet",
    "name": "Hump Magnet",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/hump-magnet/hump-magnet-01.png",
    "imageGallery": [
      "/assets/products/hump-magnet/hump-magnet-01.png",
      "/assets/products/hump-magnet/hump-magnet-02.jpg",
      "/assets/products/hump-magnet/hump-magnet-03.jpg",
      "/assets/products/hump-magnet/hump-magnet-04.jpg",
      "/assets/products/hump-magnet/hump-magnet-05.jpg",
      "/assets/products/hump-magnet/hump-magnet-06.jpg",
      "/assets/products/hump-magnet/hump-magnet-08.png",
      "/assets/products/hump-magnet/hump-magnet-07.jpg"
    ],
    "summary": "Hump Magnets are used to remove large pieces of tramp iron as well as ferrous fragments from gravity-flow materials or material flow activated by wind in enclosed flow lines before they reach storage bins or processing equipment. They can be mounted in",
    "keywords": [
      "Hump Magnet",
      "Food Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "features": [],
    "principle": "products_details.css?v=1764035205000&tenantId=233649&viewType=1\" rel=\"stylesheet\" type=\"text/css\" /> chnmag@chnmag.com  Search Determine Cancel $('.diaBtn').on('click', function () { $(this).siblings('.lay').removeClass('hiden'); }); $('.p_searchBtn').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); $('.closse').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); ; Home Metal Recycling  Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Mining Industry  Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Food Industry  Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Company Blog Contacts var _li =$('.navUl').children('.navLi'); _li.each(function(i, e) { $(this).addClass('tplink'+(i+1)); } ); $('.navBtn').on('click',function(){ $(this).siblings('.tNav').toggleClass('tNavHeight'); } ); $('.navSliBtn').on('click',function(){ $('.tNav').removeClass('tNavHeight'); } ); $('.iconJt').on('click',function(){ $(this).toggleClass('iconJtRotate') .parents('.navLi').siblings('.navLi') .find('.slidBox').slideUp().end() .find('.tNavH').removeClass('tNavHBac').end() .find('.iconJt').removeClass('iconJtRotate').end().end().end() .parent('.tNavH').addClass('tNavHBac').siblings('.slidBox').slideToggle(); } ); $(\"div[id^='c_portalResnav_main']\").attr(\"loaded\",\"true\"); Home Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet Company Blog Contacts  Home Metal Recycling  Eccentric Eddy Current Separator Permanent",
    "specs": [],
    "applications": [
      "Food Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Hump-Magnet-19.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "magnetic-grid",
    "name": "Magnetic Grid",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/magnetic-grid/magnetic-grid-01.png",
    "imageGallery": [
      "/assets/products/magnetic-grid/magnetic-grid-01.png",
      "/assets/products/magnetic-grid/magnetic-grid-02.jpg",
      "/assets/products/magnetic-grid/magnetic-grid-03.jpg",
      "/assets/products/magnetic-grid/magnetic-grid-04.jpg",
      "/assets/products/magnetic-grid/magnetic-grid-05.jpg",
      "/assets/products/magnetic-grid/magnetic-grid-08.png",
      "/assets/products/magnetic-grid/magnetic-grid-06.jpg",
      "/assets/products/magnetic-grid/magnetic-grid-07.jpg"
    ],
    "summary": "Magnetic Grate is installed or simply laid-inside of hoppers, housings, and bins to trap and hold ferrous fines, fragments,and small metal objects. Please be aware these grates are built for low-abrasion materials.",
    "keywords": [
      "Magnetic Grid",
      "Food Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "features": [],
    "principle": "products_details.css?v=1764035205000&tenantId=233649&viewType=1\" rel=\"stylesheet\" type=\"text/css\" /> chnmag@chnmag.com  Search Determine Cancel $('.diaBtn').on('click', function () { $(this).siblings('.lay').removeClass('hiden'); }); $('.p_searchBtn').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); $('.closse').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); ; Home Metal Recycling  Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Mining Industry  Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Food Industry  Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Company Blog Contacts var _li =$('.navUl').children('.navLi'); _li.each(function(i, e) { $(this).addClass('tplink'+(i+1)); } ); $('.navBtn').on('click',function(){ $(this).siblings('.tNav').toggleClass('tNavHeight'); } ); $('.navSliBtn').on('click',function(){ $('.tNav').removeClass('tNavHeight'); } ); $('.iconJt').on('click',function(){ $(this).toggleClass('iconJtRotate') .parents('.navLi').siblings('.navLi') .find('.slidBox').slideUp().end() .find('.tNavH').removeClass('tNavHBac').end() .find('.iconJt').removeClass('iconJtRotate').end().end().end() .parent('.tNavH').addClass('tNavHBac').siblings('.slidBox').slideToggle(); } ); $(\"div[id^='c_portalResnav_main']\").attr(\"loaded\",\"true\"); Home Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet Company Blog Contacts  Home Metal Recycling  Eccentric Eddy Current Separator Permanent",
    "specs": [],
    "applications": [
      "Food Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Magnetic-Grid-20.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "magnetic-rod",
    "name": "Magnetic Rod",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/magnetic-rod/magnetic-rod-01.png",
    "imageGallery": [
      "/assets/products/magnetic-rod/magnetic-rod-01.png",
      "/assets/products/magnetic-rod/magnetic-rod-02.jpg",
      "/assets/products/magnetic-rod/magnetic-rod-08.png",
      "/assets/products/magnetic-rod/magnetic-rod-03.jpg",
      "/assets/products/magnetic-rod/magnetic-rod-05.jpg",
      "/assets/products/magnetic-rod/magnetic-rod-04.jpg",
      "/assets/products/magnetic-rod/magnetic-rod-07.jpg",
      "/assets/products/magnetic-rod/magnetic-rod-06.jpg"
    ],
    "summary": "Magnetic bars are the main part of different magnetic grate separators. They can effectively remove ferrous chips and metal particles from loosely packed, free flowing materials.",
    "keywords": [
      "Magnetic Rod",
      "Food Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "features": [],
    "principle": "products_details.css?v=1764035205000&tenantId=233649&viewType=1\" rel=\"stylesheet\" type=\"text/css\" /> chnmag@chnmag.com  Search Determine Cancel $('.diaBtn').on('click', function () { $(this).siblings('.lay').removeClass('hiden'); }); $('.p_searchBtn').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); $('.closse').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); ; Home Metal Recycling  Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Mining Industry  Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Food Industry  Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Company Blog Contacts var _li =$('.navUl').children('.navLi'); _li.each(function(i, e) { $(this).addClass('tplink'+(i+1)); } ); $('.navBtn').on('click',function(){ $(this).siblings('.tNav').toggleClass('tNavHeight'); } ); $('.navSliBtn').on('click',function(){ $('.tNav').removeClass('tNavHeight'); } ); $('.iconJt').on('click',function(){ $(this).toggleClass('iconJtRotate') .parents('.navLi').siblings('.navLi') .find('.slidBox').slideUp().end() .find('.tNavH').removeClass('tNavHBac').end() .find('.iconJt').removeClass('iconJtRotate').end().end().end() .parent('.tNavH').addClass('tNavHBac').siblings('.slidBox').slideToggle(); } ); $(\"div[id^='c_portalResnav_main']\").attr(\"loaded\",\"true\"); Home Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet Company Blog Contacts  Home Metal Recycling  Eccentric Eddy Current Separator Permanent",
    "specs": [],
    "applications": [
      "Food Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Magnetic-Rod-21.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "magnetic-trap",
    "name": "Magnetic Trap",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/magnetic-trap/magnetic-trap-01.png",
    "imageGallery": [
      "/assets/products/magnetic-trap/magnetic-trap-01.png",
      "/assets/products/magnetic-trap/magnetic-trap-02.jpg",
      "/assets/products/magnetic-trap/magnetic-trap-08.png",
      "/assets/products/magnetic-trap/magnetic-trap-04.jpg",
      "/assets/products/magnetic-trap/magnetic-trap-03.jpg",
      "/assets/products/magnetic-trap/magnetic-trap-05.jpg",
      "/assets/products/magnetic-trap/magnetic-trap-06.jpg",
      "/assets/products/magnetic-trap/magnetic-trap-07.jpg"
    ],
    "summary": "Magnetic Liquid Traps or Magnetic Liquid Filters are designed for liquid or semi-liquid flow systems to remove ferrous contamination from liquid with different viscosity level. They preserve product purity by removing small contaminants , provide magnetic",
    "keywords": [
      "Magnetic Trap",
      "Food Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "features": [
      "Many different styles are available for different materials.",
      "The max magnetic strength can reach 12,000GS for N style, 8000GS for E style.",
      "Standard working temperature ≤ 80°c, max working temperature can be chosen from 80°c to 350°c as the same with magnetic bars if needed.",
      "Connection can be through ferrule, bolt plate, flange or uneven head, etc.",
      "Stainless steel 304 or316L is available for shell material.",
      "Properly designed magnetic configuration ensures Maximum magnetic effect without impeding liquid flow."
    ],
    "principle": "Magnetic Liquid Traps or Magnetic Liquid Filters are designed for liquid or semi-liquid flow systems to remove ferrous contamination from liquid with different viscosity level. They preserve product purity by removing small contaminants , provide magnetic protection for liquid lines and processing requirements. Features: 1. Many different styles are available for different materials. 2. The max magnetic strength can reach 12,000GS for N style, 8000GS for E style. 3. Standard working temperature ≤ 80°c, max working temperature can be chosen from 80°c to 350°c as the same with magnetic bars if needed. 4. Connection can be through ferrule, bolt plate, flange or uneven head, etc. 5. Stainless steel 304 or316L is available for shell material. 6. Properly designed magnetic configuration ensures Maximum magnetic effect without impeding liquid flow. 7. Pressure design or other special requirement can be custom made. N Style Magnetic Liquid Trap Magnetic Strength: Up to the highest 12,000 GS (1.2T) Fast Connection Style Magnetic Liquid Trap Good sealing results by using rubber seal washer and special shape pipe wall designing, save cost and installation time. Easy-Clean Magnetic Liquid Trap Magnetic strength: The highest is 8000GS (0.8T) Insulation Style Magnetic Liquid Trap Insulation Style Liquid Traps or Filters have a jacket filled with hot water or oil that keep liquid warm enough when it pass through the taps. Ideal choice for chocolate, syrups , jams and sauces to removing ferrous contamination.",
    "specs": [
      {
        "label": "Model",
        "value": "JSON"
      },
      {
        "label": "Model",
        "value": "UA-162924846"
      }
    ],
    "applications": [
      "Food Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [
      "Model: JSON",
      "Model: UA-162924846"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Magnetic-Trap-22.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "rotary-pipe-magnet",
    "name": "Rotary Pipe Magnet",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/rotary-pipe-magnet/rotary-pipe-magnet-01.png",
    "imageGallery": [
      "/assets/products/rotary-pipe-magnet/rotary-pipe-magnet-01.png",
      "/assets/products/rotary-pipe-magnet/rotary-pipe-magnet-02.jpg",
      "/assets/products/rotary-pipe-magnet/rotary-pipe-magnet-03.jpg",
      "/assets/products/rotary-pipe-magnet/rotary-pipe-magnet-04.jpg",
      "/assets/products/rotary-pipe-magnet/rotary-pipe-magnet-05.jpg",
      "/assets/products/rotary-pipe-magnet/rotary-pipe-magnet-08.png",
      "/assets/products/rotary-pipe-magnet/rotary-pipe-magnet-06.jpg",
      "/assets/products/rotary-pipe-magnet/rotary-pipe-magnet-07.jpg"
    ],
    "summary": "Suitable for removing iron scrap or micro ferromagnetic contamination from powder or granule materials, especially from high viscosity or poor fluidity materials that is prone to caking or bridging. Rotary grate magnetic separators are widely used in building",
    "keywords": [
      "Rotary Pipe Magnet",
      "Food Industry",
      "mining",
      "recycling",
      "coal",
      "food",
      "chemical",
      "ore",
      "metal recycling"
    ],
    "features": [],
    "principle": "products_details.css?v=1764035205000&tenantId=233649&viewType=1\" rel=\"stylesheet\" type=\"text/css\" /> chnmag@chnmag.com  Search Determine Cancel $('.diaBtn').on('click', function () { $(this).siblings('.lay').removeClass('hiden'); }); $('.p_searchBtn').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); $('.closse').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); ; Home Metal Recycling  Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Mining Industry  Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Food Industry  Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Company Blog Contacts var _li =$('.navUl').children('.navLi'); _li.each(function(i, e) { $(this).addClass('tplink'+(i+1)); } ); $('.navBtn').on('click',function(){ $(this).siblings('.tNav').toggleClass('tNavHeight'); } ); $('.navSliBtn').on('click',function(){ $('.tNav').removeClass('tNavHeight'); } ); $('.iconJt').on('click',function(){ $(this).toggleClass('iconJtRotate') .parents('.navLi').siblings('.navLi') .find('.slidBox').slideUp().end() .find('.tNavH').removeClass('tNavHBac').end() .find('.iconJt').removeClass('iconJtRotate').end().end().end() .parent('.tNavH').addClass('tNavHBac').siblings('.slidBox').slideToggle(); } ); $(\"div[id^='c_portalResnav_main']\").attr(\"loaded\",\"true\"); Home Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet Company Blog Contacts  Home Metal Recycling  Eccentric Eddy Current Separator Permanent",
    "specs": [],
    "applications": [
      "Food Industry",
      "mining",
      "recycling",
      "coal",
      "food",
      "chemical",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/Rotary-Pipe-Magnet-23.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "permanent-filter-bar-magnetic-neodymium-rod",
    "name": "Strong 6000-16000 Gauss Iron Absorbing Permanent Filter Bar Magnetic Neodymium Rod",
    "category": "Magnetic Components & Filters",
    "image": "/assets/products/permanent-filter-bar-magnetic-rod.webp",
    "imageGallery": [
      "/assets/products/permanent-filter-bar-magnetic-rod.webp"
    ],
    "summary": "High-gauss magnetic rods used to capture fine ferrous contamination in material flow and filtration systems.",
    "keywords": [
      "Strong 6000-16000 Gauss Iron Absorbing Permanent Filter Bar Magnetic Neodymium Rod",
      "Permanent Filter Bar Magnetic Rod",
      "Magnetic Rollers & Magnetic Bars",
      "Powder",
      "granule",
      "liquid filtration",
      "hopper and chute protection"
    ],
    "features": [
      "6000-16000 Gauss magnetic force options",
      "304 or 316L stainless steel sealed welded tube",
      "Captures iron powder, filings and fine ferrous particles",
      "Can be built into magnetic grates, filters, hoppers and custom assemblies"
    ],
    "principle": "Magnetic rods use high-strength permanent magnetic materials to remove ferromagnetic impurities from powders, granules, liquids and flowing materials. The internal neodymium-iron-boron magnet is sealed inside 304 or 316L stainless steel for corrosion resistance and easy cleaning.",
    "specs": [
      {
        "label": "Magnetic Strength",
        "value": "6000-16000 Gauss"
      },
      {
        "label": "Magnet Material",
        "value": "Neodymium iron boron"
      },
      {
        "label": "Tube Material",
        "value": "304 or 316L stainless steel"
      },
      {
        "label": "Applications",
        "value": "Powder, granule, liquid, hopper, chute and filter systems"
      }
    ],
    "applications": [
      "Powder",
      "granule",
      "liquid filtration",
      "hopper and chute protection",
      "Magnetic Rollers & Magnetic Bars"
    ],
    "installation": "",
    "customization": [
      "Magnet Material: Neodymium iron boron",
      "Tube Material: 304 or 316L stainless steel"
    ],
    "faqs": [],
    "sourceUrls": [],
    "sourceSite": ""
  },
  {
    "slug": "high-frequency-screen",
    "name": "High Frequency Screen",
    "category": "Industry Application Equipment",
    "image": "/assets/products/high-frequency-screen/high-frequency-screen-01.jpg",
    "imageGallery": [
      "/assets/products/high-frequency-screen/high-frequency-screen-01.jpg",
      "/assets/products/high-frequency-screen/high-frequency-screen-03.jpg",
      "/assets/products/high-frequency-screen/high-frequency-screen-02.jpg",
      "/assets/products/high-frequency-screen/high-frequency-screen-04.jpg",
      "/assets/products/high-frequency-screen/high-frequency-screen-05.jpg",
      "/assets/products/high-frequency-screen/high-frequency-screen-06.jpg",
      "/assets/products/high-frequency-screen/high-frequency-screen-07.jpg",
      "/assets/products/high-frequency-screen/high-frequency-screen-11.jpg",
      "/assets/products/high-frequency-screen/high-frequency-screen-08.jpg",
      "/assets/products/high-frequency-screen/high-frequency-screen-09.jpg",
      "/assets/products/high-frequency-screen/high-frequency-screen-10.jpg"
    ],
    "summary": "High frequency screen consists of a vibrator, pulp distributor, screen frame,rack,suspension spring, mesh and other components. It has the advantages of high efficiency, small amplitude and high screening frequency, and is an effective equipment for screening",
    "keywords": [
      "High Frequency Screen",
      "Mining Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "features": [],
    "principle": "products_details.css?v=1764035205000&tenantId=233649&viewType=1\" rel=\"stylesheet\" type=\"text/css\" /> chnmag@chnmag.com  Search Determine Cancel $('.diaBtn').on('click', function () { $(this).siblings('.lay').removeClass('hiden'); }); $('.p_searchBtn').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); $('.closse').on('click', function () { $(this).parents('.lay').addClass('hiden'); }); ; Home Metal Recycling  Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Mining Industry  Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Food Industry  Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet 需要产品服务？ 需求征询表 服务流程 资料下载 联系我们 --> Company Blog Contacts var _li =$('.navUl').children('.navLi'); _li.each(function(i, e) { $(this).addClass('tplink'+(i+1)); } ); $('.navBtn').on('click',function(){ $(this).siblings('.tNav').toggleClass('tNavHeight'); } ); $('.navSliBtn').on('click',function(){ $('.tNav').removeClass('tNavHeight'); } ); $('.iconJt').on('click',function(){ $(this).toggleClass('iconJtRotate') .parents('.navLi').siblings('.navLi') .find('.slidBox').slideUp().end() .find('.tNavH').removeClass('tNavHBac').end() .find('.iconJt').removeClass('iconJtRotate').end().end().end() .parent('.tNavH').addClass('tNavHBac').siblings('.slidBox').slideToggle(); } ); $(\"div[id^='c_portalResnav_main']\").attr(\"loaded\",\"true\"); Home Metal Recycling Eccentric Eddy Current Separator Permanent Overband Magnetic Separator Drum Magnet Stainless Steel Separation Conveyor Electromagnet Separator Magnetic Head Pulley Belt Color Sorter Eddy Current Separator + Stainless Steel Separation Mining Industry Dry Drum Magnetic Separator Wet Drum Magnetic Separator Belt High Gradient Magnetic Separator High Frequency Screen Disc Magnetic Separator for Tailing Food Industry Drawer Magnet Hump Magnet Magnetic Grid Magnetic Rod Magnetic Trap Rotary Pipe Magnet Company Blog Contacts  Home Metal Recycling  Eccentric Eddy Current Separator Permanent",
    "specs": [],
    "applications": [
      "Mining Industry",
      "mining",
      "recycling",
      "food",
      "ore",
      "metal recycling"
    ],
    "installation": "",
    "customization": [],
    "faqs": [],
    "sourceUrls": [
      "https://www.chnmag.com/product/27.html"
    ],
    "sourceSite": "chnmag.com"
  },
  {
    "slug": "kgla-series-rectifier-control-box",
    "name": "KGLA series rectifier control box",
    "category": "Industry Application Equipment",
    "image": "/assets/products/kgla-series-rectifier-control-box/kgla-series-rectifier-control-box-01.jpg",
    "imageGallery": [
      "/assets/products/kgla-series-rectifier-control-box/kgla-series-rectifier-control-box-01.jpg",
      "/assets/products/kgla-series-rectifier-control-box/kgla-series-rectifier-control-box-02.png",
      "/assets/products/kgla-series-rectifier-control-box/kgla-series-rectifier-control-box-05.png",
      "/assets/products/kgla-series-rectifier-control-box/kgla-series-rectifier-control-box-03.png",
      "/assets/products/kgla-series-rectifier-control-box/kgla-series-rectifier-control-box-04.png",
      "/assets/products/kgla-series-rectifier-control-box/kgla-series-rectifier-control-box-07.jpg",
      "/assets/products/kgla-series-rectifier-control-box/kgla-series-rectifier-control-box-06.jpg"
    ],
    "summary": "product overview： 1、 Explanation The KGLA series rectifier control equipment is a small and medium-sized rectifier control cabinet designed by our company for electromagnetic, permanent magnet self dumping and other magneto electric equipment. It is divided",
    "keywords": [
      "KGLA series rectifier control box",
      "General iron removal equipment"
    ],
    "features": [
      "of wide adaptability, low cost, and easy operation. 2、"
    ],
    "principle": "product overview： 1、 Explanation The KGLA series rectifier control equipment is a small and medium-sized rectifier control cabinet designed by our company for electromagnetic, permanent magnet self dumping and other magneto electric equipment. It is divided into two types: centralized and non centralized, suitable for occasions with low control requirements, and has the characteristics of wide adaptability, low cost, and easy operation. 2、 Schematic diagram 3、 Main technical parameters",
    "specs": [
      {
        "label": "Model",
        "value": "KGLA"
      }
    ],
    "applications": [
      "General iron removal equipment"
    ],
    "installation": "",
    "customization": [
      "Model: KGLA"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-14/50.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box",
    "name": "KXB mining explosion-proof electromagnetic iron remover control box",
    "category": "Industry Application Equipment",
    "image": "/assets/products/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box-01.jpg",
    "imageGallery": [
      "/assets/products/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box-01.jpg",
      "/assets/products/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box-02.png",
      "/assets/products/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box-03.png",
      "/assets/products/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box-04.png",
      "/assets/products/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box-06.png",
      "/assets/products/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box-05.png",
      "/assets/products/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box-07.jpg",
      "/assets/products/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box/kxb-mining-explosion-proof-electromagnetic-iron-remover-control-box-08.jpg"
    ],
    "summary": "product overview： 1、Explanation: 2、 Schematic diagram 3、 Purpose: Suitable for rectification and control of mining explosion-proof electromagnetic iron remover. 4、 Scope Suitable for explosive gas environments with methane and coal dust in underground coal",
    "keywords": [
      "KXB mining explosion-proof electromagnetic iron remover control box",
      "Coal industry iron removal and magnetic separation equipment",
      "mining",
      "coal"
    ],
    "features": [],
    "principle": "product overview： 1、Explanation: 2、 Schematic diagram 3、 Purpose: Suitable for rectification and control of mining explosion-proof electromagnetic iron remover. 4、 Scope Suitable for explosive gas environments with methane and coal dust in underground coal mines and surrounding media. 5、 Characteristics Intelligent microcontroller control, advanced protection algorithms, high-precision data processing, stable performance, and reliable action. Backlit LCD display, menu style human-computer interaction interface, rich display information, intuitive and easy operation. There are two methods of on-site control and remote control, and the conversion is convenient. Optional RS-485 communication interface for programmable automatic control. The main components adopt coal mine safety sign products. The explosion-proof design of the shell fully meets the Exdl standard. 6、 Main technical parameters",
    "specs": [
      {
        "label": "Model",
        "value": "LCD"
      },
      {
        "label": "Model",
        "value": "RS-485"
      }
    ],
    "applications": [
      "Coal industry iron removal and magnetic separation equipment",
      "mining",
      "coal"
    ],
    "installation": "",
    "customization": [
      "Model: LCD",
      "Model: RS-485"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-16/81.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box",
    "name": "QJZ mining explosion-proof permanent magnet iron remover control box",
    "category": "Industry Application Equipment",
    "image": "/assets/products/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box-01.jpg",
    "imageGallery": [
      "/assets/products/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box-01.jpg",
      "/assets/products/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box-02.png",
      "/assets/products/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box-03.png",
      "/assets/products/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box-05.png",
      "/assets/products/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box-04.png",
      "/assets/products/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box-06.png",
      "/assets/products/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box-08.jpg",
      "/assets/products/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box/qjz-mining-explosion-proof-permanent-magnet-iron-remover-control-box-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation 2、 Schematic diagram 3、 Purpose: Suitable for motor control of mining explosion-proof permanent magnet iron remover. 4、 Scope Suitable for remote and nearby control of the starting and stopping of three induction motors of",
    "keywords": [
      "QJZ mining explosion-proof permanent magnet iron remover control box",
      "Coal industry iron removal and magnetic separation equipment",
      "mining",
      "coal"
    ],
    "features": [],
    "principle": "product overview： 1、 Explanation 2、 Schematic diagram 3、 Purpose: Suitable for motor control of mining explosion-proof permanent magnet iron remover. 4、 Scope Suitable for remote and nearby control of the starting and stopping of three induction motors of permanent magnet iron remover in explosive gas environments with methane and coal dust in coal mines and surrounding media. Simultaneously protect the motor and related circuits. 5、 Characteristics Intelligent microcontroller control, stable performance, reliable action. It has functions such as overload, short circuit, voltage loss, phase failure, and leakage lockout protection. There are two methods for on-site and remote control, and the conversion is convenient. The shell partition design fully meets the Exdl standard. 6、 Main technical parameters",
    "specs": [],
    "applications": [
      "Coal industry iron removal and magnetic separation equipment",
      "mining",
      "coal"
    ],
    "installation": "",
    "customization": [],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-16/82.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover",
    "name": "RBCDB explosion-proof disc type electromagnetic iron remover",
    "category": "Industry Application Equipment",
    "image": "/assets/products/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover-01.jpg",
      "/assets/products/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover-02.png",
      "/assets/products/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover-03.png",
      "/assets/products/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover-04.png",
      "/assets/products/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover-05.png",
      "/assets/products/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover-06.jpg",
      "/assets/products/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover/rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover-07.jpg"
    ],
    "summary": "product overview： 1、 Explanation RBCDB explosion-proof disc type electromagnetic iron remover is suitable for explosive gas environments with methane components and mines with coal dust. The body adopts a natural cooling design, with small size, fast heat",
    "keywords": [
      "RBCDB explosion-proof disc type electromagnetic iron remover",
      "Coal industry iron removal and magnetic separation equipment",
      "mining",
      "coal",
      "chemical"
    ],
    "features": [
      "RBCDB explosion-proof disc type electromagnetic iron remover is suitable for explosive gas environments with methane components and mines with coal dust",
      "The body adopts a natural cooling design, with small size, fast heat dissipation, and light weight",
      "Used in conjunction with conveyor belts to remove magnetic iron mixed in non-magnetic materials",
      "Mainly used in coal mines or other flammable and explosive industries such as mining, steel, chemical, electricity, or coal transportation systems in major coal enterprises"
    ],
    "principle": "product overview： 1、 Explanation RBCDB explosion-proof disc type electromagnetic iron remover is suitable for explosive gas environments with methane components and mines with coal dust. The body adopts a natural cooling design, with small size, fast heat dissipation, and light weight. Used in conjunction with conveyor belts to remove magnetic iron mixed in non-magnetic materials. The rectification control equipment is equipped with intelligent protection, with local and remote control functions, and can achieve fully automatic control of iron suction and unloading when combined with an electric walking device. Mainly used in coal mines or other flammable and explosive industries such as mining, steel, chemical, electricity, or coal transportation systems in major coal enterprises. The entire series of models have obtained the explosion-proof certificate issued by the National Safety Production Fushun Mining Equipment Testing and Inspection Center and the MA Mining Product Safety Mark Certificate issued by the National Mining Product Safety Mark Center. 2、 Schematic diagram 3、 Main technical parameters",
    "specs": [
      {
        "label": "Model",
        "value": "RBCDB"
      }
    ],
    "applications": [
      "Coal industry iron removal and magnetic separation equipment",
      "mining",
      "coal",
      "chemical"
    ],
    "installation": "",
    "customization": [
      "Model: RBCDB"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-16/80.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover",
    "name": "RBCDD explosion-proof electromagnetic self dumping iron remover",
    "category": "Industry Application Equipment",
    "image": "/assets/products/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover-01.jpg",
      "/assets/products/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover-02.png",
      "/assets/products/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover-03.png",
      "/assets/products/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover-06.png",
      "/assets/products/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover-08.jpg",
      "/assets/products/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover-04.png",
      "/assets/products/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover-07.jpg",
      "/assets/products/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover-05.png"
    ],
    "summary": "product overview： 1、 Explanation RBCDD explosion-proof self dumping electromagnetic iron remover is suitable for explosive gas environments with methane components and mines with coal dust. The body adopts a natural cooling design, with small size, fast heat",
    "keywords": [
      "RBCDD explosion-proof electromagnetic self dumping iron remover",
      "Coal industry iron removal and magnetic separation equipment",
      "mining",
      "coal",
      "chemical"
    ],
    "features": [
      "RBCDD explosion-proof self dumping electromagnetic iron remover is suitable for explosive gas environments with methane components and mines with coal dust",
      "The body adopts a natural cooling design, with small size, fast heat dissipation, and light weight",
      "The fully enclosed structure has the characteristics of moisture resistance, dust prevention, and corrosion resistance",
      "The rotating drum adopts an automatic correction structure design, matched with an explosion-proof motor and a flame-retardant ring belt",
      "Used in conjunction with conveyor belts to remove magnetic iron mixed in non-magnetic materials",
      "Mainly used in coal mines or other flammable and explosive industries such as mining, steel, chemical, electricity, or coal transportation systems in major coal enterprises"
    ],
    "principle": "product overview： 1、 Explanation RBCDD explosion-proof self dumping electromagnetic iron remover is suitable for explosive gas environments with methane components and mines with coal dust. The body adopts a natural cooling design, with small size, fast heat dissipation, and light weight. The fully enclosed structure has the characteristics of moisture resistance, dust prevention, and corrosion resistance. The rotating drum adopts an automatic correction structure design, matched with an explosion-proof motor and a flame-retardant ring belt. Used in conjunction with conveyor belts to remove magnetic iron mixed in non-magnetic materials. The rectification control equipment has intelligent protection, with local and remote control functions, and can be used in conjunction with a mining explosion-proof electrical control cabinet to achieve continuous suction and disposal of iron. Mainly used in coal mines or other flammable and explosive industries such as mining, steel, chemical, electricity, or coal transportation systems in major coal enterprises. The entire series of models have obtained the explosion-proof certificate issued by the National Safety Production Fushun Mining Equipment Testing and Inspection Center and the MA Mining Product Safety Mark Certificate issued by the National Mining Product Safety Mark Center. 2、 Schematic diagram 3、 Main technical parameters 4、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "RBCDD"
      }
    ],
    "applications": [
      "Coal industry iron removal and magnetic separation equipment",
      "mining",
      "coal",
      "chemical"
    ],
    "installation": "",
    "customization": [
      "Model: RBCDD"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-16/77.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover",
    "name": "RBCYD explosion-proof permanent magnet self dumping iron remover",
    "category": "Industry Application Equipment",
    "image": "/assets/products/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover-01.jpg",
    "imageGallery": [
      "/assets/products/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover-01.jpg",
      "/assets/products/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover-02.png",
      "/assets/products/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover-04.png",
      "/assets/products/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover-03.png",
      "/assets/products/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover-07.png",
      "/assets/products/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover-06.png",
      "/assets/products/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover-05.png",
      "/assets/products/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover-09.jpg",
      "/assets/products/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover-08.jpg"
    ],
    "summary": "product overview： 1、 Explanation RBCYD explosion-proof permanent magnet self dumping iron remover is suitable for places with explosive gases. It is used in conjunction with conveyor belts to remove magnetic iron mixed in non-magnetic materials.",
    "keywords": [
      "RBCYD explosion-proof permanent magnet self dumping iron remover",
      "Coal industry iron removal and magnetic separation equipment",
      "mining",
      "coal",
      "chemical"
    ],
    "features": [
      "RBCYD explosion-proof permanent magnet self dumping iron remover is suitable for places with explosive gases",
      "It is used in conjunction with conveyor belts to remove magnetic iron mixed in non-magnetic materials",
      "When used in conjunction with mining explosion-proof electrical control cabinets, it can achieve continuous suction and disposal of iron",
      "Mainly used in coal mines or other flammable and explosive industries such as mining, steel, chemical, electricity, or coal transportation systems in major coal enterprises"
    ],
    "principle": "product overview： 1、 Explanation RBCYD explosion-proof permanent magnet self dumping iron remover is suitable for places with explosive gases. It is used in conjunction with conveyor belts to remove magnetic iron mixed in non-magnetic materials. When used in conjunction with mining explosion-proof electrical control cabinets, it can achieve continuous suction and disposal of iron. Mainly used in coal mines or other flammable and explosive industries such as mining, steel, chemical, electricity, or coal transportation systems in major coal enterprises. The entire series of models have obtained the explosion-proof certificate issued by the National Safety Production Fushun Mining Equipment Testing and Inspection Center and the MA Mining Product Safety Mark Certificate issued by the National Mining Product Safety Mark Center. 2、 Schematic diagram 3、 Main technical parameters 4、 Product shooting",
    "specs": [
      {
        "label": "Model",
        "value": "RBCYD"
      }
    ],
    "applications": [
      "Coal industry iron removal and magnetic separation equipment",
      "mining",
      "coal",
      "chemical"
    ],
    "installation": "",
    "customization": [
      "Model: RBCYD"
    ],
    "faqs": [],
    "sourceUrls": [
      "https://www.cnmagnetics.com/n-16/76.html"
    ],
    "sourceSite": "cnmagnetics.com"
  },
  {
    "slug": "round-electromagnetic-lifting-magnet",
    "name": "Round Electromagnetic Lifting Magnet",
    "category": "Industry Application Equipment",
    "image": "/assets/products/round-electromagnetic-lifting-magnet.webp",
    "imageGallery": [
      "/assets/products/round-electromagnetic-lifting-magnet.webp"
    ],
    "summary": "A round lifting electromagnet for handling ferrous metal materials in industrial loading and unloading scenarios.",
    "keywords": [
      "Round Electromagnetic Lifting Magnet",
      "Electromagnetic Series",
      "Steel scrap lifting",
      "metal handling",
      "foundry and warehouse operations"
    ],
    "features": [
      "Round lifting surface for ferrous scrap and metal material handling",
      "Heavy-duty steel housing for industrial operating environments",
      "Designed for crane, hoist and loading-unloading systems",
      "Useful for improving handling efficiency and reducing manual contact"
    ],
    "principle": "The round electromagnetic lifting magnet is used for lifting and transferring ferrous metal materials in scrap yards, steel plants, foundries, warehouses and loading operations. The round body is suitable for loose scrap, steel chips and ferrous metal handling.",
    "specs": [
      {
        "label": "Product Type",
        "value": "Electromagnetic lifting magnet"
      },
      {
        "label": "Material Handled",
        "value": "Steel scrap, cast iron, ferrous metal pieces"
      },
      {
        "label": "Typical Equipment",
        "value": "Crane, hoist, excavator lifting system"
      },
      {
        "label": "Applications",
        "value": "Steel mills, scrap yards, foundries, warehouses"
      }
    ],
    "applications": [
      "Steel scrap lifting",
      "metal handling",
      "foundry and warehouse operations",
      "Electromagnetic Series"
    ],
    "installation": "",
    "customization": [
      "Material Handled: Steel scrap, cast iron, ferrous metal pieces"
    ],
    "faqs": [],
    "sourceUrls": [],
    "sourceSite": ""
  }
];
