export type LandingLang = 'tr' | 'en' | 'de' | 'nl' | 'es' | 'it';

export type LandingContent = {
  lang: LandingLang;
  nav: { features: string; howItWorks: string; packages: string; faq: string; login: string; cta: string };
  badge: string;
  heroTitle: string[];
  heroSub: string;
  heroCta1: string;
  heroCta2: string;
  heroNote: string;
  phoneCaption: string;
  advantages: { title: string; items: { icon: string; title: string; desc: string }[] };
  howItWorks: { title: string; steps: { num: string; title: string; desc: string }[] };
  features: { title: string; list: string[] };
  benefits: { title: string; items: { icon: string; title: string; desc: string }[] };
  useCases: { title: string; items: { icon: string; label: string }[] };
  packages: {
    title: string; subtitle: string;
    items: { name: string; price: string; period: string; badge: string | null; desc: string; features: string[]; cta: string; href: string; primary: boolean }[];
  };
  faq: { title: string; items: { q: string; a: string }[] };
  finalCta: { title: string; sub: string; cta1: string; cta2: string };
};

const base: Omit<LandingContent, 'lang'> = {
  nav: { features: 'Özellikler', howItWorks: 'Nasıl Çalışır', packages: 'Paketler', faq: 'SSS', login: 'Giriş yap', cta: 'Ücretsiz Başla →' },
  badge: 'T.C. Gıda Mevzuatına Uygun · 14 Resmi Alerjen',
  heroTitle: ['MENÜNÜZÜ', 'DİJİTALE', 'TAŞIYIN'],
  heroSub: 'QR menülerinizi kolayca oluşturun, ürünlerinizi yönetin ve menünüzü saniyeler içinde güncelleyin.',
  heroCta1: 'Ücretsiz Demo Al',
  heroCta2: 'Örnek Menüyü İncele →',
  heroNote: '5 gün ücretsiz · Kredi kartı gerekmez',
  phoneCaption: '↑ Gerçek menü — kaydırın, deneyin',
  advantages: {
    title: 'NEDEN MIA MENU?',
    items: [
      { icon: '⚡', title: 'Hızlı Kurulum', desc: 'Menünüz kısa sürede kullanıma hazır hale gelir.' },
      { icon: '✏️', title: 'Kolay Yönetim', desc: 'Ürün, fiyat ve kategori bilgilerinizi kolayca güncelleyin.' },
      { icon: '📱', title: 'Mobil Uyumlu', desc: 'Tüm telefon ve tabletlerde kusursuz görünüm.' },
      { icon: '🔲', title: 'QR Menü Sistemi', desc: 'Temassız, hızlı ve modern menü deneyimi.' },
    ],
  },
  howItWorks: {
    title: '3 ADIMDA YAYINDA',
    steps: [
      { num: '01', title: 'Menünüzü Oluşturun', desc: 'Ürünlerinizi, kategorilerinizi ve fiyatlarınızı ekleyin.' },
      { num: '02', title: 'QR Kodunuzu Alın', desc: 'Masanıza, kapınıza veya paketlerinize yerleştirin.' },
      { num: '03', title: 'Anında Güncelleyin', desc: 'Baskı maliyeti olmadan menünüzü dilediğiniz zaman değiştirin.' },
    ],
  },
  features: {
    title: 'HER ŞEY KONTROLÜNÜZDE',
    list: ['Ürün fotoğrafları ve açıklama yönetimi', 'Çoklu dil desteği (50+ dil)', 'Kategori ve bölüm düzenleme', 'Kampanyalı ürün gösterimi', 'Stokta olmayan ürünü gizleme', 'Sosyal medya bağlantıları', 'Alerjen ve kalori bilgisi', 'QR kod özelleştirme'],
  },
  benefits: {
    title: 'İŞLETMENİZE KATKISI',
    items: [
      { icon: '💰', title: 'Baskı maliyetlerini azaltın', desc: 'Her fiyat değişiminde yeni menü bastırmanıza gerek kalmaz.' },
      { icon: '😊', title: 'Müşteri deneyimini geliştirin', desc: 'Misafirleriniz menüye hızlı ve kolay şekilde ulaşır.' },
      { icon: '⚡', title: 'Menünüzü her an yönetin', desc: 'Yeni ürünleri ve kampanyaları anında yayınlayın.' },
      { icon: '🎨', title: 'Markanıza özel görünüm', desc: 'Renklerinize ve kurumsal kimliğinize uygun dijital menü oluşturun.' },
    ],
  },
  useCases: {
    title: 'HER İŞLETMEYE UYGUN',
    items: [{ icon: '🍽️', label: 'Restoranlar' }, { icon: '☕', label: 'Kafeler' }, { icon: '🏨', label: 'Oteller' }, { icon: '🍸', label: 'Barlar' }, { icon: '🎂', label: 'Pastaneler' }, { icon: '🏖️', label: "Beach Club'lar" }, { icon: '📦', label: 'Paket Servis' }],
  },
  packages: {
    title: 'FİYATLANDIRMA',
    subtitle: '5 gün ücretsiz deneyin, kredi kartı gerekmez',
    items: [
      { name: 'Başlangıç', price: '300₺', period: '/ay', badge: null, desc: 'Küçük işletmeler için temel dijital menü.', features: ['Sınırsız ürün', 'QR kod yönetimi', '14 resmi alerjen', 'Baskı şablonları'], cta: 'Başla', href: '/kayit', primary: false },
      { name: 'Profesyonel', price: '3.300₺', period: '/yıl', badge: 'En popüler', desc: 'Daha fazla özellik ve özelleştirme seçeneği.', features: ["Başlangıç'taki her şey", '50+ dil çevirisi', 'Sadakat kartı sistemi', 'Öncelikli destek'], cta: 'Yıllık Başla', href: '/kayit', primary: true },
      { name: 'Kurumsal', price: 'Teklif Al', period: '', badge: null, desc: 'Birden fazla şubesi bulunan işletmeler için.', features: ['Tüm özellikler', 'Çoklu şube yönetimi', 'Özel entegrasyon', 'Dedicated destek'], cta: 'İletişime Geç', href: 'mailto:merhaba@mia.menu', primary: false },
    ],
  },
  faq: {
    title: 'SIK SORULAN SORULAR',
    items: [
      { q: 'Menüde değişiklik yapabilir miyim?', a: 'Evet, ürün ve fiyat bilgilerinizi istediğiniz zaman güncelleyebilirsiniz. Değişiklikler anında yansır.' },
      { q: 'QR kod değişir mi?', a: 'Hayır. Menünüzü güncelleseniz bile aynı QR kodu kullanmaya devam edebilirsiniz.' },
      { q: 'Kurulum desteği veriliyor mu?', a: 'Evet, menü kurulumu ve kullanım sürecinde destek sağlanır.' },
      { q: 'Birden fazla şube eklenebilir mi?', a: 'Kurumsal paketlerde birden fazla şube yönetilebilir.' },
    ],
  },
  finalCta: { title: 'MENÜNÜZÜ YENİLEMENİN EN KOLAY YOLU', sub: 'Mia Menu ile modern, hızlı ve yönetilebilir bir dijital menüye geçin.', cta1: 'Hemen Başlayın', cta2: 'Bizimle İletişime Geçin' },
};

export const LANDING_CONTENT: Record<LandingLang, LandingContent> = {
  tr: { lang: 'tr', ...base },
  en: {
    lang: 'en',
    nav: { features: 'Features', howItWorks: 'How It Works', packages: 'Pricing', faq: 'FAQ', login: 'Sign in', cta: 'Start Free →' },
    badge: 'Compliant with Turkish Food Regulations · 14 Official Allergens',
    heroTitle: ['DIGITIZE', 'YOUR', 'MENU'],
    heroSub: 'Easily create QR menus, manage your products, and update your menu in seconds.',
    heroCta1: 'Get Free Demo',
    heroCta2: 'View Sample Menu →',
    heroNote: '5 days free · No credit card required',
    phoneCaption: '↑ Live menu — scroll & try it',
    advantages: { title: 'WHY MIA MENU?', items: [{ icon: '⚡', title: 'Quick Setup', desc: 'Your menu is ready to use in minutes.' }, { icon: '✏️', title: 'Easy Management', desc: 'Update products, prices and categories effortlessly.' }, { icon: '📱', title: 'Mobile Friendly', desc: 'Perfect display on all phones and tablets.' }, { icon: '🔲', title: 'QR Menu System', desc: 'Contactless, fast and modern menu experience.' }] },
    howItWorks: { title: 'LIVE IN 3 STEPS', steps: [{ num: '01', title: 'Build Your Menu', desc: 'Add your products, categories and prices.' }, { num: '02', title: 'Get Your QR Code', desc: 'Place it on tables, doors or packaging.' }, { num: '03', title: 'Update Instantly', desc: 'Change your menu anytime without printing costs.' }] },
    features: { title: 'EVERYTHING UNDER CONTROL', list: ['Product photos & description management', '50+ language support', 'Category & section editing', 'Featured product display', 'Hide out-of-stock items', 'Social media links', 'Allergen & calorie info', 'QR code customization'] },
    benefits: { title: 'BENEFITS FOR YOUR BUSINESS', items: [{ icon: '💰', title: 'Reduce printing costs', desc: 'No need to print new menus every time prices change.' }, { icon: '😊', title: 'Improve customer experience', desc: 'Guests access the menu quickly and easily.' }, { icon: '⚡', title: 'Manage anytime', desc: 'Publish new items and promotions instantly.' }, { icon: '🎨', title: 'Your brand, your look', desc: 'Create a digital menu matching your brand identity.' }] },
    useCases: { title: 'PERFECT FOR EVERY VENUE', items: [{ icon: '🍽️', label: 'Restaurants' }, { icon: '☕', label: 'Cafes' }, { icon: '🏨', label: 'Hotels' }, { icon: '🍸', label: 'Bars' }, { icon: '🎂', label: 'Bakeries' }, { icon: '🏖️', label: 'Beach Clubs' }, { icon: '📦', label: 'Delivery' }] },
    packages: { title: 'PRICING', subtitle: 'Try 5 days free, no credit card required', items: [{ name: 'Starter', price: '€9', period: '/mo', badge: null, desc: 'Basic digital menu for small businesses.', features: ['Unlimited products', 'QR code management', '14 allergens', 'Print templates'], cta: 'Start', href: '/kayit', primary: false }, { name: 'Professional', price: '€89', period: '/yr', badge: 'Most popular', desc: 'More features and customization options.', features: ['Everything in Starter', '50+ language translation', 'Loyalty card system', 'Priority support'], cta: 'Start Yearly', href: '/kayit', primary: true }, { name: 'Enterprise', price: 'Get Quote', period: '', badge: null, desc: 'For businesses with multiple locations.', features: ['All features', 'Multi-branch management', 'Custom integration', 'Dedicated support'], cta: 'Contact Us', href: 'mailto:hello@mia.menu', primary: false }] },
    faq: { title: 'FREQUENTLY ASKED QUESTIONS', items: [{ q: 'Can I make changes to my menu?', a: 'Yes, you can update products and prices anytime. Changes are reflected instantly.' }, { q: 'Does the QR code change?', a: 'No. Even when you update your menu, the same QR code continues to work.' }, { q: 'Is setup support provided?', a: 'Yes, support is provided during menu setup and usage.' }, { q: 'Can I add multiple branches?', a: 'Multiple branches can be managed in enterprise packages.' }] },
    finalCta: { title: 'THE EASIEST WAY TO MODERNIZE YOUR MENU', sub: 'Go digital with Mia Menu — modern, fast, and fully manageable.', cta1: 'Get Started Now', cta2: 'Contact Us' },
  },
  de: {
    lang: 'de',
    nav: { features: 'Funktionen', howItWorks: 'So funktionierts', packages: 'Preise', faq: 'FAQ', login: 'Anmelden', cta: 'Kostenlos starten →' },
    badge: 'Konform mit türkischen Lebensmittelvorschriften · 14 Allergene',
    heroTitle: ['IHRE SPEISEKARTE', 'JETZT', 'DIGITAL'],
    heroSub: 'Erstellen Sie QR-Speisekarten, verwalten Sie Ihre Produkte und aktualisieren Sie Ihr Menü in Sekunden.',
    heroCta1: 'Kostenlose Demo',
    heroCta2: 'Beispielmenü ansehen →',
    heroNote: '5 Tage kostenlos · Keine Kreditkarte erforderlich',
    phoneCaption: '↑ Live-Menü — scrollen & ausprobieren',
    advantages: { title: 'WARUM MIA MENU?', items: [{ icon: '⚡', title: 'Schnelle Einrichtung', desc: 'Ihr Menü ist in Minuten einsatzbereit.' }, { icon: '✏️', title: 'Einfache Verwaltung', desc: 'Produkte, Preise und Kategorien mühelos aktualisieren.' }, { icon: '📱', title: 'Mobilfreundlich', desc: 'Perfekte Darstellung auf allen Geräten.' }, { icon: '🔲', title: 'QR-Menü-System', desc: 'Kontaktlos, schnell und modernes Menüerlebnis.' }] },
    howItWorks: { title: 'IN 3 SCHRITTEN ONLINE', steps: [{ num: '01', title: 'Menü erstellen', desc: 'Fügen Sie Produkte, Kategorien und Preise hinzu.' }, { num: '02', title: 'QR-Code erhalten', desc: 'Platzieren Sie ihn auf Tischen oder Verpackungen.' }, { num: '03', title: 'Sofort aktualisieren', desc: 'Ändern Sie Ihr Menü jederzeit ohne Druckkosten.' }] },
    features: { title: 'ALLES UNTER KONTROLLE', list: ['Produktfotos & Beschreibungsverwaltung', 'Unterstützung für 50+ Sprachen', 'Kategorien & Abschnitte bearbeiten', 'Aktionsprodukte hervorheben', 'Nicht vorrätige Artikel ausblenden', 'Social-Media-Links', 'Allergen- & Kalorieninfo', 'QR-Code-Anpassung'] },
    benefits: { title: 'VORTEILE FÜR IHR UNTERNEHMEN', items: [{ icon: '💰', title: 'Druckkosten senken', desc: 'Kein Drucken neuer Speisekarten bei Preisänderungen.' }, { icon: '😊', title: 'Kundenerfahrung verbessern', desc: 'Gäste greifen schnell und einfach auf das Menü zu.' }, { icon: '⚡', title: 'Jederzeit verwalten', desc: 'Neue Artikel und Aktionen sofort veröffentlichen.' }, { icon: '🎨', title: 'Ihr Markenauftritt', desc: 'Digitales Menü passend zu Ihrer Markenidentität.' }] },
    useCases: { title: 'FÜR JEDEN BETRIEB GEEIGNET', items: [{ icon: '🍽️', label: 'Restaurants' }, { icon: '☕', label: 'Cafés' }, { icon: '🏨', label: 'Hotels' }, { icon: '🍸', label: 'Bars' }, { icon: '🎂', label: 'Bäckereien' }, { icon: '🏖️', label: 'Beach Clubs' }, { icon: '📦', label: 'Lieferservice' }] },
    packages: { title: 'PREISE', subtitle: '5 Tage kostenlos testen, keine Kreditkarte erforderlich', items: [{ name: 'Starter', price: '€9', period: '/Mo', badge: null, desc: 'Basis-Digitalmenü für kleine Betriebe.', features: ['Unbegrenzte Produkte', 'QR-Code-Verwaltung', '14 Allergene', 'Druckvorlagen'], cta: 'Starten', href: '/kayit', primary: false }, { name: 'Professional', price: '€89', period: '/Jahr', badge: 'Beliebteste', desc: 'Mehr Funktionen und Anpassungsoptionen.', features: ['Alles aus Starter', '50+ Sprachen-Übersetzung', 'Treuekartensystem', 'Prioritätssupport'], cta: 'Jährlich starten', href: '/kayit', primary: true }, { name: 'Enterprise', price: 'Angebot', period: '', badge: null, desc: 'Für Unternehmen mit mehreren Standorten.', features: ['Alle Funktionen', 'Multi-Standort-Verwaltung', 'Individuelle Integration', 'Dedizierter Support'], cta: 'Kontaktieren', href: 'mailto:hallo@mia.menu', primary: false }] },
    faq: { title: 'HÄUFIG GESTELLTE FRAGEN', items: [{ q: 'Kann ich das Menü ändern?', a: 'Ja, Sie können Produkte und Preise jederzeit aktualisieren. Änderungen werden sofort angezeigt.' }, { q: 'Ändert sich der QR-Code?', a: 'Nein. Auch nach Menüänderungen bleibt der QR-Code gleich.' }, { q: 'Gibt es Einrichtungssupport?', a: 'Ja, Support wird bei Einrichtung und Nutzung bereitgestellt.' }, { q: 'Können mehrere Standorte hinzugefügt werden?', a: 'In Enterprise-Paketen können mehrere Standorte verwaltet werden.' }] },
    finalCta: { title: 'DER EINFACHSTE WEG ZUM MODERNEN MENÜ', sub: 'Mit Mia Menu digital, schnell und vollständig verwaltbar werden.', cta1: 'Jetzt starten', cta2: 'Kontaktieren Sie uns' },
  },
  nl: {
    lang: 'nl',
    nav: { features: 'Functies', howItWorks: 'Hoe het werkt', packages: 'Prijzen', faq: 'FAQ', login: 'Inloggen', cta: 'Gratis starten →' },
    badge: 'Conform Turkse voedselregelgeving · 14 officiële allergenen',
    heroTitle: ['DIGITALISEER', 'UW', 'MENU'],
    heroSub: 'Maak eenvoudig QR-menu\'s, beheer uw producten en update uw menu in seconden.',
    heroCta1: 'Gratis demo',
    heroCta2: 'Voorbeeldmenu bekijken →',
    heroNote: '5 dagen gratis · Geen creditcard vereist',
    phoneCaption: '↑ Live menu — scroll & probeer het',
    advantages: { title: 'WAAROM MIA MENU?', items: [{ icon: '⚡', title: 'Snelle installatie', desc: 'Uw menu is in minuten klaar voor gebruik.' }, { icon: '✏️', title: 'Eenvoudig beheer', desc: 'Update producten, prijzen en categorieën moeiteloos.' }, { icon: '📱', title: 'Mobiel vriendelijk', desc: 'Perfect weergegeven op alle apparaten.' }, { icon: '🔲', title: 'QR-menusysteem', desc: 'Contactloos, snel en moderne menu-ervaring.' }] },
    howItWorks: { title: 'IN 3 STAPPEN LIVE', steps: [{ num: '01', title: 'Maak uw menu', desc: 'Voeg producten, categorieën en prijzen toe.' }, { num: '02', title: 'Ontvang uw QR-code', desc: 'Plaats het op tafels of verpakkingen.' }, { num: '03', title: 'Direct updaten', desc: 'Wijzig uw menu wanneer u wilt zonder drukkosten.' }] },
    features: { title: 'ALLES ONDER CONTROLE', list: ['Productfoto\'s & beschrijvingsbeheer', 'Ondersteuning voor 50+ talen', 'Categorieën & secties bewerken', 'Aanbiedingsproducten markeren', 'Uitverkochte items verbergen', 'Social media links', 'Allergen & calorie-info', 'QR-code aanpassing'] },
    benefits: { title: 'VOORDELEN VOOR UW BEDRIJF', items: [{ icon: '💰', title: 'Drukkosten verlagen', desc: 'Geen nieuwe menu\'s drukken bij prijswijzigingen.' }, { icon: '😊', title: 'Klantbeleving verbeteren', desc: 'Gasten hebben snel en gemakkelijk toegang tot het menu.' }, { icon: '⚡', title: 'Altijd beheren', desc: 'Publiceer nieuwe items en aanbiedingen direct.' }, { icon: '🎨', title: 'Uw merkidentiteit', desc: 'Digitaal menu passend bij uw huisstijl.' }] },
    useCases: { title: 'GESCHIKT VOOR ELK BEDRIJF', items: [{ icon: '🍽️', label: 'Restaurants' }, { icon: '☕', label: "Café's" }, { icon: '🏨', label: 'Hotels' }, { icon: '🍸', label: 'Bars' }, { icon: '🎂', label: 'Bakkerijen' }, { icon: '🏖️', label: 'Beach Clubs' }, { icon: '📦', label: 'Bezorging' }] },
    packages: { title: 'PRIJZEN', subtitle: '5 dagen gratis proberen, geen creditcard vereist', items: [{ name: 'Starter', price: '€9', period: '/mnd', badge: null, desc: 'Basis digitaal menu voor kleine bedrijven.', features: ['Onbeperkte producten', 'QR-codebeheer', '14 allergenen', 'Druksjablonen'], cta: 'Starten', href: '/kayit', primary: false }, { name: 'Professioneel', price: '€89', period: '/jaar', badge: 'Meest populair', desc: 'Meer functies en aanpassingsopties.', features: ['Alles uit Starter', 'Vertaling 50+ talen', 'Loyaliteitskaart', 'Prioriteitsondersteuning'], cta: 'Jaarlijks starten', href: '/kayit', primary: true }, { name: 'Enterprise', price: 'Offerte', period: '', badge: null, desc: 'Voor bedrijven met meerdere locaties.', features: ['Alle functies', 'Multi-locatiebeheer', 'Aangepaste integratie', 'Toegewijde support'], cta: 'Contact', href: 'mailto:info@mia.menu', primary: false }] },
    faq: { title: 'VEELGESTELDE VRAGEN', items: [{ q: 'Kan ik het menu wijzigen?', a: 'Ja, u kunt producten en prijzen op elk moment bijwerken. Wijzigingen zijn direct zichtbaar.' }, { q: 'Verandert de QR-code?', a: 'Nee. Ook na menu-updates blijft dezelfde QR-code werken.' }, { q: 'Is er installatieondersteuning?', a: 'Ja, ondersteuning is beschikbaar tijdens setup en gebruik.' }, { q: 'Kunnen meerdere locaties worden toegevoegd?', a: 'In enterprise-pakketten kunnen meerdere locaties worden beheerd.' }] },
    finalCta: { title: 'DE EENVOUDIGSTE MANIER OM UW MENU TE MODERNISEREN', sub: 'Word digitaal met Mia Menu — modern, snel en volledig beheersbaar.', cta1: 'Nu beginnen', cta2: 'Neem contact op' },
  },
  es: {
    lang: 'es',
    nav: { features: 'Funciones', howItWorks: 'Cómo funciona', packages: 'Precios', faq: 'FAQ', login: 'Iniciar sesión', cta: 'Empezar gratis →' },
    badge: 'Conforme a la normativa alimentaria turca · 14 alérgenos oficiales',
    heroTitle: ['DIGITALICE', 'SU', 'MENÚ'],
    heroSub: 'Cree menús QR fácilmente, gestione sus productos y actualice su menú en segundos.',
    heroCta1: 'Demo gratuita',
    heroCta2: 'Ver menú de ejemplo →',
    heroNote: '5 días gratis · Sin tarjeta de crédito',
    phoneCaption: '↑ Menú en vivo — desplácese y pruébelo',
    advantages: { title: '¿POR QUÉ MIA MENU?', items: [{ icon: '⚡', title: 'Configuración rápida', desc: 'Su menú estará listo para usar en minutos.' }, { icon: '✏️', title: 'Gestión sencilla', desc: 'Actualice productos, precios y categorías fácilmente.' }, { icon: '📱', title: 'Compatible con móvil', desc: 'Visualización perfecta en todos los dispositivos.' }, { icon: '🔲', title: 'Sistema de menú QR', desc: 'Experiencia de menú sin contacto, rápida y moderna.' }] },
    howItWorks: { title: 'EN LÍNEA EN 3 PASOS', steps: [{ num: '01', title: 'Cree su menú', desc: 'Añada productos, categorías y precios.' }, { num: '02', title: 'Obtenga su código QR', desc: 'Colóquelo en mesas, puertas o embalajes.' }, { num: '03', title: 'Actualice al instante', desc: 'Cambie su menú cuando quiera sin costes de impresión.' }] },
    features: { title: 'TODO BAJO CONTROL', list: ['Fotos y descripción de productos', 'Soporte para 50+ idiomas', 'Edición de categorías', 'Productos destacados', 'Ocultar artículos agotados', 'Links de redes sociales', 'Info de alérgenos y calorías', 'Personalización de QR'] },
    benefits: { title: 'BENEFICIOS PARA SU NEGOCIO', items: [{ icon: '💰', title: 'Reduzca costos de impresión', desc: 'No más impresión de menús por cada cambio de precio.' }, { icon: '😊', title: 'Mejore la experiencia del cliente', desc: 'Los clientes acceden al menú rápida y fácilmente.' }, { icon: '⚡', title: 'Gestione en cualquier momento', desc: 'Publique nuevos artículos y promociones al instante.' }, { icon: '🎨', title: 'Su marca, su estilo', desc: 'Menú digital que refleja su identidad de marca.' }] },
    useCases: { title: 'PERFECTO PARA CUALQUIER NEGOCIO', items: [{ icon: '🍽️', label: 'Restaurantes' }, { icon: '☕', label: 'Cafés' }, { icon: '🏨', label: 'Hoteles' }, { icon: '🍸', label: 'Bares' }, { icon: '🎂', label: 'Pastelerías' }, { icon: '🏖️', label: 'Beach Clubs' }, { icon: '📦', label: 'Delivery' }] },
    packages: { title: 'PRECIOS', subtitle: 'Pruebe 5 días gratis, sin tarjeta de crédito', items: [{ name: 'Básico', price: '€9', period: '/mes', badge: null, desc: 'Menú digital básico para pequeños negocios.', features: ['Productos ilimitados', 'Gestión de código QR', '14 alérgenos', 'Plantillas de impresión'], cta: 'Empezar', href: '/kayit', primary: false }, { name: 'Profesional', price: '€89', period: '/año', badge: 'Más popular', desc: 'Más funciones y opciones de personalización.', features: ['Todo lo del Básico', 'Traducción 50+ idiomas', 'Sistema de fidelización', 'Soporte prioritario'], cta: 'Empezar anual', href: '/kayit', primary: true }, { name: 'Empresa', price: 'Cotizar', period: '', badge: null, desc: 'Para negocios con múltiples sucursales.', features: ['Todas las funciones', 'Gestión multi-sucursal', 'Integración personalizada', 'Soporte dedicado'], cta: 'Contactar', href: 'mailto:hola@mia.menu', primary: false }] },
    faq: { title: 'PREGUNTAS FRECUENTES', items: [{ q: '¿Puedo hacer cambios en el menú?', a: 'Sí, puede actualizar productos y precios en cualquier momento. Los cambios se reflejan al instante.' }, { q: '¿Cambia el código QR?', a: 'No. Aunque actualice el menú, el mismo código QR sigue funcionando.' }, { q: '¿Se proporciona soporte de configuración?', a: 'Sí, se proporciona soporte durante la configuración y el uso.' }, { q: '¿Se pueden añadir varias sucursales?', a: 'En los paquetes empresariales se pueden gestionar varias sucursales.' }] },
    finalCta: { title: 'LA FORMA MÁS FÁCIL DE MODERNIZAR SU MENÚ', sub: 'Pase al digital con Mia Menu — moderno, rápido y totalmente gestionable.', cta1: 'Empezar ahora', cta2: 'Contáctenos' },
  },
  it: {
    lang: 'it',
    nav: { features: 'Funzioni', howItWorks: 'Come funziona', packages: 'Prezzi', faq: 'FAQ', login: 'Accedi', cta: 'Inizia gratis →' },
    badge: 'Conforme alle normative alimentari turche · 14 allergeni ufficiali',
    heroTitle: ['DIGITALIZZA', 'IL TUO', 'MENU'],
    heroSub: 'Crea facilmente menu QR, gestisci i tuoi prodotti e aggiorna il menu in pochi secondi.',
    heroCta1: 'Demo gratuita',
    heroCta2: 'Vedi menu di esempio →',
    heroNote: '5 giorni gratuiti · Nessuna carta di credito richiesta',
    phoneCaption: '↑ Menu in diretta — scorri e provalo',
    advantages: { title: 'PERCHÉ MIA MENU?', items: [{ icon: '⚡', title: 'Configurazione rapida', desc: 'Il tuo menu è pronto in pochi minuti.' }, { icon: '✏️', title: 'Gestione semplice', desc: 'Aggiorna prodotti, prezzi e categorie facilmente.' }, { icon: '📱', title: 'Mobile friendly', desc: 'Visualizzazione perfetta su tutti i dispositivi.' }, { icon: '🔲', title: 'Sistema menu QR', desc: 'Esperienza menu contactless, veloce e moderna.' }] },
    howItWorks: { title: 'ONLINE IN 3 PASSI', steps: [{ num: '01', title: 'Crea il tuo menu', desc: 'Aggiungi prodotti, categorie e prezzi.' }, { num: '02', title: 'Ottieni il codice QR', desc: 'Posizionalo su tavoli, porte o confezioni.' }, { num: '03', title: 'Aggiorna istantaneamente', desc: 'Modifica il menu quando vuoi senza costi di stampa.' }] },
    features: { title: 'TUTTO SOTTO CONTROLLO', list: ['Foto prodotti e gestione descrizioni', 'Supporto per 50+ lingue', 'Modifica categorie e sezioni', 'Prodotti in evidenza', 'Nascondi articoli esauriti', 'Link social media', 'Info allergeni e calorie', 'Personalizzazione QR'] },
    benefits: { title: 'VANTAGGI PER LA TUA ATTIVITÀ', items: [{ icon: '💰', title: 'Riduci i costi di stampa', desc: 'Nessuna stampa di nuovi menu ad ogni cambio di prezzo.' }, { icon: '😊', title: 'Migliora l\'esperienza cliente', desc: 'Gli ospiti accedono al menu rapidamente e facilmente.' }, { icon: '⚡', title: 'Gestisci sempre', desc: 'Pubblica nuovi articoli e promozioni istantaneamente.' }, { icon: '🎨', title: 'Il tuo brand, il tuo stile', desc: 'Menu digitale che riflette la tua identità di marca.' }] },
    useCases: { title: 'ADATTO AD OGNI ATTIVITÀ', items: [{ icon: '🍽️', label: 'Ristoranti' }, { icon: '☕', label: 'Caffè' }, { icon: '🏨', label: 'Hotel' }, { icon: '🍸', label: 'Bar' }, { icon: '🎂', label: 'Pasticcerie' }, { icon: '🏖️', label: 'Beach Club' }, { icon: '📦', label: 'Consegna' }] },
    packages: { title: 'PREZZI', subtitle: 'Prova 5 giorni gratis, nessuna carta di credito richiesta', items: [{ name: 'Base', price: '€9', period: '/mese', badge: null, desc: 'Menu digitale base per piccole attività.', features: ['Prodotti illimitati', 'Gestione codice QR', '14 allergeni', 'Modelli di stampa'], cta: 'Inizia', href: '/kayit', primary: false }, { name: 'Professionale', price: '€89', period: '/anno', badge: 'Più popolare', desc: 'Più funzioni e opzioni di personalizzazione.', features: ['Tutto di Base', 'Traduzione 50+ lingue', 'Sistema fedeltà', 'Supporto prioritario'], cta: 'Inizia annuale', href: '/kayit', primary: true }, { name: 'Enterprise', price: 'Preventivo', period: '', badge: null, desc: 'Per attività con più sedi.', features: ['Tutte le funzioni', 'Gestione multi-sede', 'Integrazione personalizzata', 'Supporto dedicato'], cta: 'Contattaci', href: 'mailto:ciao@mia.menu', primary: false }] },
    faq: { title: 'DOMANDE FREQUENTI', items: [{ q: 'Posso modificare il menu?', a: 'Sì, puoi aggiornare prodotti e prezzi in qualsiasi momento. Le modifiche si riflettono istantaneamente.' }, { q: 'Il codice QR cambia?', a: 'No. Anche dopo gli aggiornamenti del menu, lo stesso codice QR continua a funzionare.' }, { q: 'Viene fornito supporto alla configurazione?', a: 'Sì, il supporto viene fornito durante la configurazione e l\'utilizzo.' }, { q: 'Si possono aggiungere più sedi?', a: 'Nei pacchetti enterprise è possibile gestire più sedi.' }] },
    finalCta: { title: 'IL MODO PIÙ SEMPLICE PER MODERNIZZARE IL TUO MENU', sub: 'Passa al digitale con Mia Menu — moderno, veloce e completamente gestibile.', cta1: 'Inizia ora', cta2: 'Contattaci' },
  },
};
