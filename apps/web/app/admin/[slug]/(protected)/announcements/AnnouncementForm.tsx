'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { addAnnouncement } from '../../actions';

export default function AnnouncementForm({ tenantId, slug }: { tenantId: string; slug: string }) {
  const [kind, setKind] = useState<'text' | 'poster'>('text');
  const [imageUrl, setImageUrl] = useState('');

  const bound = addAnnouncement.bind(null, tenantId, slug);

  return (
    <form
      action={async (formData) => {
        if (imageUrl) formData.set('image_url', imageUrl);
        await bound(formData);
        setImageUrl('');
      }}
      className="flex flex-col gap-2 max-w-sm border-t border-gray-100 pt-4"
    >
      <p className="text-sm font-medium">Yeni duyuru</p>

      <div className="flex gap-2">
        <select name="icon_type" className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm">
          <option value="duyuru">📢 Duyuru</option>
          <option value="kampanya">🏷️ Kampanya</option>
        </select>
        <select
          name="kind"
          value={kind}
          onChange={(e) => { setKind(e.target.value as 'text' | 'poster'); setImageUrl(''); }}
          className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        >
          <option value="text">Metin</option>
          <option value="poster">Poster (popup)</option>
        </select>
      </div>

      <input name="title" placeholder="Başlık" required
        className="border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
      <textarea name="message" placeholder="Mesaj (opsiyonel)" rows={2}
        className="border border-gray-200 rounded-md px-3 py-1.5 text-sm" />

      {kind === 'poster' && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Poster görseli</p>
          <ImageUploader
            folder="announcements"
            currentUrl={imageUrl}
            onUploaded={(url) => setImageUrl(url)}
            label="Görsel yükle"
          />
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-[11px] text-gray-400">Başlangıç (opsiyonel)</label>
          <input type="datetime-local" name="starts_at"
            className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm mt-0.5" />
        </div>
        <div className="flex-1">
          <label className="text-[11px] text-gray-400">Bitiş (opsiyonel)</label>
          <input type="datetime-local" name="ends_at"
            className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm mt-0.5" />
        </div>
      </div>

      <button type="submit"
        className="self-start text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md mt-1">
        Ekle
      </button>
    </form>
  );
}
