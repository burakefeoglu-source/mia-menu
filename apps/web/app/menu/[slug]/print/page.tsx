import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AllergenIcon } from '@/lib/allergenIcons';

export const dynamic = 'force-dynamic';

type SearchParams = {
  paper?: string;
  cols?: string;
  prices?: string;
  descs?: string;
  images?: string;
  allergens?: string;
};

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

  const cols = searchParams.cols === '2' ? 2 : 1;
  const showPrices = searchParams.prices !== 'false';
  const showDescs = searchParams.descs !== 'false';
  const showImages = searchParams.images !== 'false';
  const showAllergens = searchParams.allergens !== 'false';
  const paper = searchParams.paper === 'a5' ? 'a5' : 'a4';

  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <title>{tenant.name} — Menü</title>
        <style>{`
          @page {
            size: ${paper === 'a5' ? 'A5' : 'A4'};
            margin: 16mm;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: ${paper === 'a5' ? '10px' : '11px'};
            color: #111;
            background: #fff;
          }
          .header {
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 2px solid #111;
            padding-bottom: 8px;
            margin-bottom: 16px;
          }
          .header h1 {
            font-size: ${paper === 'a5' ? '18px' : '22px'};
            font-weight: 700;
          }
          .header img {
            width: ${paper === 'a5' ? '40px' : '50px'};
            height: ${paper === 'a5' ? '40px' : '50px'};
            object-fit: cover;
            border-radius: 6px;
          }
          .grid {
            columns: ${cols};
            column-gap: 16px;
          }
          .section {
            break-inside: avoid;
            margin-bottom: 14px;
          }
          .section-title {
            font-size: ${paper === 'a5' ? '13px' : '14px'};
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #ccc;
            padding-bottom: 3px;
            margin-bottom: 6px;
          }
          .product {
            display: flex;
            gap: 8px;
            padding: 4px 0;
            border-bottom: 1px dotted #e5e7eb;
            break-inside: avoid;
          }
          .product:last-child { border-bottom: none; }
          .product-img {
            width: 40px;
            height: 40px;
            object-fit: cover;
            border-radius: 4px;
            flex-shrink: 0;
          }
          .product-img-placeholder {
            width: 40px;
            height: 40px;
            flex-shrink: 0;
          }
          .product-body { flex: 1; min-width: 0; }
          .product-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 4px;
          }
          .product-name {
            font-weight: 600;
            font-size: ${paper === 'a5' ? '10px' : '11px'};
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .product-price {
            font-weight: 700;
            white-space: nowrap;
            font-size: ${paper === 'a5' ? '10px' : '11px'};
          }
          .product-desc {
            font-size: ${paper === 'a5' ? '8.5px' : '9px'};
            color: #6b7280;
            margin-top: 1px;
          }
          .allergens {
            display: flex;
            flex-wrap: wrap;
            gap: 3px;
            margin-top: 3px;
          }
          .allergen {
            font-size: ${paper === 'a5' ? '7.5px' : '8px'};
            background: #fef3c7;
            color: #92400e;
            padding: 1px 4px;
            border-radius: 3px;
          }
          .footer {
            margin-top: 20px;
            padding-top: 6px;
            border-top: 1px solid #e5e7eb;
            font-size: 8px;
            color: #9ca3af;
            text-align: center;
          }
          @media print {
            html, body { width: 100%; }
            button { display: none !important; }
          }
        `}</style>
      </head>
      <body>
        <div className="header">
          {tenant.logo_url && <img src={tenant.logo_url} alt={tenant.name} />}
          <h1>{tenant.name}</h1>
        </div>

        <div className="grid">
          {(sections ?? []).map((section) => {
            const sectionProducts = (products ?? []).filter(
              (p) => p.section_id === section.id
            );
            if (sectionProducts.length === 0) return null;

            return (
              <div key={section.id} className="section">
                <div className="section-title">{section.name}</div>
                {sectionProducts.map((p) => (
                  <div key={p.id} className="product">
                    {showImages && p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt={p.name} className="product-img" />
                    ) : showImages ? (
                      <div className="product-img-placeholder" />
                    ) : null}
                    <div className="product-body">
                      <div className="product-row">
                        <span className="product-name">{p.name}</span>
                        {showPrices && (
                          <span className="product-price">{p.price} ₺</span>
                        )}
                      </div>
                      {showDescs && p.description && (
                        <div className="product-desc">{p.description}</div>
                      )}
                      {showAllergens &&
                        p.product_allergens &&
                        p.product_allergens.length > 0 && (
                          <div className="allergens">
                            {p.product_allergens.map((pa: { allergens: { code: string | null; name_tr: string } }, i: number) => (
                              <span key={i} className="allergen">
                                {pa.allergens.name_tr}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="footer">
          Bu menü {new Date().toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur. •
          Alerjen bilgisi yasal zorunluluk kapsamında sunulmaktadır.
        </div>
      </body>
    </html>
  );
}
