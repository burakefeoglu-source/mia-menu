import { createClient } from '@/lib/supabase/server';
import SettingsForm from './SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: tenant } = await supabase
    .from('tenants').select('*').eq('slug', params.slug).single();

  return (
    <div>
      <h2 className="text-base font-medium mb-4">İşletme ayarları</h2>
      <SettingsForm tenant={tenant!} slug={params.slug} />
    </div>
  );
}
