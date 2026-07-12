'use client';

import { useRef } from 'react';
import { addBannerAction, deleteBannerAction, toggleBannerAction } from './bannerActions';

type Banner = {
  id: string;
  text: string;
  bg_color: string;
  is_active: boolean;
};

export default function BannerManager({ initialBanners }: { initialBanners: Banner[] }) {
  const colorRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <p className="text-sm font-medium">Reklam bandı yönetimi</p>
        <span className="text-xs text-gray-400">
          {initialBanners.filter(b => b.is_active).length} aktif
        </span>
      </div>

      {/* Mevcut bannerlar */}
      <div className="divide-y divide-gray-100">
        {initialBanners.map((b) => {
          const boundToggle = toggleBannerAction.bind(null, b.id, !b.is_active);
          const boundDelete = deleteBannerAction.bind(null, b.id);
          return (
            <div key={b.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: b.bg_color }} />
              <p className="text-sm flex-1 truncate">{b.text}</p>
              <div className="flex gap-2 flex-shrink-0">
                <form action={boundToggle}>
                  <button className={`text-xs px-2 py-1 rounded-md ${
                    b.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {b.is_active ? 'Aktif' : 'Pasif'}
                  </button>
                </form>
                <form action={boundDelete}>
                  <button className="text-xs text-red-500">Sil</button>
                </form>
              </div>
            </div>
          );
        })}
        {initialBanners.length === 0 && (
          <p className="px-4 py-4 text-sm text-gray-400">Henüz banner yok</p>
        )}
      </div>

      {/* Yeni banner ekle */}
      <form action={addBannerAction} className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 mb-2">Yeni banner</p>
        <div className="flex gap-2">
          <input
            name="text"
            required
            placeholder="Banner metni..."
            className="flex-1 border border-gray-200 rounded-md px-2 py-1.5 text-sm bg-white"
          />
          <input
            ref={colorRef}
            type="color"
            name="bg_color"
            defaultValue="#c2185b"
            className="w-9 h-9 rounded border border-gray-200 cursor-pointer p-0.5 bg-white flex-shrink-0"
          />
          <button
            type="submit"
            className="text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md flex-shrink-0"
          >
            Ekle
          </button>
        </div>
      </form>
    </div>
  );
}
