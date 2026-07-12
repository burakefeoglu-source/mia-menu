'use client';

import { useState } from 'react';
import { bulkUpdatePrices } from '@/app/admin/[slug]/actions';
import type { MenuSection } from '@/types/database';

export default function BulkPriceUpdater({
  tenantId,
  slug,
  sections,
}: {
  tenantId: string;
  slug: string;
  sections: MenuSection[];
}) {
  const [type, setType] = useState<'percent' | 'flat'>('percent');
  const [direction, setDirection] = useState<'increase' | 'decrease'>('increase');
  const [amount, setAmount] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    const confirm = window.confirm(
      `Tüm ${sectionId ? 'seçili bölümdeki' : 'menüdeki'} fiyatlar ${direction === 'increase' ? 'artırılacak' : 'düşürülecek'}: ${direction === 'increase' ? '+' : '-'}${num}${type === 'percent' ? '%' : '₺'}. Devam et?`
    );
    if (!confirm) return;

    setLoading(true);
    setResult(null);
    const res = await bulkUpdatePrices(tenantId, slug, type, direction, num, sectionId || undefined);
    setResult(`${res.updated} ürün güncellendi.`);
    setAmount('');
    setLoading(false);
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
      <p className="text-sm font-medium mb-3">Toplu fiyat güncelleme</p>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
        {/* Artır / Düşür */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">İşlem</label>
          <div className="flex rounded-md overflow-hidden border border-gray-200">
            <button type="button" onClick={() => setDirection('increase')}
              className={`text-xs px-3 py-1.5 ${direction === 'increase' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}>
              Artır
            </button>
            <button type="button" onClick={() => setDirection('decrease')}
              className={`text-xs px-3 py-1.5 ${direction === 'decrease' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}>
              Düşür
            </button>
          </div>
        </div>

        {/* % veya ₺ */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tür</label>
          <div className="flex rounded-md overflow-hidden border border-gray-200">
            <button type="button" onClick={() => setType('percent')}
              className={`text-xs px-3 py-1.5 ${type === 'percent' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}>
              %
            </button>
            <button type="button" onClick={() => setType('flat')}
              className={`text-xs px-3 py-1.5 ${type === 'flat' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}>
              ₺
            </button>
          </div>
        </div>

        {/* Miktar */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Miktar</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={type === 'percent' ? '10' : '50'}
            min="0"
            step={type === 'percent' ? '0.5' : '1'}
            required
            className="w-20 border border-gray-200 rounded-md px-2 py-1.5 text-sm"
          />
        </div>

        {/* Bölüm seç */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Bölüm</label>
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="border border-gray-200 rounded-md px-2 py-1.5 text-sm"
          >
            <option value="">Tüm menü</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !amount}
          className="text-sm bg-amber-600 text-white px-4 py-1.5 rounded-md disabled:opacity-50"
        >
          {loading ? 'Güncelleniyor...' : 'Uygula'}
        </button>
      </form>

      {result && (
        <p className="text-xs text-green-700 mt-2">✓ {result}</p>
      )}
    </div>
  );
}
