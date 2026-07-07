'use client';

import { useEffect, useRef } from 'react';

type Style = 'square' | 'rounded' | 'dot';

const presets: Record<
  Style,
  { dots: string; cornersSquare: string; cornersDot: string }
> = {
  square: { dots: 'square', cornersSquare: 'square', cornersDot: 'square' },
  rounded: { dots: 'rounded', cornersSquare: 'extra-rounded', cornersDot: 'dot' },
  dot: { dots: 'dots', cornersSquare: 'dot', cornersDot: 'dot' },
};

export default function QrCard({
  label,
  url,
  style,
  logoUrl,
  fgColor = '#111827',
  bgColor = '#ffffff',
}: {
  label: string;
  url: string;
  style: Style;
  logoUrl: string;
  fgColor?: string;
  bgColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qrRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mod = await import('qr-code-styling');
      const QRCodeStyling = mod.default;
      const preset = presets[style];

      const qr = new QRCodeStyling({
        width: 200,
        height: 200,
        data: url,
        margin: 6,
        qrOptions: { errorCorrectionLevel: 'H' },
        dotsOptions: { type: preset.dots as never, color: fgColor },
        cornersSquareOptions: { type: preset.cornersSquare as never, color: fgColor },
        cornersDotOptions: { type: preset.cornersDot as never, color: fgColor },
        backgroundOptions: { color: bgColor },
        image: logoUrl || undefined,
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 4,
          hideBackgroundDots: true,
          imageSize: 0.35,
        },
      });

      if (!cancelled && containerRef.current) {
        containerRef.current.innerHTML = '';
        qr.append(containerRef.current);
        qrRef.current = qr;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, style, logoUrl, fgColor, bgColor]);

  async function downloadPng() {
    await qrRef.current?.download({ name: label, extension: 'png' });
  }

  async function downloadSvg() {
    await qrRef.current?.download({ name: label, extension: 'svg' });
  }

  async function downloadPdf() {
    const blob = await qrRef.current?.getRawData('png');
    if (!blob) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: [260, 320] });
      doc.addImage(dataUrl, 'PNG', 30, 20, 200, 200);
      doc.setFontSize(12);
      doc.text(label, 130, 250, { align: 'center' });
      doc.save(`${label}.pdf`);
    };
    reader.readAsDataURL(blob as Blob);
  }

  return (
    <div className="border border-gray-200 rounded-md p-3 text-center">
      <div ref={containerRef} className="flex justify-center mb-2" />
      <p className="text-xs mb-2">{label}</p>
      <div className="flex justify-center gap-1.5">
        <button onClick={downloadPng} className="text-[11px] px-1.5 py-1 rounded-md bg-gray-100">
          PNG
        </button>
        <button onClick={downloadSvg} className="text-[11px] px-1.5 py-1 rounded-md bg-gray-100">
          SVG
        </button>
        <button onClick={downloadPdf} className="text-[11px] px-1.5 py-1 rounded-md bg-gray-100">
          PDF
        </button>
      </div>
    </div>
  );
}
