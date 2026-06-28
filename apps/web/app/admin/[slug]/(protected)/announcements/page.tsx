import { createClient } from '@/lib/supabase/server';
import { addAnnouncement, deleteAnnouncement, toggleAnnouncement } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function AnnouncementsPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single();

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .order('created_at', { ascending: false });

  const boundAdd = addAnnouncement.bind(null, tenant!.id, params.slug);

  return (
    <div>
      <h2 className="text-base font-medium mb-4">Duyurular</h2>

      <div className="flex flex-col gap-2 mb-5">
        {(announcements ?? []).map((a) => {
          const boundToggle = toggleAnnouncement.bind(null, a.id, params.slug, !a.is_active);
          const boundDelete = deleteAnnouncement.bind(null, a.id, params.slug);
          return (
            <div
              key={a.id}
              className="border border-gray-200 rounded-md p-3 flex justify-between items-start gap-3"
            >
              <div>
                <span className="text-[11px] uppercase text-gray-400">
                  {a.kind === 'poster' ? 'Poster' : 'Metin'}
                  {!a.is_active && ' · pasif'}
                </span>
                <p className="text-sm font-medium">{a.title}</p>
                {a.message && <p className="text-xs text-gray-500 mt-0.5">{a.message}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <form action={boundToggle}>
                  <button className="text-xs px-2 py-1 rounded-md bg-gray-100">
                    {a.is_active ? 'Pasif yap' : 'Aktif yap'}
                  </button>
                </form>
                <form action={boundDelete}>
                  <button className="text-xs px-2 py-1 rounded-md text-red-600">Sil</button>
                </form>
              </div>
            </div>
          );
        })}
        {(!announcements || announcements.length === 0) && (
          <p className="text-sm text-gray-400">Henüz duyuru yok</p>
        )}
      </div>

      <form
        action={boundAdd}
        className="flex flex-col gap-2 max-w-sm border-t border-gray-100 pt-4"
      >
        <label className="text-xs text-gray-500">Tür</label>
        <select name="kind" className="border border-gray-200 rounded-md px-3 py-1.5 text-sm">
          <option value="text">Metin duyuru</option>
          <option value="poster">Poster duyuru</option>
        </select>
        <input
          name="title"
          placeholder="Başlık"
          required
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
        <textarea
          name="message"
          placeholder="Mesaj"
          rows={2}
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
        <input
          name="image_url"
          placeholder="Görsel URL (poster için, opsiyonel)"
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          className="self-start text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md mt-1"
        >
          Duyuru ekle
        </button>
      </form>
    </div>
  );
}
