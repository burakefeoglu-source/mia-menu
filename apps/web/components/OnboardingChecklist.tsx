'use client';

import { useState } from 'react';
import Link from 'next/link';

type CheckItem = {
  key: string;
  label: string;
  done: boolean;
  href: string;
  action: string;
};

export default function OnboardingChecklist({ items, slug }: { items: CheckItem[]; slug: string }) {
  const [dismissed, setDismissed] = useState(false);

  const doneCount = items.filter(i => i.done).length;
  const allDone = doneCount === items.length;

  if (dismissed || allDone) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-blue-900">🚀 Menünüzü tamamlayın</p>
          <p className="text-xs text-blue-600 mt-0.5">{doneCount}/{items.length} adım tamamlandı</p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-blue-400 text-xs">✕</button>
      </div>

      <div className="w-full bg-blue-200 rounded-full h-1.5 mb-3">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all"
          style={{ width: `${(doneCount / items.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
              item.done ? 'bg-green-500 text-white' : 'bg-white border-2 border-blue-300'
            }`}>
              {item.done ? '✓' : ''}
            </span>
            <span className={`text-xs flex-1 ${item.done ? 'text-gray-400 line-through' : 'text-blue-800'}`}>
              {item.label}
            </span>
            {!item.done && (
              <Link href={`/admin/${slug}${item.href}`}
                className="text-[11px] text-blue-600 font-medium flex-shrink-0">
                {item.action} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
