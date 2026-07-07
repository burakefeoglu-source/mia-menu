'use client';

import { useState } from 'react';

type Template = 'klasik' | 'iki-sutun' | 'fotografli' | 'modern' | 'retro' | 'tahta';
type Paper = 'a3' | 'a4' | 'a5';

const TEMPLATES: { value: Template; label: string }[] = [
  { value: 'klasik', label: 'Klasik liste' },
  { value: 'iki-sutun', label: '2 sütun' },
  { value: 'fotografli', label: 'Fotoğraflı' },
  { value: 'modern', label: 'Modern bistro' },
  { value: 'retro', label: 'Retro diner' },
  { value: 'tahta', label: 'Tahta B' },
];

const PAPERS: { value: Paper; label: string; dims: string; desc: string }[] = [
  { value: 'a3', label: 'A3', dims: '29,7 × 42,0 cm', desc: 'Büyük boy' },
  { value: 'a4', label: 'A4', dims: '21,0 × 29,7 cm', desc: 'Standart' },
  { value: 'a5', label: 'A5', dims: '14,8 × 21,0 cm', desc: 'Kompakt' },
];

const COLORS = [
  { hex: '#c0392b', label: 'Kırmızı' },
  { hex: '#1a5276', label: 'Lacivert' },
  { hex: '#1e8449', label: 'Yeşil' },
  { hex: '#b7770d', label: 'Altın' },
  { hex: '#6c3483', label: 'Mor' },
  { hex: '#784212', label: 'Kahve' },
  { hex: '#2c3e50', label: 'Antrasit' },
  { hex: '#111111', label: 'Siyah' },
];

const PAPER_ICON_SIZES: Record<Paper, { w: number; h: number }> = {
  a3: { w: 28, h: 40 },
  a4: { w: 22, h: 31 },
  a5: { w: 16, h: 22 },
};

export default function PrintPanel({ slug }: { slug: string }) {
  const [template, setTemplate] = useState<Template>('klasik');
  const [paper, setPaper] = useState<Paper>('a4');
  const [color, setColor] = useState('#c0392b');
  const [showPrices, setShowPrices] = useState(true);
  const [showDescs, setShowDescs] = useState(true);
  const [showImages, setShowImages] = useState(true);
  const [showAllergens, setShowAllergens] = useState(true);

  const printUrl = `/menu/${slug}/print?tmpl=${template}&paper=${paper}&color=${encodeURIComponent(color)}&prices=${showPrices}&descs=${showDescs}&images=${showImages}&allergens=${showAllergens}`;

  function openPrint(e: React.MouseEvent) {
    e.preventDefault();
    const win = window.open(printUrl, '_blank');
    if (win) {
      win.addEventListener('load', () => {
        setTimeout(() => win.print(), 300);
      });
    }
  }

  return (
    <div className="max-w-lg">

      {/* Şablon */}
      <p className="text-sm font-medium mb-3">Şablon</p>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {TEMPLATES.map((t) => (
          <button
            key={t.value}
            onClick={() => setTemplate(t.value)}
            className={`text-sm py-2 rounded-md border text-center transition-colors ${
              template === t.value
                ? 'border-rose-600 bg-rose-50 text-rose-700 font-medium'
                : 'border-gray-200 text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Aksan rengi */}
      <p className="text-sm font-medium mb-3">Aksan rengi</p>
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        {COLORS.map((c) => (
          <button
            key={c.hex}
            title={c.label}
            onClick={() => setColor(c.hex)}
            className="w-6 h-6 rounded-full transition-transform"
            style={{
              background: c.hex,
              border: color === c.hex ? `2.5px solid #111` : '1.5px solid transparent',
              transform: color === c.hex ? 'scale(1.18)' : 'scale(1)',
            }}
          />
        ))}
        <div className="flex items-center gap-1.5 ml-1">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-6 h-6 rounded-full cursor-pointer border-0 p-0"
          />
          <span className="text-xs text-gray-400">Özel</span>
        </div>
      </div>

      {/* Kağıt boyutu */}
      <p className="text-sm font-medium mb-3">Kağıt boyutu</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {PAPERS.map((p) => {
          const icon = PAPER_ICON_SIZES[p.value];
          const active = paper === p.value;
          return (
            <button
              key={p.value}
              onClick={() => setPaper(p.value)}
              className={`rounded-lg border-2 p-3 text-center transition-colors ${
                active ? 'border-rose-600 bg-rose-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-center items-end mb-2" style={{ height: 44 }}>
                <div
                  style={{
                    width: icon.w,
                    height: icon.h,
                    border: `1.5px solid ${active ? '#c0392b' : '#d1d5db'}`,
                    borderRadius: 2,
                    background: active ? '#fef2f2' : '#f9fafb',
                  }}
                />
              </div>
              <p className={`text-sm font-semibold ${active ? 'text-rose-600' : 'text-gray-800'}`}>
                {p.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{p.dims}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{p.desc}</p>
            </button>
          );
        })}
      </div>

      {/* İçerik seçenekleri */}
      <p className="text-sm font-medium mb-3">İçerik</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: 'Fiyatlar', value: showPrices, setter: setShowPrices },
          { label: 'Açıklamalar', value: showDescs, setter: setShowDescs },
          { label: 'Görseller', value: showImages, setter: setShowImages },
          { label: 'Alerjenler', value: showAllergens, setter: setShowAllergens },
        ].map((opt) => (
          <button
            key={opt.label}
            onClick={() => opt.setter(!opt.value)}
            className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${
              opt.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'border-gray-200 text-gray-500'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Butonlar */}
      <div className="flex gap-3">
        <a
          href={printUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 text-center text-sm border border-gray-200 rounded-lg py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Önizle
        </a>
        <button
          onClick={openPrint}
          className="flex-1 text-sm rounded-lg py-2.5 text-white font-medium transition-colors"
          style={{ background: color }}
        >
          Yazdır
        </button>
      </div>
    </div>
  );
}
