'use client';

import { useRef, useState } from 'react';
import { importProducts } from '@/app/admin/[slug]/actions';

type Row = { sectionName: string; name: string; price: number; description?: string; calories?: number };
type Step = 'upload' | 'map' | 'preview' | 'done';

const REQUIRED = ['name', 'price'] as const;
const COLUMNS = [
  { key: 'sectionName', label: 'Bölüm adı', required: true },
  { key: 'name', label: 'Ürün adı', required: true },
  { key: 'price', label: 'Fiyat (₺)', required: true },
  { key: 'description', label: 'Açıklama', required: false },
  { key: 'calories', label: 'Kalori', required: false },
] as const;

type ColKey = (typeof COLUMNS)[number]['key'];

export default function ImportWizard({ tenantId, slug }: { tenantId: string; slug: string }) {
  const [step, setStep] = useState<Step>('upload');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Partial<Record<ColKey, string>>>({});
  const [preview, setPreview] = useState<Row[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported?: number; error?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    let rows: string[][] = [];

    if (ext === 'csv') {
      const Papa = (await import('papaparse')).default;
      const text = await file.text();
      const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
      rows = parsed.data as string[][];
    } else {
      const XLSX = await import('xlsx');
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: '' }) as string[][];
    }

    if (rows.length < 2) return;

    const hdrs = rows[0].map(String);
    setHeaders(hdrs);
    setRawRows(rows.slice(1));

    // Otomatik eşleştirme — başlık adından tahmin et
    const autoMap: Partial<Record<ColKey, string>> = {};
    hdrs.forEach((h) => {
      const lower = h.toLowerCase().replace(/\s/g, '');
      if (!autoMap.sectionName && /bölüm|kategori|section|category/.test(lower)) autoMap.sectionName = h;
      if (!autoMap.name && /ürünadı|ürün|isim|ad|name|item/.test(lower)) autoMap.name = h;
      if (!autoMap.price && /fiyat|price|ücret|tutar/.test(lower)) autoMap.price = h;
      if (!autoMap.description && /açıklama|description|detay/.test(lower)) autoMap.description = h;
      if (!autoMap.calories && /kalori|kcal|calorie/.test(lower)) autoMap.calories = h;
    });
    setMapping(autoMap);
    setStep('map');
  }

  function buildPreview() {
    const rows: Row[] = [];
    for (const raw of rawRows.slice(0, 200)) {
      const get = (col?: string) => col ? raw[headers.indexOf(col)] ?? '' : '';
      const name = get(mapping.name).trim();
      const priceStr = get(mapping.price).replace(/[^0-9.,]/g, '').replace(',', '.');
      const price = parseFloat(priceStr);
      if (!name || isNaN(price)) continue;
      rows.push({
        sectionName: get(mapping.sectionName).trim() || 'Genel',
        name,
        price,
        description: get(mapping.description).trim() || undefined,
        calories: get(mapping.calories) ? parseInt(get(mapping.calories)) : undefined,
      });
    }
    setPreview(rows);
    setStep('preview');
  }

  async function handleImport() {
    setImporting(true);
    const res = await importProducts(tenantId, slug, preview);
    setResult(res);
    setImporting(false);
    setStep('done');
  }

  function reset() {
    setStep('upload');
    setHeaders([]);
    setRawRows([]);
    setMapping({});
    setPreview([]);
    setResult(null);
  }

  if (step === 'upload') return (
    <div>
      <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs font-medium text-gray-700 mb-1">Dosya formatı</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Excel (.xlsx) veya CSV (.csv) dosyası yükleyin. İlk satır başlık olmalı.
          Önerilen sütunlar: <strong>Bölüm Adı, Ürün Adı, Fiyat</strong> (zorunlu),
          Açıklama, Kalori (opsiyonel).
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <button
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center w-full max-w-sm border-2 border-dashed border-gray-200 rounded-xl p-10 text-gray-400 hover:border-rose-400 hover:text-rose-500 transition-colors"
      >
        <span className="text-3xl mb-2">📂</span>
        <span className="text-sm font-medium">Excel veya CSV seç</span>
        <span className="text-xs mt-1">.xlsx, .xls, .csv</span>
      </button>

      <div className="mt-5 max-w-sm">
        <p className="text-xs text-gray-400 mb-2">Örnek format:</p>
        <table className="text-xs w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              {['Bölüm Adı', 'Ürün Adı', 'Fiyat', 'Açıklama'].map(h => (
                <th key={h} className="px-2 py-1.5 text-left font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Kahvaltı', 'Serpme Kahvaltı', '450', 'Peynir, zeytin, bal'],
              ['Kahvaltı', 'Menemen', '180', 'Domates, biber'],
              ['Ana Yemekler', 'Izgara Köfte', '320', ''],
            ].map((r, i) => (
              <tr key={i} className="border-t border-gray-100">
                {r.map((c, j) => <td key={j} className="px-2 py-1.5 text-gray-600">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (step === 'map') return (
    <div className="max-w-md">
      <p className="text-sm font-medium mb-4">Sütunları eşleştir</p>
      <p className="text-xs text-gray-500 mb-4">
        Dosyanızdaki hangi sütunun hangi bilgiyi içerdiğini seçin.
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {COLUMNS.map((col) => (
          <div key={col.key} className="flex items-center gap-3">
            <label className="text-xs w-28 flex-shrink-0">
              {col.label}
              {col.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <select
              value={mapping[col.key] ?? ''}
              onChange={(e) => setMapping((m) => ({ ...m, [col.key]: e.target.value || undefined }))}
              className="flex-1 border border-gray-200 rounded-md px-2 py-1.5 text-sm"
            >
              <option value="">— Seç —</option>
              {headers.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={reset} className="text-sm px-3 py-1.5 border border-gray-200 rounded-md text-gray-600">Geri</button>
        <button
          onClick={buildPreview}
          disabled={!mapping.name || !mapping.price}
          className="text-sm px-4 py-1.5 bg-rose-600 text-white rounded-md disabled:opacity-50"
        >
          Önizle
        </button>
      </div>
    </div>
  );

  if (step === 'preview') return (
    <div>
      <p className="text-sm font-medium mb-1">Önizleme</p>
      <p className="text-xs text-gray-500 mb-4">
        {preview.length} ürün aktarılacak. Kontrol edip onaylayın.
      </p>

      <div className="overflow-x-auto mb-5 max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
        <table className="text-xs w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {['Bölüm', 'Ürün adı', 'Fiyat', 'Açıklama', 'Kalori'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((r, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-3 py-1.5 text-gray-500">{r.sectionName}</td>
                <td className="px-3 py-1.5 font-medium">{r.name}</td>
                <td className="px-3 py-1.5">{r.price} ₺</td>
                <td className="px-3 py-1.5 text-gray-500 max-w-[180px] truncate">{r.description}</td>
                <td className="px-3 py-1.5 text-gray-500">{r.calories ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setStep('map')} className="text-sm px-3 py-1.5 border border-gray-200 rounded-md text-gray-600">Geri</button>
        <button
          onClick={handleImport}
          disabled={importing || preview.length === 0}
          className="text-sm px-4 py-1.5 bg-rose-600 text-white rounded-md disabled:opacity-50"
        >
          {importing ? 'Aktarılıyor...' : `${preview.length} ürünü aktar`}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-sm text-center py-8">
      {result?.error ? (
        <>
          <p className="text-3xl mb-3">❌</p>
          <p className="text-sm text-red-600 mb-4">{result.error}</p>
          <button onClick={reset} className="text-sm px-4 py-2 border border-gray-200 rounded-md">Tekrar dene</button>
        </>
      ) : (
        <>
          <p className="text-3xl mb-3">✅</p>
          <p className="text-sm font-medium mb-1">{result?.imported} ürün aktarıldı</p>
          <p className="text-xs text-gray-500 mb-4">Bölümler ve ürünler menünüze eklendi.</p>
          <div className="flex gap-2 justify-center">
            <button onClick={reset} className="text-sm px-4 py-2 border border-gray-200 rounded-md">Yeni dosya aktar</button>
            <a href={`/admin/${slug}`} className="text-sm px-4 py-2 bg-rose-600 text-white rounded-md">Menüye git</a>
          </div>
        </>
      )}
    </div>
  );
}
