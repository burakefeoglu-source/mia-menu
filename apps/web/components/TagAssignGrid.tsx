'use client';

import { useState } from 'react';
import { deleteTag, toggleProductTag } from '@/app/admin/[slug]/actions';
import type { Tag } from '@/types/database';

export default function TagAssignGrid({
  slug,
  tags,
  products,
  productTags,
}: {
  slug: string;
  tags: Tag[];
  products: { id: string; name: string }[];
  productTags: { product_id: string; tag_id: string }[];
}) {
  const [assigned, setAssigned] = useState<Set<string>>(
    new Set(productTags.map((pt) => `${pt.product_id}:${pt.tag_id}`))
  );

  function isAssigned(productId: string, tagId: string) {
    return assigned.has(`${productId}:${tagId}`);
  }

  async function toggle(productId: string, tagId: string) {
    const key = `${productId}:${tagId}`;
    const next = !assigned.has(key);
    setAssigned((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(key);
      else copy.delete(key);
      return copy;
    });
    await toggleProductTag(productId, tagId, slug, next);
  }

  return (
    <div className="overflow-x-auto">
      <table className="text-sm">
        <thead>
          <tr>
            <th className="text-left pr-4 pb-2 text-xs text-gray-500 font-normal">Ürün</th>
            {tags.map((t) => (
              <th key={t.id} className="px-2 pb-2 text-xs text-gray-500 font-normal">
                <div className="flex flex-col items-center gap-1">
                  <span title={t.name}>
                    {(t as { icon?: string | null }).icon ? (t as { icon: string }).icon : t.name}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`"${t.name}" etiketini silmek istediğine emin misin?`)) {
                        deleteTag(t.id, slug);
                      }
                    }}
                    className="text-[10px] text-red-500"
                  >
                    sil
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-gray-100">
              <td className="pr-4 py-1.5 whitespace-nowrap">{p.name}</td>
              {tags.map((t) => (
                <td key={t.id} className="text-center px-2">
                  <input
                    type="checkbox"
                    checked={isAssigned(p.id, t.id)}
                    onChange={() => toggle(p.id, t.id)}
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
