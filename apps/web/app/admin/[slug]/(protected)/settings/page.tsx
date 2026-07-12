import { createClient } from '@/lib/supabase/server';
import { updateTenant } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', params.slug)
    .single();

  const boundUpdateTenant = updateTenant.bind(null, tenant!.id, params.slug);

  return (
    <div>
      <h2 className="text-base font-medium mb-4">İşletme ayarları</h2>
      <form action={boundUpdateTenant} className="flex flex-col gap-3 max-w-sm">
        <div>
          <label className="block text-xs text-gray-500 mb-1">İşletme adı</label>
          <input
            name="name"
            defaultValue={tenant!.name}
            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Telefon</label>
          <input
            name="phone"
            defaultValue={tenant!.phone ?? ''}
            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Adres</label>
          <textarea
            name="address"
            defaultValue={tenant!.address ?? ''}
            rows={2}
            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Mağaza fotoğrafı URL (müşteri menüsünün üstünde görünür)
          </label>
          <input
            name="cover_image_url"
            defaultValue={tenant!.cover_image_url ?? ''}
            placeholder="https://..."
            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Google yorum linki
          </label>
          <input
            name="google_review_url"
            defaultValue={(tenant as { google_review_url?: string })?.google_review_url ?? ''}
            placeholder="https://g.page/r/..."
            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Google İşletme profili → Yorumlar → &quot;Yorum al&quot; linki
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium mb-1">WhatsApp bildirim</p>
          <p className="text-xs text-gray-400 mb-3">
            Müşteri görüş bıraktığında mesaj alın.{' '}
            <a href="https://www.callmebot.com/blog/free-api-whatsapp-messages/" target="_blank" rel="noreferrer" className="text-rose-600 underline">CallMeBot kurulum →</a>
          </p>
          <div className="flex flex-col gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Telefon numarası</label>
              <input name="notification_phone"
                defaultValue={(tenant as { notification_phone?: string })?.notification_phone ?? ''}
                placeholder="905001234567 (+ olmadan)"
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">CallMeBot API key</label>
              <input name="callmebot_api_key"
                defaultValue={(tenant as { callmebot_api_key?: string })?.callmebot_api_key ?? ''}
                placeholder="CallMeBot'tan gelen API key"
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
            </div>
          </div>
        </div>

        <button type="submit" className="self-start text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md mt-1">
          Kaydet
        </button>
      </form>
    </div>
  );
}
