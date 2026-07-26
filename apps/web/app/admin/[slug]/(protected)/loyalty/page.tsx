import { createClient } from '@/lib/supabase/server';
import { createLoyaltyProgram, toggleLoyaltyProgram, deleteLoyaltyProgram } from '../../actions';
import LoyaltyStampPanel from './LoyaltyStampPanel';

export const dynamic = 'force-dynamic';

export default async function LoyaltyPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: tenant } = await supabase
    .from('tenants').select('id, name').eq('slug', params.slug).single();

  const { data: programs } = await supabase
    .from('loyalty_programs').select('*')
    .eq('tenant_id', tenant!.id).order('created_at');

  const { data: cards } = await supabase
    .from('loyalty_cards').select('*, loyalty_programs(name, required_stamps)')
    .eq('tenant_id', tenant!.id).order('created_at', { ascending: false });

  const boundCreate = createLoyaltyProgram.bind(null, tenant!.id, params.slug);

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Sadakat programı</h2>
      <p className="text-xs text-gray-500 mb-5">Dijital damga kartı ile müşteri bağlılığı oluşturun.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sol: Program yönetimi + damga */}
        <div>
          {/* Programlar */}
          <p className="text-sm font-medium mb-3">Programlar</p>
          <div className="flex flex-col gap-2 mb-4">
            {(programs ?? []).map(p => {
              const boundToggle = toggleLoyaltyProgram.bind(null, p.id, params.slug, !p.is_active);
              const boundDelete = deleteLoyaltyProgram.bind(null, p.id, params.slug);
              return (
                <div key={p.id} className={`border rounded-xl p-3 ${p.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {p.required_stamps} alımda → {p.reward_description}
                      </p>
                      {p.description && <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <form action={boundToggle}>
                        <button className={`text-xs px-2 py-1 rounded-md ${p.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.is_active ? 'Aktif' : 'Pasif'}
                        </button>
                      </form>
                      <form action={boundDelete}>
                        <button className="text-xs text-red-500">Sil</button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!programs || programs.length === 0) && (
              <p className="text-sm text-gray-400">Henüz program yok</p>
            )}
          </div>

          {/* Yeni program */}
          <form action={boundCreate} className="border border-dashed border-gray-200 rounded-xl p-3 flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-600">Yeni program ekle</p>
            <input name="name" placeholder="Program adı (örn: Kahve Kartı)" required
              className="border border-gray-200 rounded-md px-2 py-1.5 text-sm" />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[11px] text-gray-400">Kaç alımda ödül</label>
                <input name="required_stamps" type="number" defaultValue={10} min={2} max={50}
                  className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm mt-0.5" />
              </div>
              <div className="flex-1">
                <label className="text-[11px] text-gray-400">Ödül</label>
                <input name="reward_description" placeholder="1 bedava kahve" required
                  className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm mt-0.5" />
              </div>
            </div>
            <input name="description" placeholder="Açıklama (opsiyonel)"
              className="border border-gray-200 rounded-md px-2 py-1.5 text-sm" />
            <button type="submit" className="self-start text-xs bg-rose-600 text-white px-3 py-1.5 rounded-md">Ekle</button>
          </form>
        </div>

        {/* Sağ: Damga vur */}
        <div>
          <p className="text-sm font-medium mb-3">Damga vur</p>
          <LoyaltyStampPanel
            tenantId={tenant!.id}
            slug={params.slug}
            programs={(programs ?? []).filter(p => p.is_active)}
          />
        </div>
      </div>

      {/* Kart listesi */}
      <div className="mt-8">
        <p className="text-sm font-medium mb-3">Müşteri kartları ({cards?.length ?? 0})</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs text-gray-500 font-medium py-2 pr-4">Müşteri</th>
                <th className="text-left text-xs text-gray-500 font-medium py-2 pr-4">Program</th>
                <th className="text-center text-xs text-gray-500 font-medium py-2 pr-4">Damga</th>
                <th className="text-center text-xs text-gray-500 font-medium py-2">Tamamlanan</th>
              </tr>
            </thead>
            <tbody>
              {(cards ?? []).map(c => {
                const prog = c.loyalty_programs as { name: string; required_stamps: number } | null;
                return (
                  <tr key={c.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <p className="font-medium">{c.customer_name ?? '—'}</p>
                      <p className="text-xs text-gray-400">{c.customer_phone}</p>
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-600">{prog?.name ?? '—'}</td>
                    <td className="py-2 pr-4 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        {Array.from({ length: prog?.required_stamps ?? 10 }).map((_, i) => (
                          <span key={i} className={`w-2 h-2 rounded-full ${i < c.stamps ? 'bg-rose-500' : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{c.stamps}/{prog?.required_stamps ?? 10}</p>
                    </td>
                    <td className="py-2 text-center">
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">{c.completed_count}x</span>
                    </td>
                  </tr>
                );
              })}
              {(!cards || cards.length === 0) && (
                <tr><td colSpan={4} className="py-4 text-center text-sm text-gray-400">Henüz müşteri yok</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
