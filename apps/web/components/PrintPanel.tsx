'use client';

import { useState } from 'react';

type PaperSize = 'a4' | 'a5';
type Columns = '1' | '2';

export default function PrintPanel({ slug }: { slug: string }) {
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [columns, setColumns] = useState<Columns>('1');
  const [showPrices, setShowPrices] = useState(true);
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [showImages, setShowImages] = useState(true);
  const [showAllergens, setShowAllergens] = useState(true);

  const printUrl = `/menu/${slug}/print?paper=${paperSize}&cols=${columns}&prices=${showPrices}&descs=${showDescriptions}&images=${showImages}&allergens=${showAllergens}`;

  return (
    <div className="max-w-sm">
      <div className="flex flex-col gap-5">
        {/* Kağıt boyutu */}
        <div>
          <p className="text-sm font-medium mb-2">Kağıt boyutu</p>
          <div className="flex gap-2">
            {(['a4', 'a5'] as PaperSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setPaperSize(s)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm ${
                  paperSize === s
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                {s === 'a4' ? '📄 A4' : '📋 A5'}
              </button>
            ))}
          </div>
        </div>

        {/* Sütun sayısı */}
        <div>
          <p className="text-sm font-medium mb-2">Sütun sayısı</p>
          <div className="flex gap-2">
            <button
              onClick={() => setColumns('1')}
              className={`px-4 py-2 rounded-md border text-sm ${
                columns === '1'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'border-gray-200 text-gray-700'
              }`}
            >
              1 sütun
            </button>
            <button
              onClick={() => setColumns('2')}
              className={`px-4 py-2 rounded-md border text-sm ${
                columns === '2'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'border-gray-200 text-gray-700'
              }`}
            >
              2 sütun
            </button>
          </div>
        </div>

        {/* Göster/gizle seçenekleri */}
        <div>
          <p className="text-sm font-medium mb-2">İçerik seçenekleri</p>
          <div className="flex flex-col gap-2">
            {[
              { key: 'prices', label: 'Fiyatları göster', value: showPrices, setter: setShowPrices },
              { key: 'desc', label: 'Açıklamaları göster', value: showDescriptions, setter: setShowDescriptions },
              { key: 'images', label: 'Görselleri göster', value: showImages, setter: setShowImages },
              { key: 'allergens', label: 'Alerjen bilgisini göster', value: showAllergens, setter: setShowAllergens },
            ].map((opt) => (
              <label key={opt.key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opt.value}
                  onChange={(e) => opt.setter(e.target.checked)}
                  className="rounded"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <a
            href={printUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center text-sm border border-gray-200 rounded-md py-2 text-gray-700 hover:bg-gray-50"
          >
            Önizle
          </a>
          <a
            href={printUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              e.preventDefault();
              const win = window.open(printUrl, '_blank');
              win?.addEventListener('load', () => win.print());
            }}
            className="flex-1 text-center text-sm bg-rose-600 text-white rounded-md py-2 hover:bg-rose-700"
          >
            Yazdır
          </a>
        </div>
      </div>
    </div>
  );
}
