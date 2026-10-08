import {
  VillaProject,
  RealCase,
  TeamMember,
  ReviewItem,
  EngineeringPillar,
  PackageTier,
  RoadmapStep,
  FaqItem,
} from '../types';

/**
 * =======================================================================
 *               ЕДИНЫЙ ЦЕНТР УПРАВЛЕНИЯ КОНТЕНТОМ САЙТА
 *                 ARCLINE ESTATE — MASTER CONTENT REGISTRY
 * =======================================================================
 * 
 * В ЭТОМ ФАЙЛЕ СОБРАНЫ ВСЕ ТЕКСТЫ, ИЗОБРАЖЕНИЯ И ИКОНКИ ВСЕГО САЙТА!
 * Больше не нужно искать по компонентам — просто измените значение здесь,
 * и оно мгновенно обновится на сайте.
 * 
 * Также на самом сайте есть визуальный редактор (кнопка "✎ Редактор контента"),
 * позволяющий менять любые поля в реальном времени с предпросмотром!
 * =======================================================================
 */

/**
 * БИБЛИОТЕКА ДОСТУПНЫХ ИЗОБРАЖЕНИЙ ПРОЕКТА
 * Используйте эти пути для быстрой смены фотографий в любом блоке:
 */
export const SITE_IMAGES = {
  // Виллы и архитектура
  vistaExterior: '/src/assets/images/vista_exterior_fachwerk_1791226463608.webp',
  vistaInterior: '/src/assets/images/vista_interior_living_1791226475298.webp',
  nordicExterior: '/src/assets/images/nordic_exterior_villa_1791226487192.webp',
  nordicInterior: '/src/assets/images/nordic_interior_lounge_1791226497950.webp',
  titanExterior: '/src/assets/images/titan_exterior_monolith_1791226508091.webp',
  titanInterior: '/src/assets/images/titan_interior_gallery_1791226518952.webp',
  chaletExterior: '/src/assets/images/chalet_exterior_stone_1791226528798.webp',
  chaletInterior: '/src/assets/images/chalet_interior_fireplace_1791226542576.webp',
  
  // Дополнительные локации и стройплощадка
  villaNovariga: '/src/assets/images/villa_fachwerk_novariga_1790974449998.webp',
  villaAgalarov: '/src/assets/images/villa_monolith_estate_1790974470505.webp',
  villaRepino: '/src/assets/images/villa_nordic_repino_1790974460773.webp',
  villaForest: '/src/assets/images/villa_serene_forest_1790974481188.webp',
  timberConstructionSite: '/src/assets/images/site_construction_timber_1790974492241.webp',

  // Индивидуальные стройплощадки под каждый объект
  novarigaConstruction: '/src/assets/images/novariga_construction_site_1791402742102.webp',
  novarigaBlueprint: '/src/assets/images/novariga_bim_blueprint_1791402774881.webp',

  agalarovConstruction: '/src/assets/images/agalarov_construction_site_1791402789924.webp',
  agalarovBlueprint: '/src/assets/images/agalarov_bim_blueprint_1791402804711.webp',

  repinoConstruction: '/src/assets/images/repino_construction_site_1791402819862.webp',
  repinoBlueprint: '/src/assets/images/repino_bim_blueprint_1791402835570.webp',

  nikolinaConstruction: '/src/assets/images/nikolina_construction_site_1791402850712.webp',
  nikolinaBlueprint: '/src/assets/images/nikolina_bim_blueprint_1791402872210.webp',

  // Команда бюро
  teamAlexey: '/src/assets/images/team_alexey_portrait_1791316187784.webp',
  teamMikhail: '/src/assets/images/team_mikhail_engineer_1791316200520.webp',
  teamDmitry: '/src/assets/images/team_dmitry_qc_1791316213087.webp',
  teamEkaterina: '/src/assets/images/team_ekaterina_bim_1791316228337.webp',

  // Отзывы и клиенты
  clientSergeyElena: '/src/assets/images/client_sergey_elena_1790974502846.webp',
  clientKonstantin: '/src/assets/images/client_konstantin_owner_1790974513567.webp',
  clientMarinaArtem: '/src/assets/images/client_marina_artem_1790974524724.webp',
};

export interface SiteBrandConfig {
  name: string;
  tagline: { ru: string; en: string };
  phone: string;
  email: string;
  address: { ru: string; en: string };
  hours: { ru: string; en: string };
  logoIcon: string;
}

export interface SiteHeroConfig {
  pretitle: { ru: string; en: string };
  title: { ru: string; en: string };
  subtitle: { ru: string; en: string };
  backgroundImage: string;
  ctaCalculateText: { ru: string; en: string };
  ctaCatalogText: { ru: string; en: string };
  watermarkText: string;
  stats: {
    number: string;
    label: { ru: string; en: string };
  }[];
}

export interface SiteAboutConfig {
  sectionBadge: { ru: string; en: string };
  established: string;
  manifestoTitle: { ru: string; en: string };
  description: { ru: string; en: string };
  metrics: {
    number: string;
    label: { ru: string; en: string };
  }[];
  subCards: {
    title: string;
    text: { ru: string; en: string };
    icon: string;
  }[];
}

export interface SiteEngineeringConfig {
  sectionBadge: { ru: string; en: string };
  subtitleBadge: string;
  title: { ru: string; en: string };
  subtitle: { ru: string; en: string };
  pillars: EngineeringPillar[];
}

export interface SiteMasterConfig {
  brand: SiteBrandConfig;
  hero: SiteHeroConfig;
  about: SiteAboutConfig;
  engineering: SiteEngineeringConfig;
  villas: VillaProject[];
  realCases: RealCase[];
  team: TeamMember[];
  reviews: ReviewItem[];
  packages: PackageTier[];
  roadmap: RoadmapStep[];
  faq: FaqItem[];
}

/**
 * ДЕФОЛТНАЯ СТРУКТУРА КОНТЕНТА САЙТА
 * Вы можете редактировать любые поля прямо здесь!
 */
export const DEFAULT_SITE_CONTENT: SiteMasterConfig = {
  // 1. БРЕНД И КОНТАКТЫ
  brand: {
    name: 'ARCLINE ESTATE',
    tagline: {
      ru: 'Архитектурно-инженерное бюро полного цикла',
      en: 'Architectural & Engineering Bureau',
    },
    phone: '+7 (495) 890-44-12',
    email: 'vip@arcline-estate.ru',
    address: {
      ru: 'МО, Новорижское ш., 23-й км, БЦ «Riga Land», строение 3, этаж 2',
      en: 'BC Riga Land, Novorizhskoe Hwy 23km, Bldg 3, Fl 2, Moscow Region',
    },
    hours: {
      ru: 'Пн–Вс: 10:00 – 21:00 (по предварительной записи)',
      en: 'Mon–Sun: 10:00 – 21:00 (by appointment)',
    },
    logoIcon: 'Compass',
  },

  // 2. ГЛАВНЫЙ ЭКРАН (HERO)
  hero: {
    pretitle: {
      ru: 'АРХИТЕКТУРНО-ИНЖЕНЕРНЫЙ ГЕНПОДРЯД ПОЛНОГО ЦИКЛА // EST. 2014',
      en: 'FULL-CYCLE ARCHITECTURAL & ENGINEERING GENERAL CONTRACTOR // EST. 2014',
    },
    title: {
      ru: 'Инженерные резиденции с панорамным остеклением и гарантией сроков',
      en: 'High-Performance Panoramic Residences with Guaranteed Delivery',
    },
    subtitle: {
      ru: 'Проектируем и возводим энергоэффективные фахверковые и монолитные резиденции: фиксированная смета в договоре, заводская прецизионность Hundegger K2i и 25 лет юридической гарантии на конструктив.',
      en: 'Engineering ultra-efficient timber post-and-beam and monolithic villas with fixed-price contracts, Hundegger K2i German precision, and 25-year structural warranties.',
    },
    backgroundImage: SITE_IMAGES.vistaExterior,
    ctaCalculateText: {
      ru: 'Рассчитать смету виллы',
      en: 'Calculate Villa Budget',
    },
    ctaCatalogText: {
      ru: 'Коллекция проектов',
      en: 'Explore Collection',
    },
    watermarkText: 'ARCLINE ESTATE',
    stats: [
      {
        number: '140+',
        label: {
          ru: 'Реализованных резиденций точно в срок',
          en: 'Turnkey Residences Delivered On-Time',
        },
      },
      {
        number: '0 ₽',
        label: {
          ru: 'Удорожаний по твердой смете',
          en: 'Budget Overruns Guaranteed',
        },
      },
      {
        number: '25 Лет',
        label: {
          ru: 'Гарантия на несущий конструктив',
          en: 'Comprehensive Structural Warranty',
        },
      },
      {
        number: '±0.2 мм',
        label: {
          ru: 'Точность замковых узлов Hundegger',
          en: 'Hundegger Joint Machining Accuracy',
        },
      },
    ],
  },

  // 3. О БЮРО (ABOUT)
  about: {
    sectionBadge: {
      ru: 'О БЮРО // ARCLINE ESTATE',
      en: 'ABOUT // ARCLINE ESTATE',
    },
    established: 'EST. 2014 // MOSCOW',
    manifestoTitle: {
      ru: 'Мы не строим типовые дома. Мы проектируем авторские резиденции, где обилие света, эстетика и конструктивная надежность объединены в единую экосистему.',
      en: 'We do not build generic homes. We engineer architectural sanctuaries, where panoramic daylight, bespoke aesthetics, and structural durability merge into a unified ecosystem.',
    },
    description: {
      ru: 'Каждая резиденция Arcline создается по индивидуальному цифровому BIM-двойнику со строгой валидацией теплового контура по стандарту Passivhaus. Собственное роботизированное производство с ЧПУ Hundegger K2i и независимый технадзор полностью исключают мостики холода, задержки поставок и непредвиденные перерасходы сметы.',
      en: 'Every Arcline residence is engineered through an individual digital BIM model with strict thermal envelope validation under certified Passivhaus standards. Our proprietary CNC fabrication facility and dedicated engineering supervision eliminate thermal bridging, supply delays, and budget overruns.',
    },
    metrics: [
      {
        number: '140+',
        label: { ru: 'Реализованных вилл', en: 'Villas in prime locations' },
      },
      {
        number: '80+',
        label: { ru: 'Авторских BIM-проектов', en: 'Signature BIM designs' },
      },
      {
        number: '50+',
        label: { ru: 'Премиальных фактур отделки', en: 'Curated finishes' },
      },
      {
        number: '25 лет',
        label: { ru: 'Гарантия на несущий каркас', en: 'Structural warranty' },
      },
    ],
    subCards: [
      {
        title: 'Purbond Swiss Eco-Adhesive',
        text: {
          ru: 'Австрийский клееный брус с полиуретановым эко-составом Purbond (Швейцария) без формальдегида. Стандарт безопасности E0 — абсолютная экологичность для вашей семьи.',
          en: 'Certified Austrian engineered timber with polyurethane adhesives completely free of formaldehyde and solvents. Eco-standard E0.',
        },
        icon: 'ShieldCheck',
      },
      {
        title: 'Hundegger K2i ±0.2 mm',
        text: {
          ru: 'Прецизионная нарезка замковых узлов на немецком 5-осевом обрабатывающем комплексе. Идеальная геометрия контура без продуваний, трещин и усадки.',
          en: 'Robotic milling of timber joints on high-speed German machining centers. Zero joint gaps and flawless geometry without settling.',
        },
        icon: 'Award',
      },
    ],
  },

  // 4. ИНЖЕНЕРНЫЕ СТАНДАРТЫ (ENGINEERING)
  engineering: {
    sectionBadge: {
      ru: 'ТЕХНОЛОГИИ // ENGINEERING',
      en: 'ENGINEERING STANDARDS',
    },
    subtitleBadge: 'GERMAN & SWISS TECH',
    title: {
      ru: 'Бескомпромиссная точность в каждой инженерной детали',
      en: 'Uncompromising Precision in Every Engineering Detail',
    },
    subtitle: {
      ru: 'Мы объединили роботизированную обработку бруса Hundegger K2i, строительную физику Passivhaus и параметрические цифровые двойники BIM LOD-500.',
      en: 'We combined Hundegger K2i robotic timber milling, Passivhaus building physics, and BIM LOD-500 parametric digital twins.',
    },
    pillars: [
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
        badge: { ru: 'Стандарт DIN 1052', en: 'DIN 1052 Standard' },
        iconName: 'Cpu',
      },
      {
        id: 'timber',
        number: '02',
        title: {
          ru: 'Австрийский клееный брус Purbond',
          en: 'Austrian Glulam with Swiss Purbond',
        },
        metric: '10–12%',
        metricLabel: {
          ru: 'Камерная сушка по всему сечению',
          en: 'Core kiln moisture content',
        },
        description: {
          ru: 'Северная ель зимней заготовки, склеенная экологичным швейцарским полиуретановым клеем Purbond без формальдегида. Нулевая эмиссия летучих веществ — стандарт E0 для детских комнат.',
          en: 'Kiln-dried winter alpine spruce laminated with solvent-free Swiss Purbond polyurethane. Certified Class E0 emissions for pure indoor air.',
        },
        badge: { ru: 'Экологический класс E0', en: 'Eco Class E0' },
        iconName: 'ShieldCheck',
      },
      {
        id: 'glass',
        number: '03',
        title: {
          ru: 'Панорамный триплекс Guardian Glass',
          en: 'Guardian Glass Super-Insulated Portals',
        },
        metric: '1.25',
        metricLabel: {
          ru: 'Коэффициент сопротивления теплопередаче',
          en: 'R-value m²·°C/W thermal envelope',
        },
        description: {
          ru: 'Двухкамерные стеклопакеты с напылением серебра SunGuard и аргоновым заполнением. До 6 метров высоты без импостов. Летом сохраняют прохладу, зимой отражают тепло внутрь дома.',
          en: 'Triple-pane argon insulated glazing with silver nano-coatings. Up to 6m uninterrupted heights. Blocks 78% solar heat while maintaining peak visible daylight.',
        },
        badge: { ru: 'SunGuard HD Neutral', en: 'SunGuard HD Neutral' },
        iconName: 'Layers',
      },
      {
        id: 'passivhaus',
        number: '04',
        title: {
          ru: 'Стандарт энергопассивности Passivhaus',
          en: 'Certified Passivhaus Energy Standard',
        },
        metric: '< 15',
        metricLabel: {
          ru: 'кВт·ч/м² в год на отопление дома',
          en: 'kWh/m² annual heating demand',
        },
        description: {
          ru: 'Абсолютная герметичность внешнего контура с проверкой тестом Blower Door (n50 < 0.6 ч⁻¹). Снижение затрат на магистральный газ или электричество на 65% по сравнению с обычным домом.',
          en: 'Continuous airtight thermal envelope validated via calibrated Blower Door depressurization (n50 < 0.6 h⁻¹). Reduces HVAC operating costs by up to 65%.',
        },
        badge: { ru: 'Blower Door n50 < 0.6', en: 'Blower Door n50 < 0.6' },
        iconName: 'VolumeX',
      },
      {
        id: 'bim',
        number: '05',
        title: {
          ru: 'Цифровой двойник BIM LOD-500',
          en: 'Digital Twin BIM LOD-500',
        },
        metric: '100%',
        metricLabel: {
          ru: 'Коллизий устранено до выхода на площадку',
          en: 'Clashes resolved pre-construction',
        },
        description: {
          ru: 'Каждый кабель, воздуховод и арматурный стержень смоделированы в 3D с точными спецификациями. Заказчик видит будущую виллу в VR до заливки первого куба бетона.',
          en: 'Every conduit, duct, and rebar intersection is pre-routed in parametric 3D space with bill-of-materials. Walk through your home in VR before ground is broken.',
        },
        badge: { ru: 'Revit + Navisworks', en: 'Revit + Navisworks' },
        iconName: 'FileCheck',
      },
      {
        id: 'monitoring',
        number: '06',
        title: {
          ru: 'Независимый технадзор и видеонаблюдение 24/7',
          en: 'Autonomous QC & 24/7 Live Stream',
        },
        metric: '320+',
        metricLabel: {
          ru: 'Контрольных точек в цифровом акте скрытых работ',
          en: 'Quality checkpoints verified',
        },
        description: {
          ru: 'Инженер технического надзора с геодезическим оборудованием Leica присутствует на каждом этапе. Личный кабинет заказчика с HD-трансляцией и ежедневными фотоотчетами.',
          en: 'Certified quality control engineers equipped with Leica laser stations inspect each structural milestone. Personal portal with live HD feeds and daily lab reports.',
        },
        badge: { ru: 'Личный кабинет заказчика', en: 'Client Web Portal' },
        iconName: 'Eye',
      },
    ],
  },

  // 5. КАТАЛОГ ВИЛЛ (VILLAS)
  villas: [
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
      mainImage: SITE_IMAGES.vistaExterior,
      secondaryImage: SITE_IMAGES.vistaInterior,
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
      mainImage: SITE_IMAGES.nordicExterior,
      secondaryImage: SITE_IMAGES.nordicInterior,
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
      mainImage: SITE_IMAGES.titanExterior,
      secondaryImage: SITE_IMAGES.titanInterior,
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
      mainImage: SITE_IMAGES.chaletExterior,
      secondaryImage: SITE_IMAGES.chaletInterior,
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
  ],

  // 6. ПОСТРОЕННЫЕ КЕЙСЫ (REAL CASES)
  realCases: [
    {
      id: 'millennium-park',
      title: { ru: 'Вилла «Millennium Vista»', en: 'Villa Millennium Vista' },
      location: {
        ru: 'КП «Миллениум Парк», 24 км Новорижского шоссе',
        en: 'Millennium Park Estate, 24 km Novorizhskoe Hwy',
      },
      builtYear: 2025,
      area: 420,
      budgetRub: 32400000,
      budgetUsd: 355000,
      timelineDays: 118,
      style: 'Панорамный фахверк + клинкерный кирпич',
      energyRating: 'Passivhaus A++ (Q = 14 кВт·ч/м²·год)',
      finishedImage: SITE_IMAGES.villaNovariga,
      constructionImage: SITE_IMAGES.novarigaConstruction,
      blueprintImage: SITE_IMAGES.novarigaBlueprint,
      clientQuote: {
        ru: '«Смета после подписания договора не выросла ни на один рубль. Дом сдали на 12 дней раньше графика. За зиму затраты на отопление 420 м² составили меньше 9 000 ₽ в месяц.»',
        en: '“The budget remained locked down to the single ruble after signing. Delivered 12 days ahead of schedule with unbelievable energy efficiency.”',
      },
      verifiedBadge: {
        ru: 'Акт ввода в эксплуатацию № 412/2025 // Росреестр',
        en: 'Occupancy Certificate #412/2025 // State Registry',
      },
      engineeringHighlights: {
        ru: [
          'Стеклопакеты Guardian SuperNeutral 70/35 высотой 5.8м',
          'Приточно-вытяжная вентиляция с роторным рекуператором Zehnder',
          'Система автоматизации на протоколе KNX (Германия)',
          'Геотермальный контур NIBE на 18 кВт',
        ],
        en: [
          '5.8m continuous Guardian SuperNeutral 70/35 structural glazing',
          'Zehnder decentralized heat recovery ventilation system',
          'KNX Germany architectural smart building automation',
          '18 kW NIBE geothermal ground-source heat pump array',
        ],
      },
      keyMetrics: [
        {
          label: { ru: 'Фактический срок', en: 'Actual timeline' },
          value: '118 дней',
        },
        {
          label: { ru: 'Отклонение от сметы', en: 'Budget variance' },
          value: '0.00 %',
        },
        {
          label: { ru: 'Тест на герметичность', en: 'Blower Door n50' },
          value: '0.48 ч⁻¹',
        },
      ],
    },
    {
      id: 'agalarov-residence',
      title: { ru: 'Резиденция «Agalarov Horizon»', en: 'Agalarov Horizon Estate' },
      location: {
        ru: 'КП «Agalarov Estate», 22 км Новорижского шоссе',
        en: 'Agalarov Estate, 22 km Novorizhskoe Hwy',
      },
      builtYear: 2024,
      area: 610,
      budgetRub: 48900000,
      budgetUsd: 535000,
      timelineDays: 154,
      style: 'Монолитный Hi-Tech + Архитектурный бетон',
      energyRating: 'Passivhaus A+ (Q = 18 кВт·ч/м²·год)',
      finishedImage: SITE_IMAGES.villaAgalarov,
      constructionImage: SITE_IMAGES.agalarovConstruction,
      blueprintImage: SITE_IMAGES.agalarovBlueprint,
      clientQuote: {
        ru: '«Сложный монолитный консольный вынос 6 метров над озером другие бюро отказывались реализовывать. Команда Arcline выполнила точный расчет преднапряженного бетона и сдала объект без единого замечания.»',
        en: '“A challenging 6m cantilever overhang above the waterfront that other builders refused. Arcline calculated post-tensioned concrete and executed flawlessly.”',
      },
      verifiedBadge: {
        ru: 'Акт приемки Ростехнадзора // Протокол испытаний бетона В35',
        en: 'State Construction Audit // B35 Concrete Lab Protocol',
      },
      engineeringHighlights: {
        ru: [
          'Преднапряженные железобетонные перекрытия без промежуточных колонн',
          'Моторизованные раздвижные системы Reynaers Hi-Finity',
          'Звукоизоляция спальных блоков 52 дБ по стандарту DIN 4109',
          'Резервная дизель-генераторная станция с автоматическим АВР',
        ],
        en: [
          'Post-tensioned reinforced slab spans without interior columns',
          'Motorized Reynaers Hi-Finity flush floor structural sliders',
          '52 dB acoustic isolation across all suites per DIN 4109',
          'Redundant diesel backup generator array with automated ATS',
        ],
      },
      keyMetrics: [
        {
          label: { ru: 'Фактический срок', en: 'Actual timeline' },
          value: '154 дня',
        },
        {
          label: { ru: 'Отклонение от сметы', en: 'Budget variance' },
          value: '0.00 %',
        },
        {
          label: { ru: 'Длина консоли', en: 'Cantilever reach' },
          value: '6.2 метра',
        },
      ],
    },
    {
      id: 'repino-pine',
      title: { ru: 'Вилла «Repino Forest Hideaway»', en: 'Repino Forest Hideaway' },
      location: {
        ru: 'Курортный район, пос. Репино, Санкт-Петербург',
        en: 'Repino Pine Enclave, Saint Petersburg',
      },
      builtYear: 2025,
      area: 310,
      budgetRub: 23800000,
      budgetUsd: 260000,
      timelineDays: 98,
      style: 'Скандинавский фахверк + Кедровая терраса',
      energyRating: 'Passivhaus A+++ (Q = 12 кВт·ч/м²·год)',
      finishedImage: SITE_IMAGES.villaRepino,
      constructionImage: SITE_IMAGES.repinoConstruction,
      blueprintImage: SITE_IMAGES.repinoBlueprint,
      clientQuote: {
        ru: '«При строительстве не срубили ни одной вековой сосны. Утеплитель Steico из древесного волокна создает в доме потрясающий хвойный микроклимат даже зимой.»',
        en: '“Not a single pine was harmed during excavation. Steico wood fiber insulation provides an extraordinary acoustic and pine-scented microclimate.”',
      },
      verifiedBadge: {
        ru: 'Сертификат Passivhaus Institut Darmstadt (Германия)',
        en: 'Passivhaus Institut Darmstadt Certified (Germany)',
      },
      engineeringHighlights: {
        ru: [
          'Утепление контура древесноволокнистыми плитами Steico (Германия)',
          'Фундамент — Утепленная Шведская Плита (УШП) со встроенным отоплением',
          'Финская биоклиматическая терраса из термоясеня с подогревом',
          'Рекуперация тепла сточных вод',
        ],
        en: [
          'Steico German natural wood fiber thermal envelope insulation',
          'Swedish Insulated Foundation Slab (USHP) with embedded manifold',
          'Finnish bioclimatic thermowood deck with infrared radiant zoning',
          'Greywater heat recovery architectural loop',
        ],
      },
      keyMetrics: [
        {
          label: { ru: 'Фактический срок', en: 'Actual timeline' },
          value: '98 дней',
        },
        {
          label: { ru: 'Отклонение от сметы', en: 'Budget variance' },
          value: '0.00 %',
        },
        {
          label: { ru: 'Сохранено сосен', en: 'Pines preserved' },
          value: '42 дерева',
        },
      ],
    },
    {
      id: 'nikolina-gora',
      title: { ru: 'Резиденция «Nikolina Pine Crest»', en: 'Nikolina Pine Crest' },
      location: {
        ru: 'Рублево-Успенское шоссе, Николина Гора',
        en: 'Rublyovo-Uspenskoe Hwy, Nikolina Gora',
      },
      builtYear: 2024,
      area: 490,
      budgetRub: 38700000,
      budgetUsd: 423000,
      timelineDays: 132,
      style: 'Комбинированный фахверк + Натуральный сланец',
      energyRating: 'Passivhaus A++ (Q = 15 кВт·ч/м²·год)',
      finishedImage: SITE_IMAGES.villaForest,
      constructionImage: SITE_IMAGES.nikolinaConstruction,
      blueprintImage: SITE_IMAGES.nikolinaBlueprint,
      clientQuote: {
        ru: '«Заказывали генподряд под ключ. От топографической съемки до расстановки дизайнерской мебели всё координировал один главный инженер. Идеальный сервис.»',
        en: '“Ordered full turnkey design-build. From initial LiDAR surveying to final furnishings, managed by a single lead engineer. Exceptional service.”',
      },
      verifiedBadge: {
        ru: 'Акт государственной комиссии № 89/НГ // Без замечаний',
        en: 'State Construction Verification Protocol #89/NG',
      },
      engineeringHighlights: {
        ru: [
          'Кровля из натурального испанского сланца Cupa Pizarras',
          'Массивный клееный брус сечением 280×280 мм со скрытым стальным крепежом',
          'Панорамное безрамное остекление Guardian Glass с защитой от ультрафиолета',
          'Система туманообразования и ионизации воздуха в зимнем саду',
        ],
        en: [
          'Natural Spanish slate roofing by Cupa Pizarras',
          'Engineered 280×280mm glulam posts with concealed internal steel ties',
          'Guardian Glass frameless portals with full UV solar protection',
          'Automated winter garden humidification and ionization systems',
        ],
      },
      keyMetrics: [
        {
          label: { ru: 'Фактический срок', en: 'Actual timeline' },
          value: '132 дня',
        },
        {
          label: { ru: 'Отклонение от сметы', en: 'Budget variance' },
          value: '0.00 %',
        },
        {
          label: { ru: 'Толщина бруса', en: 'Timber section' },
          value: '280 мм',
        },
      ],
    },
  ],

  // 7. КОМАНДА БЮРО (TEAM)
  team: [
    {
      id: 'arch-1',
      name: { ru: 'Алексей Бережной', en: 'Alexey Berezhnoy' },
      role: {
        ru: 'Главный архитектор бюро',
        en: 'Principal Architect',
      },
      experienceYears: 18,
      credentials: {
        ru: 'МАРХИ (специальность «Архитектура»), член Союза архитекторов РФ',
        en: 'Moscow Architectural Institute (MArchI), Union of Architects of Russia',
      },
      photo: SITE_IMAGES.teamAlexey,
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
      id: 'eng-1',
      name: { ru: 'Михаил Тарасов', en: 'Mikhail Tarasov' },
      role: {
        ru: 'Главный инженер проектов (ГИП)',
        en: 'Chief Structural Engineer (PE)',
      },
      experienceYears: 16,
      credentials: {
        ru: 'МГСУ (ПГС), включен в Национальный реестр специалистов (НОПРИЗ)',
        en: 'MGSU Civil Engineering, Licensed in National Registry of Specialists (NOPRIZ)',
      },
      photo: SITE_IMAGES.teamMikhail,
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
      id: 'qc-1',
      name: { ru: 'Дмитрий Волков', en: 'Dmitry Volkov' },
      role: {
        ru: 'Инженер строительного контроля (Технадзор)',
        en: 'Construction Quality Control Engineer',
      },
      experienceYears: 14,
      credentials: {
        ru: 'МГСУ (ПГС), квалификационный аттестат технического надзора',
        en: 'MGSU Civil Engineering, Certified Technical Supervision Inspector',
      },
      photo: SITE_IMAGES.teamDmitry,
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
      id: 'bim-1',
      name: { ru: 'Екатерина Соколова', en: 'Ekaterina Sokolova' },
      role: {
        ru: 'Ведущий инженер ОВК и ВК // BIM-координатор',
        en: 'Lead HVAC & Plumbing Engineer // BIM Coordinator',
      },
      experienceYears: 11,
      credentials: {
        ru: 'СПбГАСУ (Теплогазоснабжение и вентиляция), Autodesk Certified Professional',
        en: 'SPbGASU (HVAC & Water Supply), Autodesk Certified Professional',
      },
      photo: SITE_IMAGES.teamEkaterina,
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
  ],

  // 8. ОТЗЫВЫ КЛИЕНТОВ (REVIEWS)
  reviews: [
    {
      id: 'rev-1',
      authorName: { ru: 'Сергей и Елена Вороновы', en: 'Sergey & Elena Voronov' },
      authorTitle: {
        ru: 'Владельцы резиденции 380 м², КП «Миллениум Парк»',
        en: 'Owners of 380 m² Residence, Millennium Park',
      },
      location: { ru: 'Новорижское шоссе', en: 'Novorizhskoe Hwy' },
      villaName: 'ARCLINE VISTA // Фахверк',
      area: 380,
      yearBuilt: 2025,
      rating: 5,
      text: {
        ru: '«Главным страхом было раздувание сметы в процессе, как это часто бывает на стройках. С Arcline мы подписали твердую смету, и сумма не изменилась ни на копейку. Панорамные окна в два света — восторг, в доме тепло даже в –28°C.»',
        en: '“Our primary concern was the budget swelling mid-build. With Arcline, we signed a legally locked contract and the price didn’t budge by a single kopeck. The double-height glass is magnificent.”',
      },
      avatar: SITE_IMAGES.clientSergeyElena,
      villaPhoto: SITE_IMAGES.vistaExterior,
      verifiedOwner: true,
    },
    {
      id: 'rev-2',
      authorName: { ru: 'Константин Белов', en: 'Konstantin Belov' },
      authorTitle: {
        ru: 'Владелец монолитной виллы 540 м², КП «Agalarov Estate»',
        en: 'Owner of 540 m² Monolith Villa, Agalarov Estate',
      },
      location: { ru: 'Новорижское шоссе', en: 'Novorizhskoe Hwy' },
      villaName: 'ARCLINE TITAN // Hi-Tech',
      area: 540,
      yearBuilt: 2024,
      rating: 5,
      text: {
        ru: '«Инженерная культура на высшем уровне. Чистейшая стройплощадка, еженедельные детальные отчеты технадзора, камеры с доступом со смартфона. Дом сдали раньше срока на две недели. Очень рекомендую.»',
        en: '“Top-tier engineering culture. Spotless construction site, weekly independent supervision audits, 24/7 smartphone camera access. Delivered two weeks ahead of schedule.”',
      },
      avatar: SITE_IMAGES.clientKonstantin,
      villaPhoto: SITE_IMAGES.titanExterior,
      verifiedOwner: true,
    },
    {
      id: 'rev-3',
      authorName: { ru: 'Марина и Артем Григорьевы', en: 'Marina & Artem Grigoriev' },
      authorTitle: {
        ru: 'Владельцы виллы 290 м², Курортный район, Репино',
        en: 'Owners of 290 m² Villa, Repino Pine Forest',
      },
      location: { ru: 'Санкт-Петербург / Репино', en: 'Saint Petersburg / Repino' },
      villaName: 'ARCLINE NORDIC // Минимализм',
      area: 290,
      yearBuilt: 2025,
      rating: 5,
      text: {
        ru: '«Заводская нарезка бруса Hundegger — это вещь. Каркас собрали за 12 дней с точностью швейцарских часов, ни одной щели. Микроклимат потрясающий, пахнет деревом, а приточная вентиляция работает совершенно бесшумно.»',
        en: '“The Hundegger factory joinery is next level. The structural envelope was assembled in 12 days like a Swiss timepiece. Flawless indoor climate and whisper-silent ventilation.”',
      },
      avatar: SITE_IMAGES.clientMarinaArtem,
      villaPhoto: SITE_IMAGES.nordicExterior,
      verifiedOwner: true,
    },
  ],

  // 9. КОМПЛЕКТАЦИИ (PACKAGES)
  packages: [
    {
      id: 'contour',
      title: { ru: 'Теплый контур', en: 'Thermal Envelope' },
      subtitle: {
        ru: 'Фундамент, силовой фахверковый каркас, энергопассивное остекление Guardian и кровля',
        en: 'Reinforced foundation, glulam framing, Guardian glazing, and roof envelope',
      },
      pricePerM2Rub: 65000,
      pricePerM2Usd: 710,
      timeline: { ru: 'от 75 дней', en: 'from 75 days' },
      features: {
        ru: [
          'Монолитная железобетонная плита с гидроизоляцией',
          'Австрийский клееный брус с обработкой на Hundegger K2i',
          'Двухкамерные стеклопакеты Guardian Glass SunGuard',
          'Утепление кровли 250 мм Steico (Германия)',
          'Проведение теста Blower Door с протоколом',
        ],
        en: [
          'Monolithic reinforced slab foundation with dual tanking',
          'Austrian glulam posts milled on Hundegger K2i CNC',
          'Guardian Glass SunGuard triple insulated glazing units',
          '250mm Steico natural wood fiber roof insulation',
          'Calibrated Blower Door test with official certificate',
        ],
      },
    },
    {
      id: 'turnkey',
      title: { ru: 'White Box + Инженерия', en: 'Turnkey MEP + White Box' },
      subtitle: {
        ru: 'Теплый контур + полная скрытая разводка всех инженерных сетей и предчистовая отделка',
        en: 'Envelope + concealed high-end MEP networks and acoustic partitions',
      },
      pricePerM2Rub: 115000,
      pricePerM2Usd: 1260,
      isPopular: true,
      badge: { ru: 'Хит выбора', en: 'Most Popular' },
      timeline: { ru: 'от 110 дней', en: 'from 110 days' },
      features: {
        ru: [
          'Все опции комплектации «Теплый контур»',
          'Приточно-вытяжная вентиляция с рекуперацией Zehnder',
          'Водяные теплые полы с коллекторной группой Rehau Rautitan',
          'Котельная на оборудовании Viessmann / Buderus',
          'Шина автоматизации KNX Smart Home (базовый контур)',
          'Идеально ровные стены под финишную покраску',
        ],
        en: [
          'All options included in "Thermal Envelope"',
          'Zehnder heat recovery ventilation plant and ducting',
          'Rehau Rautitan radiant hydronic floor heating loops',
          'Viessmann / Buderus automated boiler plant',
          'KNX smart home automation infrastructure',
          'Acoustic drywall partitions primed for paint',
        ],
      },
    },
    {
      id: 'allinclusive',
      title: { ru: 'Премиум под ключ', en: 'Prime Turnkey Signature' },
      subtitle: {
        ru: 'Полный цикл: от ландшафтного дизайна до финишной дизайнерской отделки и сантехники',
        en: 'End-to-end realization including bespoke interior finishes and landscaping',
      },
      pricePerM2Rub: 185000,
      pricePerM2Usd: 2020,
      badge: { ru: 'Премиум', en: 'Signature' },
      timeline: { ru: 'от 150 дней', en: 'from 150 days' },
      features: {
        ru: [
          'Все опции «White Box + Инженерия»',
          'Авторский дизайн-проект интерьеров с комплектацией',
          'Натуральный широкоформатный керамогранит и паркетная доска',
          'Премиальная сантехника Antonio Lupi / Gessi',
          'Биоклиматическая пергола с подогревом и ландшафт участка',
          'Персональный консьерж-сервис объекта на 3 года',
        ],
        en: [
          'All options included in "White Box + MEP"',
          'Full bespoke architectural interior design package',
          'Italian porcelain slabs and select wide-plank wood flooring',
          'Antonio Lupi / Gessi designer sanitaryware fittings',
          'Bioclimatic motorized pergola and site landscaping',
          'Dedicated 3-year post-handover property concierge',
        ],
      },
    },
  ],

  // 10. ЭТАПЫ СТРОИТЕЛЬСТВА (ROADMAP)
  roadmap: [
    {
      step: '01',
      days: '14 дней',
      title: {
        ru: 'BIM-проектирование и посадка на рельеф',
        en: 'BIM Modeling & Topographic Survey',
      },
      desc: {
        ru: 'Геология грунта, топосъемка, разработка цифровой 3D-модели (LOD-400), привязка к сторонам света и фиксация твердой сметы в договоре.',
        en: 'Geotechnical soil survey, 3D LiDAR topography, LOD-400 parametric design, and fixed-price contract execution.',
      },
      deliverable: {
        ru: 'Утвержденный проект АР/КР + фиксированная смета',
        en: 'Approved architectural blueprints + locked budget',
      },
    },
    {
      step: '02',
      days: '21 день',
      title: {
        ru: 'Заводское изготовление на Hundegger K2i',
        en: 'Robotic Factory CNC Fabrication',
      },
      desc: {
        ru: 'Высокоточная нарезка клееного бруса с допуском ±0.2 мм, маркировка каждого элемента, заводская антисептическая обработка Remmers.',
        en: 'Precision joinery milling with ±0.2mm tolerance, component barcode tagging, and Remmers eco-protective application.',
      },
      deliverable: {
        ru: 'Готовый домокомплект со штрихкодами узлов',
        en: 'Factory-certified timber kit ready for shipping',
      },
    },
    {
      step: '03',
      days: '28 дней',
      title: {
        ru: 'Фундамент и монтаж силового каркаса',
        en: 'Foundation & Structural Assembly',
      },
      desc: {
        ru: 'Заливка монолитной плиты с гидроизоляцией, сборка каркаса автокраном за 10–14 дней, инструментальный контроль геометрии.',
        en: 'Monolithic reinforced slab pouring, rapid framing assembly via crane within 10–14 days, laser alignment verification.',
      },
      deliverable: {
        ru: 'Смонтированный несущий конструктив виллы',
        en: 'Erected weather-resistant timber frame structure',
      },
    },
    {
      step: '04',
      days: '25 дней',
      title: {
        ru: 'Панорамное остекление и теплый контур',
        en: 'Structural Glazing & Envelope Sealing',
      },
      desc: {
        ru: 'Монтаж крупноформатного триплекса вакуумными захватами, утепление кровли Steico, герметизация контура и тест Blower Door.',
        en: 'Vacuum lifter installation of triple-pane glass units, Steico roof insulation, and calibrated Blower Door test.',
      },
      deliverable: {
        ru: 'Закрытый теплый контур с подтвержденным n50 < 0.6',
        en: 'Sealed Passivhaus envelope with test protocol',
      },
    },
    {
      step: '05',
      days: '30 дней',
      title: {
        ru: 'Инженерия, сдача объекта и гарантия 25 лет',
        en: 'MEP Integration, Handover & 25-Year Warranty',
      },
      desc: {
        ru: 'Пусконаладка котельной, вентиляции и умного дома. Генеральная уборка, подписание акта приемки и выдача гарантийного сертификата.',
        en: 'HVAC, smart home commissioning, final clean, legal handover, and issuance of 25-year structural warranty certificate.',
      },
      deliverable: {
        ru: 'Ключи от виллы + гарантийный паспорт объекта',
        en: 'Keys to the residence + official building passport',
      },
    },
  ],

  // 11. FAQ (ВОПРОСЫ И ОТВЕТЫ)
  faq: [
    {
      id: 'faq-1',
      question: {
        ru: 'Действительно ли смета фиксируется и не вырастет в процессе?',
        en: 'Is the budget truly fixed with zero unexpected surcharges?',
      },
      answer: {
        ru: 'Да, на 100%. Мы фиксируем итоговую стоимость в твердом договоре генподряда до начала работ. Любые курсовые колебания валют, рост цен на материалы или логистику — исключительно риски нашего бюро. Вы платите ровно ту сумму, которая прописана в договоре.',
        en: 'Yes, 100%. We lock in the final contract sum before ground is broken. Material price fluctuations or supply shifts are absorbed by our bureau. You pay strictly the agreed figure.',
      },
      category: { ru: 'Финансы и договор', en: 'Finance & Contracts' },
    },
    {
      id: 'faq-2',
      question: {
        ru: 'Тепло ли в доме с такими большими панорамными окнами зимой в мороз?',
        en: 'Are large panoramic windows warm enough in freezing winter temperatures?',
      },
      answer: {
        ru: 'Да, абсолютно. Мы используем двухкамерные энергосберегающие стеклопакеты Guardian Glass с аргоновым заполнением и двойным напылением ионов серебра. Сопротивление теплопередаче R > 1.18 м²·°C/Вт превышает показатели кирпичной стены толщиной 64 см. У витражей нет эффекта «холодной стены», а полы всегда теплые.',
        en: 'Absolutely. We use Guardian Glass triple-pane argon units with dual silver nano-coatings. Their thermal insulation exceeds a 64cm solid brick wall. No draft or cold-wall sensation.',
      },
      category: { ru: 'Технологии и тепло', en: 'Technology & Thermal' },
    },
    {
      id: 'faq-3',
      question: {
        ru: 'Сколько времени занимает строительство виллы под ключ?',
        en: 'How long does a full turnkey villa build take?',
      },
      answer: {
        ru: 'Теплый контур с фундаментом и остеклением возводится за 75–120 дней благодаря высокой заводской готовности нарезки бруса Hundegger. Полный цикл под чистовую отделку (White Box) занимает от 4 до 6 месяцев.',
        en: 'The thermal envelope takes 75–120 days thanks to robotic CNC prefabrication. Turnkey White Box finishes take 4 to 6 months.',
      },
      category: { ru: 'Сроки реализации', en: 'Timelines' },
    },
    {
      id: 'faq-4',
      question: {
        ru: 'Можно ли адаптировать любой проект под особенности нашего участка?',
        en: 'Can any design be customized to our specific property topography?',
      },
      answer: {
        ru: 'Каждый проект из нашего каталога индивидуально адаптируется главным архитектором под перепад высот вашего участка, геологию грунта, инсоляцию и видовые точки на лес или воду. Также мы можем разработать полностью индивидуальный проект с нуля.',
        en: 'Every villa in our collection is custom-tailored by our principal architect to your site’s terrain, solar azimuth, soil composition, and panoramic vistas.',
      },
      category: { ru: 'Архитектура', en: 'Architecture' },
    },
  ],
};
