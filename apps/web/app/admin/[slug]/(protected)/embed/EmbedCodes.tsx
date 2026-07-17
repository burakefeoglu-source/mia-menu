'use client';

import { useState } from 'react';

type Props = { menuUrl: string; tenantName: string; slug: string };

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">{label}</p>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className={`text-xs px-3 py-1 rounded-md transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          {copied ? '✓ Kopyalandı' : 'Kopyala'}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-xl overflow-x-auto leading-relaxed whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
}

export default function EmbedCodes({ menuUrl, tenantName }: Props) {
  const iframeCode = `<!-- ${tenantName} Dijital Menü -->
<iframe
  src="${menuUrl}"
  width="100%"
  height="700"
  frameborder="0"
  style="border-radius: 12px; max-width: 480px; display: block; margin: 0 auto;"
  title="${tenantName} Menü"
></iframe>`;

  const widgetCode = `<!-- mia.menu Yüzen Menü Butonu -->
<script>
(function() {
  var btn = document.createElement('a');
  btn.href = '${menuUrl}';
  btn.target = '_blank';
  btn.innerHTML = '🍽️ Menüyü Gör';
  btn.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#c2185b;color:#fff;padding:12px 20px;border-radius:50px;font-family:sans-serif;font-size:14px;font-weight:600;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:9999;';
  document.body.appendChild(btn);
})();
</script>`;

  const qrCode = `<!-- ${tenantName} QR Kod -->
<div style="text-align:center; padding: 20px;">
  <img
    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}"
    alt="${tenantName} Menü QR Kodu"
    width="200"
    height="200"
    style="border-radius: 8px;"
  />
  <p style="font-family:sans-serif; font-size:14px; color:#666; margin-top:8px;">
    Menüyü görmek için tarayın
  </p>
</div>`;

  const wordpressCode = `// WordPress functions.php veya sayfa içeriğine ekleyin:
[iframe src="${menuUrl}" width="100%" height="700"]

// Veya Elementor / Gutenberg HTML bloğuna:
${iframeCode}`;

  return (
    <div className="max-w-2xl">
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mb-6 text-xs text-amber-800">
        💡 Tüm kodlar hazır, sitenize kopyalayıp yapıştırmanız yeterli. Teknik bilgi gerekmez.
      </div>

      <CodeBlock label="1. iframe — Sayfaya gömülü menü (önerilen)" code={iframeCode} />
      <CodeBlock label="2. Yüzen buton — Sağ altta 'Menüyü Gör' butonu" code={widgetCode} />
      <CodeBlock label="3. QR kod görseli — Sayfaya QR kod ekle" code={qrCode} />
      <CodeBlock label="4. WordPress / Wix / Squarespace" code={wordpressCode} />

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2">
        <p className="text-sm font-medium mb-2">Menü bağlantısı</p>
        <p className="text-xs text-gray-500 mb-2">Doğrudan menü adresi — sosyal medyada paylaşın veya linktree'ye ekleyin:</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700">
            {menuUrl}
          </code>
          <button onClick={() => navigator.clipboard.writeText(menuUrl)}
            className="text-xs bg-gray-100 px-2 py-1.5 rounded-md text-gray-600">Kopyala</button>
        </div>
      </div>
    </div>
  );
}
