'use client';

import { useState } from 'react';
import {
  activateSubscription, extendTrial, toggleTenantActive,
  saveTenantNote, createTenantManual
} from './superAdminActions';

type Sub = { status: string; trial_ends_at: string | null; plan_expires_at: string | null };
type Tenant = {
  id: string; slug: string; name: string; phone: string | null;
  is_active: boolean; created_at: string; admin_notes: string | null;
  referred_by_slug: string | null;
  subscriptions: Sub[] | Sub | null;
};

function getSub(t: Tenant): Sub | null {
  if (!t.subscriptions) return null;
  return Array.isArray(t.subscriptions) ? t.subscriptions[0] : t.subscriptions;
}

function subInfo(t: Tenant) {
  const sub = getSub(t);
  if (!sub) return { label: 'Abonelik yok', color: 'bg-gray-100 text-gray-500', daysLeft: null, isRisk: true };
  const now = new Date();
  if (sub.status === 'active' && sub.plan_expires_at) {
    const d = Math.ceil((new Date(sub.plan_expires_at).getTime() - now.getTime()) / 86400000);
    return { label: 'Aktif', color: 'bg-green-100 text-green-700', daysLeft: `${d} gün`, isRisk: d <= 30 };
  }
  if (sub.status === 'trialing' && sub.trial_ends_at) {
    const d = Math.ceil((new Date(sub.trial_ends_at).getTime() - now.getTime()) / 86400000);
    if (d <= 0) return { label: 'Trial doldu', color: 'bg-red-100 text-red-700', daysLeft: null, isRisk: true };
    return { label: 'Trial', color: 'bg-blue-100 text-blue-700', daysLeft: `${d} gün`, isRisk: d <= 2 };
  }
  if (sub.status === 'expired') return { label: 'Süresi doldu', color: 'bg-red-100 text-red-700', daysLeft: null, isRisk: true };
  return { label: sub.status, color: 'bg-gray-100 text-gray-500', daysLeft: null, isRisk: false };
}

export default function SuperAdminClient({ tenants, stats }: {
  tenants: Tenant[];
  stats: { totalViews: number; totalReviews: number; activeTenants: number };
}) {
  const [tab, setTab] = useState<'overview' | 'tenants' | 'alerts' | 'new'>('overview');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteEditing, setNoteEditing] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [creating, setCreating] = useState(false);
  const [createResult, setCreateResult] = useState<string | null>(null);

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase()) ||
    (t.phone ?? '').includes(search)
  );

  const alerts = tenants.filter(t => {
    const info = subInfo(t);
    return info.isRisk || !t.is_active;
  });

  const TABS = [
    { key: 'overview', label: 'Özet' },
    { key: 'tenants', label: `İşletmeler (${tenants.length})` },
    { key: 'alerts', label: `⚠️ Uyarılar (${alerts.length})`, red: alerts.length > 0 },
    { key: 'new', label: '+ Yeni ekle' },
  ] as const;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`text-sm px-4 py-2 border-b-2 transition-colors ${
              tab === t.key ? 'border-rose-600 text-rose-600 font-medium' : 'border-transparent text-gray-500'
            } ${(t as { red?: boolean }).red ? 'text-red-600' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ÖZET */}
      {tab === 'overview' && (
        <div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Aktif işletme', value: stats.activeTenants, icon: '🏪' },
              { label: 'Toplam menü görüntülenme', value: stats.totalViews.toLocaleString('tr-TR'), icon: '👁️' },
              { label: 'Toplam görüş', value: stats.totalReviews, icon: '⭐' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-2xl font-semibold">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium mb-3">Abonelik dağılımı</p>
            {(['active', 'trialing', 'expired'] as const).map(status => {
              const count = tenants.filter(t => getSub(t)?.status === status).length;
              const colors = { active: 'bg-green-500', trialing: 'bg-blue-500', expired: 'bg-red-400' };
              const labels = { active: 'Aktif', trialing: 'Trial', expired: 'Süresi dolmuş' };
              return (
                <div key={status} className="flex items-center gap-3 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${colors[status]}`} />
                  <span className="text-sm">{labels[status]}</span>
                  <span className="text-sm font-medium ml-auto">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* İŞLETMELER */}
      {tab === 'tenants' && (
        <div>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Ad, slug veya telefon..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 bg-white" />
          <div className="flex flex-col gap-2">
            {filtered.map(t => {
              const info = subInfo(t);
              const isExpanded = expandedId === t.id;
              return (
                <div key={t.id} className={`bg-white border rounded-xl overflow-hidden ${info.isRisk ? 'border-red-200' : 'border-gray-200'}`}>
                  <button onClick={() => setExpandedId(isExpanded ? null : t.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.is_active ? 'bg-green-400' : 'bg-gray-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.slug} · {t.phone ?? '—'}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-md ${info.color}`}>
                      {info.label}{info.daysLeft ? ` · ${info.daysLeft}` : ''}
                    </span>
                    <span className="text-gray-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
                      {/* Linkler */}
                      <div className="flex gap-2 flex-wrap">
                        <a href={`/admin/${t.slug}`} target="_blank" rel="noreferrer"
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">Paneli aç ↗</a>
                        <a href={`/menu/${t.slug}`} target="_blank" rel="noreferrer"
                          className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md">Menü ↗</a>
                      </div>

                      {/* Abonelik işlemleri */}
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => activateSubscription(t.id, 12)}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded-md">✓ 1 yıl aktif et</button>
                        <button onClick={() => activateSubscription(t.id, 1)}
                          className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-md">1 ay aktif et</button>
                        <button onClick={() => extendTrial(t.id, 7)}
                          className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-md">+7 gün trial</button>
                        <button onClick={() => toggleTenantActive(t.id, !t.is_active)}
                          className={`text-xs px-2 py-1 rounded-md border ${t.is_active ? 'text-red-600 border-red-200 bg-red-50' : 'text-green-600 border-green-200 bg-green-50'}`}>
                          {t.is_active ? 'Pasif yap' : 'Aktif yap'}
                        </button>
                      </div>

                      {/* Müşteri notu */}
                      {noteEditing === t.id ? (
                        <div className="flex gap-2">
                          <input value={noteText} onChange={e => setNoteText(e.target.value)}
                            placeholder="Not ekle..."
                            className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-xs" />
                          <button onClick={async () => {
                            await saveTenantNote(t.id, noteText);
                            setNoteEditing(null);
                          }} className="text-xs bg-gray-800 text-white px-2 py-1 rounded-md">Kaydet</button>
                          <button onClick={() => setNoteEditing(null)} className="text-xs text-gray-400">İptal</button>
                        </div>
                      ) : (
                        <button onClick={() => { setNoteEditing(t.id); setNoteText(t.admin_notes ?? ''); }}
                          className="text-xs text-gray-400 text-left">
                          📝 {t.admin_notes ?? 'Not ekle...'}
                        </button>
                      )}

                      <p className="text-xs text-gray-300">
                        Kayıt: {new Date(t.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* UYARILAR */}
      {tab === 'alerts' && (
        <div className="flex flex-col gap-3">
          {alerts.length === 0 && <p className="text-sm text-gray-400">Uyarı yok 🎉</p>}
          {alerts.map(t => {
            const info = subInfo(t);
            return (
              <div key={t.id} className="bg-white border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.slug}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-md mt-1 inline-block ${info.color}`}>
                    {!t.is_active ? 'Pasif' : info.label}{info.daysLeft ? ` · ${info.daysLeft}` : ''}
                  </span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => activateSubscription(t.id, 12)}
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded-md">Aktif et</button>
                  <button onClick={() => extendTrial(t.id, 7)}
                    className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-md">+7 gün</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* YENİ İŞLETME */}
      {tab === 'new' && (
        <div className="max-w-sm">
          <p className="text-sm font-medium mb-4">Manuel işletme oluştur</p>
          <form action={async (fd) => {
            setCreating(true);
            setCreateResult(null);
            const res = await createTenantManual(fd);
            setCreating(false);
            if (res?.error) setCreateResult('❌ ' + res.error);
            else setCreateResult(`✓ Oluşturuldu: /admin/${res?.slug}`);
          }} className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">İşletme adı *</label>
              <input name="name" required className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">E-posta *</label>
              <input name="email" type="email" required className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Şifre (boş bırakılırsa otomatik oluşur)</label>
              <input name="password" type="password" className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Telefon</label>
              <input name="phone" className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trial süresi (gün)</label>
              <input name="trial_days" type="number" defaultValue={5} className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
            </div>
            <button type="submit" disabled={creating}
              className="bg-rose-600 text-white text-sm py-2 rounded-md disabled:opacity-50">
              {creating ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
            {createResult && <p className="text-sm">{createResult}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
