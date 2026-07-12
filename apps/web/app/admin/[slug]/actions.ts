'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { translateToEnglish } from '@/lib/translate';

export async function addSection(tenantId: string, slug: string, formData: FormData) {
  const supabase = createClient();
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
  const supabase = createClient();

  await supabase.from('products').insert({
    tenant_id: tenantId,
    section_id: sectionId,
    name: formData.get('name') as string,
    price: Number(formData.get('price')),
    calories: formData.get('calories') ? Number(formData.get('calories')) : null,
    image_url: (formData.get('image_url') as string) || null,
  });

  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateSectionName(sectionId: string, slug: string, name: string) {
  const supabase = createClient();
  await supabase.from('menu_sections').update({ name }).eq('id', sectionId);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function deleteSection(sectionId: string, slug: string) {
  const supabase = createClient();
  await supabase.from('menu_sections').delete().eq('id', sectionId);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateProduct(
  productId: string,
  slug: string,
  data: { name: string; price: number; calories: number | null; imageUrl: string | null; description?: string | null }
) {
  const supabase = createClient();
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
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/admin/${slug}/prices`);
  revalidatePath(`/menu/${slug}`);
}

export async function setProductAllergens(
  productId: string,
  slug: string,
  allergenIds: string[]
) {
  const supabase = createClient();
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
  const supabase = createClient();
  await supabase.from('products').delete().eq('id', productId);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/admin/${slug}/prices`);
  revalidatePath(`/menu/${slug}`);
}

export async function reorderProducts(slug: string, orderedIds: string[]) {
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('products').update({ sort_order: index }).eq('id', id)
    )
  );
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function reorderSections(slug: string, orderedIds: string[]) {
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('menu_sections').update({ sort_order: index }).eq('id', id)
    )
  );
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function updatePrice(productId: string, slug: string, price: number) {
  const supabase = createClient();

  await supabase.from('products').update({ price }).eq('id', productId);

  revalidatePath(`/admin/${slug}/prices`);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateTenant(tenantId: string, slug: string, formData: FormData) {
  const supabase = createClient();

  await supabase
    .from('tenants')
    .update({
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      cover_image_url: (formData.get('cover_image_url') as string) || null,
      google_review_url: (formData.get('google_review_url') as string) || null,
      instagram_url: (formData.get('instagram_url') as string) || null,
      whatsapp_number: (formData.get('whatsapp_number') as string) || null,
      google_maps_url: (formData.get('google_maps_url') as string) || null,
      notification_phone: (formData.get('notification_phone') as string) || null,
      callmebot_api_key: (formData.get('callmebot_api_key') as string) || null,
    })
    .eq('id', tenantId);

  revalidatePath(`/admin/${slug}/settings`);
  revalidatePath(`/menu/${slug}`);
}

export async function addAnnouncement(tenantId: string, slug: string, formData: FormData) {
  const supabase = createClient();

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
  const supabase = createClient();

  await supabase.from('announcements').update({ is_active: nextActive }).eq('id', id);

  revalidatePath(`/admin/${slug}/announcements`);
  revalidatePath(`/menu/${slug}`);
}

export async function deleteAnnouncement(id: string, slug: string) {
  const supabase = createClient();

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
  const supabase = createClient();
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
  const supabase = createClient();

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
  const supabase = createClient();

  await supabase.from('orders').update({ status }).eq('id', orderId);

  revalidatePath(`/admin/${slug}/orders`);
  revalidatePath(`/admin/${slug}/reports`);
}

export async function updateQrStyle(
  tenantId: string,
  slug: string,
  style: 'square' | 'rounded' | 'dot'
) {
  const supabase = createClient();
  await supabase.from('tenants').update({ qr_style: style }).eq('id', tenantId);
  revalidatePath(`/admin/${slug}/qr`);
}

export async function updateQrLogo(tenantId: string, slug: string, logoUrl: string) {
  const supabase = createClient();
  await supabase
    .from('tenants')
    .update({ logo_url: logoUrl || null })
    .eq('id', tenantId);
  revalidatePath(`/admin/${slug}/qr`);
  revalidatePath(`/admin/${slug}/settings`);
}

export async function generateTables(tenantId: string, slug: string, count: number) {
  const supabase = createClient();

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
  const supabase = createClient();
  await supabase.from('tables').delete().eq('id', tableId);
  revalidatePath(`/admin/${slug}/qr`);
}

// --- Etiketler ---

export async function addTag(tenantId: string, slug: string, formData: FormData) {
  const supabase = createClient();
  const name = (formData.get('name') as string)?.trim();
  const icon = (formData.get('icon') as string)?.trim() || null;
  if (!name) return;
  await supabase.from('tags').insert({ tenant_id: tenantId, name, icon });
  revalidatePath(`/admin/${slug}/tags`);
  revalidatePath(`/menu/${slug}`);
}

export async function deleteTag(tagId: string, slug: string) {
  const supabase = createClient();
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
  const supabase = createClient();
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
  const supabase = createClient();
  const name_tr = (formData.get('name_tr') as string)?.trim();
  if (!name_tr) return;
  const name_en = (formData.get('name_en') as string)?.trim() || null;
  await supabase.from('allergens').insert({ tenant_id: tenantId, name_tr, name_en });
  revalidatePath(`/admin/${slug}/allergens`);
  revalidatePath(`/menu/${slug}`);
}

export async function deleteAllergen(allergenId: string, slug: string) {
  const supabase = createClient();
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
  const supabase = createClient();
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
  const supabase = createClient();
  await supabase.from('products').update({ is_favorite: value }).eq('id', productId);
  revalidatePath(`/admin/${slug}/favorites`);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}

// --- Görüş & yorumlar ---

export async function deleteReview(reviewId: string, slug: string) {
  const supabase = createClient();
  await supabase.from('reviews').delete().eq('id', reviewId);
  revalidatePath(`/admin/${slug}/reviews`);
}

// --- Adres / şube ---

export async function addLocation(tenantId: string, slug: string, formData: FormData) {
  const supabase = createClient();
  await supabase.from('locations').insert({
    tenant_id: tenantId,
    name: formData.get('name') as string,
    address: (formData.get('address') as string) || null,
    phone: (formData.get('phone') as string) || null,
  });
  revalidatePath(`/admin/${slug}/locations`);
}

export async function updateLocation(locationId: string, slug: string, formData: FormData) {
  const supabase = createClient();
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
  const supabase = createClient();
  await supabase.from('locations').delete().eq('id', locationId);
  revalidatePath(`/admin/${slug}/locations`);
}

// --- İçe aktarma ---

export async function importProducts(
  tenantId: string,
  slug: string,
  rows: { sectionName: string; name: string; price: number; description?: string; calories?: number }[]
) {
  const supabase = createClient();

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

  const { error } = await supabase.from('products').insert(products);
  if (error) return { error: 'Aktarım sırasında hata oluştu.' };

  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
  return { imported: products.length };
}

// --- Menü tasarım ---

export async function updateThemeColor(tenantId: string, slug: string, theme: string) {
  const supabase = createClient();
  await supabase.from('tenants').update({ theme_color: theme }).eq('id', tenantId);
  revalidatePath(`/admin/${slug}/design`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateMenuLayout(
  tenantId: string,
  slug: string,
  layout: 'classic' | 'dark' | 'minimal'
) {
  const supabase = createClient();
  await supabase.from('tenants').update({ menu_layout: layout }).eq('id', tenantId);
  revalidatePath(`/admin/${slug}/design`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateSectionNav(
  tenantId: string,
  slug: string,
  nav: 'tabs' | 'grid'
) {
  const supabase = createClient();
  await supabase.from('tenants').update({ section_nav: nav }).eq('id', tenantId);
  revalidatePath(`/admin/${slug}/design`);
  revalidatePath(`/menu/${slug}`);
}

export async function updateSectionDisplayStyle(
  sectionId: string,
  slug: string,
  style: 'list' | 'list_image' | 'grid'
) {
  const supabase = createClient();
  await supabase.from('menu_sections').update({ display_style: style }).eq('id', sectionId);
  revalidatePath(`/admin/${slug}/design`);
  revalidatePath(`/menu/${slug}`);
}


// --- Link sayfası ---

export async function updateLinksProfile(tenantId: string, slug: string, formData: FormData) {
  const supabase = createClient();
  await supabase.from('tenants').update({
    links_bio: (formData.get('links_bio') as string) || null,
    instagram_url: (formData.get('instagram_url') as string) || null,
    whatsapp_number: (formData.get('whatsapp_number') as string) || null,
    google_maps_url: (formData.get('google_maps_url') as string) || null,
  }).eq('id', tenantId);
  revalidatePath(`/admin/${slug}/links`);
  revalidatePath(`/l/${slug}`);
}

export async function addTenantLink(tenantId: string, slug: string, formData: FormData) {
  const supabase = createClient();
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
  const supabase = createClient();
  await supabase.from('tenant_links').delete().eq('id', linkId);
  revalidatePath(`/admin/${slug}/links`);
  revalidatePath(`/l/${slug}`);
}

export async function toggleTenantLink(linkId: string, slug: string, active: boolean) {
  const supabase = createClient();
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
  sectionId?: string
) {
  const supabase = createClient();
  let query = supabase.from('products').select('id, price').eq('tenant_id', tenantId);
  if (sectionId) query = query.eq('section_id', sectionId);
  const { data: products } = await query;
  if (!products?.length) return { updated: 0 };

  const updates = products.map((p) => {
    let newPrice: number;
    if (type === 'percent') {
      const delta = (p.price * amount) / 100;
      newPrice = direction === 'increase' ? p.price + delta : p.price - delta;
    } else {
      newPrice = direction === 'increase' ? p.price + amount : p.price - amount;
    }
    return { id: p.id, price: Math.max(0, Math.round(newPrice)) };
  });

  await Promise.all(
    updates.map((u) => supabase.from('products').update({ price: u.price }).eq('id', u.id))
  );

  revalidatePath(`/admin/${slug}/prices`);
  revalidatePath(`/menu/${slug}`);
  return { updated: updates.length };
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
  const supabase = createClient();
  await supabase.from('products').update(flags).eq('id', productId);
  revalidatePath(`/admin/${slug}`);
  revalidatePath(`/menu/${slug}`);
}
