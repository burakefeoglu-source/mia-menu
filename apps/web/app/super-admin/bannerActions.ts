'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const SUPER_ADMIN_EMAIL = 'burak.efeoglu@gmail.com';

async function checkAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== SUPER_ADMIN_EMAIL) throw new Error('Yetkisiz');
  return supabase;
}

export async function addBannerAction(formData: FormData) {
  const supabase = await checkAdmin();
  const text = formData.get('text') as string;
  const bg_color = formData.get('bg_color') as string;
  if (!text?.trim()) return;
  await supabase.from('admin_banners').insert({ text: text.trim(), bg_color });
  revalidatePath('/super-admin');
}

export async function toggleBannerAction(id: string, is_active: boolean) {
  const supabase = await checkAdmin();
  await supabase.from('admin_banners').update({ is_active }).eq('id', id);
  revalidatePath('/super-admin');
}

export async function deleteBannerAction(id: string) {
  const supabase = await checkAdmin();
  await supabase.from('admin_banners').delete().eq('id', id);
  revalidatePath('/super-admin');
}
