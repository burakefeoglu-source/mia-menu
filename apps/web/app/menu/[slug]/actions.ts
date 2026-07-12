'use server';

import { createClient } from '@/lib/supabase/server';
import { sendWhatsApp } from '@/lib/whatsapp';

export async function submitReview(params: {
  tenantId: string;
  customerName: string;
  rating: number;
  comment: string;
}) {
  const supabase = createClient();

  const { error } = await supabase.from('reviews').insert({
    tenant_id: params.tenantId,
    customer_name: params.customerName || null,
    rating: params.rating,
    comment: params.comment || null,
  });

  if (error) {
    return { error: 'Görüşünüz gönderilemedi, lütfen tekrar deneyin.' };
  }

  // WhatsApp bildirimi
  const { data: tenant } = await supabase
    .from('tenants')
    .select('name, notification_phone, callmebot_api_key')
    .eq('id', params.tenantId)
    .maybeSingle();

  if (tenant?.notification_phone && tenant?.callmebot_api_key) {
    const stars = '⭐'.repeat(params.rating);
    const name = params.customerName ? `*${params.customerName}*` : 'Anonim';
    const comment = params.comment ? `\n"${params.comment}"` : '';
    const msg = `📩 mia.menu — Yeni Görüş\n${tenant.name}\n\n${stars} ${name}${comment}`;
    await sendWhatsApp(tenant.notification_phone, tenant.callmebot_api_key, msg);
  }

  return { success: true };
}
