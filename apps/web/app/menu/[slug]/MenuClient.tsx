'use client';

import { useMemo, useState } from 'react';
import type { Announcement, MenuSection, Product, Tenant } from '@/types/database';
import { AllergenIcon } from '@/lib/allergenIcons';
import { submitReview } from './actions';

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
  tr: {
    allergenInfo: 'Alerjen & kalori bilgisi',
    search: 'Ürün ara...',
    notFound: 'Ürün bulunamadı',
    allergens: 'Alerjenler',
    noAllergens: 'Belirtilen alerjen yok',
    footnote: 'Bu bilgiler 1 Temmuz 2026 yönetmeliğine uygun olarak sunulmaktadır.',
    favorites: 'Favoriler',
    leaveReview: 'Görüş bırak',
  },
  en: {
    allergenInfo: 'Allergen & calorie info',
    search: 'Search dishes...',
    notFound: 'No items found',
    allergens: 'Allergens',
    noAllergens: 'No listed allergens',
    footnote: 'This information is shown in line with the regulation effective July 1, 2026.',
    favorites: 'Favorites',
    leaveReview: 'Leave feedback',
  },
};

export default function MenuClient({
  tenant,
  sections,
  products,
  announcement,
  translations,
}: {
  tenant: Tenant;
  sections: MenuSection[];
  products: ProductWithExtras[];
  announcement: Announcement | null;
  translations: Translation[];
}) {
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

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSection = p.section_id === activeSection;
      const displayName = nameFor('product', p.id, p.name);
      const matchesQuery =
        query.trim() === '' || displayName.toLowerCase().includes(query.toLowerCase());
      return matchesSection && matchesQuery;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, activeSection, query, lang, enMap]);

  async function handleReviewSubmit() {
    setReviewSubmitting(true);
    await submitReview({
      tenantId: tenant.id,
      customerName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
    });
    setReviewSubmitting(false);
    setReviewDone(true);
  }

  return (
    <main className="mx-auto max-w-md min-h-screen bg-white">
      <header className="bg-rose-50 relative">
        {tenant.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tenant.cover_image_url}
            alt={tenant.name}
            className="w-full h-32 object-cover"
          />
        )}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h1 className="text-lg font-semibold text-rose-800">{tenant.name}</h1>
            <div className="inline-flex rounded-full bg-white p-0.5">
              <button
                onClick={() => setLang('tr')}
                className={`text-xs px-2.5 py-1 rounded-full ${
                  lang === 'tr' ? 'bg-rose-600 text-white' : 'text-rose-700'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLang('en')}
                className={`text-xs px-2.5 py-1 rounded-full ${
                  lang === 'en' ? 'bg-rose-600 text-white' : 'text-rose-700'
                }`}
              >
                EN
              </button>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 mt-2 text-xs bg-white text-emerald-700 px-2 py-1 rounded-md">
            {t.allergenInfo}
          </span>
        </div>
      </header>

      {announcement && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2.5">
          {announcement.kind === 'poster' && announcement.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={announcement.image_url}
              alt={announcement.title ?? ''}
              className="w-full rounded-md mb-2"
            />
          )}
          {announcement.title && (
            <p className="text-sm font-medium text-amber-900">{announcement.title}</p>
          )}
          {announcement.message && (
            <p className="text-xs text-amber-700 mt-0.5">{announcement.message}</p>
          )}
        </div>
      )}

      {favorites.length > 0 && (
        <div className="px-4 pt-4">
          <p className="text-xs text-gray-500 mb-2">{t.favorites}</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {favorites.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="flex-shrink-0 w-28 border border-gray-200 rounded-md p-2 text-left"
              >
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-16 object-cover rounded-md mb-1.5"
                  />
                ) : null}
                <p className="text-xs font-medium truncate">{nameFor('product', p.id, p.name)}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.price} ₺</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mb-3"
        />

        <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`whitespace-nowrap text-sm px-3 py-1.5 rounded-full border ${
                activeSection === s.id
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {nameFor('section', s.id, s.name)}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="flex justify-between items-center border border-gray-200 rounded-md px-3 py-2.5 text-left gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="text-sm">
                    {nameFor('product', p.id, p.name)}
                    {p.product_tags?.map((pt, i) => (
                      <span
                        key={i}
                        className="ml-1.5 text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-md"
                      >
                        {pt.tags.name}
                      </span>
                    ))}
                  </p>
                  {p.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>
                  )}
                </div>
              </div>
              <p className="text-sm font-medium whitespace-nowrap flex-shrink-0">{p.price} ₺</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">{t.notFound}</p>
          )}
        </div>

        <button
          onClick={() => setShowReview(true)}
          className="w-full text-sm text-gray-500 border border-gray-200 rounded-md py-2 mt-4"
        >
          ★ {t.leaveReview}
        </button>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/45 flex items-center justify-center p-6 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-lg p-5 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <p className="font-medium">{nameFor('product', selected.id, selected.name)}</p>
              <button onClick={() => setSelected(null)} className="text-gray-400">
                ✕
              </button>
            </div>
            {selected.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.image_url}
                alt={selected.name}
                className="w-full h-36 object-cover rounded-md mt-2"
              />
            )}
            {selected.product_tags && selected.product_tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selected.product_tags.map((pt, i) => (
                  <span
                    key={i}
                    className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md"
                  >
                    {pt.tags.name}
                  </span>
                ))}
              </div>
            )}
            {selected.description && (
              <p className="text-sm text-gray-500 mt-1.5 mb-3">{selected.description}</p>
            )}
            <div className="flex gap-4 mb-3 text-sm">
              <span className="font-medium">{selected.price} ₺</span>
              {selected.calories != null && (
                <span className="text-gray-500">{selected.calories} kcal</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-1.5">{t.allergens}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selected.product_allergens && selected.product_allergens.length > 0 ? (
                selected.product_allergens.map((pa, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md"
                  >
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
      )}

      {showReview && (
        <div
          className="fixed inset-0 bg-black/45 flex items-center justify-center p-6 z-50"
          onClick={() => {
            setShowReview(false);
            setReviewDone(false);
          }}
        >
          <div
            className="bg-white rounded-lg p-5 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {!reviewDone ? (
              <>
                <div className="flex justify-between items-start mb-3">
                  <p className="font-medium">Görüşünüzü bırakın</p>
                  <button onClick={() => setShowReview(false)} className="text-gray-400">
                    ✕
                  </button>
                </div>
                <div className="flex gap-1 mb-3 text-2xl">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setReviewRating(n)}
                      className={n <= reviewRating ? 'text-amber-500' : 'text-gray-300'}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <input
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Adınız (opsiyonel)"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mb-2"
                />
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Yorumunuz"
                  rows={3}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mb-3"
                />
                <button
                  onClick={handleReviewSubmit}
                  disabled={reviewSubmitting}
                  className="w-full bg-rose-600 text-white rounded-md py-2 text-sm font-medium disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-2xl mb-2">✓</p>
                <p className="font-medium mb-3">Teşekkürler!</p>
                <button
                  onClick={() => {
                    setShowReview(false);
                    setReviewDone(false);
                    setReviewName('');
                    setReviewComment('');
                    setReviewRating(5);
                  }}
                  className="text-sm bg-rose-600 text-white rounded-md py-2 px-4"
                >
                  Kapat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
