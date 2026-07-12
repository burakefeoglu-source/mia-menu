'use client';

import { useState } from 'react';
import { updateProductFlags } from '@/app/admin/[slug]/actions';

const BADGES = [
  { key: 'is_vegan', icon: '🌱', label: 'Vegan', color: 'bg-green-100 border-green-400 text-green-700' },
  { key: 'is_vegetarian', icon: '🥗', label: 'Vejetaryen', color: 'bg-green-50 border-green-300 text-green-600' },
  { key: 'is_gluten_free', icon: '🌾', label: 'Glutensiz', color: 'bg-amber-50 border-amber-300 text-amber-700' },
] as const;

type BadgeKey = 'is_vegan' | 'is_vegetarian' | 'is_gluten_free';

type Product = {
  id: string;
  name: string;
  is_vegan: boolean;
  is_vegetarian: boolean;
  is_gluten_free: boolean;
};

export default function DietBadgeGrid({
  slug,
  products,
}: {
  slug: string;
  products: Product[];
}) {
  const [state, setState] = useState<Record<string, Record<BadgeKey, boolean>>>(
    Object.fromEntries(
      products.map((p) => [
        p.id,
        { is_vegan: p.is_vegan, is_vegetarian: p.is_vegetarian, is_gluten_free: p.is_gluten_free },
      ])
    )
  );

  async function toggle(productId: string, key: BadgeKey) {
    const next = !state[productId][key];
    setState((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [key]: next },
    }));
    await updateProductFlags(productId, slug, { [key]: next });
  }

  return (
    <div className="overflow-x-auto">
      <table className="text-sm w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-xs font-medium text-gray-500 py-2 pr-4">Ürün</th>
            {BADGES.map((b) => (
              <th key={b.key} className="text-center text-xs font-medium text-gray-500 py-2 px-3">
                {b.icon} {b.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 pr-4 text-sm">{p.name}</td>
              {BADGES.map((b) => {
                const active = state[p.id]?.[b.key] ?? false;
                return (
                  <td key={b.key} className="text-center py-2 px-3">
                    <button
                      onClick={() => toggle(p.id, b.key)}
                      className={`w-8 h-8 rounded-md border-2 text-base transition-colors ${
                        active ? b.color + ' border-2' : 'border-gray-200 text-gray-200'
                      }`}
                    >
                      {b.icon}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
