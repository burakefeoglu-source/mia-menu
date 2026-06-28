'use client';

import { useState } from 'react';
import { addProduct } from '@/app/admin/[slug]/actions';
import type { MenuSection, Product } from '@/types/database';

type ProductWithAllergens = Product & {
  product_allergens?: { allergens: { name_tr: string } }[];
};

export default function SectionsList({
  tenantId,
  slug,
  sections,
  products,
}: {
  tenantId: string;
  slug: string;
  sections: MenuSection[];
  products: ProductWithAllergens[];
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    sections[0] ? { [sections[0].id]: true } : {}
  );

  return (
    <div className="flex flex-col gap-2">
      {sections.map((s) => {
        const sectionProducts = products.filter((p) => p.section_id === s.id);
        const isOpen = !!expanded[s.id];
        const boundAddProduct = addProduct.bind(null, tenantId, s.id, slug);

        return (
          <div key={s.id} className="border border-gray-200 rounded-md overflow-hidden">
            <button
              onClick={() => setExpanded((e) => ({ ...e, [s.id]: !e[s.id] }))}
              className="w-full flex justify-between items-center px-3 py-2.5"
            >
              <span className="text-sm">{s.name}</span>
              <span className="flex items-center gap-2 text-xs text-gray-500">
                {sectionProducts.length} ürün
                <span>{isOpen ? '▲' : '▼'}</span>
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-gray-200">
                {sectionProducts.map((p) => (
                  <div
                    key={p.id}
                    className="px-3 py-2 text-sm flex justify-between items-center"
                  >
                    <span>
                      {p.name}
                      {p.product_allergens?.map((pa, i) => (
                        <span
                          key={i}
                          className="ml-1.5 text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-md"
                        >
                          {pa.allergens.name_tr}
                        </span>
                      ))}
                    </span>
                    <span className="flex items-center gap-3 text-xs text-gray-500">
                      {p.calories ? `${p.calories} kcal` : ''}
                      <span className="font-medium text-gray-900">{p.price} ₺</span>
                    </span>
                  </div>
                ))}
                <form
                  action={boundAddProduct}
                  className="flex gap-2 px-3 py-2 border-t border-gray-100"
                >
                  <input
                    name="name"
                    placeholder="Ürün adı"
                    required
                    className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-xs"
                  />
                  <input
                    name="price"
                    type="number"
                    placeholder="Fiyat"
                    required
                    className="w-20 border border-gray-200 rounded-md px-2 py-1 text-xs"
                  />
                  <input
                    name="calories"
                    type="number"
                    placeholder="Kalori"
                    className="w-20 border border-gray-200 rounded-md px-2 py-1 text-xs"
                  />
                  <button
                    type="submit"
                    className="text-xs bg-rose-600 text-white px-2.5 py-1 rounded-md"
                  >
                    Ekle
                  </button>
                </form>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
