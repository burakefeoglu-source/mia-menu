'use client';

import { useState } from 'react';
import { deleteTable, generateTables, updateQrLogo, updateQrStyle } from '@/app/admin/[slug]/actions';
import QrCard from './QrCard';

type Style = 'square' | 'rounded' | 'dot';

type Entry = { key: string; label: string; url: string };

const styleLabels: Record<Style, string> = {
  square: 'Kare',
  rounded: 'Yuvarlatılmış',
  dot: 'Yuvarlak',
};

export default function QrManager({
  tenantId,
  slug,
  initialStyle,
  initialLogoUrl,
  generalEntry,
  tableEntries,
  hasTables,
}: {
  tenantId: string;
  slug: string;
  initialStyle: Style;
  initialLogoUrl: string;
  generalEntry: Entry;
  tableEntries: Entry[];
  hasTables: boolean;
}) {
  const [style, setStyle] = useState<Style>(initialStyle);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [logoSaved, setLogoSaved] = useState(false);
  const [setupDismissed, setSetupDismissed] = useState(false);
  const [tableCount, setTableCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  const showChooser = !hasTables && !setupDismissed;

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-5 pb-5 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Stil</p>
          <div className="flex gap-1.5">
            {(Object.keys(styleLabels) as Style[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStyle(s);
                  updateQrStyle(tenantId, slug, s);
                }}
                className={`text-xs px-2.5 py-1.5 rounded-md border ${
                  style === s
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                {styleLabels[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <p className="text-xs text-gray-500 mb-1.5">Logo URL (opsiyonel, ortaya eklenir)</p>
          <div className="flex gap-2">
            <input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 border border-gray-200 rounded-md px-2 py-1.5 text-sm"
            />
            <button
              onClick={async () => {
                await updateQrLogo(tenantId, slug, logoUrl);
                setLogoSaved(true);
                setTimeout(() => setLogoSaved(false), 1200);
              }}
              className="text-xs bg-gray-100 px-2.5 py-1.5 rounded-md whitespace-nowrap"
            >
              {logoSaved ? 'Kaydedildi' : 'Kaydet'}
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Görsel CORS&apos;a açık bir adresten olmalı; indirme sorun verirse logo alanını boş
            bırakıp dene.
          </p>
        </div>
      </div>

      {showChooser && (
        <div className="border border-gray-200 rounded-md p-4 mb-5">
          <p className="text-sm font-medium mb-3">Karekodu nasıl kullanacaksın?</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setSetupDismissed(true)}
              className="flex-1 border border-gray-200 rounded-md p-3 text-left"
            >
              <p className="text-sm font-medium">Tek kod</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Tüm masalarda aynı genel menü QR&apos;ı kullanılır.
              </p>
            </button>
            <div className="flex-1 border border-gray-200 rounded-md p-3">
              <p className="text-sm font-medium mb-1">Masa sayısına göre</p>
              <p className="text-xs text-gray-500 mb-2">
                Her masaya ayrı bir QR oluşturulur.
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  value={tableCount}
                  onChange={(e) => setTableCount(Number(e.target.value))}
                  className="w-20 border border-gray-200 rounded-md px-2 py-1 text-sm"
                />
                <button
                  disabled={generating}
                  onClick={async () => {
                    setGenerating(true);
                    await generateTables(tenantId, slug, tableCount);
                    setGenerating(false);
                  }}
                  className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded-md disabled:opacity-50"
                >
                  {generating ? 'Oluşturuluyor...' : 'Oluştur'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <QrCard
          key={generalEntry.key}
          label={generalEntry.label}
          url={generalEntry.url}
          style={style}
          logoUrl={logoUrl}
        />
        {!showChooser &&
          tableEntries.map((t) => (
            <div key={t.key} className="flex flex-col gap-1.5">
              <QrCard label={t.label} url={t.url} style={style} logoUrl={logoUrl} />
              <button
                onClick={() => {
                  if (confirm(`"${t.label}" karekodunu silmek istediğine emin misin?`)) {
                    deleteTable(t.key, slug);
                  }
                }}
                className="text-[11px] text-red-500"
              >
                Masayı sil
              </button>
            </div>
          ))}
      </div>

      {hasTables && (
        <div className="flex gap-2 mt-4 items-center">
          <input
            type="number"
            min={1}
            value={tableCount}
            onChange={(e) => setTableCount(Number(e.target.value))}
            className="w-20 border border-gray-200 rounded-md px-2 py-1 text-sm"
          />
          <button
            disabled={generating}
            onClick={async () => {
              setGenerating(true);
              await generateTables(tenantId, slug, tableCount);
              setGenerating(false);
            }}
            className="text-xs bg-gray-100 px-3 py-1.5 rounded-md disabled:opacity-50"
          >
            + Masa ekle
          </button>
        </div>
      )}
    </div>
  );
}
