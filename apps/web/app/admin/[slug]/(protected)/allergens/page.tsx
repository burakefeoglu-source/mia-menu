import { createClient } from '@/lib/supabase/server';
import { addAllergen } from '../../actions';
import AllergenAssignGrid from '@/components/AllergenAssignGrid';
import { AllergenIcon } from '@/lib/allergenIcons';

export const dynamic = 'force-dynamic';

export default async function AllergensPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single();

  const { data: allergens } = await supabase
    .from('allergens')
    .select('*')
    .or(`tenant_id.is.null,tenant_id.eq.${tenant!.id}`)
    .order('tenant_id', { ascending: true })
    .order('name_tr');

  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .eq('tenant_id', tenant!.id)
    .order('sort_order');

  const { data: productAllergens } = await supabase
    .from('product_allergens')
    .select('product_id, allergen_id')
    .in('product_id', (products ?? []).map((p) => p.id));

  const boundAddAllergen = addAllergen.bind(null, tenant!.id, params.slug);

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Alerjen listesi</h2>
      <p className="text-xs text-gray-500 mb-3">
        İlk 8 tanesi yasal standart liste (silinemez). İstediğin kadar kendi alerjenini
        ekleyebilirsin.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2.5 mb-5">
        <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠️</span>
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Yasal zorunluluk:</strong> T.C. Tarım ve Orman Bakanlığı&apos;nın gıda mevzuatı
          uyarınca gıda işletmecileri, tüketicilere sundukları ürünlerdeki <strong>14 zorunlu
          alerjeni</strong> açıkça bildirmekle yükümlüdür. Her ürüne ilgili alerjenleri
          işaretlemeniz, hem yasal uyumu hem de müşteri güvenliğini sağlar.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(allergens ?? []).map((a) => (
          <span
            key={a.id}
            title={a.description ?? undefined}
            className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-md"
          >
            <span><AllergenIcon code={a.code} className="w-3.5 h-3.5" /></span>
            {a.name_tr}
          </span>
        ))}
      </div>

      <form action={boundAddAllergen} className="flex gap-2 mb-5 max-w-md">
        <input
          name="name_tr"
          placeholder="Yeni alerjen (örn. Hardal)"
          required
          className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
        <input
          name="name_en"
          placeholder="İngilizce (opsiyonel)"
          className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          className="text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md whitespace-nowrap"
        >
          Ekle
        </button>
      </form>

      {(products ?? []).length === 0 ? (
        <p className="text-sm text-gray-400">Önce ürün eklemen gerekiyor</p>
      ) : (
        <AllergenAssignGrid
          slug={params.slug}
          allergens={allergens ?? []}
          products={products ?? []}
          productAllergens={productAllergens ?? []}
        />
      )}
    </div>
  );
}
