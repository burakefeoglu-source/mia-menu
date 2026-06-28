'use server';

import { createClient } from '@/lib/supabase/server';

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

  return { success: true };
}
