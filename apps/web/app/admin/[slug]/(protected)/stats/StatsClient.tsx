'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type DayStat = { date: string; count: number };

function BarChart({ data, color, label }: { data: DayStat[]; color: string; label: string }) {
  const max = Math.max(...data.map(d => d.count), 1);
  const show = data.length <= 30;

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <div className="flex items-end gap-px h-20 w-full">
        {data.map((d, i) => {
          const pct = (d.count / max) * 100;
          const isToday = d.date === new Date().toISOString().slice(0, 10);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
              <div
                className="w-full rounded-sm transition-all"
                style={{ height: `${Math.max(pct, d.count > 0 ? 4 : 1)}%`, background: isToday ? color : color + '99' }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                {d.count} · {d.date.slice(5)}
              </div>
            </div>
          );
        })}
      </div>
      {show && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400">{data[0]?.date.slice(5)}</span>
          <span className="text-[10px] text-gray-400">{data[data.length - 1]?.date.slice(5)}</span>
        </div>
      )}
    </div>
  );
}

type Review = { rating: number; comment: string | null; customer_name: string | null; created_at: string };

export default function StatsClient({
  slug, days, viewsByDay, clicksByDay, topProducts, reviews, totalViews, totalClicks, avgRating,
}: {
  slug: string;
  days: number;
  viewsByDay: DayStat[];
  clicksByDay: DayStat[];
  topProducts: { name: string; count: number }[];
  reviews: Review[];
  totalViews: number;
  totalClicks: number;
  avgRating: number | null;
}) {
  const router = useRouter();

  function setDays(d: number) {
    router.push(`/admin/${slug}/stats?days=${d}`);
  }

  const stars = (n: number) => '⭐'.repeat(n);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-medium">İstatistik</h2>
        <div className="flex gap-1">
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setDays(d)}
              className={`text-xs px-2.5 py-1 rounded-md ${days === d ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {d} gün
            </button>
          ))}
        </div>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: `Görüntülenme (${days} gün)`, value: totalViews.toLocaleString('tr-TR'), icon: '👁️' },
          { label: `Ürün tıklaması (${days} gün)`, value: totalClicks.toLocaleString('tr-TR'), icon: '👆' },
          { label: 'Toplam görüş', value: reviews.length, icon: '💬' },
          { label: 'Ortalama puan', value: avgRating ? `${avgRating.toFixed(1)} ⭐` : '—', icon: '🏆' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-lg mb-1">{s.icon}</p>
            <p className="text-xl font-semibold">{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <BarChart data={viewsByDay} color="#e11d48" label="Günlük menü görüntülenme" />
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <BarChart data={clicksByDay} color="#7c3aed" label="Günlük ürün tıklaması" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* En çok tıklanan ürünler */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium mb-3">En çok görüntülenen ürünler</p>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400">Henüz veri yok</p>
          ) : (
            <div className="flex flex-col gap-2">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-5 text-right flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm truncate">{p.name}</p>
                      <span className="text-xs text-gray-500 flex-shrink-0">{p.count}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${(p.count / topProducts[0].count) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Son görüşler */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium mb-3">Son görüşler</p>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400">Henüz görüş yok</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {reviews.map((r, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium">{r.customer_name ?? 'Anonim'}</span>
                    <span className="text-xs">{stars(r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-xs text-gray-500">{r.comment}</p>}
                  <p className="text-[10px] text-gray-300 mt-1">
                    {new Date(r.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
