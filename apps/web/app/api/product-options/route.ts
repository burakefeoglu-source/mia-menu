import { NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  if (!productId) return NextResponse.json([]);

  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: groups } = await db
    .from('product_option_groups')
    .select('*, product_option_items(*)')
    .eq('product_id', productId)
    .order('sort_order');

  return NextResponse.json((groups ?? []).map(g => ({
    ...g,
    items: (g.product_option_items ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
  })));
}
