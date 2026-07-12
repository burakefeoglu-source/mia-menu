'use client';

import { useState } from 'react';

type Subscription = {
  status: string;
  trial_ends_at: string | null;
  plan_expires_at: string | null;
};

type Tenant = {
  id: string;
  slug: string;
  name: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  subscriptions: Subscription[] | Subscription | null;
};

function getSubInfo(tenant: Tenant) {
  const sub = Array.isArray(tenant.subscriptions)
    ? tenant.subscriptions[0]
    : tenant.subscriptions;
  if (!sub) return { status: 'yok', daysLeft: null, color: 'gray' };

  const now = new Date();

  if (sub.status === 'active' && sub.plan_expires_at) {
    const days = Math.ceil((new Date(sub.plan_expires_at).getTime() - now.getTime()) / 86400000);
    return { status: 'Aktif', daysLeft: `${days} gün kaldı`, color: 'green' };
  }
  if (sub.status === 'trialing' && sub.trial_ends_at) {
    const days = Math.ceil((new Date(sub.trial_ends_at).getTime() - now.getTime()) / 86400000);
    if (days <= 0) return { status: 'Trial doldu', daysLeft: null, color: 'red' };
    return { status: 'Trial', daysLeft: `${days} gün kaldı`, color: 'blue' };
  }
  if (sub.status === 'expired') return { status: 'Süresi doldu', daysLeft: null, color: 'red' };
  if (sub.status === 'cancelled') return { status: 'İptal', daysLeft: null, color: 'gray' };
  return { status: sub.status, daysLeft: null, color: 'gray' };
}

const colorMap: Record<string, string> = {
  green: 'bg-green-50 text-green-700',
  blue: 'bg-blue-50 text-blue-700',
  red: 'bg-red-50 text-red-700',
  gray: 'bg-gray-100 text-gray-600',
};

export default function SuperAdminClient({ tenants }: { tenants: Tenant[] }) {
  const [search, setSearch] = useState('');

  const filtered = tenants.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase()) ||
    (t.phone ?? '').includes(search)
  );

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="İşletme adı, slug veya telefon..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 bg-white"
      />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">İşletme</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Slug</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Telefon</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Abonelik</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Kayıt</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const sub = getSubInfo(t);
              return (
                <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-gray-500">{t.slug}</td>
                  <td className="px-4 py-3 text-gray-500">{t.phone ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-md ${colorMap[sub.color]}`}>
                      {sub.status}
                    </span>
                    {sub.daysLeft && (
                      <span className="text-xs text-gray-400 ml-1.5">{sub.daysLeft}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(t.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <a
                        href={`/admin/${t.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Paneli aç
                      </a>
                      <a
                        href={`/menu/${t.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Menü
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                  Sonuç bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
