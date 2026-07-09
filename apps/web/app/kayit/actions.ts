'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export type RegisterResult = {
  error?: string;
  fieldError?: Record<string, string>;
};

export async function registerRestaurant(
  _prev: RegisterResult,
  formData: FormData
): Promise<RegisterResult> {
  const businessName = (formData.get('business_name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('password_confirm') as string;
  const phone = (formData.get('phone') as string)?.trim();

  const fieldErrors: Record<string, string> = {};
  if (!businessName) fieldErrors.business_name = 'İşletme adı zorunlu';
  if (!email || !email.includes('@')) fieldErrors.email = 'Geçerli e-posta girin';
  if (!password || password.length < 8) fieldErrors.password = 'Şifre en az 8 karakter olmalı';
  if (password !== passwordConfirm) fieldErrors.password_confirm = 'Şifreler eşleşmiyor';

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldError: fieldErrors };
  }

  const supabase = createClient();
  const slug = slugify(businessName);

  const { data: existing } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (existing) {
    return {
      fieldError: {
        business_name: `"${slug}" adresi zaten alınmış. Farklı bir işletme adı dene.`,
      },
    };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { business_name: businessName, phone },
    },
  });

  if (authError || !authData.user) {
    if (authError?.message?.includes('already registered')) {
      return { fieldError: { email: 'Bu e-posta zaten kayıtlı.' } };
    }
    return { error: 'Hesap oluşturulamadı: ' + (authError?.message ?? 'Bilinmeyen hata') };
  }

  const userId = authData.user.id;

  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .insert({ slug, name: businessName, phone: phone || null, default_locale: 'tr' })
    .select('id')
    .single();

  if (tenantError || !tenant) {
    return { error: 'İşletme kaydı oluşturulamadı.' };
  }

  await supabase.from('staff_users').insert({ user_id: userId, tenant_id: tenant.id, role: 'owner' });
  await supabase.from('subscriptions').insert({ tenant_id: tenant.id, status: 'trialing' });
  await supabase.from('menu_sections').insert([
    { tenant_id: tenant.id, name: 'Başlangıçlar', sort_order: 1 },
    { tenant_id: tenant.id, name: 'Ana Yemekler', sort_order: 2 },
    { tenant_id: tenant.id, name: 'İçecekler', sort_order: 3 },
  ]);

  redirect(`/admin/${slug}`);
}
