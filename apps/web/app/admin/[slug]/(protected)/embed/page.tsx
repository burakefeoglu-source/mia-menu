import { createClient } from '@/lib/supabase/server';
import EmbedCodes from './EmbedCodes';

export const dynamic = 'force-dynamic';

export default async function EmbedPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: tenant } = await supabase
    .from('tenants').select('name').eq('slug', params.slug).single();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mia-menu.vercel.app';
  const menuUrl = `${siteUrl}/menu/${params.slug}`;

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Web entegrasyonu</h2>
      <p className="text-xs text-gray-500 mb-5">
        Menünüzü web sitenize eklemek için aşağıdaki kodları kullanın.
      </p>
      <EmbedCodes menuUrl={menuUrl} tenantName={tenant?.name ?? ''} slug={params.slug} />
    </div>
  );
}
