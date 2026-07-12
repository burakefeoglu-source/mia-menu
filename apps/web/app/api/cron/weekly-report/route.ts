import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendWhatsApp } from '@/lib/whatsapp';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  const supabase = createClient();
  const week7 = new Date(Date.now() - 7 * 86400000).toISOString();

  const { data: tenants } = await supabase
    .from('tenants')
    .select('id, name, notification_phone, callmebot_api_key')
    .not('notification_phone', 'is', null)
    .not('callmebot_api_key', 'is', null);

  for (const tenant of tenants ?? []) {
    const [{ count: views }, { data: reviews }] = await Promise.all([
      supabase.from('analytics_events').select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id).eq('event_type', 'menu_view').gte('created_at', week7),
      supabase.from('reviews').select('rating')
        .eq('tenant_id', tenant.id).gte('created_at', week7),
    ]);

    const reviewCount = reviews?.length ?? 0;
    const avgRating = reviewCount
      ? (reviews!.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(1)
      : null;

    const msg = [
      `📊 mia.menu — Haftalık Özet`,
      `${tenant.name}`,
      ``,
      `👁️ Menü görüntülenme: ${views ?? 0}`,
      `💬 Yeni görüş: ${reviewCount}`,
      avgRating ? `⭐ Ortalama puan: ${avgRating}` : null,
      ``,
      `mia.menu tarafından gönderildi`,
    ].filter(Boolean).join('\n');

    await sendWhatsApp(tenant.notification_phone!, tenant.callmebot_api_key!, msg);
  }

  return NextResponse.json({ ok: true, sent: tenants?.length ?? 0 });
}
