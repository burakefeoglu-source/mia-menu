'use client';

import { useState, useRef } from 'react';
import { importFromAI } from '../../actions';

type Product = {
  name: string; price: number; description?: string; calories?: number; allergens?: string[];
};
type Section = { name: string; products: Product[] };

const ALLERGEN_LABELS: Record<string, string> = {
  gluten: 'Gluten', milk: 'Süt', egg: 'Yumurta', nuts: 'Fındık', sesame: 'Susam',
  soy: 'Soya', fish: 'Balık', shellfish: 'Kabuklu deniz', peanuts: 'Yerfıstığı',
  celery: 'Kereviz', mustard: 'Hardal', sulphites: 'Sülfit', lupin: 'Bakla', molluscs: 'Yumuşakça',
};

export default function AIImport({ tenantId, slug }: { tenantId: string; slug: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ sections: Section[] } | null>(null);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
    setDone(null);
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  }

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch('/api/ai-import', { method: 'POST', body: fd });
    const data = await res.json();

    if (!res.ok || data.error) {
      setError(data.error ?? 'Bir hata oluştu');
    } else {
      setResult(data);
      setExpandedSection(0);
    }
    setLoading(false);
  }

  async function doImport() {
    if (!result) return;
    setImporting(true);
    const res = await importFromAI(tenantId, slug, result.sections);
    if (res.error) {
      setError(res.error);
    } else {
      setDone(`✓ ${res.imported} ürün başarıyla aktarıldı!`);
      setResult(null);
      setFile(null);
      setPreview(null);
    }
    setImporting(false);
  }

  const totalProducts = result?.sections.reduce((s, sec) => s + sec.products.length, 0) ?? 0;

  return (
    <div className="max-w-2xl">
      {/* Upload alanı */}
      {!result && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) {
              setFile(f);
              setPreview(f.type.startsWith('image/') ? URL.createObjectURL(f) : null);
              setError(null); setResult(null); setDone(null);
            }
          }}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-rose-400 transition-colors"
        >
          <input ref={inputRef} type="file" className="hidden"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={onFileChange} />

          {preview ? (
            <div className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Menü önizleme" className="max-h-48 object-contain rounded-lg" />
              <p className="text-sm text-gray-500">{file?.name}</p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">📄</span>
              <p className="text-sm font-medium text-gray-700">{file.name}</p>
              <p className="text-xs text-gray-400">PDF hazır</p>
            </div>
          ) : (
            <>
              <span className="text-4xl">🤖</span>
              <p className="text-base font-medium text-gray-700 mt-3">Menü dosyanı buraya sürükle veya tıkla</p>
              <p className="text-xs text-gray-400 mt-1">PDF · JPEG · PNG · WebP — max 20MB</p>
              <p className="text-xs text-gray-400 mt-3">
                Claude AI menünüzü okur, ürünleri, fiyatları, kalori ve alerjen bilgilerini otomatik doldurur.
              </p>
            </>
          )}
        </div>
      )}

      {file && !result && (
        <button onClick={analyze} disabled={loading}
          className="mt-4 w-full py-3 bg-rose-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
          {loading
            ? <><span className="animate-spin">⚙️</span> Menü okunuyor...</>
            : '✨ AI ile analiz et'}
        </button>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      {done && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 font-medium">
          {done}
        </div>
      )}

      {/* Sonuç önizleme */}
      {result && (
        <div className="flex flex-col gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-900">
              ✓ {result.sections.length} bölüm · {totalProducts} ürün tespit edildi
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Aşağıda önizleyin, beğendiyseniz aktarın.
            </p>
          </div>

          {/* Bölüm listesi */}
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
            {result.sections.map((sec, si) => (
              <div key={si} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === si ? null : si)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-gray-100">
                  <span className="text-sm font-semibold">{sec.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{sec.products.length} ürün</span>
                    <span className="text-gray-400 text-xs">{expandedSection === si ? '▲' : '▼'}</span>
                  </div>
                </button>
                {expandedSection === si && (
                  <div className="divide-y divide-gray-50">
                    {sec.products.map((p, pi) => (
                      <div key={pi} className="px-4 py-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{p.name}</p>
                            {p.description && <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>}
                            {p.allergens && p.allergens.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {p.allergens.map(a => (
                                  <span key={a} className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                                    {ALLERGEN_LABELS[a] ?? a}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-rose-600">{p.price} ₺</p>
                            {p.calories && <p className="text-xs text-gray-400">{p.calories} kcal</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Aktar butonları */}
          <div className="flex gap-2 sticky bottom-0 pt-2">
            <button onClick={doImport} disabled={importing}
              className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">
              {importing ? 'Aktarılıyor...' : `✓ ${totalProducts} ürünü aktar`}
            </button>
            <button onClick={() => { setResult(null); setFile(null); setPreview(null); }}
              className="py-3 px-4 border border-gray-200 rounded-xl text-sm text-gray-600">
              Yeniden dene
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
