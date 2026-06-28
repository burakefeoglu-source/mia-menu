import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ReportsPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const { data: todayOrders } = await supabase
    .from('orders')
    .select('total, status, order_type')
    .eq('tenant_id', tenant!.id)
    .gte('created_at', startOfToday.toISOString());

  const orders = todayOrders ?? [];
  const completed = orders.filter((o) => o.status !== 'cancelled');
  const revenue = completed.reduce((sum, o) => sum + Number(o.total), 0);
  const dineIn = orders.filter((o) => o.order_type === 'dine_in').length;
  const takeaway = orders.filter((o) => o.order_type === 'takeaway').length;
  const cancelled = orders.filter((o) => o.status === 'cancelled').length;

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Raporlar</h2>
      <p className="text-xs text-gray-500 mb-4">Bugünün özeti</p>

      <div className="grid grid-cols-2 gap-3 max-w-sm">
        <div className="border border-gray-200 rounded-md p-3">
          <p className="text-xs text-gray-500">Toplam sipariş</p>
          <p className="text-lg font-medium">{orders.length}</p>
        </div>
        <div className="border border-gray-200 rounded-md p-3">
          <p className="text-xs text-gray-500">Toplam ciro</p>
          <p className="text-lg font-medium">{revenue.toFixed(0)} ₺</p>
        </div>
        <div className="border border-gray-200 rounded-md p-3">
          <p className="text-xs text-gray-500">Masada</p>
          <p className="text-lg font-medium">{dineIn}</p>
        </div>
        <div className="border border-gray-200 rounded-md p-3">
          <p className="text-xs text-gray-500">Paket</p>
          <p className="text-lg font-medium">{takeaway}</p>
        </div>
        <div className="border border-gray-200 rounded-md p-3 col-span-2">
          <p className="text-xs text-gray-500">İptal edilen</p>
          <p className="text-lg font-medium">{cancelled}</p>
        </div>
      </div>
    </div>
  );
}
