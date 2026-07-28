import { createClient } from '@/lib/supabase/server';
import OptionsManager from './OptionsManager';

export const dynamic = 'force-dynamic';

export default async function OptionsPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: tenant } = await supabase
    .from('tenants').select('id').eq('slug', params.slug).single();

  const { data: sections } = await supabase
    .from('menu_sections').select('id, name')
    .eq('tenant_id', tenant!.id).eq('is_active', true).order('sort_order');

  const { data: products } = await supabase
    .from('products').select('id, name, price, section_id, product_option_groups(id, name, is_required, product_option_items(id, name, price, is_default, sort_order))')
    .eq('tenant_id', tenant!.id).eq('is_active', true).order('sort_order');

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Ürüne ek seçenekler</h2>
      <p className="text-xs text-gray-500 mb-5">Boyut, pişirme derecesi, ekstra gibi seçenekler tanımlayın. Müşteri menüde fiyatları doğrudan görecek.</p>
      <OptionsManager
        slug={params.slug}
        sections={sections ?? []}
        products={(products ?? []) as Parameters<typeof OptionsManager>[0]['products']}
      />
    </div>
  );
}
