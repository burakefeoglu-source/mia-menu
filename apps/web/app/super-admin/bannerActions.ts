'use server';

import { createClient as createServiceClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

function getDb() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function addBannerAction(formData: FormData) {
  const db = getDb();
  const text = (formData.get('text') as string)?.trim();
  const bg_color = (formData.get('bg_color') as string) || '#c2185b';
  if (!text) return;
  await db.from('admin_banners').insert({ text, bg_color, is_active: true });
  revalidatePath('/super-admin');
}

export async function toggleBannerAction(id: string, is_active: boolean) {
  const db = getDb();
  await db.from('admin_banners').update({ is_active }).eq('id', id);
  revalidatePath('/super-admin');
}

export async function deleteBannerAction(id: string) {
  const db = getDb();
  await db.from('admin_banners').delete().eq('id', id);
  revalidatePath('/super-admin');
}
