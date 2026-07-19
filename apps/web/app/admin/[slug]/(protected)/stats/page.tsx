import { createClient } from '@/lib/supabase/server';
import StatsClient from './StatsClient';

export const dynamic = 'force-dynamic';

export default async function StatsPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { days?: string };
}) {
  const supabase = createClient();
  const days = parseInt(searchParams.days ?? '30');

  const { data: tenant } = await supabase
    .from('tenants').select('id').eq('slug', params.slug).single();

  const tenantId = tenant!.id;
  const since = new Date(Date.now() - days * 86400000).toISOString();

  // Günlük menü görüntülenme
  const { data: viewEvents } = await supabase
    .from('analytics_events')
    .select('created_at')
    .eq('tenant_id', tenantId)
    .eq('event_type', 'menu_view')
    .gte('created_at', since);

  // Günlük ürün tıklama
  const { data: clickEvents } = await supabase
    .from('analytics_events')
    .select('created_at, product_id, products(name)')
    .eq('tenant_id', tenantId)
    .eq('event_type', 'product_click')
    .gte('created_at', since);

  // Görüşler
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating, comment, customer_name, created_at')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(20);

  // Günlük gruplama
  function groupByDay(events: { created_at: string }[]) {
    const map: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      map[key] = 0;
    }
    for (const e of events ?? []) {
      const key = e.created_at.slice(0, 10);
      if (key in map) map[key]++;
    }
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }

  const viewsByDay = groupByDay(viewEvents ?? []);
  const clicksByDay = groupByDay(clickEvents ?? []);

  // En çok tıklanan ürünler
  const productMap: Record<string, { name: string; count: number }> = {};
  for (const e of clickEvents ?? []) {
    const id = e.product_id as string;
    const name = (e.products as unknown as { name: string } | null)?.name ?? 'Bilinmiyor';
    if (!productMap[id]) productMap[id] = { name, count: 0 };
    productMap[id].count++;
  }
  const topProducts = Object.values(productMap).sort((a, b) => b.count - a.count).slice(0, 10);

  const avgRating = reviews?.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  return (
    <StatsClient
      slug={params.slug}
      days={days}
      viewsByDay={viewsByDay}
      clicksByDay={clicksByDay}
      topProducts={topProducts}
      reviews={reviews ?? []}
      totalViews={viewEvents?.length ?? 0}
      totalClicks={clickEvents?.length ?? 0}
      avgRating={avgRating}
    />
  );
}
