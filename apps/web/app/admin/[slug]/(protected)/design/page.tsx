import { createClient } from '@/lib/supabase/server';
import ThemePicker from '@/components/ThemePicker';
import SectionStyleList from '@/components/SectionStyleList';

export const dynamic = 'force-dynamic';

export default async function DesignPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, theme_color')
    .eq('slug', params.slug)
    .single();

  const { data: sections } = await supabase
    .from('menu_sections')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .order('sort_order');

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Menü tasarım</h2>
      <p className="text-xs text-gray-500 mb-5">
        Değişiklikler otomatik kaydedilir, sağdaki canlı önizlemeden kontrol edebilirsin.
      </p>

      <div className="mb-8">
        <p className="text-sm font-medium mb-2">Renk teması</p>
        <ThemePicker tenantId={tenant!.id} slug={params.slug} initialTheme={tenant!.theme_color} />
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Bölüm iç tasarımı</p>
        <SectionStyleList slug={params.slug} sections={sections ?? []} />
      </div>
    </div>
  );
}
