import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'products';

  if (!file) {
    return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Sadece görsel dosyası yüklenebilir.' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const compressed = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(filename, compressed, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (error || !data) {
      return NextResponse.json({ error: 'Yükleme başarısız oldu.' }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('menu-images').getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch {
    return NextResponse.json({ error: 'Görsel işlenirken hata oluştu.' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
