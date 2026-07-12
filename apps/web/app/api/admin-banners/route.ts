import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const SUPER_ADMIN_EMAIL = 'burak.efeoglu@gmail.com';

async function checkAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== SUPER_ADMIN_EMAIL) return null;
  return supabase;
}

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase
    .from('admin_banners')
    .select('*')
    .order('created_at', { ascending: false });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = await checkAdmin();
  if (!supabase) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const { text, bg_color } = await req.json();
  await supabase.from('admin_banners').insert({ text, bg_color });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const supabase = await checkAdmin();
  if (!supabase) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const { id, is_active } = await req.json();
  await supabase.from('admin_banners').update({ is_active }).eq('id', id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const supabase = await checkAdmin();
  if (!supabase) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const { id } = await req.json();
  await supabase.from('admin_banners').delete().eq('id', id);
  return NextResponse.json({ ok: true });
}
