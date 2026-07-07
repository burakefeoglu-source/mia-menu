'use client';

import { useState } from 'react';
import { updateSectionNav } from '@/app/admin/[slug]/actions';

type Nav = 'tabs' | 'grid';

const OPTIONS: { value: Nav; label: string; desc: string; preview: React.ReactNode }[] = [
  {
    value: 'tabs',
    label: 'Standart',
    desc: 'Yatay kaydırmalı sekme çubuğu',
    preview: (
      <div style={{ background: '#fff', padding: '8px', height: 72 }}>
        <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
          <div style={{ background: '#c2185b', color: '#fff', fontSize: 8, padding: '3px 8px', borderRadius: 12, whiteSpace: 'nowrap' }}>Kahvaltı</div>
          <div style={{ background: '#f5f5f5', color: '#888', fontSize: 8, padding: '3px 8px', borderRadius: 12, whiteSpace: 'nowrap' }}>Başlangıç</div>
          <div style={{ background: '#f5f5f5', color: '#888', fontSize: 8, padding: '3px 8px', borderRadius: 12, whiteSpace: 'nowrap' }}>Ana</div>
          <div style={{ background: '#f5f5f5', color: '#888', fontSize: 8, padding: '3px 8px', borderRadius: 12, whiteSpace: 'nowrap' }}>Tatlı</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '0.5px solid #eee', paddingBottom: 2 }}>
            <span style={{ fontSize: 8, color: '#333' }}>Serpme Kahvaltı</span>
            <span style={{ fontSize: 8, color: '#c2185b', fontWeight: 600 }}>450 ₺</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 8, color: '#333' }}>Menemen</span>
            <span style={{ fontSize: 8, color: '#c2185b', fontWeight: 600 }}>180 ₺</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    value: 'grid',
    label: 'Izgara',
    desc: '2\'li kart ızgarası, önce bölüm seç',
    preview: (
      <div style={{ background: '#fff', padding: '8px', height: 72 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          {['Kahvaltı', 'Başlangıçlar', 'Ana Yemekler', 'Tatlılar'].map((name, i) => (
            <div key={i} style={{
              borderRadius: 6,
              overflow: 'hidden',
              border: '0.5px solid #eee',
            }}>
              <div style={{ height: 18, background: i === 0 ? '#c2185b' : '#e5e7eb' }} />
              <div style={{ padding: '3px 5px' }}>
                <span style={{ fontSize: 7, fontWeight: 600, color: '#111' }}>{name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function SectionNavPicker({
  tenantId,
  slug,
  initialNav,
}: {
  tenantId: string;
  slug: string;
  initialNav: Nav;
}) {
  const [selected, setSelected] = useState<Nav>(initialNav);

  return (
    <div className="flex gap-3 flex-wrap">
      {OPTIONS.map((opt) => {
        const active = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => {
              setSelected(opt.value);
              updateSectionNav(tenantId, slug, opt.value);
            }}
            className={`flex flex-col rounded-lg border-2 overflow-hidden transition-colors text-left`}
            style={{ width: 160, borderColor: active ? '#e11d48' : '#e5e7eb' }}
          >
            {opt.preview}
            <div className={`px-3 py-2 ${active ? 'bg-rose-50' : 'bg-gray-50'}`}>
              <p className={`text-xs font-medium ${active ? 'text-rose-700' : 'text-gray-700'}`}>
                {opt.label} {active && '✓'}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
