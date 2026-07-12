'use client';

import { useState } from 'react';
import { InstagramIcon, WhatsAppIcon, MapsIcon } from './SocialIcons';

const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: <InstagramIcon className="w-4 h-4" />, color: '#E1306C', prefix: 'https://instagram.com/', placeholder: 'miabistro' },
  { key: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon className="w-4 h-4" />, color: '#25D366', prefix: 'https://wa.me/', placeholder: '905001234567' },
  { key: 'maps', label: 'Google Harita', icon: <MapsIcon className="w-4 h-4" />, color: '#EA4335', prefix: '', placeholder: 'https://maps.google.com/...' },
];

type SocialEntry = { platform: string; handle: string };

export default function SocialMediaEditor({
  initialInstagram,
  initialWhatsapp,
  initialMaps,
}: {
  initialInstagram?: string | null;
  initialWhatsapp?: string | null;
  initialMaps?: string | null;
}) {
  function handleToEntries(): SocialEntry[] {
    const entries: SocialEntry[] = [];
    if (initialInstagram) entries.push({ platform: 'instagram', handle: initialInstagram.replace('https://instagram.com/', '').replace('https://www.instagram.com/', '') });
    if (initialWhatsapp) entries.push({ platform: 'whatsapp', handle: initialWhatsapp.replace('https://wa.me/', '') });
    if (initialMaps) entries.push({ platform: 'maps', handle: initialMaps });
    return entries;
  }

  const [entries, setEntries] = useState<SocialEntry[]>(handleToEntries);
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0].key);
  const [handle, setHandle] = useState('');

  function add() {
    if (!handle.trim()) return;
    const already = entries.find(e => e.platform === selectedPlatform);
    if (already) {
      setEntries(entries.map(e => e.platform === selectedPlatform ? { ...e, handle: handle.trim() } : e));
    } else {
      setEntries([...entries, { platform: selectedPlatform, handle: handle.trim() }]);
    }
    setHandle('');
  }

  function remove(platform: string) {
    setEntries(entries.filter(e => e.platform !== platform));
  }

  // Hidden input değerlerini hesapla
  function toUrl(entry: SocialEntry) {
    const p = PLATFORMS.find(p => p.key === entry.platform)!;
    return p.prefix + entry.handle;
  }

  const instagram = entries.find(e => e.platform === 'instagram');
  const whatsapp = entries.find(e => e.platform === 'whatsapp');
  const maps = entries.find(e => e.platform === 'maps');

  const currentPlatform = PLATFORMS.find(p => p.key === selectedPlatform)!;

  return (
    <div>
      {/* Hidden inputs for form submit */}
      <input type="hidden" name="instagram_url" value={instagram ? toUrl(instagram) : ''} />
      <input type="hidden" name="whatsapp_number" value={whatsapp ? whatsapp.handle : ''} />
      <input type="hidden" name="google_maps_url" value={maps ? maps.handle : ''} />

      {/* Mevcut linkler */}
      {entries.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {entries.map(e => {
            const p = PLATFORMS.find(p => p.key === e.platform)!;
            return (
              <div key={e.platform} className="flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2">
                <span style={{ color: p.color }}>{p.icon}</span>
                <span className="text-sm flex-1 truncate">{e.handle}</span>
                <button type="button" onClick={() => remove(e.platform)} className="text-xs text-red-400">Sil</button>
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
          {PLATFORMS.map(p => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={add}
          className="text-sm bg-gray-800 text-white px-3 py-1.5 rounded-md"
        >
          Ekle
        </button>
      </div>
      <p className="text-[11px] text-gray-400 mt-1.5">
        {selectedPlatform === 'maps' ? 'Google Harita için tam URL yapıştırın' : `Sadece kullanıcı adını girin (örn: ${currentPlatform.placeholder})`}
      </p>
    </div>
  );
}
