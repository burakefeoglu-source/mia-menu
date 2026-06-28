import { createClient } from '@/lib/supabase/server';
import SectionsList from '@/components/SectionsList';
import { addSection } from '../actions';

export const dynamic = 'force-dynamic';

export default async function SectionsPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', params.slug)
    .single();

  const { data: sections } = await supabase
    .from('menu_sections')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .order('sort_order');

  const { data: products } = await supabase
    .from('products')
    .select('*, product_allergens(allergens(id, code, name_tr))')
    .eq('tenant_id', tenant!.id)
    .order('sort_order');

  const boundAddSection = addSection.bind(null, tenant!.id, params.slug);

  return (
    <div>
      <h2 className="text-base font-medium mb-4">Bölümler &amp; ürünler</h2>
      <SectionsList
        tenantId={tenant!.id}
        slug={params.slug}
        sections={sections ?? []}
        products={products ?? []}
      />
      <form action={boundAddSection} className="flex gap-2 mt-4">
        <input
          name="name"
          placeholder="Yeni bölüm adı"
          required
          className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          className="text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md whitespace-nowrap"
        >
          + Yeni bölüm
        </button>
      </form>
    </div>
  );
}
