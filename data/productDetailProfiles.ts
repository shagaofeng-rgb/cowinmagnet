import type { Product } from "@/data/products";

export type ProductFamily =
  | "suspended"
  | "mineral-processing"
  | "filtering"
  | "recycling-sorting"
  | "metal-detection"
  | "explosion-control"
  | "lifting";

export type SelectionField = {
  name: string;
  label: string;
  placeholder: string;
};

export type ProductDetailProfile = {
  family: ProductFamily;
  primaryKeyword: string;
  primaryIndustry: string;
  quickFacts: { label: string; value: string }[];
  overview: string[];
  whyPoints: { title: string; text: string }[];
  processSteps: string[];
  materials: string[];
  industrySlugs: string[];
  configurationOptions: string[];
  selectionFields: SelectionField[];
  selectionNotes: string[];
  faqs: { question: string; answer: string }[];
  limitations: string[];
  technicalFields: string[];
  contentStatus: "sample-ready" | "template-ready";
};

const baseSelection = [
  { name: "selectionMaterial", label: "Material", placeholder: "Material, particle size and bulk density" },
  { name: "selectionCapacity", label: "Capacity / flow", placeholder: "t/h, m3/h or line throughput" },
  { name: "selectionSite", label: "Installation location", placeholder: "Conveyor, chute, pipeline or process stage" }
];

const familyProfiles: Record<ProductFamily, Omit<ProductDetailProfile, "overview" | "contentStatus">> = {
  suspended: {
    family: "suspended",
    primaryKeyword: "suspended magnetic separator",
    primaryIndustry: "conveyor and bulk material handling",
    quickFacts: [
      { label: "Process role", value: "Tramp iron removal and equipment protection" },
      { label: "Material flow", value: "Bulk material on a conveyor or transfer point" },
      { label: "Cleaning choice", value: "Manual or continuous discharge, by configuration" },
      { label: "Selection starts with", value: "Belt width, burden depth and suspension height" }
    ],
    whyPoints: [
      { title: "Defined magnet position", text: "The separator is selected around the actual conveyor path, discharge point and available suspension space." },
      { title: "Cleaning method matched to contamination", text: "Manual cleaning suits lower contamination where a safe service stop is acceptable; self-cleaning is considered for continuous discharge requirements." },
      { title: "Conveyor data first", text: "Belt width, speed, material layer depth and the largest expected tramp item are required before a model can be confirmed." },
      { title: "Site conditions matter", text: "Dust, temperature, power availability and access for maintenance should be reviewed with the installation layout." }
    ],
    processSteps: ["Feed conveyor", "Tramp iron risk point", "Suspended magnet position", "Ferrous discharge or manual cleaning", "Protected downstream equipment"],
    materials: ["Ore and mineral feed", "Aggregate and limestone", "Coal and bulk fuel", "Recycling feed", "Industrial bulk material"],
    industrySlugs: ["mining", "recycling", "cement-aggregate"],
    configurationOptions: ["Permanent or electromagnetic magnet system where applicable", "Manual-clean or self-cleaning discharge arrangement", "Cross-belt or inline mounting review", "Suspension frame and guarding coordinated to site layout"],
    selectionFields: [
      ...baseSelection,
      { name: "selectionBeltWidth", label: "Conveyor belt width", placeholder: "e.g. 800 mm" },
      { name: "selectionBeltSpeed", label: "Belt speed", placeholder: "e.g. m/s" },
      { name: "selectionBurden", label: "Material layer and suspension height", placeholder: "Material depth and magnet-to-material distance" },
      { name: "selectionTrampIron", label: "Largest expected tramp iron", placeholder: "Size, shape and expected frequency" }
    ],
    selectionNotes: ["Confirm the installation direction: inline, cross-belt or at the discharge end.", "Provide a conveyor drawing or site photo where available.", "Allow a safe area for captured-metal discharge or manual cleaning."],
    faqs: [
      { question: "When is self-cleaning preferred over manual cleaning?", answer: "Self-cleaning is normally considered where ferrous contamination must be discharged continuously. Manual cleaning may be appropriate when contamination is low and the line can be isolated safely for service." },
      { question: "Should the magnet be installed inline or cross-belt?", answer: "The installation direction depends on belt speed, burden depth, the discharge side, available headroom and the required exposure to the magnetic field. The conveyor arrangement should be reviewed before selection." },
      { question: "What information is needed for a suspended magnet quote?", answer: "Please provide belt width, speed, material layer depth, suspension height, material description, the largest expected tramp item, desired cleaning method and a layout drawing or photos when available." },
      { question: "Can this separator remove all metals?", answer: "No. A magnetic separator is used for ferromagnetic contaminants. Non-ferrous metals and non-magnetic stainless steel require a different separation or detection stage." }
    ],
    limitations: ["Not a substitute for an eddy current separator where non-ferrous recovery is required.", "Final selection cannot be confirmed from product name alone; conveyor and material conditions must be reviewed."],
    technicalFields: ["Model", "Magnet system", "Cleaning arrangement", "Belt width", "Belt speed", "Material layer", "Suspension height", "Largest tramp iron", "Cooling or power requirement where applicable"]
  },
  "mineral-processing": {
    family: "mineral-processing",
    primaryKeyword: "magnetic separator for mineral processing",
    primaryIndustry: "mineral processing and ore recovery",
    quickFacts: [
      { label: "Process role", value: "Pre-concentration, recovery or magnetic impurity removal" },
      { label: "Feed state", value: "Dry bulk or slurry, depending on the equipment" },
      { label: "Separation basis", value: "Magnetic response and process flow" },
      { label: "Selection starts with", value: "Mineral, particle size, feed condition and target" }
    ],
    whyPoints: [
      { title: "Process position before model", text: "The same equipment family can serve pre-selection, concentration, cleaning, scavenging or tailings recovery depending on its location in the flow sheet." },
      { title: "Feed condition controls the design", text: "Particle size, liberation, moisture or slurry condition and feed consistency are reviewed before a configuration is proposed." },
      { title: "Target stream is defined", text: "The selection discussion distinguishes the magnetic product, non-magnetic product and the downstream stage that receives each stream." },
      { title: "Testing may be required", text: "Where mineral behavior is uncertain, representative material and process information should be reviewed before commitments are made." }
    ],
    processSteps: ["Prepared feed", "Magnetic separation stage", "Magnetic product stream", "Non-magnetic or tailings stream", "Downstream recovery or processing"],
    materials: ["Magnetite-bearing ore", "Iron ore feed", "Mineral concentrates", "Tailings", "Coal washing media"],
    industrySlugs: ["mining"],
    configurationOptions: ["Dry or wet process position, where applicable", "Feed arrangement and product discharge direction", "Magnetic circuit or intensity class confirmed by material", "Wear, water and slurry handling details reviewed for the site"],
    selectionFields: [
      ...baseSelection,
      { name: "selectionMineral", label: "Mineral and separation target", placeholder: "Mineral, impurity or recovery target" },
      { name: "selectionParticleSize", label: "Particle size", placeholder: "Feed size range / liberation information" },
      { name: "selectionFeedCondition", label: "Feed condition", placeholder: "Dry, moisture content or slurry concentration" },
      { name: "selectionProductFlow", label: "Required product streams", placeholder: "Pre-selection, concentration, cleaning or tailings recovery" }
    ],
    selectionNotes: ["State whether the objective is recovery, upgrading, cleaning or tramp iron removal.", "For wet circuits, describe the slurry condition and available water or process constraints.", "Share laboratory, plant or sample information when available."],
    faqs: [
      { question: "How is a mineral magnetic separator selected?", answer: "Selection begins with the mineral, particle size, feed condition, desired magnetic and non-magnetic product streams, throughput and the place of the machine in the process flow." },
      { question: "Can one separator solve every ore separation problem?", answer: "No. Magnetic response, liberation, feed preparation and separation target vary by material. A dry, wet, high-gradient or drum configuration is selected for the actual duty." },
      { question: "What should be sent for an initial technical review?", answer: "Provide mineral name, feed size, moisture or slurry condition, throughput, process sketch, desired product streams and any available test or plant data." },
      { question: "Are recovery results guaranteed from a catalog page?", answer: "No. Recovery depends on the material and process. Results should only be discussed after the feed and operating conditions are reviewed." }
    ],
    limitations: ["No recovery or grade claim is made without representative material and process evidence.", "Magnetic separation does not replace required crushing, screening, classification or other upstream preparation stages."],
    technicalFields: ["Model", "Process duty", "Feed size", "Feed condition", "Throughput", "Magnetic product direction", "Non-magnetic product direction", "Water or slurry requirement where applicable"]
  },
  filtering: {
    family: "filtering",
    primaryKeyword: "industrial magnetic filter",
    primaryIndustry: "powder, granule, liquid and slurry processing",
    quickFacts: [
      { label: "Process role", value: "Capture ferromagnetic contamination close to the material flow" },
      { label: "Feed type", value: "Dry free-flowing material, liquid or slurry by design" },
      { label: "Cleaning choice", value: "Manual, drawer, rotary or pipeline arrangement" },
      { label: "Selection starts with", value: "Flow behavior, temperature, interface and cleaning access" }
    ],
    whyPoints: [
      { title: "Material flow is the first check", text: "Dry powder, granules, liquid, slurry and bridging materials require different contact and cleaning arrangements." },
      { title: "Magnetic contact needs space", text: "The housing, tube or grid layout is reviewed around the available flow path so material can contact the magnetic surface without unnecessary restriction." },
      { title: "Cleaning access is designed in", text: "A practical cleaning interval and safe access should be agreed before choosing a manual, drawer, rotary or pipeline configuration." },
      { title: "Contact materials are confirmed", text: "For hygienic, corrosive or temperature-sensitive duties, the required contact material and operating limit must be confirmed against the real process." }
    ],
    processSteps: ["Material feed", "Magnetic contact zone", "Captured ferromagnetic contamination", "Clean material outlet", "Planned cleaning point"],
    materials: ["Dry powders", "Pellets and granules", "Plastic regrind", "Liquids", "Slurries and process media"],
    industrySlugs: ["food-processing", "recycling"],
    configurationOptions: ["Magnetic bar, grid, drawer, trap, rotary or pipeline construction as applicable", "Housing connection and installation orientation", "Cleaning access matched to the material and maintenance practice", "Contact material and temperature suitability confirmed for the duty"],
    selectionFields: [
      ...baseSelection,
      { name: "selectionFlowType", label: "Material flow type", placeholder: "Dry powder, granule, liquid, slurry or bridging material" },
      { name: "selectionTemperature", label: "Temperature", placeholder: "Operating temperature if known" },
      { name: "selectionViscosity", label: "Viscosity / flowability", placeholder: "Free-flowing, cohesive, viscous or other" },
      { name: "selectionConnection", label: "Connection or opening size", placeholder: "Pipe, flange, chute or housing interface" }
    ],
    selectionNotes: ["Describe whether the material is free-flowing, sticky, bridging or abrasive.", "State the cleaning interval and whether shutdown is possible.", "For food or hygienic duties, confirm the actual compliance and contact-material requirements before ordering."],
    faqs: [
      { question: "Which magnetic filter is suitable for dry powder or pellets?", answer: "The choice depends on free-flowing behavior, particle size, available headroom and cleaning access. Drawer, grid and bar arrangements are commonly reviewed for gravity-flow duties." },
      { question: "Can a magnetic filter replace a metal detector?", answer: "No. A magnetic filter captures ferromagnetic particles. A metal detector is a detection system and may identify other metals depending on its configuration." },
      { question: "What should be confirmed for liquid or slurry filtration?", answer: "Please provide flow rate, viscosity, temperature, solids content, line pressure, connection size, installation orientation and the expected contamination type." },
      { question: "Does every magnetic filter meet food-processing requirements?", answer: "No. Food-related contact material, finish, cleaning method and documentation must be confirmed for the actual process; they should not be assumed from a product family name." }
    ],
    limitations: ["The product should not be described as food-grade, sanitary or pressure-rated unless the specific material and documentation are verified.", "Flow restriction and bridging risk must be assessed for cohesive or viscous materials."],
    technicalFields: ["Model", "Flow type", "Connection or housing interface", "Cleaning method", "Contact material", "Operating temperature", "Flow rate", "Installation direction"]
  },
  "recycling-sorting": {
    family: "recycling-sorting",
    primaryKeyword: "metal sorting equipment",
    primaryIndustry: "recycling and metal recovery",
    quickFacts: [
      { label: "Process role", value: "Separate a defined metal fraction after feed preparation" },
      { label: "Feed type", value: "Prepared, sized material on a controlled feed" },
      { label: "Process sequence", value: "Ferrous removal before non-ferrous separation" },
      { label: "Selection starts with", value: "Material mix, particle size and upstream preparation" }
    ],
    whyPoints: [
      { title: "Separation sequence is explicit", text: "A recycling line is reviewed from size reduction and screening through ferrous removal, the main sorting stage and downstream fraction handling." },
      { title: "Feed preparation affects results", text: "Particle size, feed distribution, material moisture and ferrous removal before non-ferrous sorting must be clarified." },
      { title: "Equipment roles remain separate", text: "Magnetic separation, eddy current separation, metal detection and stainless-steel sorting have different functions and are not presented as interchangeable." },
      { title: "Downstream fractions are planned", text: "The required ferrous, non-ferrous or residual output stream should be specified before equipment selection." }
    ],
    processSteps: ["Crushing or screening", "Ferrous pre-separation", "Primary sorting stage", "Separated metal fraction", "Residual or downstream sorting"],
    materials: ["Prepared scrap", "Construction and demolition feed", "WEEE fractions", "Mixed non-ferrous feed", "Recycling residues"],
    industrySlugs: ["recycling"],
    configurationOptions: ["Feed conveyor and metering arrangement", "Ferrous pre-separation coordinated with the sorting stage", "Particle-size range confirmed from screened feed", "Downstream collection and access planned with the line"],
    selectionFields: [
      ...baseSelection,
      { name: "selectionFeedSize", label: "Feed size range", placeholder: "Screened particle-size range" },
      { name: "selectionMaterialMix", label: "Material mix", placeholder: "Expected ferrous, non-ferrous and residual fractions" },
      { name: "selectionPreTreatment", label: "Upstream preparation", placeholder: "Shredding, screening and ferrous removal stages" },
      { name: "selectionOutput", label: "Required output fraction", placeholder: "Metal recovery or residual-cleaning objective" }
    ],
    selectionNotes: ["State whether ferrous material has already been removed upstream.", "Provide the screened feed size, feed rate and material mix.", "Describe the downstream collection or sorting stage so the equipment role is clear."],
    faqs: [
      { question: "Why is ferrous removal checked before an eddy current separator?", answer: "A magnetic pre-separation stage is commonly reviewed before non-ferrous sorting so the feed reaching the eddy current stage is prepared for its intended duty." },
      { question: "Can an eddy current separator remove ferrous tramp iron?", answer: "No. Eddy current equipment is used for non-ferrous metal recovery. Ferromagnetic material should be addressed with the appropriate magnetic separation stage." },
      { question: "What information is needed for recycling sorting selection?", answer: "Please share feed size, material mix, throughput, upstream preparation, existing ferrous removal, required output fractions and the available conveyor layout." },
      { question: "Can a stainless-steel sorting conveyor be described as a general metal separator?", answer: "No. Its application depends on the actual equipment capability and feed. It should be specified separately from magnetic and eddy-current stages." }
    ],
    limitations: ["Recovery performance is not stated without a defined feed and a line review.", "The product does not replace upstream screening, controlled feed or ferrous pre-separation where those stages are required."],
    technicalFields: ["Model", "Feed size range", "Feed rate", "Belt or conveyor interface", "Pre-separation requirement", "Target fraction", "Downstream discharge arrangement"]
  },
  "metal-detection": {
    family: "metal-detection",
    primaryKeyword: "industrial metal detector",
    primaryIndustry: "conveyor and bulk material inspection",
    quickFacts: [
      { label: "Process role", value: "Detect metal in a defined material path" },
      { label: "Detection scope", value: "Confirmed from the selected detector and product effect" },
      { label: "Action after alarm", value: "Alarm, stop or reject arrangement to be confirmed" },
      { label: "Selection starts with", value: "Opening size, product effect and conveyor conditions" }
    ],
    whyPoints: [
      { title: "Detection is not removal", text: "A metal detector identifies a signal under its configured conditions. The alarm, stop or reject response is a separate line-design decision." },
      { title: "Opening and material matter", text: "The window size, conveyed material, moisture or product effect and belt conditions should be reviewed together." },
      { title: "Integration is part of selection", text: "The detector needs a defined conveyor or chute position, electrical interface and response procedure for the operating team." },
      { title: "Magnetic separation can be complementary", text: "A magnetic separator may remove ferromagnetic contamination upstream, while a detector can be used for the separate detection role required by the line." }
    ],
    processSteps: ["Conveyed material", "Detector window", "Signal evaluation", "Alarm, stop or reject response", "Documented inspection action"],
    materials: ["Conveyed bulk material", "Processed products", "Recycling feed", "Granules and powders", "Packaged or unpackaged material subject to line design"],
    industrySlugs: ["recycling", "food-processing"],
    configurationOptions: ["Window or channel size", "Alarm, stop or reject signal arrangement", "Conveyor interface and belt condition review", "Electrical and communication interface confirmed for the line"],
    selectionFields: [
      ...baseSelection,
      { name: "selectionWindow", label: "Window / channel size", placeholder: "Opening dimensions and belt layout" },
      { name: "selectionDetectionTarget", label: "Detection target", placeholder: "Expected metal type and contamination size" },
      { name: "selectionProductEffect", label: "Material or product effect", placeholder: "Moisture, conductivity or other relevant condition" },
      { name: "selectionReject", label: "Required response", placeholder: "Alarm, stop or reject arrangement" }
    ],
    selectionNotes: ["Describe the actual conveyed product and operating conditions.", "State whether the line requires an alarm, stop signal or a separately designed reject action.", "Do not use a metal detector specification as proof that metal is automatically removed."],
    faqs: [
      { question: "What does a window metal detector do?", answer: "It monitors material passing through a defined aperture and provides a response according to its configuration. The final detection capability depends on the actual product, opening and operating conditions." },
      { question: "Does a metal detector remove metal automatically?", answer: "Not by itself. Removal requires an appropriate reject, stop or downstream separation arrangement designed for the production line." },
      { question: "Can a magnetic separator and metal detector be used together?", answer: "Yes, when their separate roles are clear: magnetic equipment addresses ferromagnetic material, while a detector provides the detection function required by the line." },
      { question: "What is required for a detector selection review?", answer: "Provide the window size, conveyor arrangement, material, product effect, expected contaminant, belt speed, required response and available electrical interface." }
    ],
    limitations: ["Detection capability must not be claimed without the actual material, aperture and operating condition.", "The detector is not presented as an automatic metal-removal device."],
    technicalFields: ["Model", "Window or channel size", "Material condition", "Detection target", "Belt or feed speed", "Alarm or reject interface", "Power and control requirement"]
  },
  "explosion-control": {
    family: "explosion-control",
    primaryKeyword: "industrial magnetic separator control equipment",
    primaryIndustry: "industrial electrical control and hazardous-area projects",
    quickFacts: [
      { label: "Process role", value: "Control or support a defined magnetic equipment duty" },
      { label: "Compatibility", value: "Confirmed against the connected equipment and electrical design" },
      { label: "Environment", value: "Hazardous-area requirements require document review" },
      { label: "Selection starts with", value: "Equipment model, power and site classification" }
    ],
    whyPoints: [
      { title: "Equipment pairing is specific", text: "The control device must be matched to the actual magnet or conveyor equipment and the site's electrical arrangement." },
      { title: "Documents are verified", text: "Explosion-protection classification, certificates and enclosure requirements are not assumed; they must be reviewed for the requested project." },
      { title: "Interlocks are planned", text: "Required start, stop, belt, alarm and safety interlocks should be defined with the line owner." },
      { title: "Site responsibility is clear", text: "Final installation and compliance requirements should be verified by the responsible project and electrical teams." }
    ],
    processSteps: ["Site electrical input", "Control or rectifier equipment", "Connected magnetic equipment", "Interlock and protection signals", "Documented commissioning review"],
    materials: ["Industrial control systems", "Conveyor magnetic equipment", "Mining magnetic equipment"],
    industrySlugs: ["mining", "cement-aggregate"],
    configurationOptions: ["Voltage and current matched to the connected equipment", "Control mode and interlocks defined for the line", "Enclosure and installation environment reviewed", "Required documentation confirmed before order"],
    selectionFields: [
      ...baseSelection,
      { name: "selectionConnectedEquipment", label: "Connected equipment", placeholder: "Magnet or conveyor model and duty" },
      { name: "selectionElectrical", label: "Electrical supply", placeholder: "Voltage, frequency and control requirement" },
      { name: "selectionEnvironment", label: "Installation environment", placeholder: "Dust, temperature and hazardous-area information" },
      { name: "selectionDocuments", label: "Required documentation", placeholder: "Project or compliance documents to confirm" }
    ],
    selectionNotes: ["Provide the connected equipment model and electrical data.", "State the project classification and document requirements; no protection class is assumed.", "Confirm site interlocks and safety responsibility with the project team."],
    faqs: [
      { question: "Can an explosion-protection rating be selected from the product name?", answer: "No. Any classification, certificate and installation requirement must be verified against the exact equipment, documents and site conditions." },
      { question: "What must be confirmed before a control box is quoted?", answer: "The connected equipment, supply, control mode, required interlocks, installation environment and project documentation should all be supplied for review." },
      { question: "Is a control box a substitute for a magnetic separator?", answer: "No. It supports or controls a defined equipment duty. The magnetic separation equipment and the control requirement are selected separately." },
      { question: "Who confirms final site compliance?", answer: "Final site compliance must be confirmed by the responsible project, electrical and safety teams using the verified documentation for the supplied configuration." }
    ],
    limitations: ["No explosion-protection classification, certification or compliance claim is shown unless verified for the exact requested configuration.", "Electrical and safety integration must be confirmed by the responsible project team."],
    technicalFields: ["Model", "Connected equipment", "Supply requirement", "Control mode", "Interlocks", "Enclosure environment", "Required documentation"]
  },
  lifting: {
    family: "lifting",
    primaryKeyword: "electromagnetic lifting magnet",
    primaryIndustry: "ferrous material handling",
    quickFacts: [
      { label: "Process role", value: "Lift defined ferromagnetic material under a controlled procedure" },
      { label: "Material scope", value: "Ferromagnetic material only" },
      { label: "Selection starts with", value: "Load shape, surface condition, duty and lifting arrangement" },
      { label: "Safety basis", value: "Site lifting plan and verified equipment documentation" }
    ],
    whyPoints: [
      { title: "Load conditions are specific", text: "Material shape, contact surface, temperature, stacking and handling method all affect the lifting review." },
      { title: "Safety planning is essential", text: "The equipment is considered within the site's approved lifting procedure, controlled area and responsible operating practice." },
      { title: "Power and control are matched", text: "The power source, controller, duty cycle and any backup requirement must be confirmed for the intended project." },
      { title: "Material scope is not broadened", text: "The product is described for ferromagnetic material handling; it is not represented as a universal lifting solution." }
    ],
    processSteps: ["Defined ferromagnetic load", "Verified lifting magnet and rigging", "Controlled lift path", "Safe set-down area", "Inspection and operating procedure"],
    materials: ["Ferrous scrap", "Steel plate or sections", "Ferromagnetic workpieces"],
    industrySlugs: ["recycling"],
    configurationOptions: ["Magnet and controller matched to the intended lifting duty", "Suspension and rigging interface reviewed", "Operating procedure and inspection requirement confirmed", "Power and site safety requirements discussed before selection"],
    selectionFields: [
      ...baseSelection,
      { name: "selectionLoad", label: "Load description", placeholder: "Material shape, condition and maximum handling requirement" },
      { name: "selectionLiftDuty", label: "Lifting duty", placeholder: "Cycle, handling method and site arrangement" },
      { name: "selectionPower", label: "Power and control", placeholder: "Available supply and control requirement" },
      { name: "selectionSafety", label: "Site safety requirement", placeholder: "Lifting plan or special operating condition" }
    ],
    selectionNotes: ["Provide a defined load description and the site's lifting arrangement.", "Confirm power, controller and inspection requirements before selection.", "Follow the responsible site's lifting plan and controlled-area procedure."],
    faqs: [
      { question: "What information is needed to select a lifting magnet?", answer: "Provide the actual ferromagnetic load shape and condition, handling method, maximum duty, lifting arrangement, power availability and site safety requirements." },
      { question: "Can a lifting magnet handle any material?", answer: "No. It is selected for defined ferromagnetic materials and duty conditions. The load and surface condition must be reviewed before a configuration is confirmed." },
      { question: "Are lifting safety requirements part of the product page?", answer: "The page identifies the need for a controlled lifting plan, but final safety procedure and site compliance are the responsibility of the operating project and qualified personnel." },
      { question: "Can a catalog page confirm lifting capacity?", answer: "No. Capacity and safety suitability require the exact configuration, load condition and verified documentation." }
    ],
    limitations: ["No lifting capacity is displayed or implied without a verified configuration and load condition.", "Use must follow the responsible site's approved lifting and safety procedure."],
    technicalFields: ["Model", "Load description", "Lifting duty", "Power and control", "Suspension arrangement", "Safety and inspection requirement"]
  }
};

const sampleOverrides: Record<string, Partial<ProductDetailProfile>> = {
  "rcyd-type-permanent-magnet-self-dumping-iron-remover": {
    overview: [
      "The RCYD permanent magnet self-dumping iron remover is an overhead magnetic separator for conveyor lines where ferromagnetic tramp material needs to be removed from a bulk stream before it reaches downstream equipment. Its role is practical: pull ferromagnetic pieces away from the conveyed material and move captured material to a defined discharge point through the self-dumping arrangement.",
      "It is normally discussed for lines handling ore, aggregate, coal, recycled material or other bulk solids. Correct selection depends on the actual belt width, belt speed, material layer depth, suspension height, expected size and frequency of tramp iron, and the space available for a safe discharge zone. COWIN MAGNET supports selection discussions, OEM/ODM configuration, sourcing coordination and export follow-up for industrial buyers."
    ],
    contentStatus: "sample-ready"
  },
  "rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover": {
    overview: [
      "The RCDD self-cooling self-dumping electromagnetic iron remover is intended for conveyor applications that require an electromagnetic overhead separation stage with continuous discharge of captured ferromagnetic material. The electromagnetic configuration is evaluated when the required working distance, material burden or tramp iron risk calls for a project-specific review rather than a simple manual-clean arrangement.",
      "The product should be positioned in a defined conveyor or transfer-point layout, with room for the discharge path and maintenance access. A suitable specification cannot be taken from the product name alone: conveyor geometry, belt speed, burden depth, suspension height, power supply, ambient conditions and the largest expected tramp item all need confirmation."
    ],
    contentStatus: "sample-ready"
  },
  "wet-drum-magnetic-separator": {
    overview: [
      "A Wet Drum Magnetic Separator is used in wet mineral-processing circuits where magnetic particles are separated from a slurry stream. Material enters the separation zone, magnetic particles are retained by the magnetic field and directed to a magnetic product outlet, while the non-magnetic portion follows its own discharge path. The exact process role may be recovery, cleaning, concentration or another defined stage in the flow sheet.",
      "The duty must be matched to the mineral, particle-size distribution, slurry condition, throughput and required product streams. Tank arrangement, feed direction and magnetic circuit are process decisions, not generic claims. COWIN MAGNET can coordinate an initial selection discussion from real process information and any available sample or plant data."
    ],
    contentStatus: "sample-ready"
  },
  "belt-high-gradient-magnetic-separator": {
    overview: [
      "The Belt High Gradient Magnetic Separator is a mineral-processing option for duties where the feed and target mineral response require a high-gradient separation stage. It should be placed in a defined process position, not selected as a stand-alone promise: the relevant questions are what enters the machine, which fraction is expected to respond magnetically and how the resulting streams continue through the plant.",
      "Before configuration, the project team should provide mineral type, feed size, moisture or slurry condition, throughput, separation target and any available process or test information. These inputs help determine whether this equipment family fits the duty or whether a drum, wet, dry or other separation route should be reviewed instead."
    ],
    contentStatus: "sample-ready"
  },
  "eccentric-eddy-current-separator": {
    overview: [
      "The Eccentric Eddy Current Separator is for recovering a defined non-ferrous metal fraction from prepared recycling feed. It belongs after the appropriate crushing or screening steps and after ferromagnetic material has been addressed by a separate magnetic stage. The product page therefore treats feed preparation and process sequence as part of the equipment decision, rather than presenting every metal-separation task as one function.",
      "For a useful review, describe the screened particle-size range, feed rate, material mix, existing ferrous pre-separation and the required output fractions. Those details determine whether the proposed machine position and downstream collection arrangement are appropriate for the line."
    ],
    contentStatus: "sample-ready"
  },
  "drawer-magnet": {
    overview: [
      "A Drawer Magnet is a magnetic filtration arrangement for dry, gravity-fed, free-flowing material where ferromagnetic contamination needs to be captured before a downstream process. It is commonly considered around hoppers, chutes and enclosed feed points, but the equipment must be matched to actual flow behavior, available installation space and the planned cleaning procedure.",
      "Material that bridges, compacts or carries significant moisture may require a different arrangement. For each project, the relevant inputs are material description, particle size, flow rate, temperature, interface dimensions, cleaning frequency and access. COWIN MAGNET can use those conditions to coordinate a suitable configuration discussion without assuming hygiene, temperature or magnetic-strength requirements."
    ],
    contentStatus: "sample-ready"
  },
  "rotary-pipe-magnet": {
    overview: [
      "A Rotary Pipe Magnet is a magnetic filtration option for a defined process flow where a rotating arrangement may be considered to help manage material contact and cleaning. The exact suitability depends on whether the feed is dry, granular, cohesive, liquid or slurry, as well as its temperature, flowability and connection geometry.",
      "This product should be discussed as one element of the material path, with the inlet, magnetic contact zone, outlet and cleaning access understood together. It is not described as a universal solution for every powder or pipeline duty. The initial selection record should include flow rate, material behavior, temperature, interface size and the expected cleaning interval."
    ],
    contentStatus: "sample-ready"
  },
  "gjt-type-window-metal-detector": {
    overview: [
      "The GJT window metal detector is an inspection device installed around a defined material path. It is used to detect a metal signal under the conditions set by the actual opening size, conveyed material, product effect and line configuration. A detector is not represented as a magnetic separator or as an automatic removal device: the required alarm, stop or reject response must be specified with the conveyor line.",
      "Selection starts with the window dimensions, the material being conveyed, expected contaminant, belt speed, product condition and required response after a signal. Where ferromagnetic contamination needs to be physically removed, a magnetic stage can be reviewed separately in the process sequence."
    ],
    contentStatus: "sample-ready"
  }
};

const displayNames: Record<string, string> = {
  "rcyd-type-permanent-magnet-self-dumping-iron-remover": "RCYD Permanent Self-Cleaning Iron Remover",
  "rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover": "RCDD Self-Cooling Electromagnetic Iron Remover",
  "belt-high-gradient-magnetic-separator": "Belt High-Gradient Magnetic Separator",
  "wet-drum-magnetic-separator": "Wet Drum Magnetic Separator",
  "eccentric-eddy-current-separator": "Eccentric Eddy Current Separator",
  "drawer-magnet": "Drawer Magnet",
  "rotary-pipe-magnet": "Rotary Pipe Magnet",
  "gjt-type-window-metal-detector": "GJT Window Metal Detector"
};

function normalizedName(product: Product) {
  return `${product.name} ${product.category}`.toLowerCase();
}

export function getProductFamily(product: Product): ProductFamily {
  const text = normalizedName(product);
  if (/(metal detector|window metal|channel metal)/.test(text)) return "metal-detection";
  if (/(eddy current|stainless steel separation)/.test(text)) return "recycling-sorting";
  if (/(control box|rectifier|explosion-proof|explosion proof|rbcdb|rbcdd|rbcyd|kgla|kxb|qjz)/.test(text)) return "explosion-control";
  if (/(lifting magnet|lifting)/.test(text)) return "lifting";
  if (/(drawer|grid|grate|magnetic rod|magnetic trap|pipe magnet|pipeline|filter|hump magnet|permanent filter bar|rotary)/.test(text)) return "filtering";
  if (/(wet|dry|drum|gradient|tailing|desliming|ore|coal washing|pre-selection|concentrated)/.test(text)) return "mineral-processing";
  return "suspended";
}

export function getProductDetailProfile(product: Product): ProductDetailProfile {
  const family = getProductFamily(product);
  const base = familyProfiles[family];
  const override = sampleOverrides[product.slug] || {};
  const defaultOverview = [
    `${product.name} is presented as a ${base.primaryKeyword} option for ${base.primaryIndustry}. Its final configuration should be based on the actual material, process position, operating conditions and the technical information available for the requested project.`,
    `COWIN MAGNET supports selection discussions, OEM/ODM configuration, sourcing coordination, inspection communication and export follow-up for industrial buyers. Product-specific values are confirmed from the selected configuration rather than assumed from a generic catalog description.`
  ];

  return {
    ...base,
    ...override,
    overview: override.overview || defaultOverview,
    contentStatus: override.contentStatus || "template-ready"
  };
}

export function getProductDisplayName(product: Product) {
  return displayNames[product.slug] || product.name;
}

function titleCase(value: string) {
  return value.replace(/\btype\b/gi, "").replace(/\s+/g, " ").trim();
}

export function productSeoTitle(product: Product) {
  const family = getProductFamily(product);
  const compactName = titleCase(getProductDisplayName(product));
  const suffix = family === "suspended" ? "Conveyor Iron Removal" : familyProfiles[family].primaryIndustry;
  // The root layout appends the COWIN MAGNET suffix through its title template.
  const title = `${compactName} for ${suffix}`;
  return title.length <= 52 ? title : compactName;
}

export function productSeoDescription(product: Product) {
  const profile = getProductDetailProfile(product);
  const description = `${getProductDisplayName(product)} for ${profile.primaryIndustry}. Share material and operating conditions with COWIN MAGNET for configuration support.`;
  return description.length <= 160 ? description : `${description.slice(0, 157).replace(/\s+\S*$/, "").trim()}...`;
}
