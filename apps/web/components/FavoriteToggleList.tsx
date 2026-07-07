'use client';

import { useState } from 'react';
import { toggleFavorite } from '@/app/admin/[slug]/actions';
import { broadcastPreviewRefresh } from '@/lib/previewChannel';
import type { Product } from '@/types/database';

type ProductWithSection = Product & { section_name: string };

export default function FavoriteToggleList({
  slug,
  products,
}: {
  slug: string;
  products: ProductWithSection[];
}) {
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(products.filter((p) => p.is_favorite).map((p) => p.id))
  );

  async function toggle(productId: string) {
    const next = !favorites.has(productId);
    setFavorites((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(productId);
      else copy.delete(productId);
      return copy;
    });
    await toggleFavorite(productId, slug, next);
    broadcastPreviewRefresh();
  }

  return (
    <div className="flex flex-col max-w-md">
      {products.map((p) => (
        <button
          key={p.id}
          onClick={() => toggle(p.id)}
          className="flex justify-between items-center py-2 border-b border-gray-100 text-left"
        >
          <div>
            <p className="text-sm">{p.name}</p>
            <p className="text-xs text-gray-400">{p.section_name}</p>
          </div>
          <span className={`text-lg ${favorites.has(p.id) ? 'text-amber-500' : 'text-gray-300'}`}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
