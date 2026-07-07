'use client';

import { useMemo, useState } from 'react';
import type { Announcement, MenuSection, Product, Tenant } from '@/types/database';
import { AllergenIcon } from '@/lib/allergenIcons';
import { getTheme } from '@/lib/menuThemes';
import { submitReview } from './actions';

type Layout = 'classic' | 'dark' | 'minimal';

type ProductWithExtras = Product & {
  product_allergens?: { allergens: { code: string | null; name_tr: string; name_en: string } }[];
  product_tags?: { tags: { name: string } }[];
};

type Translation = {
  entity_type: 'product' | 'section' | 'tenant';
  entity_id: string;
  value: string;
};

const labels = {
  tr: { allergenInfo: 'Alerjen & kalori bilgisi', search: 'Ürün ara...', notFound: 'Ürün bulunamadı', allergens: 'Alerjenler', noAllergens: 'Belirtilen alerjen yok', footnote: 'Bu bilgiler 1 Temmuz 2026 yönetmeliğine uygun olarak sunulmaktadır.', favorites: 'Favoriler', leaveReview: 'Görüş bırak' },
  en: { allergenInfo: 'Allergen & calorie info', search: 'Search dishes...', notFound: 'No items found', allergens: 'Allergens', noAllergens: 'No listed allergens', footnote: 'This information is shown in line with the regulation effective July 1, 2026.', favorites: 'Favorites', leaveReview: 'Leave feedback' },
};

export default function MenuClient({ tenant, sections, products, announcement, translations }: {
  tenant: Tenant;
  sections: MenuSection[];
  products: ProductWithExtras[];
  announcement: Announcement | null;
  translations: Translation[];
}) {
  const layout: Layout = (tenant.menu_layout as Layout) ?? 'classic';
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ProductWithExtras | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  const t = labels[lang];
  const theme = getTheme(tenant.theme_color);

  const enMap = useMemo(() => {
    const map = new Map<string, string>();
    translations.forEach((tr) => map.set(`${tr.entity_type}:${tr.entity_id}`, tr.value));
    return map;
  }, [translations]);

  function nameFor(entityType: 'product' | 'section', id: string, fallback: string) {
    if (lang === 'tr') return fallback;
    return enMap.get(`${entityType}:${id}`) || fallback;
  }

  const favorites = useMemo(() => products.filter((p) => p.is_favorite), [products]);
  const activeSectionObj = sections.find((s) => s.id === activeSection);
  const displayStyle = activeSectionObj?.display_style ?? 'list_image';

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSection = p.section_id === activeSection;
      const displayName = nameFor('product', p.id, p.name);
      const matchesQuery = query.trim() === '' || displayName.toLowerCase().includes(query.toLowerCase());
      return matchesSection && matchesQuery;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, activeSection, query, lang, enMap]);

  async function handleReviewSubmit() {
    setReviewSubmitting(true);
    await submitReview({ tenantId: tenant.id, customerName: reviewName, rating: reviewRating, comment: reviewComment });
    setReviewSubmitting(false);
    setReviewDone(true);
  }

  const langToggle = (
    <div className="inline-flex rounded-full bg-white p-0.5">
      <button onClick={() => setLang('tr')} className={`text-xs px-2.5 py-1 rounded-full ${lang === 'tr' ? `${theme.accentBg} text-white` : theme.accentText}`}>TR</button>
      <button onClick={() => setLang('en')} className={`text-xs px-2.5 py-1 rounded-full ${lang === 'en' ? `${theme.accentBg} text-white` : theme.accentText}`}>EN</button>
    </div>
  );

  const announcementBanner = announcement && (
    <div className="bg-amber-50 border-b border-amber-100 px-4 py-2.5">
      {announcement.kind === 'poster' && announcement.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={announcement.image_url} alt={announcement.title ?? ''} className="w-full rounded-md mb-2" />
      )}
      {announcement.title && <p className="text-sm font-medium text-amber-900">{announcement.title}</p>}
      {announcement.message && <p className="text-xs text-amber-700 mt-0.5">{announcement.message}</p>}
    </div>
  );

  const modal = selected && (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center p-6 z-50" onClick={() => setSelected(null)}>
      <div className="bg-white rounded-lg p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          <p className="font-medium">{nameFor('product', selected.id, selected.name)}</p>
          <button onClick={() => setSelected(null)} className="text-gray-400">✕</button>
        </div>
        {selected.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={selected.image_url} alt={selected.name} className="w-full h-36 object-cover rounded-md mt-2" />
        )}
        {selected.product_tags && selected.product_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selected.product_tags.map((pt, i) => (
              <span key={i} className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md">{pt.tags.name}</span>
            ))}
          </div>
        )}
        {selected.description && <p className="text-sm text-gray-500 mt-1.5 mb-3">{selected.description}</p>}
        <div className="flex gap-4 mb-3 text-sm">
          <span className="font-medium">{selected.price} ₺</span>
          {selected.calories != null && <span className="text-gray-500">{selected.calories} kcal</span>}
        </div>
        <p className="text-xs text-gray-500 mb-1.5">{t.allergens}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selected.product_allergens && selected.product_allergens.length > 0 ? (
            selected.product_allergens.map((pa, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md">
                <AllergenIcon code={pa.allergens.code} className="w-3.5 h-3.5" />
                {lang === 'tr' ? pa.allergens.name_tr : pa.allergens.name_en}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">{t.noAllergens}</span>
          )}
        </div>
        <p className="text-[11px] text-gray-400">{t.footnote}</p>
      </div>
    </div>
  );

  const reviewModal = showReview && (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center p-6 z-50" onClick={() => { setShowReview(false); setReviewDone(false); }}>
      <div className="bg-white rounded-lg p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        {!reviewDone ? (
          <>
            <div className="flex justify-between items-start mb-3">
              <p className="font-medium">Görüşünüzü bırakın</p>
              <button onClick={() => setShowReview(false)} className="text-gray-400">✕</button>
            </div>
            <div className="flex gap-1 mb-3 text-2xl">
              {[1,2,3,4,5].map((n) => (
                <button key={n} onClick={() => setReviewRating(n)} className={n <= reviewRating ? 'text-amber-500' : 'text-gray-300'}>★</button>
              ))}
            </div>
            <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Adınız (opsiyonel)" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mb-2" />
            <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Yorumunuz" rows={3} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mb-3" />
            <button onClick={handleReviewSubmit} disabled={reviewSubmitting} className={`w-full ${theme.accentBg} text-white rounded-md py-2 text-sm font-medium disabled:opacity-50`}>{reviewSubmitting ? 'Gönderiliyor...' : 'Gönder'}</button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-2xl mb-2">✓</p>
            <p className="font-medium mb-3">Teşekkürler!</p>
            <button onClick={() => { setShowReview(false); setReviewDone(false); setReviewName(''); setReviewComment(''); setReviewRating(5); }} className={`text-sm ${theme.accentBg} text-white rounded-md py-2 px-4`}>Kapat</button>
          </div>
        )}
      </div>
    </div>
  );

  /* ─── LAYOUT: DARK ─── */
  if (layout === 'dark') {
    return (
      <main className="mx-auto max-w-md min-h-screen bg-gray-100">
        <header className="relative bg-gray-900">
          {tenant.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tenant.cover_image_url} alt={tenant.name} className="w-full h-48 object-cover opacity-60" />
          )}
          <div className="absolute top-3 right-3">{langToggle}</div>
          <div className="px-4 py-3">
            <h1 className="text-lg font-semibold text-white">{tenant.name}</h1>
            <span className="text-xs text-white/60">İstanbul</span>
          </div>
          <div className="flex overflow-x-auto border-t border-white/10">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`whitespace-nowrap text-xs px-4 py-2.5 flex-shrink-0 border-b-2 transition-colors ${
                  activeSection === s.id ? 'text-white border-white font-medium' : 'text-white/40 border-transparent'
                }`}>
                {nameFor('section', s.id, s.name)}
              </button>
            ))}
          </div>
        </header>

        {announcementBanner}

        <div className="p-3 flex flex-col gap-2">
          {filtered.map((p) => (
            <button key={p.id} onClick={() => setSelected(p)} className="bg-white rounded-xl overflow-hidden flex text-left shadow-sm">
              <div className="flex-1 p-3">
                <p className="text-sm font-semibold text-gray-900">{nameFor('product', p.id, p.name)}</p>
                {p.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{p.description}</p>}
                <p className="text-sm font-bold text-gray-900 mt-1.5">{p.price} ₺</p>
              </div>
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt={p.name} className="w-20 h-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 bg-gray-100 flex-shrink-0" />
              )}
            </button>
          ))}
          {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-8">{t.notFound}</p>}
        </div>

        <div className="px-3 pb-4">
          <button onClick={() => setShowReview(true)} className="w-full text-sm text-gray-500 border border-gray-200 rounded-md py-2 bg-white">★ {t.leaveReview}</button>
        </div>

        {modal}{reviewModal}
      </main>
    );
  }

  /* ─── LAYOUT: MINIMAL ─── */
  if (layout === 'minimal') {
    return (
      <main className="mx-auto max-w-md min-h-screen bg-white">
        <div className="px-4 pt-5 pb-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">{tenant.name}</h1>
              {tenant.address && <p className="text-xs text-gray-400 mt-0.5">{tenant.address.split(',')[1]?.trim() ?? ''}</p>}
            </div>
            <div className="border border-gray-200 rounded-full px-3 py-1 flex gap-2 items-center">
              <button onClick={() => setLang('tr')} className={`text-xs ${lang === 'tr' ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>TR</button>
              <span className="w-px h-3 bg-gray-200" />
              <button onClick={() => setLang('en')} className={`text-xs ${lang === 'en' ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>EN</button>
            </div>
          </div>

          {tenant.cover_image_url && (
            <div className="relative mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tenant.cover_image_url} alt={tenant.name} className="w-full h-40 object-cover rounded-xl" />
              <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg px-2 py-1">
                <span className="text-[10px] text-emerald-700 font-medium">{t.allergenInfo}</span>
              </div>
            </div>
          )}

          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} className="w-full bg-gray-100 border-0 rounded-lg px-3 py-2 text-sm mb-4 focus:ring-1 focus:ring-gray-300" />

          <div className="flex gap-2 overflow-x-auto pb-3 mb-1">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full font-medium transition-colors flex-shrink-0 ${
                  activeSection === s.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                {nameFor('section', s.id, s.name)}
              </button>
            ))}
          </div>
        </div>

        {announcementBanner}

        <div className="px-4 pb-4">
          {displayStyle === 'grid' ? (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((p) => (
                <button key={p.id} onClick={() => setSelected(p)} className="border border-gray-100 rounded-xl overflow-hidden text-left">
                  {p.image_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={p.image_url} alt={p.name} className="w-full h-24 object-cover" />
                    : <div className="w-full h-24 bg-gray-100" />}
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-gray-900 truncate">{nameFor('product', p.id, p.name)}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{p.price} ₺</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {filtered.map((p) => (
                <button key={p.id} onClick={() => setSelected(p)} className="flex justify-between items-center py-3 text-left gap-3">
                  <div className="flex gap-3 items-center min-w-0">
                    {displayStyle === 'list_image' && (p.image_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      : null)}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{nameFor('product', p.id, p.name)}</p>
                      {p.description && <p className="text-xs text-gray-400 truncate">{p.description}</p>}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">{p.price} ₺</p>
                </button>
              ))}
            </div>
          )}
          {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-8">{t.notFound}</p>}

          {favorites.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">{t.favorites}</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {favorites.map((p) => (
                  <button key={p.id} onClick={() => setSelected(p)} className="flex-shrink-0 w-28 border border-gray-100 rounded-xl overflow-hidden text-left">
                    {p.image_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={p.image_url} alt={p.name} className="w-full h-16 object-cover" />
                      : <div className="w-full h-16 bg-gray-100" />}
                    <div className="p-1.5">
                      <p className="text-[11px] font-medium truncate">{nameFor('product', p.id, p.name)}</p>
                      <p className="text-xs font-bold mt-0.5">{p.price} ₺</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => setShowReview(true)} className="w-full text-sm text-gray-400 border border-gray-100 rounded-lg py-2 mt-4">★ {t.leaveReview}</button>
        </div>

        {modal}{reviewModal}
      </main>
    );
  }

  /* ─── LAYOUT: CLASSIC (default) ─── */
  return (
    <main className="mx-auto max-w-md min-h-screen bg-white">
      <header className={`${theme.headerBg} relative`}>
        {tenant.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tenant.cover_image_url} alt={tenant.name} className="w-full h-48 object-cover" />
        )}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h1 className={`text-lg font-semibold ${theme.headerText}`}>{tenant.name}</h1>
            {langToggle}
          </div>
          <span className="inline-flex items-center gap-1 mt-2 text-xs bg-white text-emerald-700 px-2 py-1 rounded-md">{t.allergenInfo}</span>
        </div>
      </header>

      {announcementBanner}

      {favorites.length > 0 && (
        <div className="px-4 pt-4">
          <p className="text-xs text-gray-500 mb-2">{t.favorites}</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {favorites.map((p) => (
              <button key={p.id} onClick={() => setSelected(p)} className="flex-shrink-0 w-28 border border-gray-200 rounded-md p-2 text-left">
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.name} className="w-full h-16 object-cover rounded-md mb-1.5" />
                )}
                <p className="text-xs font-medium truncate">{nameFor('product', p.id, p.name)}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.price} ₺</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mb-3" />
        <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`whitespace-nowrap text-sm px-3 py-1.5 rounded-full border ${
                activeSection === s.id ? `${theme.accentBg} text-white ${theme.accentBorder}` : 'bg-white text-gray-700 border-gray-200'
              }`}>
              {nameFor('section', s.id, s.name)}
            </button>
          ))}
        </div>

        {displayStyle === 'grid' ? (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((p) => (
              <button key={p.id} onClick={() => setSelected(p)} className="border border-gray-200 rounded-md overflow-hidden text-left">
                {p.image_url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.image_url} alt={p.name} className="w-full h-24 object-cover" />
                  : <div className="w-full h-24 bg-gray-100" />}
                <div className="p-2"><p className="text-xs truncate">{nameFor('product', p.id, p.name)}</p><p className="text-xs font-medium mt-1">{p.price} ₺</p></div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((p) => (
              <button key={p.id} onClick={() => setSelected(p)} className="flex justify-between items-center border border-gray-200 rounded-md px-3 py-2.5 text-left gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {displayStyle === 'list_image' && p.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm">{nameFor('product', p.id, p.name)}
                      {p.product_tags?.map((pt, i) => (
                        <span key={i} className="ml-1.5 text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-md">{pt.tags.name}</span>
                      ))}
                    </p>
                    {p.description && <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>}
                  </div>
                </div>
                <p className="text-sm font-medium whitespace-nowrap flex-shrink-0">{p.price} ₺</p>
              </button>
            ))}
          </div>
        )}
        {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-8">{t.notFound}</p>}
        <button onClick={() => setShowReview(true)} className="w-full text-sm text-gray-500 border border-gray-200 rounded-md py-2 mt-4">★ {t.leaveReview}</button>
      </div>

      {modal}{reviewModal}
    </main>
  );
}
