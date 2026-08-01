import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'Dosya gerekli' }, { status: 400 });

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Sadece PDF, JPEG veya PNG desteklenir' }, { status: 400 });
    }
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'Maksimum dosya boyutu 20MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const isPdf = file.type === 'application/pdf';

    const SYSTEM = `Sen bir restoran menüsü analiz uzmanısın. Verilen görsel veya PDF'ten menü içeriğini çıkar ve SADECE geçerli JSON döndür, başka hiçbir şey yazma.

JSON formatı:
{
  "sections": [
    {
      "name": "Bölüm Adı",
      "products": [
        {
          "name": "Ürün Adı",
          "price": 150,
          "description": "Malzeme ve açıklama",
          "calories": 320,
          "allergens": ["gluten", "milk", "egg"]
        }
      ]
    }
  ]
}

Kurallar:
- Fiyatlar sayı olmalı (₺, TL, $ işaretleri olmadan)
- Kalori tahmini yap (yoksa ortalama hesapla)
- Alerjenler: gluten, milk, egg, nuts, sesame, soy, fish, shellfish, peanuts, celery, mustard, sulphites, lupin, molluscs
- Tüm ürünleri eksiksiz çıkar
- Bölümler mantıklı gruplanmış olmalı
- Açıklama yoksa malzemeleri tahmin et
- Sadece JSON çıktısı ver`;

    const userContent = isPdf
      ? [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
          { type: 'text', text: 'Bu menü PDF dosyasındaki tüm ürünleri çıkar.' },
        ]
      : [
          { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
          { type: 'text', text: 'Bu menü görselindeki tüm ürünleri çıkar.' },
        ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: SYSTEM,
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Claude API hatası: ${err}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';

    // JSON temizle
    const clean = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      return NextResponse.json({ error: 'Menü okunamadı, lütfen daha net bir görsel deneyin.' }, { status: 422 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('AI import error:', err);
    return NextResponse.json({ error: 'Beklenmedik hata' }, { status: 500 });
  }
}
