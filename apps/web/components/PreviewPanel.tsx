'use client';

import { useState } from 'react';

export default function PreviewPanel({ slug }: { slug: string }) {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <aside className="w-44 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500">Canlı önizleme</p>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="text-xs text-rose-600"
        >
          Yenile
        </button>
      </div>
      <div
        className="border border-gray-200 rounded-lg overflow-hidden"
        style={{ height: 500 }}
      >
        <iframe key={reloadKey} src={`/menu/${slug}`} className="w-full h-full" />
      </div>
      <p className="text-[11px] text-gray-400 mt-2 text-center">
        Müşterilerinizin gördüğü görünüm
      </p>
    </aside>
  );
}
