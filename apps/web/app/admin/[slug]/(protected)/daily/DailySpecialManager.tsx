'use client';

import { useState } from 'react';
import { updateProductFlags } from '@/app/admin/[slug]/actions';
import { broadcastPreviewRefresh } from '@/lib/previewChannel';

type Product = { id: string; name: string; price: number; section_id: string; is_daily_special: boolean };
type Section = { id: string; name: string };

export default function DailySpecialManager({
  slug,
  sections,
  products,
}: {
  slug: string;
  sections: Section[];
  products: Product[];
}) {
  const [flags, setFlags] = useState<Record<string, boolean>>(
    Object.fromEntries(products.map((p) => [p.id, p.is_daily_special]))
  );

  async function toggle(productId: string) {
    const next = !flags[productId];
    setFlags((prev) => ({ ...prev, [productId]: next }));
    await updateProductFlags(productId, slug, { is_daily_special: next });
    broadcastPreviewRefresh();
  }

  const activeCount = Object.values(flags).filter(Boolean).length;

  return (
    <div>
      {activeCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
          <span className="text-rose-600">⭐</span>
          <p className="text-xs text-rose-700 font-medium">{activeCount} ürün günün menüsünde</p>
        </div>
      )}

      {sections.map((s) => {
        const sectionProducts = products.filter((p) => p.section_id === s.id);
        if (!sectionProducts.length) return null;
        return (
          <div key={s.id} className="mb-5">
            <p className="text-xs font-medium text-gray-500 mb-2">{s.name}</p>
            <div className="flex flex-col gap-1.5">
              {sectionProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    flags[p.id]
                      ? 'border-rose-300 bg-rose-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-base ${flags[p.id] ? 'opacity-100' : 'opacity-20'}`}>⭐</span>
                    <span className="text-sm">{p.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${flags[p.id] ? 'text-rose-600' : 'text-gray-500'}`}>
                    {p.price} ₺
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
