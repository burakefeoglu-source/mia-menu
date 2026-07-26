import { NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const VALID_EVENTS = ['menu_view', 'product_click'] as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tenant_id, event_type, product_id } = body;

    // Validasyon
    if (!tenant_id || typeof tenant_id !== 'string' || tenant_id.length > 50) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (!VALID_EVENTS.includes(event_type)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const db = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Tenant var mı kontrol et
    const { data: tenant } = await db
      .from('tenants').select('id').eq('id', tenant_id).eq('is_active', true).maybeSingle();

    if (!tenant) return NextResponse.json({ ok: false }, { status: 404 });

    await db.from('analytics_events').insert({
      tenant_id,
      event_type,
      product_id: product_id || null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
