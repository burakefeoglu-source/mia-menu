import { createClient } from '@/lib/supabase/server';
import ImportWizard from '@/components/ImportWizard';
import AIImport from './AIImport';

export const dynamic = 'force-dynamic';

export default async function ImportPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: tenant } = await supabase
    .from('tenants').select('id').eq('slug', params.slug).single();

  return (
    <div>
      <h2 className="text-base font-medium mb-1">İçeri aktar</h2>
      <p className="text-xs text-gray-500 mb-5">
        Excel/CSV ile veya menü görselinizi yapay zekaya okutarak aktarın.
      </p>

      <div className="mb-10">
        <p className="text-sm font-medium text-rose-600 mb-3">✨ AI ile aktar — PDF / JPEG / PNG</p>
        <AIImport tenantId={tenant!.id} slug={params.slug} />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <p className="text-sm font-medium mb-3">Excel / CSV ile aktar</p>
        <ImportWizard tenantId={tenant!.id} slug={params.slug} />
      </div>
    </div>
  );
}
