import { createClient } from '@/lib/supabase/server';
import MenuSetsManager from './MenuSetsManager';
import { createMenuSet } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function SetsPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: tenant } = await supabase
    .from('tenants').select('id').eq('slug', params.slug).single();

  const { data: sets } = await supabase
    .from('menu_sets')
    .select('*, menu_set_items(id, quantity, products(id, name, price))')
    .eq('tenant_id', tenant!.id)
    .order('sort_order');

  const { data: products } = await supabase
    .from('products').select('id, name, price, menu_sections(name)')
    .eq('tenant_id', tenant!.id).eq('is_active', true).order('sort_order');

  const boundCreate = createMenuSet.bind(null, tenant!.id, params.slug);

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Menü setleri</h2>
      <p className="text-xs text-gray-500 mb-5">
        Combo veya paket menüler oluşturun. Seçili ürünleri birleştirip tek fiyatla sunabilirsiniz.
      </p>
      <MenuSetsManager
        slug={params.slug}
        sets={(sets ?? []) as Parameters<typeof MenuSetsManager>[0]['sets']}
        products={(products ?? []) as Parameters<typeof MenuSetsManager>[0]['products']}
        createAction={boundCreate}
      />
    </div>
  );
}
