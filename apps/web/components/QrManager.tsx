'use client';

import { useState } from 'react';
import { deleteTable, generateTables, updateQrLogo, updateQrStyle } from '@/app/admin/[slug]/actions';
import ImageUploader from './ImageUploader';
import QrCard from './QrCard';

type Style = 'square' | 'rounded' | 'dot';

type Entry = { key: string; label: string; url: string };

const styleLabels: Record<Style, string> = {
  square: 'Kare',
  rounded: 'Yuvarlatılmış',
  dot: 'Yuvarlak',
};

const PRESET_COLORS = [
  { label: 'Siyah', fg: '#111827', bg: '#ffffff' },
  { label: 'Lacivert', fg: '#1e3a5f', bg: '#ffffff' },
  { label: 'Koyu Gül', fg: '#9f1239', bg: '#ffffff' },
  { label: 'Koyu Yeşil', fg: '#14532d', bg: '#ffffff' },
  { label: 'Mor', fg: '#4c1d95', bg: '#ffffff' },
  { label: 'Beyaz/Siyah', fg: '#ffffff', bg: '#111827' },
  { label: 'Krem/Koyu', fg: '#fef3c7', bg: '#1c1917' },
];

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
  const [fgColor, setFgColor] = useState('#111827');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [setupDismissed, setSetupDismissed] = useState(false);
  const [tableCount, setTableCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  const showChooser = !hasTables && !setupDismissed;

  return (
    <div>
      {/* ─── Stil ─── */}
      <div className="flex flex-wrap gap-6 mb-5 pb-5 border-b border-gray-100 items-start">
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Stil</p>
          <div className="flex gap-1.5">
            {(Object.keys(styleLabels) as Style[]).map((s) => (
              <button
                key={s}
                onClick={() => { setStyle(s); updateQrStyle(tenantId, slug, s); }}
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

        {/* ─── Renkler ─── */}
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Renk</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.label}
                title={preset.label}
                onClick={() => { setFgColor(preset.fg); setBgColor(preset.bg); }}
                className={`w-6 h-6 rounded-full border-2 ${
                  fgColor === preset.fg && bgColor === preset.bg
                    ? 'border-rose-500 scale-110'
                    : 'border-gray-200'
                }`}
                style={{ background: `linear-gradient(135deg, ${preset.bg} 50%, ${preset.fg} 50%)` }}
              />
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] text-gray-400">QR rengi</label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-6 h-6 rounded border-0 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] text-gray-400">Arkaplan</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-6 h-6 rounded border-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ─── Logo ─── */}
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs text-gray-500 mb-1.5">Logo (ortaya eklenir, opsiyonel)</p>
          <ImageUploader
            folder="logos"
            currentUrl={logoUrl || null}
            onUploaded={async (url) => {
              setLogoUrl(url);
              await updateQrLogo(tenantId, slug, url);
            }}
            label="Logo yükle"
          />
          {logoUrl && (
            <button
              className="text-[11px] text-red-500 mt-1"
              onClick={() => { setLogoUrl(''); updateQrLogo(tenantId, slug, ''); }}
            >
              Logoyu kaldır
            </button>
          )}
        </div>
      </div>

      {/* ─── Masa kurulum seçici ─── */}
      {showChooser && (
        <div className="border border-gray-200 rounded-md p-4 mb-5">
          <p className="text-sm font-medium mb-3">Karekodu nasıl kullanacaksın?</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setSetupDismissed(true)}
              className="flex-1 border border-gray-200 rounded-md p-3 text-left hover:border-gray-300"
            >
              <p className="text-sm font-medium">Tek kod</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Tüm masalarda aynı genel menü QR&apos;ı kullanılır.
              </p>
            </button>
            <div className="flex-1 border border-gray-200 rounded-md p-3">
              <p className="text-sm font-medium mb-1">Masa sayısına göre</p>
              <p className="text-xs text-gray-500 mb-2">Her masaya ayrı bir QR oluşturulur.</p>
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

      {/* ─── QR grid ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <QrCard
          key={`${generalEntry.key}-${style}-${fgColor}-${bgColor}-${logoUrl}`}
          label={generalEntry.label}
          url={generalEntry.url}
          style={style}
          logoUrl={logoUrl}
          fgColor={fgColor}
          bgColor={bgColor}
        />
        {!showChooser &&
          tableEntries.map((t) => (
            <div key={t.key} className="flex flex-col gap-1.5">
              <QrCard
                key={`${t.key}-${style}-${fgColor}-${bgColor}-${logoUrl}`}
                label={t.label}
                url={t.url}
                style={style}
                logoUrl={logoUrl}
                fgColor={fgColor}
                bgColor={bgColor}
              />
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
