'use client';

import { useEffect, useRef, useState } from 'react';

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = Math.round((DESIGN_WIDTH * 16) / 9);

export default function PreviewPanel({ slug }: { slug: string }) {
  const [reloadKey, setReloadKey] = useState(0);
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateScale() {
      if (wrapperRef.current) {
        setScale(wrapperRef.current.offsetWidth / DESIGN_WIDTH);
      }
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <aside className="w-60 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500">Canlı önizleme</p>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="text-xs text-rose-600"
        >
          Yenile
        </button>
      </div>
      <div
        ref={wrapperRef}
        className="border border-gray-200 rounded-lg overflow-hidden w-full"
        style={{ aspectRatio: '9 / 16' }}
      >
        <div
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <iframe
            key={reloadKey}
            src={`/menu/${slug}`}
            style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, border: 'none' }}
          />
        </div>
      </div>
      <p className="text-[11px] text-gray-400 mt-2 text-center">
        Müşterilerinizin gördüğü görünüm
      </p>
    </aside>
  );
}
