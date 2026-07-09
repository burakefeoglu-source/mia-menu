import { createClient } from '@/lib/supabase/server';
import ImportWizard from '@/components/ImportWizard';

export const dynamic = 'force-dynamic';

export default async function ImportPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single();

  return (
    <div>
      <h2 className="text-base font-medium mb-1">İçeri aktar</h2>
      <p className="text-xs text-gray-500 mb-5">
        Excel veya CSV dosyasından ürünlerinizi toplu olarak aktarın.
      </p>
      <ImportWizard tenantId={tenant!.id} slug={params.slug} />
    </div>
  );
}
