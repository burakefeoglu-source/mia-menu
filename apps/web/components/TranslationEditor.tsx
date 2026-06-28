'use client';

import { useState } from 'react';
import { upsertTranslation } from '@/app/admin/[slug]/actions';

type Row = {
  entityType: 'product' | 'section';
  entityId: string;
  trLabel: string;
  initialEn: string;
};

export default function TranslationEditor({
  slug,
  tenantId,
  rows,
}: {
  slug: string;
  tenantId: string;
  rows: Row[];
}) {
  return (
    <div className="flex flex-col">
      {rows.map((r) => (
        <TranslationRow key={`${r.entityType}-${r.entityId}`} slug={slug} tenantId={tenantId} row={r} />
      ))}
    </div>
  );
}

function TranslationRow({
  slug,
  tenantId,
  row,
}: {
  slug: string;
  tenantId: string;
  row: Row;
}) {
  const [value, setValue] = useState(row.initialEn);
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-100">
      <div className="w-1/3 min-w-0">
        <p className="text-sm truncate">{row.trLabel}</p>
        <p className="text-[11px] text-gray-400">
          {row.entityType === 'section' ? 'Bölüm' : 'Ürün'}
        </p>
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="İngilizce karşılığı"
        className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-sm"
      />
      <button
        onClick={async () => {
          await upsertTranslation(tenantId, slug, row.entityType, row.entityId, 'name', value);
          setSaved(true);
          setTimeout(() => setSaved(false), 1200);
        }}
        className="text-xs bg-gray-100 px-2.5 py-1.5 rounded-md flex-shrink-0"
      >
        {saved ? 'Kaydedildi' : 'Kaydet'}
      </button>
    </div>
  );
}
