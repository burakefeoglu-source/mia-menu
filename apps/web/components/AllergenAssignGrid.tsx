'use client';

import { useState } from 'react';
import { deleteAllergen, toggleProductAllergen } from '@/app/admin/[slug]/actions';
import { allergenIcon } from '@/lib/allergenIcons';
import type { Allergen } from '@/types/database';

export default function AllergenAssignGrid({
  slug,
  allergens,
  products,
  productAllergens,
}: {
  slug: string;
  allergens: Allergen[];
  products: { id: string; name: string }[];
  productAllergens: { product_id: string; allergen_id: string }[];
}) {
  const [assigned, setAssigned] = useState<Set<string>>(
    new Set(productAllergens.map((pa) => `${pa.product_id}:${pa.allergen_id}`))
  );

  function isAssigned(productId: string, allergenId: string) {
    return assigned.has(`${productId}:${allergenId}`);
  }

  async function toggle(productId: string, allergenId: string) {
    const key = `${productId}:${allergenId}`;
    const next = !assigned.has(key);
    setAssigned((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(key);
      else copy.delete(key);
      return copy;
    });
    await toggleProductAllergen(productId, allergenId, slug, next);
  }

  return (
    <div className="overflow-x-auto">
      <table className="text-sm">
        <thead>
          <tr>
            <th className="text-left pr-4 pb-2 text-xs text-gray-500 font-normal">Ürün</th>
            {allergens.map((a) => (
              <th key={a.id} className="px-2 pb-2 text-xs text-gray-500 font-normal" title={a.description ?? undefined}>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base">{allergenIcon(a.code)}</span>
                  <span>{a.name_tr}</span>
                  {a.tenant_id && (
                    <button
                      onClick={() => {
                        if (confirm(`"${a.name_tr}" alerjenini silmek istediğine emin misin?`)) {
                          deleteAllergen(a.id, slug);
                        }
                      }}
                      className="text-[10px] text-red-500"
                    >
                      sil
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-gray-100">
              <td className="pr-4 py-1.5 whitespace-nowrap">{p.name}</td>
              {allergens.map((a) => (
                <td key={a.id} className="text-center px-2">
                  <input
                    type="checkbox"
                    checked={isAssigned(p.id, a.id)}
                    onChange={() => toggle(p.id, a.id)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
