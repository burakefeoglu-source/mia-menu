import { createClient } from '@/lib/supabase/server';
import ThemePicker from '@/components/ThemePicker';
import SectionStyleList from '@/components/SectionStyleList';
import LayoutPicker from '@/components/LayoutPicker';
import SectionNavPicker from '@/components/SectionNavPicker';

export const dynamic = 'force-dynamic';

export default async function DesignPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, theme_color, menu_layout, section_nav')
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
      <p className="text-xs text-gray-500 mb-6">
        Değişiklikler otomatik kaydedilir, sağdaki canlı önizlemeden kontrol edebilirsin.
      </p>

      <div className="mb-8">
        <p className="text-sm font-medium mb-1">Menü düzeni</p>
        <p className="text-xs text-gray-400 mb-3">Genel görünüm şablonu</p>
        <LayoutPicker
          tenantId={tenant!.id}
          slug={params.slug}
          initialLayout={(tenant!.menu_layout as 'classic' | 'dark' | 'minimal') ?? 'classic'}
        />
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium mb-1">Bölüm navigasyonu</p>
        <p className="text-xs text-gray-400 mb-3">Müşteri menüye girdiğinde bölümleri nasıl görsün?</p>
        <SectionNavPicker
          tenantId={tenant!.id}
          slug={params.slug}
          initialNav={(tenant!.section_nav as 'tabs' | 'grid') ?? 'tabs'}
        />
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium mb-1">Renk teması</p>
        <p className="text-xs text-gray-400 mb-3">Butonlar, seçili durum ve vurgu rengi</p>
        <ThemePicker tenantId={tenant!.id} slug={params.slug} initialTheme={tenant!.theme_color} />
      </div>

      <div>
        <p className="text-sm font-medium mb-1">Bölüm iç tasarımı</p>
        <p className="text-xs text-gray-400 mb-3">Her bölümün ürünleri nasıl listelensin?</p>
        <SectionStyleList slug={params.slug} sections={sections ?? []} />
      </div>
    </div>
  );
}
