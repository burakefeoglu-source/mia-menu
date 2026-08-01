'use client';

import { useState, useEffect } from 'react';

type Banner = { text: string; bg_color: string };

export default function BannerTicker({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;
  const banner = banners[idx];

  return (
    <div className="overflow-hidden rounded-lg mb-5 py-1.5 transition-colors duration-500"
      style={{ background: banner.bg_color }}>
      <div className="flex whitespace-nowrap" style={{ animation: 'ticker 18s linear infinite' }}>
        {[1, 2, 3].map((i) => (
          <span key={i} className="text-xs text-white font-medium px-8 flex-shrink-0">
            {banner.text}&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;
            {banner.text}&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;
            {banner.text}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
      {banners.length > 1 && (
        <div className="flex justify-center gap-1 mt-1">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`w-1 h-1 rounded-full transition-all ${i === idx ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
