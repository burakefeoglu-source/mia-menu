'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { translateToEnglish } from '@/lib/translate';
import { requireTenantAccess } from '@/lib/authGuard';
import { detectAllergens } from '@/lib/allergenDetector';

// RLS bypass için service role client
function getDb() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function addSection(tenantId: string, slug: string, formData: FormData) {
  const supabase = getDb();
  const name = formData.get('name') as string;

  await supabase.from('menu_sections').insert({ tenant_id: tenantId, name });

  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function addProduct(
  tenantId: string,
  sectionId: string,
  slug: string,
  formData: FormData
) {
  const supabase = getDb();
  const name = formData.get('name') as string;
  const description = (formData.get('description') as string) || null;

  const { data: product } = await supabase.from('products').insert({
    tenant_id: tenantId,
    section_id: sectionId,
    name,
    price: Number(formData.get('price')),
    calories: formData.get('calories') ? Number(formData.get('calories')) : null,
    image_url: (formData.get('image_url') as string) || null,
    description,
  }).select('id').single();

  // Otomatik alerjen tespiti
  if (product?.id) {
    await autoAssignAllergens(supabase, product.id, name, description);
  }

  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateSectionName(sectionId: string, slug: string, name: string, imageUrl?: string | null) {
  const supabase = getDb();
  await supabase.from('menu_sections').update({
    name,
    image_url: imageUrl !== undefined ? imageUrl : undefined,
  }).eq('id', sectionId);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function deleteSection(sectionId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('menu_sections').delete().eq('id', sectionId);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateProduct(
  productId: string,
  slug: string,
  data: { name: string; price: number; calories: number | null; imageUrl: string | null; description?: string | null }
) {
  const supabase = getDb();
  await supabase
    .from('products')
    .update({
      name: data.name,
      price: data.price,
      calories: data.calories,
      image_url: data.imageUrl,
      description: data.description ?? null,
    })
    .eq('id', productId);

  // Otomatik alerjen tespiti
  await autoAssignAllergens(supabase, productId, data.name, data.description);

  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/admin/${slug}/prices`);
  revalidatePath(`/menu/${slug}`);
}

// --- Otomatik alerjen ataması ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function autoAssignAllergens(supabase: any, productId: string, name: string, description?: string | null) {
  try {
    const codes = detectAllergens(name, description);
    if (codes.length === 0) return;

    // Alerjen ID'lerini çek
    const { data: allergens } = await supabase
      .from('allergens')
      .select('id, code')
      .in('code', codes);

    if (!allergens?.length) return;

    // Mevcut atamaları kontrol et — sadece yeni olanları ekle
    const { data: existing } = await supabase
      .from('product_allergens')
      .select('allergen_id')
      .eq('product_id', productId);

    const existingIds = new Set((existing ?? []).map((e: { allergen_id: string }) => e.allergen_id));
    const toInsert = allergens
      .filter((a: { id: string }) => !existingIds.has(a.id))
      .map((a: { id: string }) => ({ product_id: productId, allergen_id: a.id }));

    if (toInsert.length > 0) {
      await supabase.from('product_allergens').insert(toInsert);
    }
  } catch (e) {
    console.error('autoAssignAllergens error:', e);
  }
}

export async function setProductAllergens(
  productId: string,
  slug: string,
  allergenIds: string[]
) {
  const supabase = getDb();
  await supabase.from('product_allergens').delete().eq('product_id', productId);
  if (allergenIds.length > 0) {
    await supabase
      .from('product_allergens')
      .insert(allergenIds.map((allergenId) => ({ product_id: productId, allergen_id: allergenId })));
  }
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function deleteProduct(productId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('products').delete().eq('id', productId);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/admin/${slug}/prices`);
  revalidatePath(`/menu/${slug}`);
}

export async function reorderProducts(slug: string, orderedIds: string[]) {
  const supabase = getDb();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('products').update({ sort_order: index }).eq('id', id)
    )
  );
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function reorderSections(slug: string, orderedIds: string[]) {
  const supabase = getDb();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('menu_sections').update({ sort_order: index }).eq('id', id)
    )
  );
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function updatePrice(productId: string, slug: string, price: number) {
  const supabase = getDb();

  await supabase.from('products').update({ price }).eq('id', productId);

  revalidatePath(`/admin/${slug}/prices`);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateTenant(tenantId: string, slug: string, formData: FormData) {
  const supabase = getDb();

  await supabase
    .from('tenants')
    .update({
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      cover_image_url: (formData.get('cover_image_url') as string) || null,
      logo_url: (formData.get('logo_url') as string) || null,
      logo_light_url: (formData.get('logo_light_url') as string) || null,
      qr_logo_url: (formData.get('qr_logo_url') as string) || null,
      custom_subdomain: (formData.get('custom_subdomain') as string)?.toLowerCase().replace(/[^a-z0-9-]/g, '') || null,
      google_review_url: (formData.get('google_review_url') as string) || null,
      instagram_url: (formData.get('social_instagram') as string) || null,
      whatsapp_number: (formData.get('social_whatsapp') as string) || null,
      google_maps_url: (formData.get('social_maps') as string) || null,
      facebook_url: (formData.get('social_facebook') as string) || null,
      tiktok_url: (formData.get('social_tiktok') as string) || null,
      linkedin_url: (formData.get('social_linkedin') as string) || null,
      twitter_url: (formData.get('social_twitter') as string) || null,
      youtube_url: (formData.get('social_youtube') as string) || null,
      working_hours: (formData.get('working_hours') as string) || null,
      notification_phone: (formData.get('notification_phone') as string) || null,
      callmebot_api_key: (formData.get('callmebot_api_key') as string) || null,
    })
    .eq('id', tenantId);

  revalidatePath(`/admin/${slug}/settings`);
  revalidatePath(`/menu/${slug}`);
}

export async function addAnnouncement(tenantId: string, slug: string, formData: FormData) {
  const supabase = getDb();

  const startsAt = (formData.get('starts_at') as string) || null;
  const endsAt = (formData.get('ends_at') as string) || null;

  await supabase.from('announcements').insert({
    tenant_id: tenantId,
    kind: formData.get('kind') as string,
    icon_type: (formData.get('icon_type') as string) || 'duyuru',
    title: formData.get('title') as string,
    message: (formData.get('message') as string) || null,
    image_url: (formData.get('image_url') as string) || null,
    starts_at: startsAt ? new Date(startsAt).toISOString() : null,
    ends_at: endsAt ? new Date(endsAt).toISOString() : null,
  });

  revalidatePath(`/admin/${slug}/announcements`);
  revalidatePath(`/menu/${slug}`);
}

export async function toggleAnnouncement(id: string, slug: string, nextActive: boolean) {
  const supabase = getDb();

  await supabase.from('announcements').update({ is_active: nextActive }).eq('id', id);

  revalidatePath(`/admin/${slug}/announcements`);
  revalidatePath(`/menu/${slug}`);
}

export async function deleteAnnouncement(id: string, slug: string) {
  const supabase = getDb();

  await supabase.from('announcements').delete().eq('id', id);

  revalidatePath(`/admin/${slug}/announcements`);
  revalidatePath(`/menu/${slug}`);
}

export async function upsertTranslation(
  tenantId: string,
  slug: string,
  entityType: 'product' | 'section',
  entityId: string,
  field: string,
  value: string
) {
  const supabase = getDb();
  const trimmed = value.trim();

  if (!trimmed) {
    await supabase
      .from('translations')
      .delete()
      .match({ entity_type: entityType, entity_id: entityId, locale: 'en', field });
  } else {
    await supabase.from('translations').upsert(
      {
        tenant_id: tenantId,
        entity_type: entityType,
        entity_id: entityId,
        locale: 'en',
        field,
        value: trimmed,
      },
      { onConflict: 'entity_type,entity_id,locale,field' }
    );
  }

  revalidatePath(`/admin/${slug}/language`);
  revalidatePath(`/menu/${slug}`);
}

export async function autoTranslateOne(text: string) {
  try {
    const translated = await translateToEnglish(text);
    return { translated };
  } catch {
    return { error: 'Çeviri yapılamadı, lütfen elle gir.' };
  }
}

export async function autoTranslateMissing(
  tenantId: string,
  slug: string,
  items: { entityType: 'product' | 'section'; entityId: string; text: string }[]
) {
  const supabase = getDb();

  for (const item of items) {
    try {
      const translated = await translateToEnglish(item.text);
      if (translated) {
        await supabase.from('translations').upsert(
          {
            tenant_id: tenantId,
            entity_type: item.entityType,
            entity_id: item.entityId,
            locale: 'en',
            field: 'name',
            value: translated,
          },
          { onConflict: 'entity_type,entity_id,locale,field' }
        );
      }
    } catch {
      // bu satırı atla, diğerlerine devam et
    }
  }

  revalidatePath(`/admin/${slug}/language`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateOrderStatus(
  orderId: string,
  slug: string,
  status: 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled'
) {
  const supabase = getDb();

  await supabase.from('orders').update({ status }).eq('id', orderId);

  revalidatePath(`/admin/${slug}/orders`);
  revalidatePath(`/admin/${slug}/reports`);
}

export async function updateQrStyle(
  tenantId: string,
  slug: string,
  style: 'square' | 'rounded' | 'dot'
) {
  const supabase = getDb();
  await supabase.from('tenants').update({ qr_style: style }).eq('id', tenantId);
  revalidatePath(`/admin/${slug}/qr`);
}

export async function updateQrLogo(tenantId: string, slug: string, logoUrl: string) {
  const supabase = getDb();
  await supabase
    .from('tenants')
    .update({ logo_url: logoUrl || null })
    .eq('id', tenantId);
  revalidatePath(`/admin/${slug}/qr`);
  revalidatePath(`/admin/${slug}/settings`);
}

export async function generateTables(tenantId: string, slug: string, count: number) {
  const supabase = getDb();

  const { data: existing } = await supabase
    .from('tables')
    .select('label')
    .eq('tenant_id', tenantId);

  const existingNumbers = (existing ?? [])
    .map((t) => parseInt(t.label.replace(/[^0-9]/g, ''), 10))
    .filter((n) => !isNaN(n));
  const startFrom = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

  const rows = Array.from({ length: count }, (_, i) => ({
    tenant_id: tenantId,
    label: `Masa ${startFrom + i}`,
  }));

  await supabase.from('tables').insert(rows);

  revalidatePath(`/admin/${slug}/qr`);
}

export async function deleteTable(tableId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('tables').delete().eq('id', tableId);
  revalidatePath(`/admin/${slug}/qr`);
}

// --- Etiketler ---

export async function addTag(tenantId: string, slug: string, formData: FormData) {
  const supabase = getDb();
  const name = (formData.get('name') as string)?.trim();
  const icon = (formData.get('icon') as string)?.trim() || null;
  if (!name) return;
  await supabase.from('tags').insert({ tenant_id: tenantId, name, icon });
  revalidatePath(`/admin/${slug}/tags`);
  revalidatePath(`/menu/${slug}`);
}

export async function deleteTag(tagId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('tags').delete().eq('id', tagId);
  revalidatePath(`/admin/${slug}/tags`);
  revalidatePath(`/menu/${slug}`);
}

export async function toggleProductTag(
  productId: string,
  tagId: string,
  slug: string,
  assign: boolean
) {
  const supabase = getDb();
  if (assign) {
    await supabase.from('product_tags').insert({ product_id: productId, tag_id: tagId });
  } else {
    await supabase
      .from('product_tags')
      .delete()
      .match({ product_id: productId, tag_id: tagId });
  }
  revalidatePath(`/admin/${slug}/tags`);
  revalidatePath(`/menu/${slug}`);
}

// --- Alerjenler ---

export async function addAllergen(tenantId: string, slug: string, formData: FormData) {
  const supabase = getDb();
  const name_tr = (formData.get('name_tr') as string)?.trim();
  if (!name_tr) return;
  const name_en = (formData.get('name_en') as string)?.trim() || null;
  await supabase.from('allergens').insert({ tenant_id: tenantId, name_tr, name_en });
  revalidatePath(`/admin/${slug}/allergens`);
  revalidatePath(`/menu/${slug}`);
}

export async function deleteAllergen(allergenId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('allergens').delete().eq('id', allergenId);
  revalidatePath(`/admin/${slug}/allergens`);
  revalidatePath(`/menu/${slug}`);
}

export async function toggleProductAllergen(
  productId: string,
  allergenId: string,
  slug: string,
  assign: boolean
) {
  const supabase = getDb();
  if (assign) {
    await supabase
      .from('product_allergens')
      .insert({ product_id: productId, allergen_id: allergenId });
  } else {
    await supabase
      .from('product_allergens')
      .delete()
      .match({ product_id: productId, allergen_id: allergenId });
  }
  revalidatePath(`/admin/${slug}/allergens`);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

// --- Favoriler ---

export async function toggleFavorite(productId: string, slug: string, value: boolean) {
  const supabase = getDb();
  await supabase.from('products').update({ is_favorite: value }).eq('id', productId);
  revalidatePath(`/admin/${slug}/favorites`);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

// --- Görüş & yorumlar ---

export async function deleteReview(reviewId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('reviews').delete().eq('id', reviewId);
  revalidatePath(`/admin/${slug}/reviews`);
}

// --- Adres / şube ---

export async function addLocation(tenantId: string, slug: string, formData: FormData) {
  const supabase = getDb();
  await supabase.from('locations').insert({
    tenant_id: tenantId,
    name: formData.get('name') as string,
    address: (formData.get('address') as string) || null,
    phone: (formData.get('phone') as string) || null,
  });
  revalidatePath(`/admin/${slug}/locations`);
}

export async function updateLocation(locationId: string, slug: string, formData: FormData) {
  const supabase = getDb();
  await supabase
    .from('locations')
    .update({
      name: formData.get('name') as string,
      address: (formData.get('address') as string) || null,
      phone: (formData.get('phone') as string) || null,
    })
    .eq('id', locationId);
  revalidatePath(`/admin/${slug}/locations`);
}

export async function deleteLocation(locationId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('locations').delete().eq('id', locationId);
  revalidatePath(`/admin/${slug}/locations`);
}

// --- İçe aktarma ---

export async function importProducts(
  tenantId: string,
  slug: string,
  rows: { sectionName: string; name: string; price: number; description?: string; calories?: number }[]
) {
  const { createClient: createServiceClient } = await import('@supabase/supabase-js');
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Mevcut bölümleri çek
  const { data: existingSections } = await supabase
    .from('menu_sections')
    .select('id, name')
    .eq('tenant_id', tenantId);

  const sectionMap = new Map((existingSections ?? []).map((s) => [s.name.trim().toLowerCase(), s.id]));

  // Yeni bölüm isimleri
  const newSectionNames = [...new Set(rows.map((r) => r.sectionName.trim()))]
    .filter((name) => !sectionMap.has(name.toLowerCase()));

  if (newSectionNames.length > 0) {
    const { data: created } = await supabase
      .from('menu_sections')
      .insert(newSectionNames.map((name, i) => ({
        tenant_id: tenantId,
        name,
        sort_order: (existingSections?.length ?? 0) + i + 1,
      })))
      .select('id, name');

    (created ?? []).forEach((s) => sectionMap.set(s.name.trim().toLowerCase(), s.id));
  }

  // Ürünleri ekle
  const products = rows.map((r) => ({
    tenant_id: tenantId,
    section_id: sectionMap.get(r.sectionName.trim().toLowerCase()),
    name: r.name,
    price: r.price,
    description: r.description || null,
    calories: r.calories || null,
    sort_order: 0,
  })).filter((p) => p.section_id);

  const { data: insertedProducts, error } = await supabase.from('products').insert(products).select('id, name, description');
  if (error) return { error: 'Aktarım sırasında hata oluştu: ' + error.message };

  // Otomatik alerjen tespiti — her ürün için
  if (insertedProducts?.length) {
    const { data: allAllergens } = await supabase.from('allergens').select('id, code').not('code', 'is', null);
    const allergenByCode = new Map((allAllergens ?? []).map((a: { id: string; code: string }) => [a.code, a.id]));

    const allergenRows: { product_id: string; allergen_id: string }[] = [];
    for (const p of insertedProducts) {
      const codes = detectAllergens(p.name, p.description);
      for (const code of codes) {
        const aid = allergenByCode.get(code);
        if (aid) allergenRows.push({ product_id: p.id, allergen_id: aid });
      }
    }
    if (allergenRows.length > 0) {
      await supabase.from('product_allergens').insert(allergenRows);
    }
  }

  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
  return { imported: products.length };
}

// --- Menü tasarım ---

export async function updateThemeColor(tenantId: string, slug: string, theme: string) {
  const supabase = getDb();
  await supabase.from('tenants').update({ theme_color: theme }).eq('id', tenantId);
  revalidatePath(`/admin/${slug}/design`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateMenuLayout(
  tenantId: string,
  slug: string,
  layout: 'classic' | 'dark' | 'minimal'
) {
  const supabase = getDb();
  await supabase.from('tenants').update({ menu_layout: layout }).eq('id', tenantId);
  revalidatePath(`/admin/${slug}/design`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateSectionNav(
  tenantId: string,
  slug: string,
  nav: 'tabs' | 'grid' | 'list'
) {
  const supabase = getDb();
  await supabase.from('tenants').update({ section_nav: nav }).eq('id', tenantId);
  revalidatePath(`/admin/${slug}/design`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateSectionDisplayStyle(
  sectionId: string,
  slug: string,
  style: 'list' | 'list_image' | 'grid'
) {
  const supabase = getDb();
  await supabase.from('menu_sections').update({ display_style: style }).eq('id', sectionId);
  revalidatePath(`/admin/${slug}/design`);
  revalidatePath(`/menu/${slug}`);
}


// --- Link sayfası ---

export async function updateLinksProfile(tenantId: string, slug: string, formData: FormData) {
  const supabase = getDb();
  await supabase.from('tenants').update({
    links_bio: (formData.get('links_bio') as string) || null,
    cover_image_url: (formData.get('cover_image_url') as string) || null,
    instagram_url: (formData.get('social_instagram') as string) || null,
    whatsapp_number: (formData.get('social_whatsapp') as string) || null,
    google_maps_url: (formData.get('social_maps') as string) || null,
    facebook_url: (formData.get('social_facebook') as string) || null,
    tiktok_url: (formData.get('social_tiktok') as string) || null,
    linkedin_url: (formData.get('social_linkedin') as string) || null,
    twitter_url: (formData.get('social_twitter') as string) || null,
    youtube_url: (formData.get('social_youtube') as string) || null,
  }).eq('id', tenantId);
  revalidatePath(`/admin/${slug}/links`);
  revalidatePath(`/l/${slug}`);
}

export async function addTenantLink(tenantId: string, slug: string, formData: FormData) {
  const supabase = getDb();
  const { data: last } = await supabase
    .from('tenant_links')
    .select('sort_order')
    .eq('tenant_id', tenantId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  await supabase.from('tenant_links').insert({
    tenant_id: tenantId,
    title: formData.get('title') as string,
    subtitle: (formData.get('subtitle') as string) || null,
    url: formData.get('url') as string,
    icon: (formData.get('icon') as string) || 'link',
    color: (formData.get('color') as string) || '#6b7280',
    sort_order: (last?.sort_order ?? 0) + 1,
  });
  revalidatePath(`/admin/${slug}/links`);
  revalidatePath(`/l/${slug}`);
}

export async function deleteTenantLink(linkId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('tenant_links').delete().eq('id', linkId);
  revalidatePath(`/admin/${slug}/links`);
  revalidatePath(`/l/${slug}`);
}

export async function toggleTenantLink(linkId: string, slug: string, active: boolean) {
  const supabase = getDb();
  await supabase.from('tenant_links').update({ is_active: active }).eq('id', linkId);
  revalidatePath(`/admin/${slug}/links`);
  revalidatePath(`/l/${slug}`);
}

// --- Toplu fiyat güncelleme ---

export async function bulkUpdatePrices(
  tenantId: string,
  slug: string,
  type: 'percent' | 'flat',
  direction: 'increase' | 'decrease',
  amount: number,
  sectionId?: string,
  includeOptions?: boolean
) {
  const supabase = getDb();

  function calcNew(price: number): number {
    let newPrice: number;
    if (type === 'percent') {
      const delta = (price * amount) / 100;
      newPrice = direction === 'increase' ? price + delta : price - delta;
    } else {
      newPrice = direction === 'increase' ? price + amount : price - amount;
    }
    return Math.max(0, Math.round(newPrice * 100) / 100);
  }

  // Ürün fiyatları
  let query = supabase.from('products').select('id, price').eq('tenant_id', tenantId);
  if (sectionId) query = query.eq('section_id', sectionId);
  const { data: products } = await query;
  let updated = 0;

  if (products?.length) {
    await Promise.all(
      products.map((p) =>
        supabase.from('products').update({ price: calcNew(p.price) }).eq('id', p.id)
      )
    );
    updated += products.length;
  }

  // Seçenek fiyatları
  if (includeOptions && products?.length) {
    const productIds = products.map(p => p.id);
    const { data: groups } = await supabase
      .from('product_option_groups')
      .select('id')
      .in('product_id', productIds);

    if (groups?.length) {
      const groupIds = groups.map(g => g.id);
      const { data: items } = await supabase
        .from('product_option_items')
        .select('id, price')
        .in('group_id', groupIds);

      if (items?.length) {
        await Promise.all(
          items.map(i =>
            supabase.from('product_option_items').update({ price: calcNew(i.price) }).eq('id', i.id)
          )
        );
        updated += items.length;
      }
    }
  }

  revalidatePath(`/admin/${slug}/prices`);
  revalidatePath(`/menu/${slug}`);
  return { updated };
}

// --- Ürün bayrakları (diyet rozetleri + günün menüsü) ---

export async function updateProductFlags(
  productId: string,
  slug: string,
  flags: {
    is_vegan?: boolean;
    is_vegetarian?: boolean;
    is_gluten_free?: boolean;
    is_daily_special?: boolean;
  }
) {
  const supabase = getDb();
  await supabase.from('products').update(flags).eq('id', productId);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

// --- Bölüm / ürün aktif-pasif ---

export async function toggleSectionActive(sectionId: string, slug: string, active: boolean) {
  const supabase = getDb();
  await supabase.from('menu_sections').update({ is_active: active }).eq('id', sectionId);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function toggleProductActive(productId: string, slug: string, active: boolean) {
  const supabase = getDb();
  await supabase.from('products').update({ is_active: active }).eq('id', productId);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

// --- Etkin diller ---
export async function updateEnabledLocales(tenantId: string, slug: string, locales: string[]) {
  const supabase = getDb();
  await supabase.from('tenants').update({ enabled_locales: locales }).eq('id', tenantId);
  revalidatePath(`/admin/${slug}/language`);
  revalidatePath(`/menu/${slug}`);
}

// --- Otomatik çeviri (Claude Haiku) ---
export async function autoTranslateMenu(tenantId: string, slug: string, targetLocale: string) {
  const supabase = getDb();

  const [{ data: sections }, { data: products }] = await Promise.all([
    supabase.from('menu_sections').select('id, name').eq('tenant_id', tenantId).order('sort_order'),
    supabase.from('products').select('id, name, description').eq('tenant_id', tenantId).order('sort_order'),
  ]);

  const payload = {
    sections: (sections ?? []).map(s => ({ id: s.id, name: s.name })),
    products: (products ?? []).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || null,
    })),
  };

  const { getLang } = await import('@/lib/languages');
  const langName = getLang(targetLocale)?.name ?? targetLocale;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Translate the following restaurant menu content from Turkish to ${langName}. 
Return ONLY valid JSON in the exact same structure. Keep IDs unchanged. 
For null descriptions keep them null. Be natural and appetizing for food menus.

${JSON.stringify(payload)}`,
      }],
      system: 'You are a professional restaurant menu translator. Return only valid JSON, no markdown, no explanation.',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return { error: `API hatası: ${err}` };
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? '';

  let translated: typeof payload;
  try {
    const clean = text.replace(/```json|```/g, '').trim();
    translated = JSON.parse(clean);
  } catch {
    return { error: 'Çeviri ayrıştırılamadı' };
  }

  // Çevirileri translations tablosuna kaydet
  const rows: { tenant_id: string; entity_type: string; entity_id: string; locale: string; field: string; value: string }[] = [];

  for (const s of translated.sections ?? []) {
    if (s.name) rows.push({ tenant_id: tenantId, entity_type: 'section', entity_id: s.id, locale: targetLocale, field: 'name', value: s.name });
  }
  for (const p of translated.products ?? []) {
    if (p.name) rows.push({ tenant_id: tenantId, entity_type: 'product', entity_id: p.id, locale: targetLocale, field: 'name', value: p.name });
    if (p.description) rows.push({ tenant_id: tenantId, entity_type: 'product', entity_id: p.id, locale: targetLocale, field: 'description', value: p.description });
  }

  // Önce mevcut çevirileri sil, sonra yenilerini ekle
  await supabase.from('translations')
    .delete()
    .eq('tenant_id', tenantId)
    .eq('locale', targetLocale);

  if (rows.length > 0) {
    await supabase.from('translations').insert(rows);
  }

  revalidatePath(`/admin/${slug}/language`);
  revalidatePath(`/menu/${slug}`);
  return { success: true, count: rows.length };
}

// --- Sadakat programı ---

export async function createLoyaltyProgram(tenantId: string, slug: string, formData: FormData) {
  const supabase = getDb();
  await supabase.from('loyalty_programs').insert({
    tenant_id: tenantId,
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    required_stamps: parseInt(formData.get('required_stamps') as string) || 10,
    reward_description: formData.get('reward_description') as string,
  });
  revalidatePath(`/admin/${slug}/loyalty`);
}

export async function toggleLoyaltyProgram(programId: string, slug: string, active: boolean) {
  const supabase = getDb();
  await supabase.from('loyalty_programs').update({ is_active: active }).eq('id', programId);
  revalidatePath(`/admin/${slug}/loyalty`);
}

export async function deleteLoyaltyProgram(programId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('loyalty_programs').delete().eq('id', programId);
  revalidatePath(`/admin/${slug}/loyalty`);
}

export async function addStamp(
  tenantId: string,
  slug: string,
  programId: string,
  customerPhone: string,
  customerName: string
): Promise<{ stamps: number; completed: boolean; reward: string; requiredStamps: number } | { error: string }> {
  try {
    const supabase = getDb();

    const { data: program, error: progErr } = await supabase
      .from('loyalty_programs')
      .select('required_stamps, reward_description')
      .eq('id', programId)
      .single();

    if (progErr || !program) return { error: `Program bulunamadı: ${progErr?.message}` };

    // Kart bul veya oluştur
    let { data: card } = await supabase
      .from('loyalty_cards')
      .select('id, stamps, completed_count')
      .eq('program_id', programId)
      .eq('customer_phone', customerPhone)
      .maybeSingle();

    if (!card) {
      const { data: newCard, error: cardErr } = await supabase
        .from('loyalty_cards')
        .insert({ tenant_id: tenantId, program_id: programId, customer_phone: customerPhone, customer_name: customerName || null })
        .select('id, stamps, completed_count')
        .single();
      if (cardErr) return { error: `Kart oluşturulamadı: ${cardErr.message}` };
      card = newCard;
    }

    if (!card) return { error: 'Kart bulunamadı' };

    const newStamps = card.stamps + 1;
    const completed = newStamps >= program.required_stamps;

    await supabase.from('loyalty_stamps').insert({ card_id: card.id });
    await supabase.from('loyalty_cards').update({
      stamps: completed ? 0 : newStamps,
      completed_count: completed ? card.completed_count + 1 : card.completed_count,
      customer_name: customerName || undefined,
    }).eq('id', card.id);

    revalidatePath(`/admin/${slug}/loyalty`);
    return {
      stamps: completed ? 0 : newStamps,
      completed,
      reward: program.reward_description,
      requiredStamps: program.required_stamps,
    };
  } catch (e) {
    return { error: `Beklenmeyen hata: ${(e as Error).message}` };
  }
}

// --- Ürün ek seçenekleri ---

export async function addOptionGroup(productId: string, slug: string, name: string, isRequired: boolean) {
  const supabase = getDb();
  const { data: last } = await supabase.from('product_option_groups')
    .select('sort_order').eq('product_id', productId)
    .order('sort_order', { ascending: false }).limit(1).maybeSingle();
  await supabase.from('product_option_groups').insert({
    product_id: productId, name, is_required: isRequired,
    sort_order: (last?.sort_order ?? 0) + 1,
  });
  revalidatePath(`/admin/${slug}`);
}

export async function deleteOptionGroup(groupId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('product_option_groups').delete().eq('id', groupId);
  revalidatePath(`/admin/${slug}`);
}

export async function addOptionItem(groupId: string, slug: string, name: string, price: number, isDefault: boolean) {
  const supabase = getDb();
  const { data: last } = await supabase.from('product_option_items')
    .select('sort_order').eq('group_id', groupId)
    .order('sort_order', { ascending: false }).limit(1).maybeSingle();
  await supabase.from('product_option_items').insert({
    group_id: groupId, name, price, is_default: isDefault,
    sort_order: (last?.sort_order ?? 0) + 1,
  });
  revalidatePath(`/admin/${slug}`);
}

export async function deleteOptionItem(itemId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('product_option_items').delete().eq('id', itemId);
  revalidatePath(`/admin/${slug}`);
}

// --- Menü setleri ---

export async function createMenuSet(tenantId: string, slug: string, formData: FormData) {
  const supabase = getDb();
  const { data: last } = await supabase.from('menu_sets')
    .select('sort_order').eq('tenant_id', tenantId)
    .order('sort_order', { ascending: false }).limit(1).maybeSingle();
  await supabase.from('menu_sets').insert({
    tenant_id: tenantId,
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    price: parseFloat(formData.get('price') as string) || 0,
    sort_order: (last?.sort_order ?? 0) + 1,
  });
  revalidatePath(`/admin/${slug}/sets`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateMenuSet(setId: string, slug: string, formData: FormData) {
  const supabase = getDb();
  await supabase.from('menu_sets').update({
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    price: parseFloat(formData.get('price') as string) || 0,
    image_url: (formData.get('image_url') as string) || null,
  }).eq('id', setId);
  revalidatePath(`/admin/${slug}/sets`);
  revalidatePath(`/menu/${slug}`);
}

export async function toggleMenuSet(setId: string, slug: string, active: boolean) {
  const supabase = getDb();
  await supabase.from('menu_sets').update({ is_active: active }).eq('id', setId);
  revalidatePath(`/admin/${slug}/sets`);
  revalidatePath(`/menu/${slug}`);
}

export async function deleteMenuSet(setId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('menu_sets').delete().eq('id', setId);
  revalidatePath(`/admin/${slug}/sets`);
  revalidatePath(`/menu/${slug}`);
}

export async function addMenuSetItem(setId: string, slug: string, productId: string, quantity: number) {
  const supabase = getDb();
  await supabase.from('menu_set_items').insert({ set_id: setId, product_id: productId, quantity });
  revalidatePath(`/admin/${slug}/sets`);
  revalidatePath(`/menu/${slug}`);
}

export async function removeMenuSetItem(itemId: string, slug: string) {
  const supabase = getDb();
  await supabase.from('menu_set_items').delete().eq('id', itemId);
  revalidatePath(`/admin/${slug}/sets`);
  revalidatePath(`/menu/${slug}`);
}

export async function reorderMenuSets(tenantId: string, slug: string, ids: string[]) {
  const supabase = getDb();
  await Promise.all(ids.map((id, i) => supabase.from('menu_sets').update({ sort_order: i }).eq('id', id)));
  revalidatePath(`/admin/${slug}/sets`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateOptionItem(itemId: string, slug: string, name: string, price: number) {
  const supabase = getDb();
  await supabase.from('product_option_items').update({ name, price }).eq('id', itemId);
  revalidatePath(`/admin/${slug}/options`);
  revalidatePath(`/menu/${slug}`);
}

// --- Mevcut tüm ürünlere toplu alerjen tespiti ---
export async function bulkDetectAllergens(tenantId: string, slug: string): Promise<{ assigned: number }> {
  const supabase = getDb();

  const { data: products } = await supabase
    .from('products')
    .select('id, name, description')
    .eq('tenant_id', tenantId);

  if (!products?.length) return { assigned: 0 };

  const { data: allAllergens } = await supabase
    .from('allergens').select('id, code').not('code', 'is', null);
  const allergenByCode = new Map((allAllergens ?? []).map((a: { id: string; code: string }) => [a.code, a.id]));

  let assigned = 0;
  for (const p of products) {
    const codes = detectAllergens(p.name, p.description);
    if (codes.length === 0) continue;

    const { data: existing } = await supabase
      .from('product_allergens').select('allergen_id').eq('product_id', p.id);
    const existingIds = new Set((existing ?? []).map((e: { allergen_id: string }) => e.allergen_id));

    const toInsert = codes
      .map(code => allergenByCode.get(code))
      .filter((id): id is string => !!id && !existingIds.has(id))
      .map(allergen_id => ({ product_id: p.id, allergen_id }));

    if (toInsert.length > 0) {
      await supabase.from('product_allergens').insert(toInsert);
      assigned += toInsert.length;
    }
  }

  revalidatePath(`/admin/${slug}/allergens`);
  revalidatePath(`/menu/${slug}`);
  return { assigned };
}

// --- AI menü aktarımı ---
export async function importFromAI(
  tenantId: string,
  slug: string,
  sections: { name: string; products: { name: string; price: number; description?: string; calories?: number; allergens?: string[] }[] }[]
): Promise<{ imported: number; error?: string }> {
  const supabase = getDb();

  const { data: allAllergens } = await supabase
    .from('allergens').select('id, code').not('code', 'is', null);
  const allergenByCode = new Map((allAllergens ?? []).map((a: { id: string; code: string }) => [a.code, a.id]));

  let imported = 0;

  for (const [sIdx, section] of sections.entries()) {
    // Bölüm oluştur (ya da mevcut olanı bul)
    const { data: existingSection } = await supabase
      .from('menu_sections').select('id')
      .eq('tenant_id', tenantId).ilike('name', section.name).maybeSingle();

    let sectionId: string;
    if (existingSection) {
      sectionId = existingSection.id;
    } else {
      const { data: newSection } = await supabase.from('menu_sections').insert({
        tenant_id: tenantId,
        name: section.name,
        sort_order: sIdx,
      }).select('id').single();
      if (!newSection) continue;
      sectionId = newSection.id;
    }

    // Ürünleri ekle
    for (const [pIdx, product] of section.products.entries()) {
      const { data: newProduct } = await supabase.from('products').insert({
        tenant_id: tenantId,
        section_id: sectionId,
        name: product.name,
        price: product.price || 0,
        description: product.description || null,
        calories: product.calories || null,
        sort_order: pIdx,
      }).select('id').single();

      if (!newProduct) continue;
      imported++;

      // Alerjenler
      const allergenCodes = new Set([
        ...(product.allergens ?? []),
        ...detectAllergens(product.name, product.description),
      ]);

      const allergenRows = Array.from(allergenCodes)
        .map(code => allergenByCode.get(code))
        .filter((id): id is string => !!id)
        .map(allergen_id => ({ product_id: newProduct.id, allergen_id }));

      if (allergenRows.length > 0) {
        await supabase.from('product_allergens').insert(allergenRows);
      }
    }
  }

  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/admin/${slug}/import`);
  revalidatePath(`/menu/${slug}`);
  return { imported };
}
