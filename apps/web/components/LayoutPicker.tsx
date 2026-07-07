'use client';

import { useState } from 'react';
import { updateMenuLayout } from '@/app/admin/[slug]/actions';

type Layout = 'classic' | 'dark' | 'minimal';

const LAYOUTS: { value: Layout; label: string; preview: React.ReactNode }[] = [
  {
    value: 'classic',
    label: 'Klasik',
    preview: (
      <div style={{ background: '#fff8f5', height: 100, overflow: 'hidden' }}>
        <div style={{ background: '#c2185b', padding: '6px 8px' }}>
          <div style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>Mia Bistro</div>
          <div style={{ fontSize: 7, color: 'rgba(255,255,255,.7)', marginTop: 1 }}>İstanbul</div>
        </div>
        <div style={{ padding: '5px 7px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {['Serpme Kahvaltı · 450 ₺', 'Menemen · 180 ₺', 'Mercimek · 120 ₺'].map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '0.5px solid #eee', paddingBottom: 2 }}>
              <span style={{ fontSize: 7, color: '#333' }}>{t.split('·')[0]}</span>
              <span style={{ fontSize: 7, color: '#c2185b', fontWeight: 600 }}>{t.split('·')[1]}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    value: 'dark',
    label: 'Koyu header',
    preview: (
      <div style={{ background: '#f9f9f9', height: 100, overflow: 'hidden' }}>
        <div style={{ background: '#1a1a1a', padding: '6px 8px 4px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>Mia Bistro</div>
          <div style={{ fontSize: 7, color: 'rgba(255,255,255,.5)', marginTop: 1 }}>İstanbul</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, borderTop: '0.5px solid rgba(255,255,255,.1)', paddingTop: 4 }}>
            {['Kahvaltı', 'Başlangıç', 'Ana'].map((c, i) => (
              <span key={c} style={{ fontSize: 7, color: i === 0 ? '#fff' : 'rgba(255,255,255,.4)', borderBottom: i === 0 ? '1.5px solid #fff' : 'none', paddingBottom: 2 }}>{c}</span>
            ))}
          </div>
        </div>
        <div style={{ padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[['Serpme Kahvaltı', '450 ₺'], ['Menemen', '180 ₺']].map(([n, p], i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 5, padding: '4px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 7, fontWeight: 600, color: '#111' }}>{n}</span>
              <span style={{ fontSize: 7, fontWeight: 700, color: '#111' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    value: 'minimal',
    label: 'Minimal ızgara',
    preview: (
      <div style={{ background: '#fff', height: 100, overflow: 'hidden', padding: '6px 7px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#111' }}>Mia Bistro</span>
          <div style={{ border: '0.5px solid #e5e5e5', borderRadius: 10, padding: '2px 6px' }}>
            <span style={{ fontSize: 7, color: '#111' }}>TR</span>
          </div>
        </div>
        <div style={{ height: 24, background: '#e5e7eb', borderRadius: 5, marginBottom: 5 }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {['Serpme\n450 ₺', 'Menemen\n180 ₺', 'Mercimek\n120 ₺', 'Humus\n140 ₺'].map((t, i) => (
            <div key={i} style={{ border: '0.5px solid #f0f0f0', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: 16, background: '#e5e7eb' }}></div>
              <div style={{ padding: '2px 4px' }}>
                <div style={{ fontSize: 6, fontWeight: 600, color: '#111' }}>{t.split('\n')[0]}</div>
                <div style={{ fontSize: 6, fontWeight: 700, color: '#111' }}>{t.split('\n')[1]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function LayoutPicker({
  tenantId,
  slug,
  initialLayout,
}: {
  tenantId: string;
  slug: string;
  initialLayout: Layout;
}) {
  const [selected, setSelected] = useState<Layout>(initialLayout);

  return (
    <div className="flex gap-3 flex-wrap">
      {LAYOUTS.map((l) => {
        const active = selected === l.value;
        return (
          <button
            key={l.value}
            onClick={() => {
              setSelected(l.value);
              updateMenuLayout(tenantId, slug, l.value);
            }}
            className={`flex flex-col rounded-lg border-2 overflow-hidden transition-colors ${
              active ? 'border-rose-600' : 'border-gray-200'
            }`}
            style={{ width: 130 }}
          >
            {l.preview}
            <div className={`py-1.5 text-center text-xs font-medium ${active ? 'bg-rose-50 text-rose-700' : 'bg-gray-50 text-gray-600'}`}>
              {l.label}
              {active && <span className="ml-1 text-[10px]">✓</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
