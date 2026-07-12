'use client';

import { useRef, useState } from 'react';

export default function ImageUploader({
  folder,
  currentUrl,
  onUploaded,
  label = 'Fotoğraf yükle',
}: {
  folder: 'products' | 'logos' | 'covers' | 'announcements';
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error ?? 'Yükleme başarısız.');
        return;
      }

      onUploaded(json.url);
    } catch {
      setError('Bağlantı hatası.');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {currentUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentUrl}
          alt="Mevcut görsel"
          className="w-20 h-20 object-cover rounded-md border border-gray-200"
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1.5 text-xs bg-gray-100 border border-gray-200 rounded-md px-3 py-1.5 disabled:opacity-50 hover:bg-gray-200 transition-colors w-fit"
      >
        {loading ? (
          <>
            <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Yükleniyor...
          </>
        ) : (
          <>📎 {label}</>
        )}
      </button>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
      <p className="text-[11px] text-gray-400">JPG, PNG, WebP — otomatik sıkıştırılır</p>
    </div>
  );
}
