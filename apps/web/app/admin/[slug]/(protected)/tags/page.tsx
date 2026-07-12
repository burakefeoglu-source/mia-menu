import { createClient } from '@/lib/supabase/server';
import { addTag } from '../../actions';
import TagAssignGrid from '@/components/TagAssignGrid';
import DietBadgeGrid from '@/components/DietBadgeGrid';

export const dynamic = 'force-dynamic';

export default async function TagsPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single();

  const { data: tags } = await supabase
    .from('tags')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .order('created_at');

  const { data: products } = await supabase
    .from('products')
    .select('id, name, is_vegan, is_vegetarian, is_gluten_free')
    .eq('tenant_id', tenant!.id)
    .order('sort_order');

  const { data: productTags } = await supabase
    .from('product_tags')
    .select('product_id, tag_id')
    .in('product_id', (products ?? []).map((p) => p.id));

  const boundAddTag = addTag.bind(null, tenant!.id, params.slug);

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Ürün etiketleri</h2>
      <p className="text-xs text-gray-500 mb-5">Diyet rozetleri ve özel etiketleri ürünlere atayın.</p>

      {/* Diyet rozetleri */}
      <div className="mb-8 pb-8 border-b border-gray-100">
        <p className="text-sm font-medium mb-3">Diyet rozetleri</p>
        <p className="text-xs text-gray-400 mb-3">Müşteri menüsünde ürün isminin yanında ikon olarak görünür, detayda açıklanır.</p>
        <DietBadgeGrid slug={params.slug} products={(products ?? []).map(p => ({
          id: p.id,
          name: p.name,
          is_vegan: p.is_vegan ?? false,
          is_vegetarian: p.is_vegetarian ?? false,
          is_gluten_free: p.is_gluten_free ?? false,
        }))} />
      </div>

      {/* Özel etiketler */}
      <p className="text-sm font-medium mb-3">Özel etiketler</p>
      <form action={boundAddTag} className="flex gap-2 mb-5 max-w-sm">
        <input
          name="name"
          placeholder="Yeni etiket (örn. Acılı, Yeni, Şefin seçimi)"
          required
          className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
        <button type="submit" className="text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md whitespace-nowrap">
          Ekle
        </button>
      </form>

      {(tags ?? []).length === 0 ? (
        <p className="text-sm text-gray-400">Henüz etiket yok</p>
      ) : (
        <TagAssignGrid
          slug={params.slug}
          tags={tags ?? []}
          products={(products ?? []).map(p => ({ id: p.id, name: p.name }))}
          productTags={productTags ?? []}
        />
      )}
    </div>
  );
}
