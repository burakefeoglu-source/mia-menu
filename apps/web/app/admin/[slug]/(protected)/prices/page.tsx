import { createClient } from '@/lib/supabase/server';
import PriceEditor from '@/components/PriceEditor';
import BulkPriceUpdater from '@/components/BulkPriceUpdater';

export const dynamic = 'force-dynamic';

export default async function PricesPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single();

  const { data: sections } = await supabase
    .from('menu_sections')
    .select('id, name')
    .eq('tenant_id', tenant!.id)
    .order('sort_order');

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .order('sort_order');

  const sectionMap = new Map((sections ?? []).map((s) => [s.id, s.name]));
  const productsWithSection = (products ?? []).map((p) => ({
    ...p,
    section_name: sectionMap.get(p.section_id),
  }));

  return (
    <div>
      <h2 className="text-base font-medium mb-4">Fiyat güncelleme</h2>
      <BulkPriceUpdater tenantId={tenant!.id} slug={params.slug} sections={sections ?? []} />
      <PriceEditor slug={params.slug} products={productsWithSection} />
    </div>
  );
}
