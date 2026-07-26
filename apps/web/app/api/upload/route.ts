import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import sharp from 'sharp';

const ALLOWED_FOLDERS = ['products', 'logos', 'covers', 'announcements', 'qr'];
const MAX_SIZE_MB = 10;

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'products';

  if (!file) return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400 });

  // Dosya tipi kontrolü
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic'];
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Sadece JPEG, PNG, WebP görsel yüklenebilir.' }, { status: 400 });
  }

  // Dosya boyutu kontrolü
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `Maksimum dosya boyutu ${MAX_SIZE_MB}MB.` }, { status: 400 });
  }

  // Folder güvenlik kontrolü (path traversal önlemi)
  if (!ALLOWED_FOLDERS.includes(folder) || folder.includes('..') || folder.includes('/')) {
    return NextResponse.json({ error: 'Geçersiz klasör.' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const compressed = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    // Güvenli dosya adı — sadece alfanümerik
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(filename, compressed, { contentType: 'image/webp', upsert: false });

    if (error || !data) return NextResponse.json({ error: 'Yükleme başarısız.' }, { status: 500 });

    const { data: { publicUrl } } = supabase.storage.from('menu-images').getPublicUrl(data.path);
    return NextResponse.json({ url: publicUrl });
  } catch {
    return NextResponse.json({ error: 'Görsel işlenirken hata oluştu.' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
