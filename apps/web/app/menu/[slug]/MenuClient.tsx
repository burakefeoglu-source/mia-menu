'use client';

import { useMemo, useState } from 'react';
import type { MenuSection, Product, Tenant } from '@/types/database';

type ProductWithAllergens = Product & {
  product_allergens?: { allergens: { name_tr: string; name_en: string } }[];
};

export default function MenuClient({
  tenant,
  sections,
  products,
}: {
  tenant: Tenant;
  sections: MenuSection[];
  products: ProductWithAllergens[];
}) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ProductWithAllergens | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSection = p.section_id === activeSection;
      const matchesQuery =
        query.trim() === '' || p.name.toLowerCase().includes(query.toLowerCase());
      return matchesSection && matchesQuery;
    });
  }, [products, activeSection, query]);

  return (
    <main className="mx-auto max-w-md min-h-screen bg-white">
      <header className="bg-rose-50 p-4">
        <h1 className="text-lg font-semibold text-rose-800">{tenant.name}</h1>
        <span className="inline-flex items-center gap-1 mt-2 text-xs bg-white text-emerald-700 px-2 py-1 rounded-md">
          Alerjen &amp; kalori bilgisi
        </span>
      </header>

      <div className="p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün ara..."
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
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="flex justify-between items-center border border-gray-200 rounded-md px-3 py-2.5 text-left"
            >
              <div>
                <p className="text-sm">{p.name}</p>
                {p.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>
                )}
              </div>
              <p className="text-sm font-medium whitespace-nowrap">{p.price} ₺</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">Ürün bulunamadı</p>
          )}
        </div>
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
              <p className="font-medium">{selected.name}</p>
              <button onClick={() => setSelected(null)} className="text-gray-400">
                ✕
              </button>
            </div>
            {selected.description && (
              <p className="text-sm text-gray-500 mt-1.5 mb-3">{selected.description}</p>
            )}
            <div className="flex gap-4 mb-3 text-sm">
              <span className="font-medium">{selected.price} ₺</span>
              {selected.calories != null && (
                <span className="text-gray-500">{selected.calories} kcal</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-1.5">Alerjenler</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selected.product_allergens && selected.product_allergens.length > 0 ? (
                selected.product_allergens.map((pa, i) => (
                  <span
                    key={i}
                    className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md"
                  >
                    {pa.allergens.name_tr}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">Belirtilen alerjen yok</span>
              )}
            </div>
            <p className="text-[11px] text-gray-400">
              Bu bilgiler 1 Temmuz 2026 yönetmeliğine uygun olarak sunulmaktadır.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
