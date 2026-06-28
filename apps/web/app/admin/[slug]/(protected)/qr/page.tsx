import { createClient } from '@/lib/supabase/server';
import QrManager from '@/components/QrManager';

export const dynamic = 'force-dynamic';

export default async function QrPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, qr_style, logo_url')
    .eq('slug', params.slug)
    .single();

  const { data: tables } = await supabase
    .from('tables')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .order('label');

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const generalEntry = {
    key: 'general',
    label: 'Genel menü',
    url: `${baseUrl}/menu/${params.slug}`,
  };

  const tableEntries = (tables ?? []).map((t) => ({
    key: t.id,
    label: t.label,
    url: `${baseUrl}/menu/${params.slug}?table=${t.qr_token}`,
  }));

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Karekod</h2>
      <p className="text-xs text-gray-500 mb-4">
        Stil ve logo tüm karekodlara birden uygulanır.
      </p>
      <QrManager
        tenantId={tenant!.id}
        slug={params.slug}
        initialStyle={tenant!.qr_style}
        initialLogoUrl={tenant!.logo_url ?? ''}
        generalEntry={generalEntry}
        tableEntries={tableEntries}
        hasTables={(tables ?? []).length > 0}
      />
    </div>
  );
}
