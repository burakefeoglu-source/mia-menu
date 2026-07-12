import { createClient } from '@/lib/supabase/server';
import { addTag } from '../../actions';
import TagAssignGrid from '@/components/TagAssignGrid';

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
    .select('id, name')
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
      <p className="text-xs text-gray-500 mb-5">
        Etiketler menüde ürünün isminin yanında görünür. İkonu olan etiketler sadece ikon olarak, olmayanlar metin olarak gösterilir.
      </p>

      <form action={boundAddTag} className="flex gap-2 mb-5 max-w-sm">
        <input
          name="icon"
          placeholder="🌱"
          maxLength={4}
          className="w-14 border border-gray-200 rounded-md px-2 py-1.5 text-sm text-center"
        />
        <input
          name="name"
          placeholder="Etiket adı (örn. Vegan, Acılı, Yeni)"
          required
          className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
        <button type="submit" className="text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md whitespace-nowrap">
          Ekle
        </button>
      </form>

      <p className="text-xs text-gray-400 mb-4">
        💡 İkon alanı opsiyonel. Emoji girerek 🌱 Vegan, 🌶️ Acılı, 🌾 Glutensiz gibi etiketler oluşturabilirsin.
      </p>

      {(tags ?? []).length === 0 ? (
        <p className="text-sm text-gray-400">Henüz etiket yok</p>
      ) : (
        <TagAssignGrid
          slug={params.slug}
          tags={tags ?? []}
          products={products ?? []}
          productTags={productTags ?? []}
        />
      )}
    </div>
  );
}
