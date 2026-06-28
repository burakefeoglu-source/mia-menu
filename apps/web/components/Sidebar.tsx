'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const groups = [
  {
    title: '1. Menü içeriği',
    items: [
      { key: 'sections', label: 'Bölümler & ürünler', href: '' },
      { key: 'prices', label: 'Fiyat güncelleme', href: '/prices' },
      { key: 'tags', label: 'Ürün etiketleri', href: '/tags' },
      { key: 'allergens', label: 'Alerjen listesi', href: '/allergens' },
      { key: 'favorites', label: 'Favori listesi', href: '/favorites' },
    ],
    soon: ['Ürüne ek seçenekler', 'Menü setleri'],
  },
  {
    title: '2. Tasarım',
    items: [
      { key: 'qr', label: 'Karekod', href: '/qr' },
      { key: 'language', label: 'Dil ayarları', href: '/language' },
    ],
    soon: ['Menü tasarım'],
  },
  {
    title: '3. Duyuru',
    items: [{ key: 'announcements', label: 'Duyurular', href: '/announcements' }],
    soon: [],
  },
  {
    title: '4. Görüş & yorumlar',
    items: [{ key: 'reviews', label: 'Görüş & yorumlar', href: '/reviews' }],
    soon: [],
  },
  {
    title: '5. Sipariş',
    items: [],
    soon: ['Mekanda sipariş', 'Paket sipariş', 'Raporlar'],
  },
  {
    title: '6. Ayarlar',
    items: [
      { key: 'settings', label: 'İşletme ayarları', href: '/settings' },
      { key: 'locations', label: 'Adres/şube ayarları', href: '/locations' },
    ],
    soon: ['Panel kullanıcıları', 'Entegrasyon'],
  },
];

export default function Sidebar({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/admin/${slug}`;

  return (
    <nav className="w-40 flex-shrink-0 flex flex-col">
      {groups.map((g) => (
        <div key={g.title} className="mb-3">
          <p className="text-[11px] text-gray-400 mb-1">{g.title}</p>
          {g.items.map((it) => {
            const href = base + it.href;
            const active = pathname === href;
            return (
              <Link
                key={it.key}
                href={href}
                className={`block text-[13px] rounded-md px-2 py-1.5 ${
                  active ? 'bg-rose-50 text-rose-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {it.label}
              </Link>
            );
          })}
          {g.soon.map((label) => (
            <p key={label} className="text-[12px] text-gray-300 px-2 py-1.5">
              {label}
            </p>
          ))}
        </div>
      ))}
    </nav>
  );
}
