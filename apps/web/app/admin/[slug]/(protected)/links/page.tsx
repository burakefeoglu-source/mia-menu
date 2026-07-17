import { createClient } from '@/lib/supabase/server';
import { addTenantLink, deleteTenantLink, toggleTenantLink } from '../../actions';
import LinksPageForm from './LinksPageForm';

export const dynamic = 'force-dynamic';

export default async function LinksPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants').select('*').eq('slug', params.slug).single();

  const { data: links } = await supabase
    .from('tenant_links').select('*')
    .eq('tenant_id', tenant!.id).order('sort_order');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mia-menu.vercel.app';

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Link sayfası</h2>
      <p className="text-xs text-gray-500 mb-5">Tek bir sayfada tüm linklerinizi paylaşın.</p>
      <LinksPageForm
        tenant={tenant!}
        slug={params.slug}
        links={links ?? []}
        linkPageUrl={`${siteUrl}/l/${params.slug}`}
        addLinkAction={addTenantLink.bind(null, tenant!.id, params.slug)}
        deleteLinkAction={deleteTenantLink}
        toggleLinkAction={toggleTenantLink}
      />
    </div>
  );
}
