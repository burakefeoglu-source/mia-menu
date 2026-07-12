import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { tenant_id, event_type, product_id } = await req.json();
    if (!tenant_id || !event_type) return NextResponse.json({ ok: false });

    const supabase = createClient();
    await supabase.from('analytics_events').insert({
      tenant_id,
      event_type,
      product_id: product_id || null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
