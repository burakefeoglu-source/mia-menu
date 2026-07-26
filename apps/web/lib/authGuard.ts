'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function requireTenantAccess(tenantId: string): Promise<string> {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Giriş yapmanız gerekiyor');
  return user.id;
}

export async function requireSuperAdmin(): Promise<string> {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Giriş yapmanız gerekiyor');
  if (user.email !== 'burak.efeoglu@gmail.com') throw new Error('Yetkisiz erişim');
  return user.id;
}

export function getServiceDb() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
