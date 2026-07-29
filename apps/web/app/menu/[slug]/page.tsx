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
    .select('*, product_allergens(allergens(code, name_tr, name_en)), product_tags(tags(name, icon)), product_option_groups(id, name, is_required, product_option_items(id, name, price, is_default, sort_order))')
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
    .order('created_at', { ascending: false });

  const { data: translations } = await supabase
    .from('translations')
    .select('entity_type, entity_id, value')
    .eq('tenant_id', tenant!.id)
    .eq('locale', 'en')
    .eq('field', 'name');

  const { data: loyaltyPrograms } = await supabase
    .from('loyalty_programs')
    .select('id, name, required_stamps, reward_description')
    .eq('tenant_id', tenant!.id)
    .eq('is_active', true)
    .limit(1);

  const { data: menuSets } = await supabase
    .from('menu_sets')
    .select('*, menu_set_items(id, quantity, products(id, name, price, image_url))')
    .eq('tenant_id', tenant!.id)
    .eq('is_active', true)
    .order('sort_order');

  return (
    <MenuClient
      tenant={tenant!}
      sections={sections ?? []}
      products={products ?? []}
      announcements={announcements ?? []}
      translations={translations ?? []}
      loyaltyProgram={loyaltyPrograms?.[0] ?? null}
      menuSets={menuSets ?? []}
    />
  );
}
