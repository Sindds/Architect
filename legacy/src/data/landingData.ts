import {
  VillaProject,
  PackageTier,
  EngineeringPillar,
  RoadmapStep,
  FaqItem,
  RealCase,
  ConstructionVideo,
  TrustDocument,
  TeamMember,
  ReviewItem,
} from '../types';

export const VILLA_PROJECTS: VillaProject[] = [
  {
    id: 'vista',
    name: 'ARCLINE VISTA',
    tagline: {
      ru: 'Архитектурный баланс света, массивного остекления и чистых горизонталей',
      en: 'Architectural equilibrium of natural light, frameless glazing, and pure horizontals',
    },
    style: 'fachwerk',
    styleName: { ru: 'Панорамный фахверк', en: 'Panoramic Fachwerk' },
    area: 380,
    bedrooms: 4,
    bathrooms: 4,
    floors: 2,
    durationDays: 120,
    priceRub: 24500000,
    priceUsd: 268000,
    mainImage: '/src/assets/images/vista_exterior_fachwerk_1791226463608.webp',
    secondaryImage: '/src/assets/images/vista_interior_living_1791226475298.webp',
    features: {
      ru: [
        'Двусветная гостиная с высотой потолка 7.2м',
        'Безрамные раздвижные порталы Guardian Glass',
        'Мастер-сьют 54 м² с гардеробной и террасой',
        'Интегрированный навес на 2 автомобиля',
      ],
      en: [
        'Double-height living room with 7.2m ceilings',
        'Guardian Glass frameless sliding portal systems',
        '54 m² primary suite with walk-in closet & terrace',
        'Integrated covered carport for 2 luxury vehicles',
      ],
    },
    specs: {
      ru: {
        foundation: 'Монолитная ребристая плита с ростверком и гидроизоляцией',
        glazing: 'Двухкамерный энергоэффективный триплекс с напылением серебра',
        timber: 'Австрийский клееный брус камерной сушки 240×240 мм',
        energyRating: 'Passivhaus A++ (R = 1.18 м²·°C/Вт)',
      },
      en: {
        foundation: 'Monolithic ribbed reinforced slab with dual waterproofing',
        glazing: 'Triple-pane argon-filled tempered glass with dual silver coating',
        timber: 'Austrian kiln-dried engineered glued timber 240×240 mm',
        energyRating: 'Passivhaus A++ (R = 1.18 m²·°C/W)',
      },
    },
  },
  {
    id: 'nordic',
    name: 'ARCLINE NORDIC',
    tagline: {
      ru: 'Энергоэффективность Passivhaus и второй свет для единения с сосновым лесом',
      en: 'Passivhaus ultra-efficiency and double-height volume for pine forest immersion',
    },
    style: 'minimal',
    styleName: { ru: 'Скандинавский минимализм', en: 'Nordic Minimalism' },
    area: 290,
    bedrooms: 3,
    bathrooms: 3,
    floors: 1,
    durationDays: 95,
    priceRub: 18900000,
    priceUsd: 207000,
    mainImage: '/src/assets/images/nordic_exterior_villa_1791226487192.webp',
    secondaryImage: '/src/assets/images/nordic_interior_lounge_1791226497950.webp',
    features: {
      ru: [
        'Одноэтажная безбарьерная планировка',
        'Крытая лаунж-терраса 68 м² с очагом',
        'SPA-зона с кедровой сауной и выходом во внутренний двор',
        'Скрытая инженерия и приточная вентиляция Zehnder',
      ],
      en: [
        'Single-story barrier-free architectural layout',
        'Covered 68 m² lounge terrace with outdoor hearth',
        'SPA wing with cedar sauna and secluded courtyard access',
        'Concealed MEP engineering & Zehnder heat recovery ventilation',
      ],
    },
    specs: {
      ru: {
        foundation: 'Утепленная шведская плита (УШП) со встроенным контуром',
        glazing: 'Guardian ClimaGuard Premium 8-16-6-16-8',
        timber: 'Ель северной сортировки, биозащита Remmers',
        energyRating: 'Passivhaus A+++ (удельное потребление < 15 кВт·ч/м²)',
      },
      en: {
        foundation: 'Insulated Swedish Foundation Slab with integrated heating loops',
        glazing: 'Guardian ClimaGuard Premium structural glass',
        timber: 'Northern European spruce, Remmers certified eco-sealant',
        energyRating: 'Passivhaus A+++ (Annual heating < 15 kWh/m²)',
      },
    },
  },
  {
    id: 'titan',
    name: 'ARCLINE TITAN',
    tagline: {
      ru: 'Монолитный Hi-Tech с 6-метровыми консольными выносами и эксплуатируемой кровлей',
      en: 'Reinforced concrete Hi-Tech with 6m cantilevered decks and rooftop sky terrace',
    },
    style: 'monolith',
    styleName: { ru: 'Монолитный Hi-Tech', en: 'Monolithic Hi-Tech' },
    area: 540,
    bedrooms: 5,
    bathrooms: 6,
    floors: 2,
    durationDays: 160,
    priceRub: 39200000,
    priceUsd: 429000,
    mainImage: '/src/assets/images/titan_exterior_monolith_1791226508091.webp',
    secondaryImage: '/src/assets/images/titan_interior_gallery_1791226518952.webp',
    features: {
      ru: [
        'Эксплуатируемая кровля 120 м² с джакузи и панорамным обзором',
        'Бесшовные перекрытия по технологии предварительно напряженного бетона',
        'Подземный винный погреб и сигарная комната с климат-контролем',
        'Автономная резервная система энергоснабжения Tesla/LiFePO4',
      ],
      en: [
        '120 m² engineered rooftop sky lounge with jacuzzi & panoramic views',
        'Seamless post-tensioned reinforced architectural concrete spans',
        'Underground climate-controlled wine gallery and cigar room',
        'Redundant commercial-grade hybrid solar/LiFePO4 backup power',
      ],
    },
    specs: {
      ru: {
        foundation: 'Свайное поле с монолитным железобетонным ростверком В30 W8',
        glazing: 'Reynaers Hi-Finity моторизованные порталы',
        timber: 'Монолитный железобетон + термоясень на скрытом крепеже',
        energyRating: 'Passivhaus A+ (Сейсмоустойчивость до 8 баллов)',
      },
      en: {
        foundation: 'Piled foundation with monolithic reinforced tie beam B30 W8',
        glazing: 'Reynaers Hi-Finity motorized structural slider portals',
        timber: 'Cast-in-place structural concrete + thermowood facade',
        energyRating: 'Passivhaus A+ (Engineered up to 8 Richter seismic scale)',
      },
    },
  },
  {
    id: 'serene',
    name: 'ARCLINE CHALET',
    tagline: {
      ru: 'Современное шале с массивным гранитным цоколем, каминным залом и панорамными фронтонами',
      en: 'Contemporary luxury chalet featuring granite masonry, cathedral hearth hall & panoramic gables',
    },
    style: 'chalet',
    styleName: { ru: 'Современное шале', en: 'Modern Chalet' },
    area: 320,
    bedrooms: 3,
    bathrooms: 4,
    floors: 1,
    durationDays: 110,
    priceRub: 21800000,
    priceUsd: 238000,
    mainImage: '/src/assets/images/chalet_exterior_stone_1791226528798.webp',
    secondaryImage: '/src/assets/images/chalet_interior_fireplace_1791226542576.webp',
    features: {
      ru: [
        'Внутренний световой колодец с бонсай в центре дома',
        'Акустически изолированный кабинет для конфиденциальных переговоров',
        'Каминный зал с панорамной топкой 180°',
        'Ориентация по сторонам света с расчетом солярного тепла',
      ],
      en: [
        'Central architectural atrium garden with private bonsai courtyard',
        'Acoustically isolated executive office for confidential calls',
        'Three-sided 180° panoramic fire chamber in the main gallery',
        'Solar azimuth alignment engineered for passive winter gain',
      ],
    },
    specs: {
      ru: {
        foundation: 'Монолитная ребристая плита с термоотсечками Schöck Isokorb',
        glazing: 'Schüco FWS 50+ фахверковая стоечно-ригельная система',
        timber: 'Лиственница экстра-класса и клееный брус 280 мм',
        energyRating: 'Passivhaus A++ (Шумоизоляция внешнего контура 48 дБ)',
      },
      en: {
        foundation: 'Monolithic reinforced slab with Schöck Isokorb thermal breaks',
        glazing: 'Schüco FWS 50+ structural curtain wall framing system',
        timber: 'Select alpine larch and 280mm laminated structural posts',
        energyRating: 'Passivhaus A++ (Exterior acoustic isolation: 48 dB)',
      },
    },
  },
];

export const ENGINEERING_PILLARS: EngineeringPillar[] = [
  {
    id: 'precision',
    number: '01',
    title: {
      ru: 'Прецизионная нарезка Hundegger K2i',
      en: 'Hundegger K2i Robotic CNC Precision',
    },
    metric: '±0.2 мм',
    metricLabel: {
      ru: 'Заводской допуск сопряжений',
      en: 'Factory joinery tolerance',
    },
    description: {
      ru: 'Все узлы и замки изготавливаются на немецких 5-осевых станках с ЧПУ. Никакой подгонки бензопилой на стройплощадке — идеальная геометрия контура исключает продувание и скрипы.',
      en: 'All beam joinery and locking grooves are milled in a climate-controlled plant on German 5-axis robotic CNCs. Zero manual field adjustments — guaranteeing seamless airtight seals.',
    },
    badge: { ru: 'Стандарт Германии', en: 'German Standard' },
    iconName: 'Cpu',
  },
  {
    id: 'thermal',
    number: '02',
    title: {
      ru: 'Тепловой барьер Passivhaus A++',
      en: 'Passivhaus A++ Thermal Shield',
    },
    metric: 'R = 1.18',
    metricLabel: {
      ru: 'м²·°C/Вт сопротивление остекления',
      en: 'm²·°C/W thermal resistance',
    },
    description: {
      ru: 'Аргононаполненные двухкамерные стеклопакеты Guardian Glass с двойным серебряным магнетронным напылением. Внутри тепло при -38°C на улице, и прохладно в летний зной без перегрузки кондиционеров.',
      en: 'Double-argon filled structural triple-glazing by Guardian Glass with dual magnetron silver coating. Keeps interior temperature steady at -38°C winter or +35°C summer heatwaves.',
    },
    badge: { ru: 'Guardian ClimaGuard', en: 'Guardian ClimaGuard' },
    iconName: 'ShieldCheck',
  },
  {
    id: 'bim',
    number: '03',
    title: {
      ru: 'Цифровой двойник BIM LOD-500',
      en: 'BIM LOD-500 Digital Twin',
    },
    metric: '100%',
    metricLabel: {
      ru: 'Коллизий устранено до бетона',
      en: 'Clashes resolved before pour',
    },
    description: {
      ru: 'Сквозная 3D-модель объекта объединяет архитектуру, статику конструкций и все 7 инженерных систем (ОВ, ВК, ЭОМ, СС, СКД). Вы получаете цифровую эксплуатационную модель виллы на всю жизнь.',
      en: 'End-to-end parametric 3D model harmonizing structural loads with all 7 MEP networks (HVAC, plumbing, power, automation). Handed over as an operational digital twin.',
    },
    badge: { ru: 'Autodesk Revit & Navisworks', en: 'Autodesk Revit & Navisworks' },
    iconName: 'Layers',
  },
  {
    id: 'acoustic',
    number: '04',
    title: {
      ru: 'Акустический комфорт студии звукозаписи',
      en: 'Studio-Grade Acoustic Decoupling',
    },
    metric: '48 дБ',
    metricLabel: {
      ru: 'Шумоподавление внешнего контура',
      en: 'Exterior noise suppression',
    },
    description: {
      ru: 'Виброразвязанные перекрытия Sylomer, акустический триплекс Stratophone и бесшумные фановые трубы Geberit Silent-PP. Гроза, ветер или шум с подъездной дороги не потревожат ваш сон.',
      en: 'Vibration-isolated Sylomer floor decks, Stratophone acoustic laminated glass, and Geberit Silent-PP drainage pipes. Absolute sanctuary of silence during storms and high winds.',
    },
    badge: { ru: 'Silent Architecture', en: 'Silent Architecture' },
    iconName: 'VolumeX',
  },
  {
    id: 'contract',
    number: '05',
    title: {
      ru: 'Фиксированная смета и штрафы за просрочку',
      en: 'Guaranteed Fixed Cap & Escrow Assurance',
    },
    metric: '0 ₽',
    metricLabel: {
      ru: 'Скрытых доплат по договору',
      en: 'Unplanned contract surcharges',
    },
    description: {
      ru: 'Твердая цена фиксируется в Приложении №1 к Договору генподряда. Любое удорожание материалов или просчеты в проекте бюро Arcline компенсирует за счет собственного гарантийного фонда.',
      en: 'Guaranteed maximum price legally anchored in Annex 1. Any market price fluctuations or site miscalculations are strictly absorbed by Arcline corporate reserve fund.',
    },
    badge: { ru: 'Банковское сопровождение', en: 'Escrow & Legal Shield' },
    iconName: 'FileCheck',
  },
  {
    id: 'supervision',
    number: '06',
    title: {
      ru: 'Круглосуточный технадзор и видеострим 4K',
      en: '24/7 AI Site Telemetry & 4K Stream',
    },
    metric: '24/7',
    metricLabel: {
      ru: 'Доступ в приложении заказчика',
      en: 'Real-time client mobile app access',
    },
    description: {
      ru: 'Камеры с зумом на площадке, еженедельные фотоотчеты со скрытыми работами и независимый аудит на каждом этапе от фундамента до ввода в эксплуатацию.',
      en: 'PTZ 4K streaming cameras, geo-tagged hidden work inspection reports, and independent structural audit prior to every concrete pour and frame installation.',
    },
    badge: { ru: 'Личный кабинет', en: 'Client Portal' },
    iconName: 'Camera',
  },
];

export const PACKAGE_TIERS: PackageTier[] = [
  {
    id: 'contour',
    title: { ru: 'Теплый Контур', en: 'Thermal Envelope' },
    subtitle: {
      ru: 'Несущий каркас, кровля и панорамное остекление',
      en: 'Load-bearing frame, roof insulation & structural glazing',
    },
    pricePerM2Rub: 65000,
    pricePerM2Usd: 710,
    features: {
      ru: [
        'Железобетонный фундамент (плита / ростверк на сваях)',
        'Австрийский клееный брус 240×240 мм Hundegger K2i',
        'Панорамное безрамное остекление Guardian Glass с аргоном',
        'Кровельный пирог с PIR/базальтовым утеплением 250 мм',
        'Входная портальная группа с терморазрывом и биометрией',
        'Гарантия на несущий конструктив 25 лет',
      ],
      en: [
        'Reinforced monolithic foundation slab with dual tanking',
        'Austrian 240×240 mm glued timber milled by Hundegger K2i',
        'Guardian Glass argon-filled structural frameless portals',
        '250mm high-density PIR/mineral roof thermal envelope',
        'Thermal-break entrance pivot door with biometric access',
        '25-year structural warranty on load-bearing frame',
      ],
    },
    timeline: { ru: '45 - 60 рабочих дней', en: '45 - 60 working days' },
  },
  {
    id: 'turnkey',
    title: { ru: 'Инженерный White Box', en: 'MEP Engineering White Box' },
    subtitle: {
      ru: 'Полный комплекс инженерных сетей и предчистовая отделка',
      en: 'Full MEP infrastructure, climate systems & pre-finish envelope',
    },
    pricePerM2Rub: 95000,
    pricePerM2Usd: 1040,
    isPopular: true,
    badge: { ru: 'Выбор 75% клиентов', en: 'Chosen by 75% of Clients' },
    features: {
      ru: [
        'Все опции комплектации «Теплый Контур»',
        'Разводка лучевой системы отопления и конвекторов Mohlenhoff',
        'Водяные теплые полы Rehau Rautitan во всех помещениях',
        'Приточно-вытяжная вентиляция с рекуперацией тепла и увлажнением',
        'Электромонтаж по стандарту Schneider Electric Acti9',
        'Базовая автоматизация Умного дома на шине KNX',
        'Котельная премиум-класса (Viessmann / Buderus + резерв)',
      ],
      en: [
        'All inclusions from Thermal Envelope tier',
        'Underfloor Mohlenhoff trench convectors and manifold heating',
        'Rehau Rautitan radiant floor heating throughout all zones',
        'Zehnder heat-recovery ventilation with adiabatic humidification',
        'Industrial electrical paneling via Schneider Electric Acti9',
        'KNX bus-based smart automation core for lights & climate',
        'Commercial boiler plant (Viessmann/Buderus with dual redundancy)',
      ],
    },
    timeline: { ru: '90 - 120 рабочих дней', en: '90 - 120 working days' },
  },
  {
    id: 'allinclusive',
    title: { ru: 'All Inclusive VIP', en: 'All Inclusive Bespoke' },
    subtitle: {
      ru: 'Дизайнерская отделка, итальянская мебель и ландшафт',
      en: 'Turnkey interior architecture, curated Italian furniture & landscape',
    },
    pricePerM2Rub: 145000,
    pricePerM2Usd: 1590,
    badge: { ru: 'Максимальный комфорт', en: 'Turnkey Luxury' },
    features: {
      ru: [
        'Все опции комплектации «Инженерный White Box»',
        'Премиальная чистовая отделка (крупноформатный керамогранит, шпон дуба)',
        'Комплектация сантехникой Gessi, Antonio Lupi, Villeroy & Boch',
        'Индивидуальная встроенная мебель и кухни из массива и камня',
        'Полная экосистема Умного дома с голосовым управлением и сценариями',
        'Ландшафтный дизайн участка: автополив, мощение, освещение, газон',
        'Персональный консьерж-сервис на 2 года после сдачи',
      ],
      en: [
        'All inclusions from MEP Engineering White Box',
        'Artisanal finishing: large-format porcelain, natural oak veneer panels',
        'Luxury sanitary fittings: Gessi, Antonio Lupi, Villeroy & Boch',
        'Custom built-in architectural cabinetry & stone island kitchens',
        'Full KNX/Savant smart home with multiroom sound and scene automations',
        'Integrated landscape: automatic irrigation, granite pavers, ambient lights',
        '2-year dedicated property concierge and scheduled MEP service',
      ],
    },
    timeline: { ru: '150 - 180 рабочих дней', en: '150 - 180 working days' },
  },
];

export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    step: '01',
    days: 'Дни 1–14',
    title: { ru: 'Геология, аудит и топография', en: 'Geotechnical & Solar Audit' },
    desc: {
      ru: '3 шурфа геологических изысканий, определение несущей способности грунтов, роза ветров и инсоляционный расчет.',
      en: '3 soil core drillings, groundwater depth testing, wind azimuth analysis, and exact topographic GPS surveying.',
    },
    deliverable: { ru: 'Отчет геологии + акт согласования пятна застройки', en: 'Geotech report + legal site boundary signoff' },
  },
  {
    step: '02',
    days: 'Дни 15–35',
    title: { ru: 'BIM-проект и твердая смета', en: 'BIM LOD-500 & Guaranteed Cap' },
    desc: {
      ru: '3 варианта планировок, фотореалистичные 3D-рендеры, VR-прогулка по вилле и фиксация сметы в Приложении №1.',
      en: '3 custom space layouts, architectural photorealistic renders, VR walkthrough, and guaranteed contract cost signoff.',
    },
    deliverable: { ru: 'Полный рабочий альбом АР + КР + ИОС', en: 'Full architectural, structural & MEP drawing set' },
  },
  {
    step: '03',
    days: 'Дни 36–65',
    title: { ru: 'Заводское производство каркаса', en: 'Factory CNC Pre-fabrication' },
    desc: {
      ru: 'Высокоточная нарезка клееного бруса на Hundegger K2i, антисептирование в автоклаве, изготовление триплекса Guardian.',
      en: 'High-precision timber CNC milling, autoclave pressure treatment, and Guardian structural glass manufacturing.',
    },
    deliverable: { ru: 'Паспорт заводского домокомплекта с серийными номерами', en: 'Certified factory manufacturing passport' },
  },
  {
    step: '04',
    days: 'Дни 66–115',
    title: { ru: 'Монтаж фундамента и контура', en: 'Foundation & Structural Erection' },
    desc: {
      ru: 'Заливка монолитной плиты с виброуплотнением, сборка каркаса за 21 день, герметизация швов и монтаж порталов.',
      en: 'Monolithic concrete slab pouring, airtight frame erection in 21 days, and vacuum-lift glazed portal installation.',
    },
    deliverable: { ru: 'Акты скрытых работ + тест аэродверью на герметичность', en: 'Blower-door airtightness certificate (n50 < 0.6 h⁻¹)' },
  },
  {
    step: '05',
    days: 'Дни 116–140',
    title: { ru: 'Инженерия и передача резиденции', en: 'MEP Commissioning & Keys Handover' },
    desc: {
      ru: 'Опрессовка систем отопления, настройка щитов автоматики, клининг премиум-класса и вручение золотого ключа.',
      en: 'Pressure-testing hydraulic networks, smart home programming, white-glove cleaning, and keys handover.',
    },
    deliverable: { ru: 'Гарантийный сертификат 25 лет + ключи в подарочном боксе', en: '25-year structural warranty deed + luxury key box' },
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: { ru: 'Энергоэффективность', en: 'Thermal & Glazing' },
    question: {
      ru: 'Действительно ли тепло в фахверковом доме с панорамным стеклом в морозы -35°C?',
      en: 'Is a panoramic glass villa truly warm in harsh -35°C winter conditions?',
    },
    answer: {
      ru: 'Абсолютно. В резиденциях Arcline применяются двухкамерные энергосберегающие стеклопакеты Guardian Glass со специальным магнетронным напылением оксидов серебра и заполнением аргоном. Их сопротивление теплопередаче R = 1.18 м²·°C/Вт превосходит кирпичную стену толщиной 64 см. Зимой стекло отражает инфракрасное тепло внутрь дома, а внутрипольные конвекторы создают восходящую тепловую завесу, полностью исключая запотевание.',
      en: 'Absolutely. We engineer villas with Guardian Glass argon-filled double-cavity glazing featuring magnetron dual-silver coating. Its thermal insulation factor R = 1.18 m²·°C/W surpasses a solid 64 cm brick wall. During sub-zero winters, heat radiation is bounced back into the living space, while in-floor trench convectors create a warm air curtain preventing condensation.',
    },
  },
  {
    id: 'faq-2',
    category: { ru: 'Договор и Финансы', en: 'Contract & Pricing' },
    question: {
      ru: 'Может ли смета вырасти в процессе строительства из-за инфляции или подорожания материалов?',
      en: 'Can the construction cost increase during execution due to inflation or materials?',
    },
    answer: {
      ru: 'Исключено на 100%. Мы фиксируем твердую стоимость в рублях (или в валюте по договоренности) в Приложении №1 к Договору генерального подряда. Все закупки основных конструкций (брус, стеклопакеты, арматура) резервируются и оплачиваются на заводских складах сразу после подписания. Если на стройке возникнут непредвиденные издержки по нашей вине, бюро Arcline покрывает их за счет собственного резервного фонда.',
      en: '100% strictly excluded. We lock a guaranteed maximum cost in Annex 1 of our general contractor agreement. All critical materials (timber beams, structural glass, steel) are reserved and hedged in warehouse inventory right after contract signing. Any unanticipated costs are completely covered by Arcline corporate reserve fund.',
    },
  },
  {
    id: 'faq-3',
    category: { ru: 'Конструктив и Долговечность', en: 'Structure & Longevity' },
    question: {
      ru: 'Какой реальный срок службы у клееного бруса и каркаса Arcline?',
      en: 'What is the actual operational lifespan of Arcline engineered timber frames?',
    },
    answer: {
      ru: 'Расчетный срок службы наших резиденций — более 90 лет. Мы закупаем отборную северную ель и лиственницу зимней рубки с плотными годовыми кольцами. Склейка бруса происходит полиуретановым швейцарским эко-клеем Purbond без формальдегида, который не рассыхается и не выделяет токсинов. На несущий каркас мы предоставляем юридическую гарантию 25 лет.',
      en: 'The engineered operational lifespan exceeds 90 years. We procure winter-harvested dense-grain northern timber. Laminations are bonded using Swiss solvent-free Purbond polyurethane adhesives with zero formaldehyde emissions. We back the structural integrity with a legally binding 25-year structural warranty.',
    },
  },
  {
    id: 'faq-4',
    category: { ru: 'Контроль Качества', en: 'Quality & Control' },
    question: {
      ru: 'Как заказчик контролирует строительство, если находится в командировке или за рубежом?',
      en: 'How does the client supervise construction while traveling abroad?',
    },
    answer: {
      ru: 'Вам не нужно регулярно приезжать на объект. Мы устанавливаем поворотные 4K-камеры с защищенным доступом в личном кабинете мобильного приложения. Каждую пятницу главный инженер формирует подробный фото- и видеоотчет со скрытыми работами, инструментальными замерами и актами приемки технадзора.',
      en: 'You never need to spend time commuting to the site. We equip the plot with secured 4K PTZ live streaming cameras accessible on iOS/Android. Every Friday, your project director publishes a documented inspection report with geolocated photos of hidden works and engineering signoffs.',
    },
  },
];

export const REAL_CASES: RealCase[] = [
  {
    id: 'millennium-park',
    title: { ru: 'Вилла Миллениум // Millennium Park', en: 'Villa Millennium // Millennium Park' },
    location: {
      ru: 'Новорижское шоссе, 23 км, к/п «Millennium Park»',
      en: 'Novorizhskoe Hwy 23km, Millennium Park Estate',
    },
    builtYear: 2024,
    area: 480,
    budgetRub: 38400000,
    budgetUsd: 419000,
    timelineDays: 118,
    style: 'Панорамный фахверк + клинкерный кирпич',
    energyRating: 'Passivhaus A++ (Q = 14 кВт·ч/м²·год)',
    finishedImage:
      '/src/assets/images/vista_exterior_fachwerk_1791226463608.webp',
    constructionImage:
      '/src/assets/images/novariga_construction_site_1791402742102.webp',
    blueprintImage:
      '/src/assets/images/novariga_bim_blueprint_1791402774881.webp',
    clientQuote: {
      ru: '«Смета не выросла ни на копейку. Дом сдали на 6 дней раньше контрактного срока, а зимой отопление обходится дешевле трехкомнатной квартиры в Хамовниках».',
      en: '«Not a single penny of cost overrun. The keys were handed over 6 days ahead of schedule, and winter heating bills are lower than my downtown flat».',
    },
    verifiedBadge: { ru: 'Сдан в эксплуатацию // Ноябрь 2024', en: 'Commissioned // Nov 2024' },
    engineeringHighlights: {
      ru: [
        'Фундамент: Утепленная шведская плита (УШП) 300 мм с гидроизоляцией Технониколь Техноэласт',
        'Каркас: Немецкий клееный брус 260×280 мм, нарезка замков на Hundegger K2i',
        'Остекление: Guardian SunGuard Neutral 70/35 с мультифункциональным напылением',
        'Инженерия: Приточно-вытяжная вентиляция с рекуперацией тепла Zehnder ComfoAir 92%',
      ],
      en: [
        'Substructure: Insulated Swedish Foundation Slab 300mm with dual polymer membranes',
        'Frame: Engineered kiln-dried Glulam 260×280mm milled on robotic Hundegger K2i',
        'Glazing: Guardian SunGuard Neutral 70/35 triple-pane solar control glass',
        'HVAC: Zehnder ComfoAir 92% high-efficiency heat recovery ventilation',
      ],
    },
    keyMetrics: [
      { label: { ru: 'Срок по договору / факт', en: 'Contract vs Actual Time' }, value: '124 / 118 дней' },
      { label: { ru: 'Тепловой тест Blower Door', en: 'Airtightness n50' }, value: '0.48 1/ч (Passivhaus)' },
      { label: { ru: 'Отклонение геометрии', en: 'Structural Tolerance' }, value: '±1.2 мм по всему контуру' },
      { label: { ru: 'Экономия на отоплении', en: 'Annual Energy Savings' }, value: '68% относительно СНиП' },
    ],
  },
  {
    id: 'agalarov-residence',
    title: { ru: 'Резиденция Агаларов // Agalarov Estate', en: 'Agalarov Residence // Agalarov Estate' },
    location: {
      ru: 'Новорижское шоссе, 24 км, к/п «Agalarov Estate»',
      en: 'Novorizhskoe Hwy 24km, Agalarov Estate',
    },
    builtYear: 2024,
    area: 640,
    budgetRub: 56900000,
    budgetUsd: 621000,
    timelineDays: 145,
    style: 'Монолит Hi-Tech + панорамные фасады',
    energyRating: 'Passivhaus A+ (Q = 18 кВт·ч/м²·год)',
    finishedImage:
      '/src/assets/images/titan_exterior_monolith_1791226508091.webp',
    constructionImage:
      '/src/assets/images/agalarov_construction_site_1791402789924.webp',
    blueprintImage:
      '/src/assets/images/agalarov_bim_blueprint_1791402804711.webp',
    clientQuote: {
      ru: '«Главным вызовом было панорамное остекление высотой 6.5 метров без видимых стоек. Команда Arcline выполнила статическую модель в BIM и привезла стекло на вакуумных пауках».',
      en: '«The main engineering challenge was 6.5m high frameless glass facades. Arcline FEA structural team solved the wind-load calculations effortlessly».',
    },
    verifiedBadge: { ru: 'Сдан в эксплуатацию // Сентябрь 2024', en: 'Commissioned // Sep 2024' },
    engineeringHighlights: {
      ru: [
        'Монолитный железобетонный каркас B35 W8 F200 с безбалочными перекрытиями',
        'Раздвижные моторизованные порталы Schüco ASE 80.HI с интеграцией в систему KNX',
        'Геотермальное отопление: 8 скважин по 95 метров с грунтовым тепловым насосом Viessmann',
        'Кровля: инверсионная эксплуатируемая терраса с системой дренажа и подогревом воронок',
      ],
      en: [
        'Cast-in-place reinforced monolithic frame B35 W8 with beamless slab spans',
        'Motorized Schüco ASE 80.HI panoramic sliding portals integrated into KNX bus',
        'Geothermal energy: 8 closed-loop boreholes (95m deep) with Viessmann ground-source pump',
        'Inverted green rooftop terrace with hidden siphonic drainage and perimeter melt cables',
      ],
    },
    keyMetrics: [
      { label: { ru: 'Срок реализации', en: 'Total Build Time' }, value: '145 дней под ключ' },
      { label: { ru: 'Максимальный пролет', en: 'Longest Clear Span' }, value: '11.8 м без колонн' },
      { label: { ru: 'Высота остекления', en: 'Glass Facade Height' }, value: '6.5 метров' },
      { label: { ru: 'Гарантия конструктива', en: 'Structural Guarantee' }, value: '25 лет по договору' },
    ],
  },
  {
    id: 'repino-pine',
    title: { ru: 'Вилла Репино Pine // Финский залив', en: 'Villa Repino Pine // Gulf of Finland' },
    location: {
      ru: 'Курортный район, пос. Репино, сосновый бор',
      en: 'Resort District, Repino Enclave, St. Petersburg',
    },
    builtYear: 2023,
    area: 340,
    budgetRub: 27800000,
    budgetUsd: 304000,
    timelineDays: 98,
    style: 'Скандинавский фахверк + термоясень',
    energyRating: 'Passivhaus A++ (Q = 12 кВт·ч/м²·год)',
    finishedImage:
      '/src/assets/images/nordic_exterior_villa_1791226487192.webp',
    constructionImage:
      '/src/assets/images/repino_construction_site_1791402819862.webp',
    blueprintImage:
      '/src/assets/images/repino_bim_blueprint_1791402835570.webp',
    clientQuote: {
      ru: '«Зимний монтаж при температуре -22°C прошел за 18 дней без единой ошибки. Немецкая точность замков Hundegger показала себя идеально — в доме ни одного сквозняка».',
      en: '«Sub-zero winter assembly at -22°C took just 18 days with flawless joinery fitment. Hundegger German millwork guaranteed zero drafts».',
    },
    verifiedBadge: { ru: 'Сдан в эксплуатацию // Декабрь 2023', en: 'Commissioned // Dec 2023' },
    engineeringHighlights: {
      ru: [
        'Сохранение 100% вековых сосен на пятне застройки за счет точечного свайного поля',
        'Фасады из термомодифицированного ясеня с скрытым креплением Camo',
        'Энергосберегающий триплекс с зеркальным напылением от перегрева летом',
        'Интеллектуальная система контроля протечек и климата с резервированием по LTE',
      ],
      en: [
        '100% preserved pine forest biome via pinpoint driven micropiles footprint',
        'Thermally modified ash facade rainscreen with concealed Camo fasteners',
        'Solar-reflective low-E laminated glass eliminating summer solar gain',
        'Smart automatic leak detection and microclimate control with dual LTE redundancy',
      ],
    },
    keyMetrics: [
      { label: { ru: 'Срок монтажа каркаса', en: 'Frame Assembly Time' }, value: '18 дней на площадке' },
      { label: { ru: 'Сохранено сосен', en: 'Preserved Mature Trees' }, value: '34 дерева на участке' },
      { label: { ru: 'Заводской контроль', en: 'QC Checklist Points' }, value: '184 параметра технадзора' },
      { label: { ru: 'Тепловой барьер', en: 'Envelope R-Value' }, value: '1.22 м²·°C/Вт' },
    ],
  },
  {
    id: 'nikolina-gora',
    title: { ru: 'Вилла Николина Гора // Рублевка', en: 'Villa Nikolina Gora // Rublyovka' },
    location: {
      ru: 'Рублево-Успенское шоссе, 26 км, «Николина Гора»',
      en: 'Rublyovo-Uspenskoe Hwy 26km, Nikolina Gora',
    },
    builtYear: 2023,
    area: 520,
    budgetRub: 44200000,
    budgetUsd: 483000,
    timelineDays: 132,
    style: 'Комбинированный фахверк + гранитная облицовка',
    energyRating: 'Passivhaus A+ (Q = 16 кВт·ч/м²·год)',
    finishedImage:
      '/src/assets/images/chalet_exterior_stone_1791226528798.webp',
    constructionImage:
      '/src/assets/images/nikolina_construction_site_1791402850712.webp',
    blueprintImage:
      '/src/assets/images/nikolina_bim_blueprint_1791402872210.webp',
    clientQuote: {
      ru: '«При заключении договора зафиксировали сумму в рублях. В 2023 году цены на материалы взлетели на 25%, но для меня цена осталась точно такой, как в приложении №1».',
      en: '«Locked our contract in rubles. When industry raw material prices spiked 25%, my balance sheet remained strictly unchanged as promised».',
    },
    verifiedBadge: { ru: 'Сдан в эксплуатацию // Август 2023', en: 'Commissioned // Aug 2023' },
    engineeringHighlights: {
      ru: [
        'Цокольный этаж с гидроизоляционной мембраной Sika и дренажной системой',
        'Каминная зона с подвесным очагом Focus и огнестойким коробом Promat',
        'Внутрипольные конвекторы с тангенциальными вентиляторами 24 В',
        'Автономное дизель-генераторное резервирование 40 кВА с АВР',
      ],
      en: [
        'Full subterranean cellar with Sika watertight membrane and perimeter drain',
        'Suspended sculptural Focus hearth with certified Promat fire protection envelope',
        'Ultra-quiet 24V EC in-floor trench convectors with architectural aluminum grilles',
        '40 kVA automatic standby diesel generator with instantaneous transfer switch',
      ],
    },
    keyMetrics: [
      { label: { ru: 'Срок строительства', en: 'Construction Timeline' }, value: '132 рабочих дня' },
      { label: { ru: 'Доплаты по смете', en: 'Contract Surcharges' }, value: '0 ₽ (Твердая цена)' },
      { label: { ru: 'Стеклопакеты AGC', en: 'Glazing Package' }, value: '380 м² световых проемов' },
      { label: { ru: 'Гарантийный полис', en: 'Warranty Certificate' }, value: '№ AR-2023-0889' },
    ],
  },
];

export const CONSTRUCTION_VIDEOS: ConstructionVideo[] = [
  {
    id: 'vid-1',
    title: {
      ru: 'Роботизированная нарезка замков бруса на немецком станке Hundegger K2i',
      en: 'CNC Robotic Joinery Fabrication on Hundegger K2i System',
    },
    duration: '03:42',
    category: { ru: 'Заводское ЧПУ', en: 'Factory CNC' },
    thumbnail:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    videoUrl: '/videos/video-1.mp4',
    description: {
      ru: 'Заводской процесс фрезеровки сложных замковых соединений «ласточкин хвост» с автоматическим контролем геометрических допусков ±0.2 мм.',
      en: 'Robotic milling of multi-axis dovetail timber joints with continuous laser calibration within ±0.2 mm engineering precision.',
    },
    equipmentTag: 'Hundegger K2i Robotic Center',
  },
  {
    id: 'vid-2',
    title: {
      ru: 'Монтаж панорамных триплекс-стеклопакетов весом 820 кг вакуумным пауком',
      en: 'Installing 820 kg Giant Structural Glass Panes with Vacuum Lifters',
    },
    duration: '02:15',
    category: { ru: 'Монтаж на объекте', en: 'On-Site Glass' },
    thumbnail:
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    videoUrl: '/videos/video-2.mp4',
    description: {
      ru: 'Ювелирная установка мультифункционального остекления Guardian Glass высотой 6 метров с помощью крана-манипулятора и двухконтурного захвата.',
      en: 'Precision insertion of 6-meter Guardian Glass structural panes using dual-circuit suction manipulators.',
    },
    equipmentTag: 'Palfinger Crane + Vacuum Spider',
  },
  {
    id: 'vid-3',
    title: {
      ru: 'Инструментальный тест герметичности аэродверью Blower Door по стандарту Passivhaus',
      en: 'Blower Door Air Permeability Test under Passivhaus Standard',
    },
    duration: '04:10',
    category: { ru: 'Инспекция качества', en: 'Tech Supervision' },
    thumbnail:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    videoUrl: '/videos/video-3.mp4',
    description: {
      ru: 'Создание перепада давления 50 Па и поиск скрытых утечек тепловизором Flir. Результат сданной виллы n50 = 0.48 (норма Passivhaus < 0.60).',
      en: '50 Pa differential pressure cycling with Flir thermal imaging. Certified airtightness n50 = 0.48 1/h.',
    },
    equipmentTag: 'Minneapolis Blower Door Model 4',
  },
  {
    id: 'vid-4',
    title: {
      ru: 'Скоростной монтаж несущего каркаса фахверка: 21 день от фундамента до стропил',
      en: 'Timelapse: Timber Frame Assembly from Slab to Rafters in 21 Days',
    },
    duration: '01:50',
    category: { ru: 'Таймлапс стройки', en: 'Timelapse' },
    thumbnail:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    videoUrl: '/videos/video-4.mp4',
    description: {
      ru: 'Ускоренное видео возведения двухэтажной резиденции площадью 420 м² в поселке Millennium Park.',
      en: 'Accelerated timelapse of a 420 m² residence structural assembly in Millennium Park luxury estate.',
    },
    equipmentTag: '4K Ultra-HD Site Cam',
  },
];

export const TRUST_DOCUMENTS: TrustDocument[] = [
  {
    id: 'doc-passport',
    title: { ru: 'Архитектурно-строительный паспорт виллы LOD-500', en: 'Villa BIM Project Passport LOD-500' },
    category: 'passport',
    categoryLabel: { ru: 'Паспорт проекта', en: 'Project Passport' },
    regNumber: 'LOD500-ARC-2026-08',
    issuer: 'Главный проектный институт ARCLINE',
    validity: 'Бессрочно (с регистрацией в Росреестре)',
    description: {
      ru: 'Полный комплект рабочей документации разделов АР (архитектура), КР (конструкции), ОВ/ВК (инженерия), ЭОМ и кабельный журнал с привязкой к координатам участка.',
      en: 'Complete construction drawings including Architectural, Structural, MEP, and Electrical master plans coordinated to mm coordinates.',
    },
    previewImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    downloadLabel: { ru: 'Скачать образец проекта АР/КР (PDF)', en: 'Download Sample Blueprint (PDF)' },
    fileSize: '18.4 МБ',
  },
  {
    id: 'doc-estimate',
    title: { ru: 'Детализированная смета с гарантией твердой цены', en: 'Itemized Estimate with Locked Price Guarantee' },
    category: 'estimate',
    categoryLabel: { ru: 'Образец сметы', en: 'Itemized Estimate' },
    regNumber: 'EST-2026-NVR-480',
    issuer: 'Сметно-финансовый отдел ARCLINE',
    validity: 'Фиксируется в Договоре подряда',
    description: {
      ru: 'Смета из 420+ позиций с фиксацией стоимости материалов, механизмов и работ. По договору сумма доплат строго равна 0 ₽.',
      en: 'Itemized transparent breakdown across 420+ construction lines with zero price creep guarantee.',
    },
    previewImage:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    downloadLabel: { ru: 'Скачать образец сметы (Excel/PDF)', en: 'Download Sample Estimate (PDF)' },
    fileSize: '4.2 МБ',
  },
  {
    id: 'doc-contract',
    title: { ru: 'Договор генерального подряда со штрафами за просрочку', en: 'General Contractor Agreement with Escrow & Penalties' },
    category: 'contract',
    categoryLabel: { ru: 'Договор генподряда', en: 'Contract Agreement' },
    regNumber: 'DGP-2026-CORP',
    issuer: 'Юридический департамент ARCLINE',
    validity: 'Действует на весь период строительства + 25 лет',
    description: {
      ru: 'Официальный договор с зеркальной ответственностью: поэтапная оплата через эскроу-счет, штраф 0.1% в день за срыв срока сдачи и банковская гарантия.',
      en: 'Comprehensive contractor agreement with escrow stage milestones, daily delay liquidated damages, and performance bond.',
    },
    previewImage:
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    downloadLabel: { ru: 'Скачать проект договора генподряда', en: 'Download Agreement Template' },
    fileSize: '2.8 МБ',
  },
  {
    id: 'doc-warranty',
    title: { ru: 'Гарантийный сертификат на несущий конструктив 25 лет', en: '25-Year Structural Load-Bearing Warranty Deed' },
    category: 'warranty',
    categoryLabel: { ru: 'Гарантийный полис', en: 'Warranty Deed' },
    regNumber: 'WRN-25Y-00941',
    issuer: 'Служба главного инженера ARCLINE',
    validity: '25 лет с даты подписания акта ввода',
    description: {
      ru: 'Именной сертификат с серийным голографическим знаком, закрепляющий ежегодное бесплатное ТО теплового контура и кровли.',
      en: 'Official certificate granting 25 years of structural warranty and complimentary annual thermal envelope inspection.',
    },
    previewImage:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    downloadLabel: { ru: 'Скачать образец гарантийного полиса', en: 'Download Warranty Deed' },
    fileSize: '1.9 МБ',
  },
  {
    id: 'doc-sro',
    title: { ru: 'Свидетельство СРО на генподряд и проектирование объектов', en: 'Official SRO License & ISO 9001:2015 Certification' },
    category: 'sro',
    categoryLabel: { ru: 'Допуск СРО и лицензии', en: 'SRO License' },
    regNumber: 'СРО-С-284-07112017 / № 048291',
    issuer: 'Ассоциация «Объединение строителей» / Passivhaus Institut',
    validity: 'Действующий статус (в реестре НОПРИЗ / НОСТРОЙ)',
    description: {
      ru: 'Допуск к выполнению функций генерального подрядчика и проектировщика для объектов стоимостью до 500 млн рублей. Страхование ответственности на 100 млн руб.',
      en: 'Full statutory accreditation for general contracting & architecture up to 500M RUB. 100M RUB liability insurance included.',
    },
    previewImage:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    downloadLabel: { ru: 'Скачать выписку из реестра СРО', en: 'Download SRO Registry Extract' },
    fileSize: '1.4 МБ',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'arch-1',
    name: { ru: 'Алексей Бережной', en: 'Alexey Berezhnoy' },
    role: { ru: 'Главный архитектор бюро', en: 'Principal Architect' },
    experienceYears: 18,
    credentials: {
      ru: 'МАРХИ (специальность «Архитектура»), член Союза архитекторов РФ',
      en: 'Moscow Architectural Institute (MArchI), Union of Architects of Russia',
    },
    photo:
      '/src/assets/images/team_alexey_portrait_1791316187784.webp',
    bio: {
      ru: 'Разрабатывает объемно-планировочные решения и проектную документацию марки АР. Специализируется на фахверковых конструкциях и большепролетном остеклении с расчетом естественной инсоляции и теплового баланса помещений.',
      en: 'Develops architectural layouts and working drawings (AR). Specializes in timber post-and-beam construction and large-format glazing with natural daylighting and room thermal balance analysis.',
    },
    achievements: {
      ru: [
        'Разработка альбомов АР и авторский надзор на объектах',
        'Оптимизация раскладки остекления под стандартные форматы стеклопакетов',
        'Увязка фасадных узлов с инженерами-конструкторами',
      ],
      en: [
        'Comprehensive architectural sets (AR) and on-site author supervision',
        'Facade glazing optimization matching structural glass manufacturing standards',
        'Detailed interface coordination between envelope nodes and structural frame',
      ],
    },
  },
  {
    id: 'eng-2',
    name: { ru: 'Михаил Тарасов', en: 'Mikhail Tarasov' },
    role: { ru: 'Главный инженер проектов (ГИП)', en: 'Chief Structural Engineer (PE)' },
    experienceYears: 16,
    credentials: {
      ru: 'МГСУ (ПГС), включен в Национальный реестр специалистов (НОПРИЗ)',
      en: 'MGSU Civil Engineering, Licensed in National Registry of Specialists (NOPRIZ)',
    },
    photo:
      '/src/assets/images/team_mikhail_engineer_1791316200520.webp',
    bio: {
      ru: 'Выполняет статические и прочностные расчеты несущих конструкций марки КР (КД / КЖ) в расчетных комплексах SCAD и Лира-САПР. Формирует рабочие спецификации и файлы раскроя бруса для станков с ЧПУ.',
      en: 'Performs structural static and strength calculations for timber and reinforced concrete (KR) in SCAD and LIRA-SAPR. Prepares fabrication specifications and CNC cutting data for automated timber machining.',
    },
    achievements: {
      ru: [
        'Расчет снеговых и ветровых нагрузок по СП 20.13330',
        'Подбор сечений клееного бруса и узловых соединений на нагелях и шпильках',
        'Проектирование фундаментных плит с учетом инженерно-геологических изысканий',
      ],
      en: [
        'Wind and snow load structural analysis in strict accordance with SP 20.13330',
        'Glulam cross-section sizing and structural timber dowel/pin node calculations',
        'Foundation slab and ground beam design based on verified geotechnical borings',
      ],
    },
  },
  {
    id: 'sup-3',
    name: { ru: 'Дмитрий Волков', en: 'Dmitry Volkov' },
    role: { ru: 'Инженер строительного контроля (Технадзор)', en: 'Construction Quality Control Engineer' },
    experienceYears: 14,
    credentials: {
      ru: 'МГСУ (ПГС), квалификационный аттестат технического надзора',
      en: 'MGSU Civil Engineering, Certified Technical Supervision Inspector',
    },
    photo:
      '/src/assets/images/team_dmitry_qc_1791316213087.webp',
    bio: {
      ru: 'Осуществляет операционный контроль качества на всех этапах СМР: проверка армирования перед бетонированием, контроль геометрии каркаса нивелиром и тахеометром, входной контроль пиломатериалов и освидетельствование скрытых работ.',
      en: 'Conducts operational quality control across all construction milestones: rebar verification prior to concrete pouring, optical total station framing alignment, raw lumber incoming inspection, and concealed work audits.',
    },
    achievements: {
      ru: [
        'Оформление актов освидетельствования скрытых работ (АОСР)',
        'Входной контроль влажности и геометрии поступающего клееного бруса',
        'Инструментальная проверка герметичности теплового контура (Blower Door)',
      ],
      en: [
        'Formal signing of concealed works inspection certificates (AOSR)',
        'Moisture content and dimensional incoming checks on delivered glulam timber',
        'Instrumental blower-door envelope airtightness diagnostics before interior finishing',
      ],
    },
  },
  {
    id: 'bim-4',
    name: { ru: 'Екатерина Соколова', en: 'Ekaterina Sokolova' },
    role: { ru: 'Ведущий инженер ОВК и ВК // BIM-координатор', en: 'Lead HVAC & Plumbing Engineer // BIM Coordinator' },
    experienceYears: 11,
    credentials: {
      ru: 'СПбГАСУ (Теплогазоснабжение и вентиляция), Autodesk Certified Professional',
      en: 'SPbGASU (HVAC & Water Supply), Autodesk Certified Professional',
    },
    photo:
      '/src/assets/images/team_ekaterina_bim_1791316228337.webp',
    bio: {
      ru: 'Проектирует разделы отопления, вентиляции с рекуперацией тепла, кондиционирования и водоснабжения (ОВ, ВК). Координирует трассировку инженерных сетей в цифровой модели Revit для исключения пересечений с несущими балками.',
      en: 'Designs heating, heat recovery ventilation, air conditioning, and domestic plumbing (HVAC & MEP). Coordinates duct and pipe routing within Autodesk Revit models to prevent spatial clashes with structural timber framing.',
    },
    achievements: {
      ru: [
        'Гидравлический и аэродинамический расчет сетей дома',
        'Координация скрытых проходок коммуникаций через деревянные конструкции',
        'Спецификация оборудования котельных и приточно-вытяжных установок',
      ],
      en: [
        'Hydraulic and aerodynamic calculations for hydronic heating and ductwork',
        'Pre-coordinated structural penetrations for utilities through timber frame',
        'Comprehensive equipment specifications for boiler rooms and ventilation plants',
      ],
    },
  },
];

export const VERIFIED_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    authorName: { ru: 'Сергей и Елена Вороновы', en: 'Sergey & Elena Voronov' },
    authorTitle: { ru: 'Владельцы виллы 480 м²', en: 'Villa Owners (480 m²)' },
    location: { ru: 'к/п «Millennium Park», Новорижское ш.', en: 'Millennium Park, Novorizhskoe Hwy' },
    villaName: 'ARCLINE VISTA 480',
    area: 480,
    yearBuilt: 2024,
    rating: 5,
    avatar: '/src/assets/images/client_sergey_elena_1790974502846.webp',
    villaPhoto: '/src/assets/images/vista_exterior_fachwerk_1791226463608.webp',
    verifiedOwner: true,
    videoUrl: '/videos/video-1.mp4',
    text: {
      ru: '«Мы искали подрядчика больше года. Все обещали золотые горы, но в договорах оставляли лазейки для удорожания сметы. Arcline стали единственными, кто подписал твердую цену в рублях и прописал штраф за каждый день просрочки. Дом сдали раньше срока на неделю! Остекление фантастическое: в морозы -30°C в доме тепло и сухо».',
      en: '«We spent a whole year vetting contractors. Arcline was the only bureau that contractually committed to a locked fixed price in rubles with daily delay penalties. They delivered one week ahead of schedule! The triple glazing is sublime: at -30°C outside, the home is cozy and whisper-quiet».',
    },
  },
  {
    id: 'rev-2',
    authorName: { ru: 'Константин Васильев', en: 'Konstantin Vasiliev' },
    authorTitle: { ru: 'Владелец резиденции 640 м²', en: 'Residence Owner (640 m²)' },
    location: { ru: 'к/п «Agalarov Estate»', en: 'Agalarov Estate' },
    villaName: 'ARCLINE MONOLITH 640',
    area: 640,
    yearBuilt: 2024,
    rating: 5,
    avatar: '/src/assets/images/client_konstantin_owner_1790974513567.webp',
    villaPhoto: '/src/assets/images/titan_exterior_monolith_1791226508091.webp',
    verifiedOwner: true,
    videoUrl: '/videos/video-2.mp4',
    text: {
      ru: '«По роду деятельности я часто в разъездах. Контролировал стройку через личный кабинет: 4K-камеры на участке и еженедельные подробнейшие отчеты от технадзора с лазерными замерами. Никаких нервов, полное спокойствие. Отдельный респект за геотермальное отопление — счета за электричество в огромном доме смешные».',
      en: '«Because of my international travels, I supervised the entire build via their online portal with 4K live cameras and weekly laser survey reports. Zero stress. The geothermal HVAC system is pure engineering brilliance».',
    },
  },
  {
    id: 'rev-3',
    authorName: { ru: 'Марина и Артем Григорьевы', en: 'Marina & Artem Grigoriev' },
    authorTitle: { ru: 'Владельцы виллы 340 м²', en: 'Villa Owners (340 m²)' },
    location: { ru: 'Курортный район, пос. Репино', en: 'Repino Enclave, St. Petersburg' },
    villaName: 'ARCLINE NORDIC 340',
    area: 340,
    yearBuilt: 2023,
    rating: 5,
    avatar: '/src/assets/images/client_marina_artem_1790974524724.webp',
    villaPhoto: '/src/assets/images/nordic_exterior_villa_1791226487192.webp',
    verifiedOwner: true,
    text: {
      ru: '«Главной нашей мечтой было сохранить сосны на участке. Архитектор Алексей Бережной выехал на местность, сделал геодезическую съемку каждого дерева и виртуозно посадил дом между стволами. Монтаж каркаса за 18 дней зимой на морозе поразил всех соседей. Живем второй год — абсолютный восторг».',
      en: '«Our top priority was keeping every pine tree intact. Principal architect Alexey personally plotted each trunk with a total station. The 18-day winter timber assembly astonished all our neighbors. Two years in, it is pure architectural bliss».',
    },
  },
];

