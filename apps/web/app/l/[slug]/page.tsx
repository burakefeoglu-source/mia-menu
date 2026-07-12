import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const BUILT_IN_LINKS = (tenant: {
  slug: string;
  instagram_url: string | null;
  whatsapp_number: string | null;
  google_maps_url: string | null;
  google_review_url: string | null;
}, siteUrl: string) => [
  {
    id: 'menu',
    title: 'Dijital Menümüz',
    subtitle: 'QR ile görüntüle',
    url: `${siteUrl}/menu/${tenant.slug}`,
    icon: 'qrcode',
    color: '#c2185b',
    is_active: true,
  },
  tenant.instagram_url ? {
    id: 'instagram',
    title: 'Instagram',
    subtitle: null,
    url: tenant.instagram_url,
    icon: 'brand-instagram',
    color: '#e1306c',
    is_active: true,
  } : null,
  tenant.whatsapp_number ? {
    id: 'whatsapp',
    title: 'WhatsApp',
    subtitle: 'Rezervasyon',
    url: `https://wa.me/${tenant.whatsapp_number}`,
    icon: 'brand-whatsapp',
    color: '#16a34a',
    is_active: true,
  } : null,
  tenant.google_maps_url ? {
    id: 'maps',
    title: 'Konum',
    subtitle: 'Google Harita',
    url: tenant.google_maps_url,
    icon: 'map-pin',
    color: '#ca8a04',
    is_active: true,
  } : null,
  tenant.google_review_url ? {
    id: 'review',
    title: 'Google Yorumlar',
    subtitle: 'Bizi değerlendirin',
    url: tenant.google_review_url,
    icon: 'star',
    color: '#9333ea',
    is_active: true,
  } : null,
].filter(Boolean) as { id: string; title: string; subtitle: string | null; url: string; icon: string; color: string; is_active: boolean }[];

export default async function LinkPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mia-menu.vercel.app';

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!tenant) notFound();

  const { data: customLinks } = await supabase
    .from('tenant_links')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('is_active', true)
    .order('sort_order');

  const builtIn = BUILT_IN_LINKS(tenant, siteUrl);
  const allLinks = [...builtIn, ...(customLinks ?? [])];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-sm">

        {/* Profil */}
        <div className="text-center mb-7">
          {tenant.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tenant.cover_image_url} alt={tenant.name}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-white shadow" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center mx-auto mb-3 border-4 border-white shadow">
              <span className="text-2xl font-bold text-white">{tenant.name[0]}</span>
            </div>
          )}
          <h1 className="text-lg font-semibold text-gray-900">{tenant.name}</h1>
          {tenant.address && (
            <p className="text-xs text-gray-400 mt-0.5">{tenant.address.split(',').slice(-2).join(',').trim()}</p>
          )}
          {(tenant as { links_bio?: string | null }).links_bio && (
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {(tenant as { links_bio?: string | null }).links_bio}
            </p>
          )}
        </div>

        {/* Linkler */}
        <div className="flex flex-col gap-3">
          {allLinks.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: link.color }}>
                <i className={`ti ti-${link.icon} text-white`} style={{ fontSize: 18 }} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{link.title}</p>
                {link.subtitle && <p className="text-xs text-gray-400">{link.subtitle}</p>}
              </div>
              <i className="ti ti-chevron-right text-gray-300" style={{ fontSize: 14 }} aria-hidden="true" />
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-gray-300 mt-8">mia.menu</p>
      </div>
    </main>
  );
}
