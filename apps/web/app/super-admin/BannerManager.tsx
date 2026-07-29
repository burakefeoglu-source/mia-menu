'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addBannerAction, deleteBannerAction, toggleBannerAction } from './bannerActions';

type Banner = { id: string; text: string; bg_color: string; is_active: boolean };

export default function BannerManager({ initialBanners }: { initialBanners: Banner[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [banners, setBanners] = useState(initialBanners);
  const [newText, setNewText] = useState('');
  const [newColor, setNewColor] = useState('#c2185b');
  const [adding, setAdding] = useState(false);

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleToggle(id: string, currentActive: boolean) {
    // Optimistic update
    setBanners(prev => prev.map(b => b.id === id ? { ...b, is_active: !currentActive } : b));
    await toggleBannerAction(id, !currentActive);
    refresh();
  }

  async function handleDelete(id: string) {
    setBanners(prev => prev.filter(b => b.id !== id));
    await deleteBannerAction(id);
    refresh();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newText.trim()) return;
    setAdding(true);
    const fd = new FormData();
    fd.set('text', newText.trim());
    fd.set('bg_color', newColor);
    await addBannerAction(fd);
    setNewText('');
    setAdding(false);
    refresh();
  }

  const activeBanners = banners.filter(b => b.is_active);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <p className="text-sm font-medium">Reklam bandı yönetimi</p>
        <span className="text-xs text-gray-400">
          {activeBanners.length} aktif{isPending ? ' · kaydediliyor...' : ''}
        </span>
      </div>

      {/* Önizleme */}
      {activeBanners.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="text-xs text-gray-400 mb-1.5">Önizleme (sırayla döner):</p>
          <div className="flex flex-col gap-1">
            {activeBanners.map(b => (
              <div key={b.id} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-white text-xs font-medium"
                style={{ background: b.bg_color }}>
                {b.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tüm bannerlar */}
      <div className="divide-y divide-gray-100">
        {banners.map(b => (
          <div key={b.id} className="flex items-center gap-3 px-4 py-3">
            <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: b.bg_color }} />
            <p className="text-sm flex-1 truncate">{b.text}</p>
            <div className="flex gap-2 flex-shrink-0 items-center">
              <button
                onClick={() => handleToggle(b.id, b.is_active)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  b.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                {b.is_active ? '✓ Aktif' : 'Pasif'}
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="text-xs text-red-400 hover:text-red-600">Sil</button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="px-4 py-4 text-sm text-gray-400">Henüz banner yok</p>
        )}
      </div>

      {/* Yeni banner ekle */}
      <form onSubmit={handleAdd} className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 mb-2">Yeni banner ekle</p>
        <div className="flex gap-2">
          <input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            required
            placeholder="Banner metni..."
            className="flex-1 border border-gray-200 rounded-md px-2 py-1.5 text-sm bg-white"
          />
          <input
            type="color"
            value={newColor}
            onChange={e => setNewColor(e.target.value)}
            className="w-9 h-9 rounded border border-gray-200 cursor-pointer p-0.5 bg-white flex-shrink-0"
          />
          <button
            type="submit"
            disabled={adding}
            className="text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md flex-shrink-0 disabled:opacity-50"
          >
            {adding ? '...' : 'Ekle'}
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5">
          Birden fazla banner aktifse sırayla 4 saniyede bir döner.
        </p>
      </form>
    </div>
  );
}
