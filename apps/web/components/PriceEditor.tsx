'use client';

import { useState } from 'react';
import { updatePrice } from '@/app/admin/[slug]/actions';
import { broadcastPreviewRefresh } from '@/lib/previewChannel';
import type { Product } from '@/types/database';

type ProductWithSection = Product & { section_name?: string };

export default function PriceEditor({
  slug,
  products,
}: {
  slug: string;
  products: ProductWithSection[];
}) {
  return (
    <div className="flex flex-col">
      {products.map((p) => (
        <PriceRow key={p.id} slug={slug} product={p} />
      ))}
    </div>
  );
}

function PriceRow({ slug, product }: { slug: string; product: ProductWithSection }) {
  const [price, setPrice] = useState(product.price);
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <div>
        <p className="text-sm">{product.name}</p>
        {product.section_name && (
          <p className="text-xs text-gray-400">{product.section_name}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-20 border border-gray-200 rounded-md px-2 py-1 text-sm"
        />
        <button
          onClick={async () => {
            await updatePrice(product.id, slug, price);
            broadcastPreviewRefresh();
            setSaved(true);
            setTimeout(() => setSaved(false), 1200);
          }}
          className="text-xs bg-gray-100 px-2.5 py-1.5 rounded-md"
        >
          {saved ? 'Kaydedildi' : 'Kaydet'}
        </button>
      </div>
    </div>
  );
}
