import { createClient } from '@/lib/supabase/server';
import { addTenantLink, deleteTenantLink, toggleTenantLink, updateLinksProfile } from '../../actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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

export default async function LinksPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', params.slug)
    .single();

  const { data: links } = await supabase
    .from('tenant_links')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .order('sort_order');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mia-menu.vercel.app';
  const linkPageUrl = `${siteUrl}/l/${params.slug}`;

  const boundUpdateProfile = updateLinksProfile.bind(null, tenant!.id, params.slug);
  const boundAddLink = addTenantLink.bind(null, tenant!.id, params.slug);

  return (
    <div>
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-base font-medium mb-1">Link sayfası</h2>
          <p className="text-xs text-gray-500">Tek bir sayfada tüm linklerinizi paylaşın</p>
        </div>
        <a href={linkPageUrl} target="_blank" rel="noreferrer"
          className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-md flex items-center gap-1">
          Sayfayı gör ↗
        </a>
      </div>

      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-5 flex items-center justify-between gap-3">
        <span className="text-xs text-gray-500 truncate">{linkPageUrl}</span>
        <Link href={`/l/${params.slug}`} target="_blank"
          className="text-xs text-rose-600 whitespace-nowrap">Kopyala</Link>
      </div>

      {/* Profil */}
      <form action={boundUpdateProfile} className="flex flex-col gap-3 max-w-sm mb-8 pb-8 border-b border-gray-100">
        <p className="text-sm font-medium">Profil</p>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Kısa açıklama</label>
          <input name="links_bio" defaultValue={tenant!.links_bio ?? ''}
            placeholder="Kadıköy'ün en iyi kahvaltı mekanı"
            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Instagram URL</label>
          <input name="instagram_url" defaultValue={tenant!.instagram_url ?? ''}
            placeholder="https://instagram.com/miabistro"
            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">WhatsApp numarası</label>
          <input name="whatsapp_number" defaultValue={tenant!.whatsapp_number ?? ''}
            placeholder="905001234567"
            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
          <p className="text-[11px] text-gray-400 mt-0.5">Başında + olmadan, ülke kodu dahil</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Google Harita URL</label>
          <input name="google_maps_url" defaultValue={tenant!.google_maps_url ?? ''}
            placeholder="https://maps.google.com/..."
            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
        </div>
        <button type="submit" className="self-start text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md">
          Kaydet
        </button>
      </form>

      {/* Mevcut linkler */}
      <p className="text-sm font-medium mb-3">Özel linkler</p>
      <div className="flex flex-col gap-2 mb-5 max-w-sm">
        {(links ?? []).map((link) => {
          const boundToggle = toggleTenantLink.bind(null, link.id, params.slug, !link.is_active);
          const boundDelete = deleteTenantLink.bind(null, link.id, params.slug);
          return (
            <div key={link.id}
              className={`flex items-center gap-3 border rounded-md px-3 py-2 ${!link.is_active ? 'opacity-50 border-gray-100' : 'border-gray-200'}`}>
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
        {(!links || links.length === 0) && (
          <p className="text-sm text-gray-400">Henüz özel link yok</p>
        )}
      </div>

      {/* Yeni link ekle */}
      <form action={boundAddLink}
        className="flex flex-col gap-2 max-w-sm border-t border-gray-100 pt-4">
        <p className="text-sm font-medium">Link ekle</p>
        <input name="title" placeholder="Başlık (örn. Online Sipariş)" required
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
        <input name="subtitle" placeholder="Alt başlık (opsiyonel)"
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
        <input name="url" placeholder="https://..." required
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
        <div className="flex gap-2">
          <select name="icon" className="flex-1 border border-gray-200 rounded-md px-2 py-1.5 text-sm">
            {ICON_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Renk</label>
            <input type="color" name="color" defaultValue="#6b7280"
              className="w-8 h-8 rounded border-0 cursor-pointer p-0" />
          </div>
        </div>
        <button type="submit" className="self-start text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md mt-1">
          Ekle
        </button>
      </form>
    </div>
  );
}
