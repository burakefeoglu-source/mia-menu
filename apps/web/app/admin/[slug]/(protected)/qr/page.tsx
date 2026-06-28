import QRCode from 'qrcode';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function QrPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single();

  const { data: tables } = await supabase
    .from('tables')
    .select('*')
    .eq('tenant_id', tenant!.id);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const entries: { label: string; qr_token: string | null }[] = [
    { label: 'Genel menü', qr_token: null },
    ...(tables ?? []).map((t) => ({ label: t.label, qr_token: t.qr_token })),
  ];

  const items = await Promise.all(
    entries.map(async (entry) => {
      const url = entry.qr_token
        ? `${baseUrl}/menu/${params.slug}?table=${entry.qr_token}`
        : `${baseUrl}/menu/${params.slug}`;
      const dataUrl = await QRCode.toDataURL(url, { width: 160, margin: 1 });
      return { label: entry.label, dataUrl };
    })
  );

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Karekod</h2>
      <p className="text-xs text-gray-500 mb-4">
        Genel menü QR&apos;ı ve masa bazlı QR kodları
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={item.label} className="border border-gray-200 rounded-md p-3 text-center">
            <img src={item.dataUrl} alt={item.label} className="mx-auto" />
            <p className="text-xs mt-2">{item.label}</p>
            <a
              href={item.dataUrl}
              download={`${item.label}.png`}
              className="text-xs text-rose-600 mt-1 inline-block"
            >
              İndir
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
