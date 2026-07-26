'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Program = { id: string; name: string; required_stamps: number; reward_description: string; description: string | null };
type CardData = { stamps: number; completed_count: number; program: Program };

export default function KartClient({
  tenantId, programs,
}: { tenantId: string; programs: Program[] }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<CardData[] | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function lookup() {
    if (!phone.trim()) return;
    setLoading(true);
    setNotFound(false);
    setCards(null);

    const supabase = createClient();
    const { data } = await supabase
      .from('loyalty_cards')
      .select('stamps, completed_count, program_id')
      .eq('tenant_id', tenantId)
      .eq('customer_phone', phone.trim());

    if (!data || data.length === 0) {
      setNotFound(true);
    } else {
      const result: CardData[] = data.map(c => ({
        stamps: c.stamps,
        completed_count: c.completed_count,
        program: programs.find(p => p.id === c.program_id)!,
      })).filter(c => c.program);
      setCards(result);
    }
    setLoading(false);
  }

  return (
    <div>
      {/* Telefon sorgulama */}
      {!cards && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-medium mb-3">Kartını sorgula</p>
          <div className="flex gap-2">
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && lookup()}
              placeholder="Telefon numarası"
              type="tel"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <button onClick={lookup} disabled={loading || !phone.trim()}
              className="bg-rose-600 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50">
              {loading ? '...' : 'Ara'}
            </button>
          </div>
          {notFound && (
            <p className="text-xs text-gray-500 mt-3 text-center">
              Bu numarayla kayıtlı kart bulunamadı.
            </p>
          )}
        </div>
      )}

      {/* Kart görünümü */}
      {cards && (
        <div className="flex flex-col gap-4">
          {cards.map((c, i) => {
            const pct = (c.stamps / c.program.required_stamps) * 100;
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">{c.program.name}</p>
                    {c.program.description && <p className="text-xs text-gray-400 mt-0.5">{c.program.description}</p>}
                  </div>
                  {c.completed_count > 0 && (
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md">
                      {c.completed_count}x kazanıldı
                    </span>
                  )}
                </div>

                {/* Damgalar */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.from({ length: c.program.required_stamps }).map((_, i) => (
                    <div key={i}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        i < c.stamps
                          ? 'bg-rose-500 border-rose-500 text-white'
                          : 'border-gray-200 text-gray-200'
                      }`}
                    >
                      {i < c.stamps ? '✓' : <span className="text-lg">○</span>}
                    </div>
                  ))}
                </div>

                {/* İlerleme */}
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                  <div className="bg-rose-500 h-2 rounded-full transition-all"
                    style={{ width: `${pct}%` }} />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-rose-600">{c.stamps}</span>/{c.program.required_stamps} damga
                  </p>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Ödül</p>
                    <p className="text-sm font-medium text-gray-700">🎁 {c.program.reward_description}</p>
                  </div>
                </div>

                {c.stamps === c.program.required_stamps - 1 && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                    <p className="text-xs text-amber-700 font-medium">🔥 Bir damgan kaldı! Ödülünü kazan!</p>
                  </div>
                )}
              </div>
            );
          })}

          <button onClick={() => { setCards(null); setPhone(''); }}
            className="text-sm text-gray-400 text-center">
            Farklı numara sorgula
          </button>
        </div>
      )}
    </div>
  );
}
