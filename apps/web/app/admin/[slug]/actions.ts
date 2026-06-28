'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

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
  data: { name: string; price: number; calories: number | null; imageUrl: string | null }
) {
  const supabase = createClient();
  await supabase
    .from('products')
    .update({
      name: data.name,
      price: data.price,
      calories: data.calories,
      image_url: data.imageUrl,
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
    })
    .eq('id', tenantId);

  revalidatePath(`/admin/${slug}/settings`);
  revalidatePath(`/menu/${slug}`);
}

export async function addAnnouncement(tenantId: string, slug: string, formData: FormData) {
  const supabase = createClient();

  await supabase.from('announcements').insert({
    tenant_id: tenantId,
    kind: formData.get('kind') as string,
    title: formData.get('title') as string,
    message: (formData.get('message') as string) || null,
    image_url: (formData.get('image_url') as string) || null,
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
  if (!name) return;
  await supabase.from('tags').insert({ tenant_id: tenantId, name });
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

