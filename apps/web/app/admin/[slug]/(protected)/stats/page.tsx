import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function StatsPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single();

  const tenantId = tenant!.id;
  const now = new Date();
  const day7 = new Date(now.getTime() - 7 * 86400000).toISOString();
  const day30 = new Date(now.getTime() - 30 * 86400000).toISOString();

  const [
    { count: views7 },
    { count: views30 },
    { count: clicks7 },
    { data: topProducts },
    { data: reviews },
  ] = await Promise.all([
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId).eq('event_type', 'menu_view').gte('created_at', day7),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId).eq('event_type', 'menu_view').gte('created_at', day30),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId).eq('event_type', 'product_click').gte('created_at', day7),
    supabase.from('analytics_events').select('product_id, products(name)')
      .eq('tenant_id', tenantId).eq('event_type', 'product_click')
      .gte('created_at', day30).not('product_id', 'is', null),
    supabase.from('reviews').select('rating, comment, customer_name, created_at')
      .eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(10),
  ]);

  // Ürün tıklama sayılarını grupla
  const clickMap = new Map<string, { name: string; count: number }>();
  (topProducts ?? []).forEach((e) => {
    const productId = e.product_id as string | null;
    const products = e.products as { name: string }[] | { name: string } | null;
    if (!productId || !products) return;
    const productName = Array.isArray(products) ? products[0]?.name : products.name;
    if (!productName) return;
    const prev = clickMap.get(productId) ?? { name: productName, count: 0 };
    clickMap.set(productId, { ...prev, count: prev.count + 1 });
  });
  const sortedProducts = [...clickMap.values()].sort((a, b) => b.count - a.count).slice(0, 10);

  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div>
      <h2 className="text-base font-medium mb-5">İstatistik</h2>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Menü görüntülenme (7 gün)', value: views7 ?? 0, icon: '👁️' },
          { label: 'Menü görüntülenme (30 gün)', value: views30 ?? 0, icon: '📅' },
          { label: 'Ürün tıklaması (7 gün)', value: clicks7 ?? 0, icon: '👆' },
          { label: 'Ortalama puan', value: avgRating ? `${avgRating} ⭐` : '—', icon: '💬' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xl mb-1">{stat.icon}</p>
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* En çok tıklanan ürünler */}
        <div>
          <p className="text-sm font-medium mb-3">En çok görüntülenen ürünler (30 gün)</p>
          {sortedProducts.length === 0 ? (
            <p className="text-sm text-gray-400">Henüz veri yok</p>
          ) : (
            <div className="flex flex-col gap-2">
              {sortedProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{p.name}</p>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${Math.min(100, (p.count / sortedProducts[0].count) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{p.count} tık</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Son görüşler */}
        <div>
          <p className="text-sm font-medium mb-3">Son görüşler</p>
          {!reviews?.length ? (
            <p className="text-sm text-gray-400">Henüz görüş yok</p>
          ) : (
            <div className="flex flex-col gap-2">
              {reviews.map((r, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{r.customer_name ?? 'Anonim'}</span>
                    <span className="text-xs text-amber-500">{'⭐'.repeat(r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-xs text-gray-500">{r.comment}</p>}
                  <p className="text-[11px] text-gray-300 mt-1">
                    {new Date(r.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
