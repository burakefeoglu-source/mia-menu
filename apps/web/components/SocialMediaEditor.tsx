'use client';

import { useState } from 'react';
import { SOCIAL_PLATFORMS } from './SocialIcons';

type Entry = { platform: string; handle: string };

function urlToHandle(platform: string, url: string): string {
  if (!url) return '';
  const p = SOCIAL_PLATFORMS.find(p => p.key === platform);
  if (!p || !p.prefix) return url;
  return url.replace(p.prefix, '').replace('https://www.instagram.com/', '').replace('@', '');
}

function handleToUrl(platform: string, handle: string): string {
  const p = SOCIAL_PLATFORMS.find(p => p.key === platform);
  if (!p) return handle;
  if (!p.prefix) return handle; // maps, whatsapp — raw value
  return p.prefix + handle;
}

export default function SocialMediaEditor({
  initialValues,
}: {
  initialValues?: Record<string, string | null>;
}) {
  const [entries, setEntries] = useState<Entry[]>(() => {
    const result: Entry[] = [];
    if (!initialValues) return result;
    SOCIAL_PLATFORMS.forEach(p => {
      const val = initialValues[p.key];
      if (val) result.push({ platform: p.key, handle: urlToHandle(p.key, val) });
    });
    return result;
  });

  const [selectedPlatform, setSelectedPlatform] = useState<string>(SOCIAL_PLATFORMS[0].key);
  const [handle, setHandle] = useState('');

  const currentPlatform = SOCIAL_PLATFORMS.find(p => p.key === selectedPlatform)!;

  function add() {
    if (!handle.trim()) return;
    const already = entries.findIndex(e => e.platform === selectedPlatform);
    if (already >= 0) {
      setEntries(entries.map((e, i) => i === already ? { ...e, handle: handle.trim() } : e));
    } else {
      setEntries([...entries, { platform: selectedPlatform, handle: handle.trim() }]);
    }
    setHandle('');
  }

  function remove(platform: string) {
    setEntries(entries.filter(e => e.platform !== platform));
  }

  return (
    <div>
      {/* Hidden inputs */}
      {SOCIAL_PLATFORMS.map(p => {
        const entry = entries.find(e => e.platform === p.key);
        return (
          <input key={p.key} type="hidden"
            name={`social_${p.key}`}
            value={entry ? handleToUrl(p.key, entry.handle) : ''} />
        );
      })}

      {/* Mevcut linkler */}
      {entries.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-3">
          {entries.map(e => {
            const p = SOCIAL_PLATFORMS.find(p => p.key === e.platform)!;
            return (
              <div key={e.platform} className="flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2">
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: p.color }}>{p.svg}</span>
                <span className="text-xs text-gray-600 flex-1 truncate">{p.label}: {e.handle}</span>
                <button type="button" onClick={() => remove(e.platform)} className="text-xs text-red-400 flex-shrink-0">Sil</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Yeni ekle */}
      <div className="flex gap-2">
        <input
          type="text"
          value={handle}
          onChange={e => setHandle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={currentPlatform.placeholder}
          className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
        <select
          value={selectedPlatform}
          onChange={e => { setSelectedPlatform(e.target.value); setHandle(''); }}
          className="border border-gray-200 rounded-md px-2 py-1.5 text-sm"
        >
          {SOCIAL_PLATFORMS.map(p => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
        <button type="button" onClick={add}
          className="text-sm bg-gray-800 text-white px-3 py-1.5 rounded-md flex-shrink-0">
          Ekle
        </button>
      </div>
      <p className="text-[11px] text-gray-400 mt-1.5">
        {currentPlatform.prefix ? `Sadece kullanıcı adını girin (örn: ${currentPlatform.placeholder})` : 'Tam URL yapıştırın'}
      </p>
    </div>
  );
}
