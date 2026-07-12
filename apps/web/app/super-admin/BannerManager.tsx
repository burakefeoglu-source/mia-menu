'use client';

import { useState } from 'react';

type Banner = {
  id: string;
  text: string;
  bg_color: string;
  is_active: boolean;
};

export default function BannerManager({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [newText, setNewText] = useState('');
  const [newColor, setNewColor] = useState('#c2185b');
  const [saving, setSaving] = useState(false);

  async function fetchBanners() {
    const res = await fetch('/api/admin-banners');
    const data = await res.json();
    setBanners(data);
  }

  async function addBanner() {
    if (!newText.trim()) return;
    setSaving(true);
    await fetch('/api/admin-banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText, bg_color: newColor }),
    });
    setNewText('');
    await fetchBanners();
    setSaving(false);
  }

  async function toggleBanner(id: string, active: boolean) {
    await fetch('/api/admin-banners', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: active }),
    });
    await fetchBanners();
  }

  async function deleteBanner(id: string) {
    if (!confirm('Bu bandı silmek istediğine emin misin?')) return;
    await fetch('/api/admin-banners', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchBanners();
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <p className="text-sm font-medium">Reklam bandı yönetimi</p>
        <span className="text-xs text-gray-400">{banners.filter(b => b.is_active).length} aktif</span>
      </div>

      {/* Mevcut bannerlar */}
      <div className="divide-y divide-gray-100">
        {banners.map((b) => (
          <div key={b.id} className="flex items-center gap-3 px-4 py-3">
            <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: b.bg_color }} />
            <p className="text-sm flex-1 truncate">{b.text}</p>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => toggleBanner(b.id, !b.is_active)}
                className={`text-xs px-2 py-1 rounded-md ${b.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}
              >
                {b.is_active ? 'Aktif' : 'Pasif'}
              </button>
              <button onClick={() => deleteBanner(b.id)} className="text-xs text-red-500">Sil</button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="px-4 py-4 text-sm text-gray-400">Henüz banner yok</p>
        )}
      </div>

      {/* Yeni banner ekle */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 mb-2">Yeni banner</p>
        <div className="flex gap-2">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Banner metni..."
            className="flex-1 border border-gray-200 rounded-md px-2 py-1.5 text-sm bg-white"
          />
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-9 h-9 rounded border-0 cursor-pointer p-0 flex-shrink-0"
          />
          <button
            onClick={addBanner}
            disabled={saving || !newText.trim()}
            className="text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md disabled:opacity-50 flex-shrink-0"
          >
            Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
