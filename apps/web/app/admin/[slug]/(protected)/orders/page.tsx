import { createClient } from '@/lib/supabase/server';
import { updateOrderStatus } from '../../actions';
import type { Order, OrderItem, OrderStatus } from '@/types/database';

export const dynamic = 'force-dynamic';

const statusLabels: Record<OrderStatus, string> = {
  new: 'Yeni',
  preparing: 'Hazırlanıyor',
  ready: 'Hazır',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  new: 'preparing',
  preparing: 'ready',
  ready: 'completed',
  completed: null,
  cancelled: null,
};

export default async function OrdersPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { type?: string };
}) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single();

  let query = supabase
    .from('orders')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (searchParams.type === 'dine_in' || searchParams.type === 'takeaway') {
    query = query.eq('order_type', searchParams.type);
  }

  const { data: orders } = await query;

  const orderIds = (orders ?? []).map((o) => o.id);
  const { data: items } = orderIds.length
    ? await supabase.from('order_items').select('*').in('order_id', orderIds)
    : { data: [] as OrderItem[] };

  const itemsByOrder = new Map<string, OrderItem[]>();
  (items ?? []).forEach((it) => {
    const list = itemsByOrder.get(it.order_id) ?? [];
    list.push(it);
    itemsByOrder.set(it.order_id, list);
  });

  const title =
    searchParams.type === 'dine_in'
      ? 'Mekanda siparişler'
      : searchParams.type === 'takeaway'
        ? 'Paket siparişler'
        : 'Tüm siparişler';

  return (
    <div>
      <h2 className="text-base font-medium mb-4">{title}</h2>

      <div className="flex flex-col gap-3">
        {(orders ?? []).map((order: Order) => {
          const lines = itemsByOrder.get(order.id) ?? [];
          const next = nextStatus[order.status];
          const boundAdvance = next
            ? updateOrderStatus.bind(null, order.id, params.slug, next)
            : null;
          const boundCancel = updateOrderStatus.bind(null, order.id, params.slug, 'cancelled');

          return (
            <div key={order.id} className="border border-gray-200 rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium">
                    {order.order_type === 'dine_in' ? 'Masada' : 'Paket'}
                    {order.table_note ? ` · Masa ${order.table_note}` : ''}
                    {order.customer_name ? ` · ${order.customer_name}` : ''}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {new Date(order.created_at).toLocaleString('tr-TR')}
                  </p>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
                  {statusLabels[order.status]}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                {lines.map((l) => (
                  <p key={l.id}>
                    {l.quantity}× {l.product_name}
                  </p>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{order.total} ₺</span>
                <div className="flex gap-2">
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <form action={boundCancel}>
                      <button className="text-xs text-red-600 px-2 py-1">İptal</button>
                    </form>
                  )}
                  {boundAdvance && (
                    <form action={boundAdvance}>
                      <button className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded-md">
                        {statusLabels[next!]} yap
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {(!orders || orders.length === 0) && (
          <p className="text-sm text-gray-400">Henüz sipariş yok</p>
        )}
      </div>
    </div>
  );
}
