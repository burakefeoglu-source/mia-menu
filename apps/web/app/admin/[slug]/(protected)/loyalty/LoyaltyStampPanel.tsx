'use client';

import { useState } from 'react';
import { addStamp } from '../../actions';

type Program = { id: string; name: string; required_stamps: number; reward_description: string };

export default function LoyaltyStampPanel({
  tenantId, slug, programs,
}: { tenantId: string; slug: string; programs: Program[] }) {
  const [programId, setProgramId] = useState(programs[0]?.id ?? '');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    stamps?: number; completed?: boolean; reward?: string; requiredStamps?: number; error?: string;
  } | null>(null);

  const selectedProgram = programs.find(p => p.id === programId);

  async function handleStamp() {
    if (!phone.trim() || !programId) return;
    setLoading(true);
    setResult(null);
    const res = await addStamp(tenantId, slug, programId, phone.trim(), name.trim());
    setResult(res);
    setLoading(false);
    if (!('error' in res)) {
      setPhone('');
      setName('');
    }
  }

  if (programs.length === 0) return (
    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-400">Önce aktif bir program oluşturun.</div>
  );

  return (
    <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Program</label>
        <select value={programId} onChange={e => setProgramId(e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-white">
          {programs.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.required_stamps} → {p.reward_description})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Müşteri telefonu</label>
        <input value={phone} onChange={e => setPhone(e.target.value)}
          placeholder="05001234567"
          className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-white"
          onKeyDown={e => e.key === 'Enter' && handleStamp()} />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Müşteri adı (opsiyonel)</label>
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="Ahmet Bey"
          className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-white" />
      </div>

      <button onClick={handleStamp} disabled={loading || !phone.trim()}
        className="w-full bg-rose-600 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
        {loading ? 'İşleniyor...' : '+ Damga Vur'}
      </button>

      {result && (
        <div className={`rounded-xl p-4 text-center ${result.error ? 'bg-red-50 border border-red-200' : result.completed ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
          {result.error ? (
            <p className="text-sm text-red-700">❌ {result.error}</p>
          ) : result.completed ? (
            <>
              <p className="text-2xl mb-1">🎉</p>
              <p className="text-sm font-semibold text-green-700">Ödül kazanıldı!</p>
              <p className="text-sm text-green-600 mt-0.5">{result.reward}</p>
              <p className="text-xs text-green-500 mt-1">Kart sıfırlandı, yeni tura başlandı</p>
            </>
          ) : (
            <>
              <p className="text-xl mb-1">✓</p>
              <p className="text-sm font-medium text-blue-700">Damga eklendi</p>
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: result.requiredStamps ?? 10 }).map((_, i) => (
                  <span key={i} className={`w-3 h-3 rounded-full ${i < (result.stamps ?? 0) ? 'bg-rose-500' : 'bg-gray-200'}`} />
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-1">{result.stamps}/{result.requiredStamps} damga</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
