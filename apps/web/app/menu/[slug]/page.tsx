import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MenuClient from './MenuClient';

export const dynamic = 'force-dynamic';

export default async function MenuPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!tenant) {
    notFound();
  }

  const { data: sections } = await supabase
    .from('menu_sections')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .eq('is_active', true)
    .order('sort_order');

  const { data: products } = await supabase
    .from('products')
    .select('*, product_allergens(allergens(code, name_tr, name_en)), product_tags(tags(name))')
    .eq('tenant_id', tenant!.id)
    .eq('is_active', true)
    .order('sort_order');

  const now = new Date().toISOString();
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .eq('is_active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order('created_at', { ascending: false })
    .limit(1);

  const { data: translations } = await supabase
    .from('translations')
    .select('entity_type, entity_id, value')
    .eq('tenant_id', tenant!.id)
    .eq('locale', 'en')
    .eq('field', 'name');

  return (
    <MenuClient
      tenant={tenant!}
      sections={sections ?? []}
      products={products ?? []}
      announcement={announcements?.[0] ?? null}
      translations={translations ?? []}
    />
  );
}
