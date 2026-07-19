import { createClient } from '@/lib/supabase/server';
import LanguageEditor from './LanguageEditor';

export const dynamic = 'force-dynamic';

export default async function LanguagePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: tenant } = await supabase
    .from('tenants').select('*').eq('slug', params.slug).single();

  const { data: products } = await supabase
    .from('products').select('id, name, description')
    .eq('tenant_id', tenant!.id).order('sort_order');

  const { data: sections } = await supabase
    .from('menu_sections').select('id, name')
    .eq('tenant_id', tenant!.id).order('sort_order');

  const { data: translations } = await supabase
    .from('translations').select('*')
    .eq('tenant_id', tenant!.id);

  const enabledLocales: string[] = (tenant as { enabled_locales?: string[] }).enabled_locales ?? ['tr'];

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Dil ayarları</h2>
      <p className="text-xs text-gray-500 mb-5">Müşteri menüsünde hangi dillerin gösterileceğini seçin.</p>
      <LanguageEditor
        tenantId={tenant!.id}
        slug={params.slug}
        enabledLocales={enabledLocales}
        products={products ?? []}
        sections={sections ?? []}
        translations={translations ?? []}
        hasAnthropicKey={!!process.env.ANTHROPIC_API_KEY}
      />
    </div>
  );
}
