'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

async function getAdminClient() {
  // Oturum kontrolü
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== 'burak.efeoglu@gmail.com') throw new Error('Yetkisiz');

  // RLS bypass için service role client
  const adminClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  return adminClient;
}

// Abonelik aktif et
export async function activateSubscription(tenantId: string, months: number) {
  const db = await getAdminClient();
  const now = new Date();
  const expires = new Date(now.getTime() + months * 30 * 86400000);
  await db.from('subscriptions').upsert({
    tenant_id: tenantId,
    status: 'active',
    plan: 'yearly',
    plan_starts_at: now.toISOString(),
    plan_expires_at: expires.toISOString(),
  }, { onConflict: 'tenant_id' });
  revalidatePath('/super-admin');
}

// Trial uzat
export async function extendTrial(tenantId: string, days: number) {
  const db = await getAdminClient();
  const { data: sub } = await db
    .from('subscriptions').select('trial_ends_at').eq('tenant_id', tenantId).maybeSingle();
  const base = sub?.trial_ends_at ? new Date(sub.trial_ends_at) : new Date();
  if (base < new Date()) base.setTime(new Date().getTime());
  const newEnd = new Date(base.getTime() + days * 86400000);
  await db.from('subscriptions').upsert({
    tenant_id: tenantId,
    status: 'trialing',
    trial_ends_at: newEnd.toISOString(),
  }, { onConflict: 'tenant_id' });
  revalidatePath('/super-admin');
}

// Pasif/aktif yap
export async function toggleTenantActive(tenantId: string, active: boolean) {
  const db = await getAdminClient();
  await db.from('tenants').update({ is_active: active }).eq('id', tenantId);
  revalidatePath('/super-admin');
}

// Müşteri notu kaydet
export async function saveTenantNote(tenantId: string, note: string) {
  const db = await getAdminClient();
  await db.from('tenants').update({ admin_notes: note || null }).eq('id', tenantId);
  revalidatePath('/super-admin');
}

// Manuel işletme ekle
export async function createTenantManual(formData: FormData) {
  const db = await getAdminClient();

  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const password = (formData.get('password') as string);
  const phone = (formData.get('phone') as string)?.trim();
  const trialDays = parseInt(formData.get('trial_days') as string) || 5;

  if (!name || !email) return { error: 'Ad ve e-posta zorunlu' };

  const slug = name.toLowerCase()
    .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const { data: existing } = await db.from('tenants').select('id').eq('slug', slug).maybeSingle();
  if (existing) return { error: `"${slug}" slug zaten alınmış` };

  const { data: authData, error: authError } = await db.auth.admin.createUser({
    email,
    password: password || Math.random().toString(36).slice(-10),
    email_confirm: true,
  });
  if (authError || !authData.user) return { error: authError?.message ?? 'Kullanıcı oluşturulamadı' };

  const { data: tenant, error: tenantError } = await db.from('tenants').insert({
    slug, name, phone: phone || null,
    default_locale: 'tr', qr_style: 'square',
    theme_color: 'rose', menu_layout: 'classic',
    section_nav: 'tabs', is_active: true,
  }).select('id').single();

  if (tenantError || !tenant) return { error: `İşletme oluşturulamadı: ${tenantError?.message}` };

  await db.from('staff_users').insert({ user_id: authData.user.id, tenant_id: tenant.id, role: 'owner' });
  await db.from('subscriptions').insert({
    tenant_id: tenant.id, status: 'trialing',
    trial_ends_at: new Date(Date.now() + trialDays * 86400000).toISOString(),
  });
  await db.from('menu_sections').insert([
    { tenant_id: tenant.id, name: 'Başlangıçlar', sort_order: 1 },
    { tenant_id: tenant.id, name: 'Ana Yemekler', sort_order: 2 },
    { tenant_id: tenant.id, name: 'İçecekler', sort_order: 3 },
  ]);

  revalidatePath('/super-admin');
  return { success: true, slug };
}
