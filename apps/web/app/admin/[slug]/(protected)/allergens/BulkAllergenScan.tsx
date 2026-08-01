'use client';

import { useState } from 'react';

export default function BulkAllergenScan({
  tenantId, slug, action,
}: {
  tenantId: string;
  slug: string;
  action: () => Promise<{ assigned: number }>;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    const res = await action();
    setResult(`✓ ${res.assigned} alerjen atandı`);
    setLoading(false);
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-blue-900">Otomatik alerjen tespiti</p>
        <p className="text-xs text-blue-700 mt-0.5">
          Tüm ürün adları ve açıklamaları taranarak alerjenler otomatik atanır. Mevcut manüel seçimler korunur.
        </p>
        {result && <p className="text-xs text-green-700 font-medium mt-1">{result}</p>}
      </div>
      <button onClick={run} disabled={loading}
        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg whitespace-nowrap disabled:opacity-50 flex-shrink-0">
        {loading ? 'Taranıyor...' : '🔍 Mevcut ürünleri tara'}
      </button>
    </div>
  );
}
