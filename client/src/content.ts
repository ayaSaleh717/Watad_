// All site text lives here. Edit freely: `ar` and `en` must keep the same shape.

export const CONTACT = {
  phone: '+963947174565',
  email: 'watadpetroleum@gmail.com',
  facebook: 'watadpetrol',
  telegram: 'watadpetroleum',
}

// TODO: replace these placeholder figures with the company's real numbers before publishing.
// `founded` is the year the company was established; the rest are shown as "N+" (readiness as "N/7").
export const STATS = { founded: 2017, fleet: 50, areas: 12, readiness: 24 }

export const ar = {
  meta: {
    title: 'وتد للبترول | محروقات · غاز · تكرير',
    description: 'وتد للبترول: توريد وتوزيع المحروقات والغاز، ومشاريع التكرير والاستخراج.',
  },
  langBtn: 'EN',
  nav: {
    home: 'الرئيسية',
    about: 'من نحن',
    divisions: 'أقسامنا',
    more: 'المزيد',
    stations: 'المحطات',
    prices: 'الأسعار',
    products: 'منتجاتنا',
    hse: 'السلامة والبيئة',
    contact: 'تواصل معنا',
  },
  hero: {
    kicker: 'شركة سورية للطاقة',
    words: ['استخراج', 'تقطير', 'تميّز'],
    sub: 'توريد وتوزيع المحروقات والغاز، وبوابتنا القادمة إلى الاستخراج والتقطير.',
    cta1: 'اطلب عرض سعر',
    cta2: 'اكتشف أقسامنا',
    soon: 'قريباً: الاستخراج والتقطير',
  },
  stats: [
    { icon: 'calendar', value: STATS.founded, suffix: '', label: 'سنة التأسيس' },
    { icon: 'truck', value: STATS.fleet, suffix: '+', label: 'شاحنة ضمن الأسطول' },
    { icon: 'pin', value: STATS.areas, suffix: '+', label: 'منطقة ضمن نطاق التغطية' },
    { icon: 'bolt', value: STATS.readiness, suffix: '/7', label: 'جاهزية تشغيلية واستجابة' },
  ],
  about: {
    eyebrow: 'من نحن',
    title: 'طاقة موثوقة تصل إلى كل بيت ومنشأة',
    p1: 'تأسست وتد للبترول عام 2017 في شمال سوريا، وبدأت بتوريد المحروقات وأسطوانات الغاز المنزلي وتوزيعها على المستهلكين والتجار.',
    p2: 'منذ ذلك الحين تطورت الشركة إلى منظومة من أربعة أقسام تضم المحروقات والغاز والأسواق ومحطات التكرير، وتعمل اليوم على التوسع نحو الاستخراج والتقطير.',
    visionT: 'رؤيتنا',
    vision: 'أن نكون الخيار الأول للطاقة الموثوقة في سوريا والمنطقة.',
    missionT: 'رسالتنا',
    mission: 'تأمين الوقود والغاز بجودة عالية وتسعير واضح وخدمة تصل إلى كل بيت ومنشأة.',
    valuesT: 'قيمنا',
    values: [
      { t: 'الجودة', d: 'منتجات بمواصفات موثوقة.' },
      { t: 'الأمان', d: 'سلامة في كل مرحلة من التخزين إلى التوزيع.' },
      { t: 'الشفافية', d: 'أسعار معلنة وتعامل واضح.' },
      { t: 'المسؤولية البيئية', d: 'التزام بتقليل الأثر البيئي.' },
    ],
  },
  divisions: {
    eyebrow: 'أقسامنا',
    title: 'أربعة أقسام، منظومة طاقة واحدة',
    sub: 'من التوريد إلى التوزيع، ومن التسعير إلى التكرير.',
    soon: 'قريباً',
    items: [
      { key: 'fuels', t: 'محروقات وتد', d: 'استيراد وتوزيع البنزين والمازوت للمستهلك وللتجار.', soon: false },
      { key: 'gas', t: 'غاز وتد', d: 'توفير أسطوانات الغاز المنزلي وتوزيعها عبر شبكة منافذ.', soon: false },
      { key: 'refining', t: 'محطات التكرير', d: 'مشاريع تكرير وتقطير لإنتاج المشتقات النفطية محلياً.', soon: true },
      { key: 'markets', t: 'أسواق وتد', d: 'ذراع التجارة والأسواق: تسعير شفاف ومتابعة لأسواق الطاقة.', soon: false },
    ],
  },
  products: {
    eyebrow: 'منتجاتنا',
    title: 'ما نوفره لك',
    sub: 'منتجات الطاقة الأساسية للمنازل والمركبات والمنشآت.',
    items: [
      { t: 'بنزين مستورد', d: 'وقود للمركبات بجودة مستوردة.', tag: 'محروقات' },
      { t: 'مازوت مستورد', d: 'للمركبات والآليات والمولدات.', tag: 'محروقات' },
      { t: 'مازوت مكرر', d: 'خيار اقتصادي مكرر محلياً.', tag: 'تكرير' },
      { t: 'جرة الغاز', d: 'أسطوانات الغاز المنزلي.', tag: 'غاز' },
    ],
  },
  journey: {
    eyebrow: 'مسيرتنا',
    title: 'من التأسيس إلى الاستخراج',
    items: [
      { y: '2017', t: 'التأسيس', d: 'انطلاق وتد للبترول في شمال سوريا.' },
      { y: '2018', t: 'التوريد والتوزيع', d: 'استيراد المحروقات وتوزيع أسطوانات الغاز.' },
      { y: 'اليوم', t: 'منظومة متكاملة', d: 'محروقات، غاز، أسواق، ومحطات تكرير.' },
      { y: 'قريباً', t: 'الاستخراج والتقطير', d: 'الخطوة التالية في سلسلة القيمة النفطية.' },
    ],
  },
  hse: {
    eyebrow: 'الصحة والسلامة والبيئة',
    title: 'السلامة أولاً، دائماً',
    p: 'نلتزم بإجراءات السلامة في التخزين والنقل والتوزيع، ونسعى لتقليل الأثر البيئي لعملياتنا.',
    items: [
      { t: 'التخزين', d: 'التزام بمعايير الأمان في المستودعات والخزانات.' },
      { t: 'النقل', d: 'نقل وتوزيع وفق إجراءات سلامة واضحة.' },
      { t: 'البيئة', d: 'السعي نحو تقليل الانبعاثات وإدارة المخلفات.' },
    ],
  },
  contact: {
    eyebrow: 'تواصل معنا',
    title: 'اطلب عرض سعر أو استفساراً',
    sub: 'للتجار والمنشآت: أرسل طلبك وسنعود إليك بأقرب وقت.',
    form: {
      name: 'الاسم',
      company: 'الشركة (اختياري)',
      phone: 'رقم الهاتف',
      product: 'المنتج',
      qty: 'الكمية المطلوبة',
      message: 'رسالتك',
      send: 'إرسال الطلب',
      sent: 'تم تجهيز رسالتك في تطبيق البريد، يرجى الضغط على إرسال هناك.',
      options: ['بنزين مستورد', 'مازوت مستورد', 'مازوت مكرر', 'جرة الغاز', 'أخرى'],
    },
    info: {
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      facebook: 'فيسبوك',
      telegram: 'تلغرام',
    },
  },
  footer: {
    tagline: 'استخراج · تقطير · تميّز',
    rights: 'جميع الحقوق محفوظة',
  },
}

export type Dict = typeof ar

export const en: Dict = {
  meta: {
    title: 'Watad Petroleum | Fuels · Gas · Refining',
    description: 'Watad Petroleum: supply and distribution of fuels and gas, with refining and extraction projects.',
  },
  langBtn: 'عربي',
  nav: {
    home: 'Home',
    about: 'About',
    divisions: 'Divisions',
    more: 'More',
    stations: 'Stations',
    prices: 'Prices',
    products: 'Products',
    hse: 'HSE',
    contact: 'Contact',
  },
  hero: {
    kicker: 'A Syrian energy company',
    words: ['Extraction', 'Refining', 'Excellence'],
    sub: 'Supplying and distributing fuels and gas, with extraction and refining on the horizon.',
    cta1: 'Request a quote',
    cta2: 'Explore our divisions',
    soon: 'Coming soon: extraction & refining',
  },
  stats: [
    { icon: 'calendar', value: STATS.founded, suffix: '', label: 'Year founded' },
    { icon: 'truck', value: STATS.fleet, suffix: '+', label: 'Trucks in the fleet' },
    { icon: 'pin', value: STATS.areas, suffix: '+', label: 'Areas within our coverage' },
    { icon: 'bolt', value: STATS.readiness, suffix: '/7', label: 'Operational readiness & response' },
  ],
  about: {
    eyebrow: 'About us',
    title: 'Reliable energy for every home and business',
    p1: 'Watad Petroleum was founded in 2017 in northern Syria, starting with the supply and distribution of fuels and household gas cylinders to consumers and traders.',
    p2: 'Since then it has grown into a four-division system covering fuels, gas, markets and refining stations, and is now expanding toward extraction and distillation.',
    visionT: 'Our vision',
    vision: 'To be the first choice for reliable energy in Syria and the region.',
    missionT: 'Our mission',
    mission: 'To secure fuel and gas with high quality, clear pricing and service that reaches every home and facility.',
    valuesT: 'Our values',
    values: [
      { t: 'Quality', d: 'Products with trusted specifications.' },
      { t: 'Safety', d: 'Safe practice from storage to delivery.' },
      { t: 'Transparency', d: 'Published prices and clear dealings.' },
      { t: 'Environmental care', d: 'A commitment to a lighter footprint.' },
    ],
  },
  divisions: {
    eyebrow: 'Our divisions',
    title: 'Four divisions, one energy system',
    sub: 'From supply to distribution, from pricing to refining.',
    soon: 'Soon',
    items: [
      { key: 'fuels', t: 'Watad Fuels', d: 'Import and distribution of gasoline and diesel for consumers and traders.', soon: false },
      { key: 'gas', t: 'Watad Gas', d: 'Household gas cylinders distributed through a network of outlets.', soon: false },
      { key: 'refining', t: 'Refining Stations', d: 'Refining and distillation projects to produce petroleum products locally.', soon: true },
      { key: 'markets', t: 'Watad Markets', d: 'The trade and markets arm: transparent pricing and energy market tracking.', soon: false },
    ],
  },
  products: {
    eyebrow: 'Our products',
    title: 'What we supply',
    sub: 'Core energy products for homes, vehicles and facilities.',
    items: [
      { t: 'Imported gasoline', d: 'Vehicle fuel of imported quality.', tag: 'Fuels' },
      { t: 'Imported diesel', d: 'For vehicles, machinery and generators.', tag: 'Fuels' },
      { t: 'Refined diesel', d: 'An economical, locally refined option.', tag: 'Refining' },
      { t: 'Gas cylinder', d: 'Household gas cylinders.', tag: 'Gas' },
    ],
  },
  journey: {
    eyebrow: 'Our journey',
    title: 'From founding to extraction',
    items: [
      { y: '2017', t: 'Founded', d: 'Watad Petroleum launches in northern Syria.' },
      { y: '2018', t: 'Supply & distribution', d: 'Fuel imports and gas cylinder distribution begin.' },
      { y: 'Today', t: 'An integrated system', d: 'Fuels, gas, markets and refining stations.' },
      { y: 'Soon', t: 'Extraction & distillation', d: 'The next step in the petroleum value chain.' },
    ],
  },
  hse: {
    eyebrow: 'Health, safety & environment',
    title: 'Safety first, always',
    p: 'We follow safety procedures across storage, transport and distribution, and work to reduce the environmental impact of our operations.',
    items: [
      { t: 'Storage', d: 'Safety standards in depots and tanks.' },
      { t: 'Transport', d: 'Distribution under clear safety procedures.' },
      { t: 'Environment', d: 'Working to cut emissions and manage waste.' },
    ],
  },
  contact: {
    eyebrow: 'Contact us',
    title: 'Request a quote or ask a question',
    sub: 'For traders and businesses: send your request and we will get back to you shortly.',
    form: {
      name: 'Name',
      company: 'Company (optional)',
      phone: 'Phone number',
      product: 'Product',
      qty: 'Quantity needed',
      message: 'Your message',
      send: 'Send request',
      sent: 'Your message is ready in your mail app. Please press send there.',
      options: ['Imported gasoline', 'Imported diesel', 'Refined diesel', 'Gas cylinder', 'Other'],
    },
    info: {
      phone: 'Phone',
      email: 'Email',
      facebook: 'Facebook',
      telegram: 'Telegram',
    },
  },
  footer: {
    tagline: 'Extraction · Refining · Excellence',
    rights: 'All rights reserved',
  },
}
