'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addBannerAction(formData: FormData) {
  const supabase = createClient();
  const text = (formData.get('text') as string)?.trim();
  const bg_color = (formData.get('bg_color') as string) || '#c2185b';
  if (!text) return;
  const { error } = await supabase.from('admin_banners').insert({ text, bg_color, is_active: true });
  if (error) console.error('Banner eklenemedi:', error);
  revalidatePath('/super-admin');
}

export async function toggleBannerAction(id: string, is_active: boolean) {
  const supabase = createClient();
  await supabase.from('admin_banners').update({ is_active }).eq('id', id);
  revalidatePath('/super-admin');
}

export async function deleteBannerAction(id: string) {
  const supabase = createClient();
  await supabase.from('admin_banners').delete().eq('id', id);
  revalidatePath('/super-admin');
}
