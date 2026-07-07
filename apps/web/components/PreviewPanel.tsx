'use client';

import { useEffect, useRef, useState } from 'react';
import { listenPreviewRefresh } from '@/lib/previewChannel';

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = Math.round((DESIGN_WIDTH * 16) / 9);

export default function PreviewPanel({ slug }: { slug: string }) {
  const [reloadKey, setReloadKey] = useState(0);
  const [scale, setScale] = useState(1);
  const [flash, setFlash] = useState(false);
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

  useEffect(() => {
    const unlisten = listenPreviewRefresh(() => {
      setReloadKey((k) => k + 1);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    });
    return unlisten;
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
        className="rounded-lg overflow-hidden w-full transition-all duration-300"
        style={{
          aspectRatio: '9 / 16',
          border: flash ? '2px solid #c2185b' : '1px solid #e5e7eb',
        }}
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
        Değişiklikler otomatik yansır
      </p>
    </aside>
  );
}
