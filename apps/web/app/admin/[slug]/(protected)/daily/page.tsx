import { createClient } from '@/lib/supabase/server';
import DailySpecialManager from './DailySpecialManager';

export const dynamic = 'force-dynamic';

export default async function DailyPage({ params }: { params: { slug: string } }) {
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
    .select('id, name, price, section_id, is_daily_special')
    .eq('tenant_id', tenant!.id)
    .order('sort_order');

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Günün menüsü</h2>
      <p className="text-xs text-gray-500 mb-5">
        Seçilen ürünler müşteri menüsünde ⭐ "Günün Menüsü" bölümünde üstte gösterilir.
      </p>
      <DailySpecialManager
        slug={params.slug}
        sections={sections ?? []}
        products={(products ?? []).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          section_id: p.section_id,
          is_daily_special: p.is_daily_special ?? false,
        }))}
      />
    </div>
  );
}
