'use client';

import { useState } from 'react';
import { updateThemeColor } from '@/app/admin/[slug]/actions';
import { broadcastPreviewRefresh } from '@/lib/previewChannel';
import { MENU_THEMES, type MenuThemeKey } from '@/lib/menuThemes';

export default function ThemePicker({
  tenantId,
  slug,
  initialTheme,
}: {
  tenantId: string;
  slug: string;
  initialTheme: string;
}) {
  const [selected, setSelected] = useState(initialTheme);

  return (
    <div className="flex flex-wrap gap-3">
      {(Object.keys(MENU_THEMES) as MenuThemeKey[]).map((key) => {
        const theme = MENU_THEMES[key];
        const active = selected === key;
        return (
          <button
            key={key}
            onClick={() => {
              setSelected(key);
              updateThemeColor(tenantId, slug, key);
              broadcastPreviewRefresh();
            }}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-md border-2 ${
              active ? 'border-gray-800' : 'border-transparent'
            }`}
          >
            <span className={`w-10 h-10 rounded-full ${theme.swatch}`} />
            <span className="text-xs text-gray-600">{theme.label}</span>
          </button>
        );
      })}
    </div>
  );
}
