import { createClient } from '@/lib/supabase/server';
import TranslationEditor from '@/components/TranslationEditor';

export const dynamic = 'force-dynamic';

export default async function LanguagePage({ params }: { params: { slug: string } }) {
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
    .select('id, name')
    .eq('tenant_id', tenant!.id)
    .order('sort_order');

  const { data: translations } = await supabase
    .from('translations')
    .select('entity_type, entity_id, value')
    .eq('tenant_id', tenant!.id)
    .eq('locale', 'en')
    .eq('field', 'name');

  const trMap = new Map(
    (translations ?? []).map((t) => [`${t.entity_type}:${t.entity_id}`, t.value])
  );

  const rows = [
    ...(sections ?? []).map((s) => ({
      entityType: 'section' as const,
      entityId: s.id,
      trLabel: s.name,
      initialEn: trMap.get(`section:${s.id}`) ?? '',
    })),
    ...(products ?? []).map((p) => ({
      entityType: 'product' as const,
      entityId: p.id,
      trLabel: p.name,
      initialEn: trMap.get(`product:${p.id}`) ?? '',
    })),
  ];

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Dil ayarları</h2>
      <p className="text-xs text-gray-500 mb-4">
        Bölüm ve ürün adlarının İngilizce karşılığını gir. Boş bırakılanlar müşteri menüsünde
        Türkçe görünür. (Açıklamalar şimdilik sadece Türkçe kalıyor.)
      </p>
      <TranslationEditor slug={params.slug} tenantId={tenant!.id} rows={rows} />
    </div>
  );
}
