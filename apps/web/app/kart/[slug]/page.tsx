import { createClient } from '@/lib/supabase/server';
import KartClient from './KartClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function KartPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants').select('id, name, logo_url, cover_image_url')
    .eq('slug', params.slug).eq('is_active', true).single();

  if (!tenant) notFound();

  const { data: programs } = await supabase
    .from('loyalty_programs').select('id, name, required_stamps, reward_description, description')
    .eq('tenant_id', tenant.id).eq('is_active', true).order('created_at');

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-sm">
        {/* Geri dön */}
        <a href={`/menu/${params.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 mb-5 hover:text-gray-700">
          ← Menüye dön
        </a>

        <div className="text-center mb-6">
          {tenant.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tenant.logo_url} alt={tenant.name} className="w-16 h-16 object-contain mx-auto mb-2" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-white">{tenant.name[0]}</span>
            </div>
          )}
          <h1 className="text-lg font-semibold">{tenant.name}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Sadakat Kartı</p>
        </div>
        <KartClient tenantId={tenant.id} programs={programs ?? []} />
      </div>
    </main>
  );
}
