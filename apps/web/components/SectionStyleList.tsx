'use client';

import { useState } from 'react';
import { updateSectionDisplayStyle } from '@/app/admin/[slug]/actions';
import { broadcastPreviewRefresh } from '@/lib/previewChannel';
import type { MenuSection } from '@/types/database';

type Style = MenuSection['display_style'];

const OPTIONS: { value: Style; label: string; preview: React.ReactNode }[] = [
  {
    value: 'list',
    label: 'Sade liste',
    preview: (
      <svg viewBox="0 0 60 44" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="38" height="5" rx="1.5" fill="#d1d5db"/>
        <rect x="4" y="7" width="18" height="3" rx="1" fill="#9ca3af"/>
        <rect x="46" y="7" width="10" height="3" rx="1" fill="#6b7280"/>
        <rect x="4" y="18" width="38" height="5" rx="1.5" fill="#d1d5db"/>
        <rect x="4" y="19" width="18" height="3" rx="1" fill="#9ca3af"/>
        <rect x="46" y="19" width="10" height="3" rx="1" fill="#6b7280"/>
        <rect x="4" y="30" width="38" height="5" rx="1.5" fill="#d1d5db"/>
        <rect x="4" y="31" width="18" height="3" rx="1" fill="#9ca3af"/>
        <rect x="46" y="31" width="10" height="3" rx="1" fill="#6b7280"/>
      </svg>
    ),
  },
  {
    value: 'list_image',
    label: 'Görselli liste',
    preview: (
      <svg viewBox="0 0 60 44" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="5" width="10" height="10" rx="2" fill="#d1d5db"/>
        <rect x="17" y="7" width="22" height="2.5" rx="1" fill="#9ca3af"/>
        <rect x="17" y="11" width="14" height="2" rx="1" fill="#d1d5db"/>
        <rect x="46" y="8" width="10" height="3" rx="1" fill="#6b7280"/>
        <rect x="4" y="20" width="10" height="10" rx="2" fill="#d1d5db"/>
        <rect x="17" y="22" width="22" height="2.5" rx="1" fill="#9ca3af"/>
        <rect x="17" y="26" width="14" height="2" rx="1" fill="#d1d5db"/>
        <rect x="46" y="23" width="10" height="3" rx="1" fill="#6b7280"/>
        <rect x="4" y="35" width="10" height="10" rx="2" fill="#d1d5db"/>
        <rect x="17" y="37" width="22" height="2.5" rx="1" fill="#9ca3af"/>
        <rect x="17" y="41" width="14" height="2" rx="1" fill="#d1d5db"/>
        <rect x="46" y="38" width="10" height="3" rx="1" fill="#6b7280"/>
      </svg>
    ),
  },
  {
    value: 'grid',
    label: '2\'li ızgara',
    preview: (
      <svg viewBox="0 0 60 44" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="24" height="17" rx="2" fill="#d1d5db"/>
        <rect x="4" y="16" width="24" height="5" rx="0" fill="#f3f4f6"/>
        <rect x="6" y="17" width="12" height="2" rx="1" fill="#9ca3af"/>
        <rect x="6" y="20" width="8" height="1.5" rx="0.75" fill="#d1d5db"/>
        <rect x="32" y="4" width="24" height="17" rx="2" fill="#d1d5db"/>
        <rect x="32" y="16" width="24" height="5" rx="0" fill="#f3f4f6"/>
        <rect x="34" y="17" width="12" height="2" rx="1" fill="#9ca3af"/>
        <rect x="34" y="20" width="8" height="1.5" rx="0.75" fill="#d1d5db"/>
        <rect x="4" y="25" width="24" height="17" rx="2" fill="#d1d5db"/>
        <rect x="4" y="37" width="24" height="5" rx="0" fill="#f3f4f6"/>
        <rect x="6" y="38" width="12" height="2" rx="1" fill="#9ca3af"/>
        <rect x="6" y="41" width="8" height="1.5" rx="0.75" fill="#d1d5db"/>
        <rect x="32" y="25" width="24" height="17" rx="2" fill="#d1d5db"/>
        <rect x="32" y="37" width="24" height="5" rx="0" fill="#f3f4f6"/>
        <rect x="34" y="38" width="12" height="2" rx="1" fill="#9ca3af"/>
        <rect x="34" y="41" width="8" height="1.5" rx="0.75" fill="#d1d5db"/>
      </svg>
    ),
  },
];

export default function SectionStyleList({
  slug,
  sections,
}: {
  slug: string;
  sections: MenuSection[];
}) {
  const [styles, setStyles] = useState<Record<string, Style>>(
    Object.fromEntries(sections.map((s) => [s.id, s.display_style]))
  );

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {sections.map((s) => (
        <div key={s.id} className="py-4 first:pt-0">
          <p className="text-sm font-medium mb-3">{s.name}</p>
          <div className="flex gap-3">
            {OPTIONS.map((opt) => {
              const active = styles[s.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStyles((prev) => ({ ...prev, [s.id]: opt.value }));
                    updateSectionDisplayStyle(s.id, slug, opt.value);
                    broadcastPreviewRefresh();
                  }}
                  className={`flex flex-col items-center gap-1.5 rounded-md border-2 p-1.5 transition-colors ${
                    active
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  style={{ width: 72 }}
                >
                  <div className="w-full" style={{ height: 48 }}>
                    {opt.preview}
                  </div>
                  <span className={`text-[11px] text-center leading-tight ${active ? 'text-rose-700 font-medium' : 'text-gray-500'}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
