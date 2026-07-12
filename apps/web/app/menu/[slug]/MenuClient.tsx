'use client';

import { useMemo, useState, useEffect } from 'react';
import type { Announcement, MenuSection, Product, Tenant } from '@/types/database';
import { AllergenIcon } from '@/lib/allergenIcons';
import { getTheme } from '@/lib/menuThemes';
import { submitReview } from './actions';
import SocialLinks from '@/components/SocialLinks';

type ProductWithExtras = Product & {
  product_allergens?: { allergens: { code: string | null; name_tr: string; name_en: string } }[];
  product_tags?: { tags: { name: string } }[];
  is_vegan?: boolean;
  is_vegetarian?: boolean;
  is_gluten_free?: boolean;
  is_daily_special?: boolean;
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
  const layout = (tenant.menu_layout as 'classic' | 'dark' | 'minimal') ?? 'classic';
  const sectionNav = (tenant.section_nav as 'tabs' | 'grid') ?? 'tabs';
  const theme = getTheme(tenant.theme_color);

  // Menü görüntülenme tracking
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenant_id: tenant.id, event_type: 'menu_view' }),
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [activeSection, setActiveSection] = useState<string | null>(
    sectionNav === 'grid' ? null : (sections[0]?.id ?? '')
  );
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ProductWithExtras | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [posterDismissed, setPosterDismissed] = useState(false);
  function trackProductClick(product: ProductWithExtras) {
    setSelected(product);
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenant_id: tenant.id, event_type: 'product_click', product_id: product.id }),
    }).catch(() => {});
  }
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  const t = labels[lang];

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
    if (!activeSection) return [];
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

  /* ─── DİL TOGGLE ─── */
  const langToggleDark = (
    <div className="inline-flex rounded-full bg-white/15 p-0.5">
      <button onClick={() => setLang('tr')} className={`text-xs px-2.5 py-1 rounded-full ${lang === 'tr' ? 'bg-white text-gray-900' : 'text-white/70'}`}>TR</button>
      <button onClick={() => setLang('en')} className={`text-xs px-2.5 py-1 rounded-full ${lang === 'en' ? 'bg-white text-gray-900' : 'text-white/70'}`}>EN</button>
    </div>
  );

  const langToggleLight = (
    <div className="inline-flex rounded-full bg-white p-0.5">
      <button onClick={() => setLang('tr')} className={`text-xs px-2.5 py-1 rounded-full ${lang === 'tr' ? `${theme.accentBg} text-white` : theme.accentText}`}>TR</button>
      <button onClick={() => setLang('en')} className={`text-xs px-2.5 py-1 rounded-full ${lang === 'en' ? `${theme.accentBg} text-white` : theme.accentText}`}>EN</button>
    </div>
  );

  const langToggleBorder = (
    <div className="border border-gray-200 rounded-full px-3 py-1 flex gap-2 items-center">
      <button onClick={() => setLang('tr')} className={`text-xs ${lang === 'tr' ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>TR</button>
      <span className="w-px h-3 bg-gray-200" />
      <button onClick={() => setLang('en')} className={`text-xs ${lang === 'en' ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>EN</button>
    </div>
  );

  /* ─── HEADER ─── */
  const header = (() => {
    if (layout === 'dark') return (
      <header className="relative bg-gray-900">
        {tenant.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tenant.cover_image_url} alt={tenant.name} className="w-full h-48 object-cover opacity-60" />
        )}
        <div className="absolute top-3 right-3">{langToggleDark}</div>
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold text-white">{tenant.name}</h1>
          <SocialLinks
            instagram={tenant.instagram_url}
            whatsapp={tenant.whatsapp_number}
            maps={tenant.google_maps_url}
            workingHours={tenant.working_hours}
            variant="on-dark"
          />
        </div>
      </header>
    );

    if (layout === 'minimal') return (
      <header className="px-4 pt-5 pb-3">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{tenant.name}</h1>
            {tenant.address && <p className="text-xs text-gray-400 mt-0.5">{tenant.address.split(',').slice(-1)[0]?.trim()}</p>}
          </div>
          {langToggleBorder}
        </div>
        {tenant.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tenant.cover_image_url} alt={tenant.name} className="w-full h-40 object-cover rounded-xl" />
        )}
        <SocialLinks
          instagram={tenant.instagram_url}
          whatsapp={tenant.whatsapp_number}
          maps={tenant.google_maps_url}
          workingHours={tenant.working_hours}
          variant="on-light"
        />
      </header>
    );

    /* classic (default) */
    return (
      <header className={`${theme.headerBg}`}>
        {tenant.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tenant.cover_image_url} alt={tenant.name} className="w-full h-44 object-cover" />
        )}
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className={`text-base font-semibold ${theme.headerText}`}>{tenant.name}</h1>
            {langToggleLight}
          </div>
          <SocialLinks
            instagram={tenant.instagram_url}
            whatsapp={tenant.whatsapp_number}
            maps={tenant.google_maps_url}
            workingHours={tenant.working_hours}
            variant="on-light"
          />
        </div>
      </header>
    );
  })();

  /* ─── ORTAK GÖVDE ─── */
  const body = (
    <>
      {/* Duyuru */}
      {announcement && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2.5">
          {announcement.kind === 'poster' && announcement.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={announcement.image_url} alt={announcement.title ?? ''} className="w-full rounded-md mb-2" />
          )}
          <div className="flex items-start gap-2">
            <span className="text-base flex-shrink-0 mt-0.5">
              {(announcement as { icon_type?: string }).icon_type === 'kampanya' ? '🏷️' : '📢'}
            </span>
            <div>
              {announcement.title && <p className="text-sm font-medium text-amber-900">{announcement.title}</p>}
              {announcement.message && <p className="text-xs text-amber-700 mt-0.5">{announcement.message}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Günün menüsü */}
      {products.filter((p) => p.is_daily_special).length > 0 && (
        <div className="px-4 pt-4">
          <p className="text-xs font-medium text-rose-600 mb-2">⭐ Günün Menüsü</p>
          <div className="flex flex-col gap-1.5">
            {products.filter((p) => p.is_daily_special).map((p) => (
              <button key={p.id} onClick={() => setSelected(p)}
                className="flex justify-between items-center border border-rose-100 bg-rose-50 rounded-lg px-3 py-2 text-left">
                <span className="text-sm font-medium text-gray-900">{nameFor('product', p.id, p.name)}</span>
                <span className="text-sm font-semibold text-rose-600">{p.price} ₺</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Favoriler */}
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
        {/* Arama */}
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mb-3" />

        {/* Bölüm navigasyonu — tabs */}
        {sectionNav === 'tabs' && (
          <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`whitespace-nowrap text-sm px-3 py-1.5 rounded-full border flex-shrink-0 ${
                  activeSection === s.id
                    ? `${theme.accentBg} text-white ${theme.accentBorder}`
                    : 'bg-white text-gray-700 border-gray-200'
                }`}>
                {nameFor('section', s.id, s.name)}
              </button>
            ))}
          </div>
        )}

        {/* Bölüm navigasyonu — grid */}
        {sectionNav === 'grid' && activeSection === null && (
          <div className="grid grid-cols-2 gap-3">
            {sections.map((s) => {
              const cover = products.find((p) => p.section_id === s.id && p.image_url)?.image_url;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className="border border-gray-200 rounded-xl overflow-hidden text-left">
                  {cover
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={cover} alt={s.name} className="w-full h-24 object-cover" />
                    : <div className={`w-full h-24 ${theme.headerBg}`} />}
                  <div className="p-2.5">
                    <p className="text-sm font-semibold text-gray-900">{nameFor('section', s.id, s.name)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{products.filter((p) => p.section_id === s.id).length} ürün</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Geri butonu (ızgara modunda bölüm seçildiyse) */}
        {sectionNav === 'grid' && activeSection !== null && (
          <button onClick={() => setActiveSection(null)}
            className="flex items-center gap-1.5 text-sm text-gray-500 mb-3 -ml-1">
            ← {t.favorites === 'Favoriler' ? 'Bölümler' : 'Sections'}
          </button>
        )}

        {/* Ürün listesi */}
        {(sectionNav === 'tabs' || activeSection !== null) && (
          <>
            {displayStyle === 'grid' ? (
              <div className="grid grid-cols-2 gap-2">
                {filtered.map((p) => (
                  <button key={p.id} onClick={() => setSelected(p)} className="border border-gray-200 rounded-md overflow-hidden text-left">
                    {p.image_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={p.image_url} alt={p.name} className="w-full h-24 object-cover" />
                      : <div className="w-full h-24 bg-gray-100" />}
                    <div className="p-2">
                      <p className="text-xs truncate">{nameFor('product', p.id, p.name)}</p>
                      <p className="text-xs font-medium mt-1">{p.price} ₺</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filtered.map((p) => (
                  <button key={p.id} onClick={() => setSelected(p)}
                    className="flex justify-between items-center border border-gray-200 rounded-md px-3 py-2.5 text-left gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {displayStyle === 'list_image' && p.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm">
                          {nameFor('product', p.id, p.name)}
                          {p.is_vegan && <span className="ml-1 text-sm">🌱</span>}
                          {p.is_vegetarian && <span className="ml-1 text-sm">🥗</span>}
                          {p.is_gluten_free && <span className="ml-1 text-sm">🌾</span>}
                          {p.product_tags?.map((pt, i) => {
                            const tagIcon = (pt.tags as unknown as { name: string; icon?: string | null }).icon;
                            return (
                              <span key={i} className="ml-1 text-sm" title={pt.tags.name}>
                                {tagIcon
                                  ? tagIcon
                                  : <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-md">{pt.tags.name}</span>
                                }
                              </span>
                            );
                          })}
                        </p>
                        {p.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{p.description}</p>}
                      </div>
                    </div>
                    <p className="text-sm font-medium whitespace-nowrap flex-shrink-0">{p.price} ₺</p>
                  </button>
                ))}
              </div>
            )}
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">{t.notFound}</p>
            )}
          </>
        )}

        <button onClick={() => setShowReview(true)}
          className="w-full text-sm text-gray-500 border border-gray-200 rounded-md py-2 mt-4">
          ★ {t.leaveReview}
        </button>
        {tenant.google_review_url && (
          <a
            href={tenant.google_review_url}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 text-sm text-gray-700 border border-gray-200 rounded-md py-2 mt-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.vecteezy.com/system/resources/previews/066/712/316/non_2x/google-business-icon-logo-symbol-free-png.png"
              alt="Google"
              className="w-5 h-5 object-contain"
            />
            Google&apos;da değerlendirin
          </a>
        )}
        <div className="text-center mt-6 pb-2">
          <p className="text-[11px] text-gray-300">
            Powered by{' '}
            <a href="https://mia-menu.vercel.app" target="_blank" rel="noreferrer"
              className="text-gray-400 hover:text-gray-500">
              Mia Digital Solutions
            </a>
          </p>
        </div>
      </div>
    </>
  );

  /* ─── MODALLER ─── */
  const posterModal = announcement?.kind === 'poster' && !posterDismissed && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
      onClick={() => setPosterDismissed(true)}>
      <div className="bg-white rounded-xl overflow-hidden max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        {announcement.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={announcement.image_url} alt={announcement.title ?? ''} className="w-full" />
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span>{(announcement as { icon_type?: string }).icon_type === 'kampanya' ? '🏷️' : '📢'}</span>
            {announcement.title && <p className="font-medium text-gray-900">{announcement.title}</p>}
          </div>
          {announcement.message && <p className="text-sm text-gray-600 mt-1">{announcement.message}</p>}
          <button onClick={() => setPosterDismissed(true)}
            className="w-full mt-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
            Kapat
          </button>
        </div>
      </div>
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
        {/* Diyet rozetleri */}
        {(selected.is_vegan || selected.is_vegetarian || selected.is_gluten_free) && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selected.is_vegan && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-md">🌱 Vegan</span>}
            {selected.is_vegetarian && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-md">🥗 Vejetaryen</span>}
            {selected.is_gluten_free && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">🌾 Glutensiz</span>}
          </div>
        )}
        {selected.product_tags && selected.product_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selected.product_tags.map((pt, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md">
                {(pt.tags as unknown as { name: string; icon?: string | null }).icon && (
                  <span>{(pt.tags as unknown as { icon: string }).icon}</span>
                )}
                {pt.tags.name}
              </span>
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
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center p-6 z-50"
      onClick={() => { setShowReview(false); setReviewDone(false); }}>
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
            <button onClick={handleReviewSubmit} disabled={reviewSubmitting}
              className={`w-full ${theme.accentBg} text-white rounded-md py-2 text-sm font-medium disabled:opacity-50`}>
              {reviewSubmitting ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-2xl mb-2">✓</p>
            <p className="font-medium mb-3">Teşekkürler!</p>
            <button onClick={() => { setShowReview(false); setReviewDone(false); setReviewName(''); setReviewComment(''); setReviewRating(5); }}
              className={`text-sm ${theme.accentBg} text-white rounded-md py-2 px-4`}>
              Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <main className="mx-auto max-w-md min-h-screen bg-white">
      {posterModal}
      {header}
      {body}
      {modal}
      {reviewModal}
    </main>
  );
}
