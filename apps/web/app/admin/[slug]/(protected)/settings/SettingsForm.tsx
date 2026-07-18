'use client';

import { useState } from 'react';
import { updateTenant } from '../../actions';
import ImageUploader from '@/components/ImageUploader';
import SocialMediaEditor from '@/components/SocialMediaEditor';
import type { Tenant } from '@/types/database';

export default function SettingsForm({ tenant, slug }: { tenant: Tenant; slug: string }) {
  const [coverUrl, setCoverUrl] = useState(tenant.cover_image_url ?? '');
  const [logoUrl, setLogoUrl] = useState(tenant.logo_url ?? '');

  const bound = updateTenant.bind(null, tenant.id, slug);

  const socialInitial = {
    instagram: tenant.instagram_url,
    whatsapp: tenant.whatsapp_number,
    maps: tenant.google_maps_url,
    facebook: tenant.facebook_url,
    tiktok: tenant.tiktok_url,
    linkedin: tenant.linkedin_url,
    twitter: tenant.twitter_url,
    youtube: tenant.youtube_url,
  };

  return (
    <form action={async (fd) => {
      fd.set('cover_image_url', coverUrl);
      fd.set('logo_url', logoUrl);
      await bound(fd);
    }} className="flex flex-col gap-3 max-w-sm">

      <div>
        <label className="block text-xs text-gray-500 mb-1">İşletme adı</label>
        <input name="name" defaultValue={tenant.name}
          className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Telefon</label>
        <input name="phone" defaultValue={tenant.phone ?? ''}
          className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Adres</label>
        <textarea name="address" defaultValue={tenant.address ?? ''} rows={2}
          className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Çalışma saatleri</label>
        <input name="working_hours" defaultValue={tenant.working_hours ?? ''}
          placeholder="Her gün 08:00 – 23:00"
          className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Kapak fotoğrafı</label>
        <ImageUploader
          folder="covers"
          currentUrl={coverUrl}
          onUploaded={(url) => setCoverUrl(url)}
          label="Fotoğraf yükle"
        />
        {coverUrl && (
          <button type="button" onClick={() => setCoverUrl('')}
            className="text-xs text-red-500 mt-1">Fotoğrafı sil</button>
        )}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Logo</label>
        <p className="text-[11px] text-gray-400 mb-1.5">Kapak fotoğrafının üzerinde shadow ile gösterilir.</p>
        <ImageUploader
          folder="logos"
          currentUrl={logoUrl}
          onUploaded={(url) => setLogoUrl(url)}
          label="Logo yükle"
        />
        {logoUrl && (
          <button type="button" onClick={() => setLogoUrl('')}
            className="text-xs text-red-500 mt-1">Logoyu sil</button>
        )}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Google yorum linki</label>
        <input name="google_review_url" defaultValue={tenant.google_review_url ?? ''}
          placeholder="https://g.page/r/..."
          className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-medium mb-1">Sosyal medya</p>
        <p className="text-xs text-gray-400 mb-3">Müşteri menüsünde header'da ikon olarak görünür.</p>
        <SocialMediaEditor initialValues={socialInitial} />
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-medium mb-1">WhatsApp bildirim</p>
        <p className="text-xs text-gray-400 mb-3">
          Müşteri görüş bıraktığında mesaj alın.{' '}
          <a href="https://www.callmebot.com/blog/free-api-whatsapp-messages/" target="_blank" rel="noreferrer" className="text-rose-600 underline">CallMeBot →</a>
        </p>
        <div className="flex flex-col gap-2">
          <input name="notification_phone" defaultValue={(tenant as { notification_phone?: string }).notification_phone ?? ''}
            placeholder="905001234567"
            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
          <input name="callmebot_api_key" defaultValue={(tenant as { callmebot_api_key?: string }).callmebot_api_key ?? ''}
            placeholder="CallMeBot API key"
            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
        </div>
      </div>

      <button type="submit" className="self-start text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md mt-1">
        Kaydet
      </button>
    </form>
  );
}
