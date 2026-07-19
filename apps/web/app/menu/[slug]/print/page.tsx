import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type SearchParams = {
  tmpl?: string;
  paper?: string;
  color?: string;
  prices?: string;
  descs?: string;
  images?: string;
  allergens?: string;
};

type Allergen = { code: string | null; name_tr: string };
type ProductAllergenRow = { allergens: Allergen };

export default async function PrintMenuPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: SearchParams;
}) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!tenant) notFound();

  const { data: sections } = await supabase
    .from('menu_sections')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('is_active', true)
    .order('sort_order');

  const { data: products } = await supabase
    .from('products')
    .select('*, product_allergens(allergens(code, name_tr))')
    .eq('tenant_id', tenant.id)
    .eq('is_active', true)
    .order('sort_order');

  const tmpl = searchParams.tmpl ?? 'klasik';
  const paper = searchParams.paper === 'a3' ? 'A3' : searchParams.paper === 'a5' ? 'A5' : 'A4';
  const color = searchParams.color ? decodeURIComponent(searchParams.color) : '#c0392b';
  const showPrices = searchParams.prices !== 'false';
  const showDescs = searchParams.descs !== 'false';
  const showImages = searchParams.images !== 'false';
  const showAllergens = searchParams.allergens !== 'false';

  const isSmall = paper === 'A5';
  const isLarge = paper === 'A3';
  const baseFontSize = isSmall ? 9 : isLarge ? 13 : 11;
  const titleFontSize = isSmall ? 16 : isLarge ? 24 : 20;
  const sectionFontSize = isSmall ? 9 : isLarge ? 12 : 10;

  const sectionList = sections ?? [];
  const productList = products ?? [];

  function renderKlasiklist() {
    return sectionList.map((s) => {
      const ps = productList.filter((p) => p.section_id === s.id);
      if (!ps.length) return '';
      return `
        <div style="break-inside:avoid; margin-bottom:14px;">
          <div style="font-size:${sectionFontSize}px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:${color}; border-bottom:1px solid ${color}; padding-bottom:2px; margin-bottom:5px;">${s.name}</div>
          ${ps.map((p) => `
            <div style="display:flex; justify-content:space-between; align-items:baseline; padding:2.5px 0; border-bottom:.5px dotted #ddd;">
              <div style="min-width:0;">
                <span style="font-size:${baseFontSize}px; color:#111;">${p.name}</span>
                ${showDescs && p.description ? `<span style="font-size:${baseFontSize - 1.5}px; color:#888; margin-left:5px;">${p.description}</span>` : ''}
                ${showAllergens && (p.product_allergens as ProductAllergenRow[])?.length ? `<div style="margin-top:2px;">${(p.product_allergens as ProductAllergenRow[]).map((pa) => `<span style="font-size:${baseFontSize - 2.5}px; background:#fef3c7; color:#92400e; padding:1px 4px; border-radius:2px; margin-right:2px;">${pa.allergens.name_tr}</span>`).join('')}</div>` : ''}
              </div>
              ${showPrices ? `<span style="font-size:${baseFontSize}px; font-weight:700; color:#111; white-space:nowrap; margin-left:8px;">${p.price} ₺</span>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
  }

  function renderIkiSutun() {
    const half = Math.ceil(sectionList.length / 2);
    const col1 = sectionList.slice(0, half);
    const col2 = sectionList.slice(half);
    function colHtml(cols: typeof sectionList) {
      return cols.map((s) => {
        const ps = productList.filter((p) => p.section_id === s.id);
        if (!ps.length) return '';
        return `
          <div style="break-inside:avoid; margin-bottom:12px;">
            <div style="font-size:${sectionFontSize}px; font-weight:700; text-transform:uppercase; color:${color}; border-bottom:1px solid ${color}; padding-bottom:2px; margin-bottom:4px;">${s.name}</div>
            ${ps.map((p) => `
              <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:.5px dotted #ddd;">
                <span style="font-size:${baseFontSize - 0.5}px;">${p.name}</span>
                ${showPrices ? `<span style="font-size:${baseFontSize - 0.5}px; font-weight:700; color:${color}; margin-left:4px; white-space:nowrap;">${p.price}</span>` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }).join('');
    }
    return `<div style="display:grid; grid-template-columns:1fr 1fr; gap:0 20px;">${colHtml(col1)}${colHtml(col2)}</div>`;
  }

  function renderFotografli() {
    return sectionList.map((s) => {
      const ps = productList.filter((p) => p.section_id === s.id);
      if (!ps.length) return '';
      return `
        <div style="break-inside:avoid; margin-bottom:14px;">
          <div style="font-size:${sectionFontSize}px; font-weight:700; text-transform:uppercase; color:${color}; margin-bottom:6px;">${s.name}</div>
          ${ps.map((p) => `
            <div style="display:flex; gap:8px; padding:4px 0; border-bottom:.5px solid #eee; break-inside:avoid;">
              ${showImages && p.image_url ? `<img src="${p.image_url}" style="width:${isSmall ? 32 : 44}px; height:${isSmall ? 32 : 44}px; object-fit:cover; border-radius:3px; flex-shrink:0;">` : showImages ? `<div style="width:${isSmall ? 32 : 44}px; height:${isSmall ? 32 : 44}px; background:#e5e7eb; border-radius:3px; flex-shrink:0;"></div>` : ''}
              <div style="flex:1; min-width:0;">
                <div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px;">
                  <span style="font-size:${baseFontSize}px; font-weight:600; flex:1;">${p.name}</span>
                  ${showPrices ? `<span style="font-size:${baseFontSize}px; font-weight:700; color:${color}; white-space:nowrap; margin-left:auto; flex-shrink:0;">${p.price} ₺</span>` : ''}
                </div>
                ${showDescs && p.description ? `<div style="font-size:${baseFontSize - 1.5}px; color:#666; margin-top:1px;">${p.description}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
  }

  function renderModern() {
    return sectionList.map((s) => {
      const ps = productList.filter((p) => p.section_id === s.id);
      if (!ps.length) return '';
      return `
        <div style="break-inside:avoid; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:5px;">
            <div style="height:.5px; flex:1; background:${color}; opacity:.4;"></div>
            <span style="font-size:${sectionFontSize}px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:${color};">${s.name}</span>
            <div style="height:.5px; flex:1; background:${color}; opacity:.4;"></div>
          </div>
          ${ps.map((p) => `
            <div style="display:flex; justify-content:space-between; padding:3px 0; border-bottom:.5px solid #eee;">
              <div>
                <span style="font-size:${baseFontSize}px; font-weight:500;">${p.name}</span>
                ${showDescs && p.description ? `<span style="font-size:${baseFontSize - 1.5}px; color:#999; margin-left:6px;">· ${p.description}</span>` : ''}
              </div>
              ${showPrices ? `<span style="font-size:${baseFontSize}px; font-weight:600; color:#111; margin-left:8px; white-space:nowrap;">${p.price}</span>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
  }

  function renderRetro() {
    return sectionList.map((s) => {
      const ps = productList.filter((p) => p.section_id === s.id);
      if (!ps.length) return '';
      return `
        <div style="break-inside:avoid; margin-bottom:12px;">
          <div style="background:${color}; color:#fff; font-size:${sectionFontSize}px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; padding:2px 8px; display:inline-block; border-radius:1px; margin-bottom:5px;">${s.name}</div>
          ${ps.map((p) => `
            <div style="display:flex; justify-content:space-between; align-items:baseline; padding:3px 0; border-bottom:.5px dashed #ddd;">
              <span style="font-size:${baseFontSize}px; font-weight:500; color:#1a1a1a;">${p.name}${showDescs && p.description ? `<span style="font-size:${baseFontSize - 2}px; color:#888; margin-left:5px;">${p.description}</span>` : ''}</span>
              ${showPrices ? `<span style="font-size:${baseFontSize}px; font-weight:700; color:${color}; margin-left:8px; white-space:nowrap;">${p.price} ₺</span>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
  }

  function renderTahta() {
    return sectionList.map((s) => {
      const ps = productList.filter((p) => p.section_id === s.id);
      if (!ps.length) return '';
      return `
        <div style="break-inside:avoid; margin-bottom:12px;">
          <div style="background:${color}; color:#c9a96e; font-size:${sectionFontSize}px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; padding:2px 8px; display:inline-block; border-radius:1px; margin-bottom:5px;">${s.name}</div>
          ${ps.map((p) => `
            <div style="display:flex; justify-content:space-between; align-items:baseline; padding:3px 0; border-bottom:.5px dashed #c9a96e;">
              <span style="font-size:${baseFontSize}px; color:#2c1810;">${p.name}</span>
              ${showPrices ? `<span style="font-size:${baseFontSize}px; font-weight:700; color:${color}; margin-left:8px; white-space:nowrap;">${p.price} ₺</span>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
  }

  const headerHtml = (() => {
    if (tmpl === 'retro') return `
      <div style="background:${color}; padding:8px; margin:-16mm -16mm 14px; text-align:center;">
        <div style="font-size:${baseFontSize - 1}px; color:rgba(255,255,255,.7); letter-spacing:.15em; text-transform:uppercase; margin-bottom:2px;">✦ Günün Menüsü ✦</div>
        <div style="font-size:${titleFontSize}px; color:#fff; font-weight:700; letter-spacing:.04em;">${tenant.name}</div>
      </div>
    `;
    if (tmpl === 'tahta') return `
      <div style="background:${color}; padding:8px; margin:-16mm -16mm 14px; text-align:center;">
        <div style="font-size:${baseFontSize - 1}px; color:#c9a96e; letter-spacing:.15em; text-transform:uppercase; margin-bottom:2px;">✦ Günün Menüsü ✦</div>
        <div style="font-size:${titleFontSize}px; color:#fdf8f0; font-weight:700; letter-spacing:.04em;">${tenant.name}</div>
      </div>
    `;
    if (tmpl === 'modern') return `
      <div style="display:flex; align-items:center; gap:10px; border-bottom:2px solid #111; padding-bottom:8px; margin-bottom:16px;">
        <div style="width:${isSmall ? 32 : 44}px; height:${isSmall ? 32 : 44}px; background:#111; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <span style="font-size:${isSmall ? 12 : 16}px; color:#fff; font-weight:700;">${tenant.name[0]}</span>
        </div>
        <div>
          <div style="font-size:${titleFontSize}px; font-weight:700; color:#111; letter-spacing:.04em;">${tenant.name.toUpperCase()}</div>
          ${tenant.address ? `<div style="font-size:${baseFontSize - 1}px; color:#888;">${tenant.address}</div>` : ''}
        </div>
      </div>
    `;
    return `
      <div style="text-align:center; border-bottom:2px solid #111; padding-bottom:6px; margin-bottom:14px;">
        ${tenant.logo_url ? `<img src="${tenant.logo_url}" style="width:${isSmall ? 36 : 52}px; height:${isSmall ? 36 : 52}px; object-fit:cover; border-radius:4px; margin-bottom:4px;">` : ''}
        <div style="font-size:${titleFontSize}px; font-weight:700; color:#111; letter-spacing:.04em;">${tenant.name.toUpperCase()}</div>
        ${tenant.address ? `<div style="font-size:${baseFontSize - 1}px; color:#666; letter-spacing:.08em; text-transform:uppercase; margin-top:2px;">${tenant.address}</div>` : ''}
      </div>
    `;
  })();

  const bodyHtml = (() => {
    if (tmpl === 'iki-sutun') return renderIkiSutun();
    if (tmpl === 'fotografli') return renderFotografli();
    if (tmpl === 'modern') return renderModern();
    if (tmpl === 'retro') return renderRetro();
    if (tmpl === 'tahta') return renderTahta();
    return renderKlasiklist();
  })();

  const bgColor = tmpl === 'tahta' ? '#fdf8f0' : tmpl === 'retro' ? '#fdf4e7' : '#ffffff';

  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <title>{tenant.name} — Menü</title>
        <style>{`
          @page { size: ${paper}; margin: 16mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: ${tmpl === 'klasik' ? 'Georgia, serif' : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
            font-size: ${baseFontSize}px;
            color: #111;
            background: ${bgColor};
          }
          .footer { margin-top:20px; padding-top:6px; border-top:1px solid #e5e7eb; font-size:8px; color:#9ca3af; text-align:center; }
          @media print { button { display:none !important; } }
        `}</style>
      </head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: headerHtml }} />
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        <div className="footer">
          {tenant.name} • {new Date().toLocaleDateString('tr-TR')} • Alerjen bilgisi yasal zorunluluk kapsamında sunulmaktadır.
        </div>
      </body>
    </html>
  );
}
