'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';
import SocialMediaEditor from '@/components/SocialMediaEditor';
import { updateLinksProfile } from '../../actions';
import type { Tenant } from '@/types/database';

const ICON_OPTIONS = [
  { value: 'qrcode', label: 'QR / Menü' },
  { value: 'brand-instagram', label: 'Instagram' },
  { value: 'brand-whatsapp', label: 'WhatsApp' },
  { value: 'map-pin', label: 'Konum' },
  { value: 'star', label: 'Yorum' },
  { value: 'phone', label: 'Telefon' },
  { value: 'world', label: 'Website' },
  { value: 'brand-tiktok', label: 'TikTok' },
  { value: 'brand-facebook', label: 'Facebook' },
  { value: 'link', label: 'Diğer' },
];

type TenantLink = {
  id: string; title: string; subtitle: string | null;
  url: string; icon: string; color: string; is_active: boolean;
};

type Props = {
  tenant: Tenant;
  slug: string;
  links: TenantLink[];
  linkPageUrl: string;
  addLinkAction: (fd: FormData) => Promise<void>;
  deleteLinkAction: (id: string, slug: string) => Promise<void>;
  toggleLinkAction: (id: string, slug: string, active: boolean) => Promise<void>;
};

export default function LinksPageForm({
  tenant, slug, links, linkPageUrl,
  addLinkAction, deleteLinkAction, toggleLinkAction,
}: Props) {
  const [logoUrl, setLogoUrl] = useState(tenant.cover_image_url ?? '');

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

  const bound = updateLinksProfile.bind(null, tenant.id, slug);

  return (
    <div>
      {/* Link sayfası adresi */}
      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-5 flex items-center justify-between gap-3">
        <span className="text-xs text-gray-500 truncate">{linkPageUrl}</span>
        <a href={linkPageUrl} target="_blank" rel="noreferrer"
          className="text-xs text-rose-600 whitespace-nowrap flex-shrink-0">Görüntüle ↗</a>
      </div>

      {/* Profil formu */}
      <form action={async (fd) => { fd.set('cover_image_url', logoUrl); await bound(fd); }}
        className="flex flex-col gap-3 max-w-sm mb-8 pb-6 border-b border-gray-100">
        <p className="text-sm font-medium">Profil</p>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Profil görseli</label>
          <ImageUploader folder="covers" currentUrl={logoUrl}
            onUploaded={(url) => setLogoUrl(url)} label="Görsel yükle" />
          {logoUrl && (
            <button type="button" onClick={() => setLogoUrl('')} className="text-xs text-red-500 mt-1">Kaldır</button>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Kısa açıklama</label>
          <input name="links_bio" defaultValue={tenant.links_bio ?? ''}
            placeholder="Kadıköy'ün en iyi kahvaltı mekanı"
            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Sosyal medya linkleri</label>
          <p className="text-xs text-gray-400 mb-2">Link sayfasında otomatik görünür.</p>
          <SocialMediaEditor initialValues={socialInitial} />
        </div>

        <button type="submit" className="self-start text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md">Kaydet</button>
      </form>

      {/* Özel linkler */}
      <p className="text-sm font-medium mb-3">Özel linkler</p>
      <div className="flex flex-col gap-2 mb-5 max-w-sm">
        {links.map((link) => {
          const boundToggle = toggleLinkAction.bind(null, link.id, slug, !link.is_active);
          const boundDelete = deleteLinkAction.bind(null, link.id, slug);
          return (
            <div key={link.id} className={`flex items-center gap-3 border rounded-md px-3 py-2 ${!link.is_active ? 'opacity-50 border-gray-100' : 'border-gray-200'}`}>
              <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: link.color }}>
                <i className={`ti ti-${link.icon} text-white`} style={{ fontSize: 13 }} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{link.title}</p>
                {link.subtitle && <p className="text-xs text-gray-400 truncate">{link.subtitle}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <form action={boundToggle}>
                  <button className="text-xs text-gray-400">{link.is_active ? 'Gizle' : 'Göster'}</button>
                </form>
                <form action={boundDelete}>
                  <button className="text-xs text-red-500">Sil</button>
                </form>
              </div>
            </div>
          );
        })}
        {links.length === 0 && <p className="text-sm text-gray-400">Henüz özel link yok</p>}
      </div>

      <form action={addLinkAction} className="flex flex-col gap-2 max-w-sm border-t border-gray-100 pt-4">
        <p className="text-sm font-medium">Link ekle</p>
        <input name="title" placeholder="Başlık" required className="border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
        <input name="subtitle" placeholder="Alt başlık (opsiyonel)" className="border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
        <input name="url" placeholder="https://..." required className="border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
        <div className="flex gap-2">
          <select name="icon" className="flex-1 border border-gray-200 rounded-md px-2 py-1.5 text-sm">
            {ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <input type="color" name="color" defaultValue="#6b7280" className="w-8 h-8 rounded border-0 cursor-pointer p-0" />
        </div>
        <button type="submit" className="self-start text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md">Ekle</button>
      </form>
    </div>
  );
}
