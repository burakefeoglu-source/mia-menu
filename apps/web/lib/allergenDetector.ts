/**
 * Ürün adı/açıklamasından otomatik alerjen tespiti
 * Türkçe gıda kelimelerini 14 resmi alerjenle eşleştirir
 */

type AllergenCode = 'gluten' | 'milk' | 'egg' | 'nuts' | 'sesame' | 'soy' |
  'fish' | 'shellfish' | 'peanuts' | 'celery' | 'mustard' | 'sulphites' | 'lupin' | 'molluscs';

const RULES: { keywords: string[]; allergens: AllergenCode[] }[] = [
  // GLUTEN — buğday, un, hamur, ekmek, makarna, börek, pasta, kurabiye
  {
    keywords: [
      'ekmek', 'bread', 'un', 'buğday', 'hamur', 'börek', 'gözleme', 'pide', 'lavaş',
      'simit', 'poğaça', 'açma', 'kurabiye', 'kek', 'pasta', 'brownie', 'waffle', 'wafl',
      'makarna', 'spagetti', 'fettuccine', 'penne', 'lasagna', 'lazanya', 'pizza',
      'mantı', 'köfte', 'şiş köfte', 'ravioli', 'tarhana', 'erişte', 'bulgur',
      'tagliatelle', 'tortiglioni', 'linguine', 'şehriye', 'arpa şehriye',
      'galeta', 'bisküvi', 'kraker', 'mısır gevreği', 'müsli', 'granola',
      'sote', 'panko', 'un kaplı', 'unlu', 'hamurlard', 'bazlama',
      'croissant', 'bagel', 'muffin', 'pancake', 'krep', 'gözleme', 'katmer',
      'revani', 'tulumba', 'kadayıf', 'lokma', 'helva', 'şekerpare',
      'trilece', 'tiramisu', 'profiterol', 'éclair', 'sufle',
    ],
    allergens: ['gluten'],
  },

  // SÜT — peynir, tereyağı, krema, yoğurt, ayran, süt
  {
    keywords: [
      'süt', 'milk', 'peynir', 'cheese', 'beyaz peynir', 'kaşar', 'tulum', 'lor',
      'mozzarella', 'cheddar', 'parmesan', 'ricotta', 'brie', 'feta',
      'tereyağı', 'butter', 'krema', 'cream', 'kaymak', 'yoğurt', 'yogurt',
      'ayran', 'kefir', 'çikolata sütlü', 'sütlü', 'sütlaç', 'muhallebi',
      'dondurma', 'ice cream', 'milkshake', 'latte', 'cappuccino', 'macchiato',
      'beyaz sos', 'béchamel', 'beşamel', 'kremalı', 'sütlü çikolata',
      'lasagna', 'lazanya', 'moussaka', 'muscaka', 'graten', 'gratine',
    ],
    allergens: ['milk'],
  },

  // YUMURTA
  {
    keywords: [
      'yumurta', 'egg', 'eggs', 'omlet', 'omelette', 'menemen', 'çılbır',
      'mayonez', 'mayonnaise', 'hollandaise', 'meringue', 'bezey',
      'sahanda', 'haşlanmış yumurta', 'scrambled', 'benedikt',
      'soufflé', 'sufle', 'kek', 'pasta', 'kurabiye', 'krep', 'waffle',
      'frittata', 'quiche', 'brownie',
    ],
    allergens: ['egg'],
  },

  // FINDIK/SERT KABUKLU — fındık, ceviz, badem, antepfıstığı, kaju, pekan
  {
    keywords: [
      'fındık', 'hazelnut', 'ceviz', 'walnut', 'badem', 'almond',
      'antepfıstığı', 'pistachio', 'kaju', 'cashew', 'pekan', 'pecan',
      'makadamya', 'macadamia', 'brezilya cevizi', 'brazil nut',
      'pralin', 'nutella', 'nut', 'nuts', 'mix nuts', 'karma kuruyemiş',
      'fındıklı', 'cevizli', 'bademli', 'fıstıklı', 'kajulu',
      'baklava', 'kadayıf', 'sütlü fındık', 'çikolata fındık',
    ],
    allergens: ['nuts'],
  },

  // YERFISTIĞI
  {
    keywords: [
      'yerfıstığı', 'yer fıstığı', 'peanut', 'peanuts', 'fıstık ezmesi',
      'peanut butter', 'satay', 'pad thai', 'nasi goreng',
    ],
    allergens: ['peanuts'],
  },

  // SUSAM
  {
    keywords: [
      'susam', 'sesame', 'tahini', 'tahin', 'hummus', 'humus',
      'susamlı', 'simit', 'halva', 'helva', 'tahinli',
      'burger bun', 'susamlı ekmek',
    ],
    allergens: ['sesame'],
  },

  // SOYA
  {
    keywords: [
      'soya', 'soy', 'tofu', 'edamame', 'miso', 'tempeh',
      'soya sosu', 'soy sauce', 'teriyaki', 'worcestershire',
    ],
    allergens: ['soy'],
  },

  // BALIK
  {
    keywords: [
      'balık', 'fish', 'levrek', 'çipura', 'uskumru', 'hamsi', 'sardalya',
      'ton balığı', 'tuna', 'somon', 'salmon', 'alabalık', 'trout',
      'palamut', 'lüfer', 'kılıç balığı', 'mercan', 'barbun', 'grida',
      'morina', 'cod', 'tilapia', 'sea bass', 'sea bream',
      'balık fileto', 'balık çorbası', 'balık tarator', 'füme somon',
      'gravlaks', 'tarama', 'balık yumurtası',
    ],
    allergens: ['fish'],
  },

  // KABUKLU DENİZ ÜRÜNLERİ
  {
    keywords: [
      'karides', 'shrimp', 'prawn', 'ıstakoz', 'lobster', 'yengeç', 'crab',
      'kerevit', 'crayfish', 'langustin', 'langoustine', 'deniz ürünleri',
      'seafood', 'deniz mahsulleri', 'kabuklu', 'scampi',
    ],
    allergens: ['shellfish'],
  },

  // YUMUŞAKÇALAR
  {
    keywords: [
      'midye', 'mussel', 'istiridye', 'oyster', 'ahtapot', 'octopus',
      'kalamar', 'squid', 'calamari', 'deniz salyangozbu', 'snail',
      'salyangoz', 'escargot', 'deniz tarağı', 'scallop',
    ],
    allergens: ['molluscs'],
  },

  // KEREVİZ
  {
    keywords: [
      'kereviz', 'celery', 'kereviz sapı', 'kereviz kökü', 'celeriac',
    ],
    allergens: ['celery'],
  },

  // HARDAL
  {
    keywords: [
      'hardal', 'mustard', 'dijon', 'remoulade', 'hot dog', 'sosisli',
    ],
    allergens: ['mustard'],
  },

  // SÜLFİTLER — şarap, sirke, kuru meyve
  {
    keywords: [
      'şarap', 'wine', 'bira', 'beer', 'sirke', 'vinegar', 'kuru üzüm',
      'kuru kayısı', 'kuru meyve', 'dried fruit', 'sosisli', 'sosis', 'sucuk', 'pastırma',
    ],
    allergens: ['sulphites'],
  },

  // ACI BAKLA
  {
    keywords: [
      'acı bakla', 'lupin', 'lupine', 'bakla unu',
    ],
    allergens: ['lupin'],
  },
];

/**
 * Ürün adı ve açıklamasından alerjen kodlarını tespit eder
 */
export function detectAllergens(name: string, description?: string | null): AllergenCode[] {
  const text = `${name} ${description ?? ''}`.toLowerCase()
    .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c');

  const detected = new Set<AllergenCode>();

  for (const rule of RULES) {
    for (const kw of rule.keywords) {
      const normalizedKw = kw.toLowerCase()
        .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
        .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c');
      if (text.includes(normalizedKw)) {
        rule.allergens.forEach(a => detected.add(a));
        break;
      }
    }
  }

  return Array.from(detected);
}
