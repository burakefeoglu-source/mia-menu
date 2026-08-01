'use client';

type Banner = { text: string; bg_color: string };

export default function BannerTicker({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) return null;

  // Tüm banner metinlerini tek bir şerit halinde birleştir
  const combinedItems = [...banners, ...banners, ...banners]; // 3x döngü için
  const speed = banners.length * 12; // banner sayısına göre hız ayarı (sn)

  return (
    <div className="mb-5 rounded-lg overflow-hidden"
      style={{ background: banners[0].bg_color }}>
      <div className="overflow-hidden py-1.5">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: `ticker ${speed}s linear infinite` }}
        >
          {combinedItems.map((b, i) => (
            <span key={i} className="text-xs text-white font-medium px-8 flex-shrink-0"
              style={{ color: 'white' }}>
              {b.text}
              <span className="mx-4 opacity-50">✦</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
