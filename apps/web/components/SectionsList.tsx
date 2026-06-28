'use client';

import { useState } from 'react';
import {
  addProduct,
  deleteProduct,
  deleteSection,
  updateProduct,
  updateSectionName,
} from '@/app/admin/[slug]/actions';
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
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {sections.map((s) => {
        const sectionProducts = products.filter((p) => p.section_id === s.id);
        const isOpen = !!expanded[s.id];
        const boundAddProduct = addProduct.bind(null, tenantId, s.id, slug);

        return (
          <div key={s.id} className="border border-gray-200 rounded-md overflow-hidden">
            <div className="w-full flex justify-between items-center px-3 py-2.5">
              {editingSection === s.id ? (
                <form
                  className="flex items-center gap-2 flex-1"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem(
                      'name'
                    ) as HTMLInputElement;
                    await updateSectionName(s.id, slug, input.value);
                    setEditingSection(null);
                  }}
                >
                  <input
                    name="name"
                    defaultValue={s.name}
                    autoFocus
                    className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-sm"
                  />
                  <button type="submit" className="text-xs bg-rose-600 text-white px-2 py-1 rounded-md">
                    Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSection(null)}
                    className="text-xs text-gray-400"
                  >
                    Vazgeç
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setExpanded((e) => ({ ...e, [s.id]: !e[s.id] }))}
                  className="flex-1 flex justify-between items-center text-left"
                >
                  <span className="text-sm">{s.name}</span>
                  <span className="flex items-center gap-2 text-xs text-gray-500 mr-2">
                    {sectionProducts.length} ürün
                    <span>{isOpen ? '▲' : '▼'}</span>
                  </span>
                </button>
              )}

              {editingSection !== s.id && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditingSection(s.id)}
                    className="text-xs text-gray-400"
                    aria-label="Bölümü düzenle"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `"${s.name}" bölümünü ve içindeki ${sectionProducts.length} ürünü silmek istediğine emin misin?`
                        )
                      ) {
                        deleteSection(s.id, slug);
                      }
                    }}
                    className="text-xs text-red-500"
                    aria-label="Bölümü sil"
                  >
                    Sil
                  </button>
                </div>
              )}
            </div>

            {isOpen && (
              <div className="border-t border-gray-200">
                {sectionProducts.map((p) =>
                  editingProduct === p.id ? (
                    <form
                      key={p.id}
                      className="flex gap-2 px-3 py-2 border-b border-gray-100 items-center"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                        const price = Number(
                          (form.elements.namedItem('price') as HTMLInputElement).value
                        );
                        const caloriesRaw = (
                          form.elements.namedItem('calories') as HTMLInputElement
                        ).value;
                        await updateProduct(p.id, slug, {
                          name,
                          price,
                          calories: caloriesRaw ? Number(caloriesRaw) : null,
                        });
                        setEditingProduct(null);
                      }}
                    >
                      <input
                        name="name"
                        defaultValue={p.name}
                        autoFocus
                        className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-xs"
                      />
                      <input
                        name="price"
                        type="number"
                        defaultValue={p.price}
                        className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs"
                      />
                      <input
                        name="calories"
                        type="number"
                        defaultValue={p.calories ?? ''}
                        className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs"
                      />
                      <button type="submit" className="text-xs bg-rose-600 text-white px-2 py-1 rounded-md">
                        Kaydet
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="text-xs text-gray-400"
                      >
                        Vazgeç
                      </button>
                    </form>
                  ) : (
                    <div
                      key={p.id}
                      className="px-3 py-2 text-sm flex justify-between items-center border-b border-gray-100"
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
                        <button onClick={() => setEditingProduct(p.id)} className="text-gray-400">
                          Düzenle
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`"${p.name}" ürününü silmek istediğine emin misin?`)) {
                              deleteProduct(p.id, slug);
                            }
                          }}
                          className="text-red-500"
                        >
                          Sil
                        </button>
                      </span>
                    </div>
                  )
                )}
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
