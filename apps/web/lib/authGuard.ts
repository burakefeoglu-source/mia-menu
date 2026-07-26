'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

/**
 * Kullanıcının belirtilen tenant'a erişim yetkisi olup olmadığını doğrular.
 * Yetkisiz erişimde hata fırlatır.
 */
export async function requireTenantAccess(tenantId: string): Promise<string> {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) throw new Error('Giriş yapmanız gerekiyor');

  // Service role ile staff_users kontrolü
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: staff } = await db
    .from('staff_users')
    .select('id')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .maybeSingle();

  if (!staff) throw new Error('Bu işletmeye erişim yetkiniz yok');

  return user.id;
}

/**
 * Super admin kontrolü
 */
export async function requireSuperAdmin(): Promise<string> {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) throw new Error('Giriş yapmanız gerekiyor');
  if (user.email !== process.env.SUPER_ADMIN_EMAIL && user.email !== 'burak.efeoglu@gmail.com') {
    throw new Error('Yetkisiz erişim');
  }

  return user.id;
}

export function getDb() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
