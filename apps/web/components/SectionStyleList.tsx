'use client';

import { useState } from 'react';
import { updateSectionDisplayStyle } from '@/app/admin/[slug]/actions';
import type { MenuSection } from '@/types/database';

const OPTIONS: { value: MenuSection['display_style']; label: string }[] = [
  { value: 'list', label: 'Görselsiz kompakt listelenmiş bölüm' },
  { value: 'list_image', label: 'Görselli listelenmiş bölüm' },
  { value: 'grid', label: '2 sütunda listelenmiş bölüm' },
];

export default function SectionStyleList({
  slug,
  sections,
}: {
  slug: string;
  sections: MenuSection[];
}) {
  const [styles, setStyles] = useState<Record<string, MenuSection['display_style']>>(
    Object.fromEntries(sections.map((s) => [s.id, s.display_style]))
  );

  return (
    <div className="flex flex-col gap-4 max-w-md">
      {sections.map((s) => (
        <div key={s.id}>
          <p className="text-sm font-medium mb-1.5">{s.name}</p>
          <div className="flex flex-col gap-1">
            {OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name={`style-${s.id}`}
                  checked={styles[s.id] === opt.value}
                  onChange={() => {
                    setStyles((prev) => ({ ...prev, [s.id]: opt.value }));
                    updateSectionDisplayStyle(s.id, slug, opt.value);
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
