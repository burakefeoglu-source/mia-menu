'use client';

import { useState, useRef } from 'react';
import { GripVertical } from 'lucide-react';
import {
  addProduct,
  deleteProduct,
  deleteSection,
  reorderProducts,
  reorderSections,
  toggleProductActive,
  toggleSectionActive,
  updateProduct,
  updateProductFlags,
  updateSectionName,
} from '@/app/admin/[slug]/actions';
import { AllergenIcon } from '@/lib/allergenIcons';
import ImageUploader from '@/components/ImageUploader';
import { broadcastPreviewRefresh } from '@/lib/previewChannel';
import type { MenuSection, Product } from '@/types/database';

type ProductWithAllergens = Product & {
  product_allergens?: { allergens: { id: string; code: string | null; name_tr: string } }[];
  is_vegan?: boolean;
  is_vegetarian?: boolean;
  is_gluten_free?: boolean;
  is_daily_special?: boolean;
};

export default function SectionsList({
  tenantId,
  slug,
  sections,
  products,
}: {
  tenantId: string;
  slug: string;
  sections: MenuSection[];
  products: ProductWithAllergens[];
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    sections[0] ? { [sections[0].id]: true } : {}
  );
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [localProducts, setLocalProducts] = useState(products);
  const [localSections, setLocalSections] = useState(sections);
  const sectionDragIndex = useRef<number | null>(null);

  function handleSectionDragStart(index: number) {
    sectionDragIndex.current = index;
  }

  function handleSectionDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (sectionDragIndex.current === null || sectionDragIndex.current === index) return;
    const newSections = [...localSections];
    const [moved] = newSections.splice(sectionDragIndex.current, 1);
    newSections.splice(index, 0, moved);
    sectionDragIndex.current = index;
    setLocalSections(newSections);
  }

  async function handleSectionDrop() {
    await reorderSections(slug, localSections.map((s) => s.id));
    broadcastPreviewRefresh();
    sectionDragIndex.current = null;
  }

  return (
    <div className="flex flex-col gap-2">
      {localSections.map((s, sectionIndex) => {
        const sectionProducts = localProducts.filter((p) => p.section_id === s.id);
        const isOpen = !!expanded[s.id];
        const boundAddProduct = addProduct.bind(null, tenantId, s.id, slug);

        return (
          <div
            key={s.id}
            draggable={editingSection !== s.id}
            onDragStart={() => handleSectionDragStart(sectionIndex)}
            onDragOver={(e) => handleSectionDragOver(e, sectionIndex)}
            onDrop={handleSectionDrop}
            className={`border rounded-md overflow-hidden transition-opacity ${!s.is_active ? 'opacity-50 border-dashed border-gray-300' : 'border-gray-200'}`}
          >
            <div className="w-full flex justify-between items-center px-3 py-2.5">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 cursor-grab" />
                {editingSection === s.id ? (
                  <form
                    className="flex items-center gap-2 flex-1"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const input = e.currentTarget.elements.namedItem('name') as HTMLInputElement;
                      await updateSectionName(s.id, slug, input.value);
                      setEditingSection(null);
                    }}
                  >
                    <input name="name" defaultValue={s.name} autoFocus
                      className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-sm" />
                    <button type="submit" className="text-xs bg-rose-600 text-white px-2 py-1 rounded-md">Kaydet</button>
                    <button type="button" onClick={() => setEditingSection(null)} className="text-xs text-gray-400">Vazgeç</button>
                  </form>
                ) : (
                  <button
                    onClick={() => setExpanded((e) => ({ ...e, [s.id]: !e[s.id] }))}
                    className="flex-1 flex justify-between items-center text-left"
                  >
                    <span className="text-sm">{s.name}</span>
                    <span className="flex items-center gap-2 text-xs text-gray-500 mr-2">
                      {sectionProducts.length} ürün
                      <span>{isOpen ? '▲' : '▼'}</span>
                    </span>
                  </button>
                )}
              </div>
              {editingSection !== s.id && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleSectionActive(s.id, slug, !s.is_active)}
                    className={`text-xs px-1.5 py-0.5 rounded ${s.is_active ? 'text-gray-400' : 'text-amber-600 bg-amber-50'}`}
                    title={s.is_active ? 'Pasif yap' : 'Aktif yap'}
                  >
                    {s.is_active ? '●' : '○'}
                  </button>
                  <button onClick={() => setEditingSection(s.id)} className="text-xs text-gray-400">Düzenle</button>
                  <button
                    onClick={() => {
                      if (confirm(`"${s.name}" bölümünü silmek istediğine emin misin?`)) {
                        deleteSection(s.id, slug);
                      }
                    }}
                    className="text-xs text-red-500"
                  >Sil</button>
                </div>
              )}
            </div>

            {isOpen && (
              <div className="border-t border-gray-200">
                <DraggableProductList
                  slug={slug}
                  sectionId={s.id}
                  products={sectionProducts}
                  editingProduct={editingProduct}
                  setEditingProduct={setEditingProduct}
                  onReorder={(newOrder) => {
                    setLocalProducts((prev) => {
                      const others = prev.filter((p) => p.section_id !== s.id);
                      return [...others, ...newOrder];
                    });
                  }}
                />
                <form action={boundAddProduct} className="flex flex-wrap gap-2 px-3 py-2 border-t border-gray-100">
                  <input name="name" placeholder="Ürün adı" required
                    className="flex-1 min-w-[100px] border border-gray-200 rounded-md px-2 py-1 text-xs" />
                  <input name="price" type="number" placeholder="Fiyat" required
                    className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs" />
                  <input name="calories" type="number" placeholder="Kalori"
                    className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs" />
                  <button type="submit" className="text-xs bg-rose-600 text-white px-2.5 py-1 rounded-md">Ekle</button>
                </form>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DraggableProductList({
  slug,
  sectionId,
  products,
  editingProduct,
  setEditingProduct,
  onReorder,
}: {
  slug: string;
  sectionId: string;
  products: ProductWithAllergens[];
  editingProduct: string | null;
  setEditingProduct: (id: string | null) => void;
  onReorder: (newOrder: ProductWithAllergens[]) => void;
}) {
  const [items, setItems] = useState(products);
  const dragIndex = useRef<number | null>(null);

  // products prop değişince (sunucudan güncelleme gelince) senkronize et
  useState(() => { setItems(products); });

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;

    const newItems = [...items];
    const [moved] = newItems.splice(dragIndex.current, 1);
    newItems.splice(index, 0, moved);
    dragIndex.current = index;
    setItems(newItems);
    onReorder(newItems);
  }

  async function handleDrop() {
    await reorderProducts(slug, items.map((p) => p.id));
    broadcastPreviewRefresh();
    dragIndex.current = null;
  }

  return (
    <>
      {items.map((p, index) =>
        editingProduct === p.id ? (
          <ProductEditForm
            key={p.id}
            slug={slug}
            product={p}
            onDone={() => setEditingProduct(null)}
          />
        ) : (
          <div
            key={p.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            className="px-3 py-2 text-sm flex justify-between items-center border-b border-gray-100 gap-2 cursor-grab active:cursor-grabbing active:bg-gray-50"
          >
            <div className="flex items-center gap-2 min-w-0">
              <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-md bg-gray-100 flex-shrink-0" />
              )}
              <span className="truncate">
                {p.name}
                {p.product_allergens?.map((pa, i) => (
                  <span key={i} className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-md">
                    <AllergenIcon code={pa.allergens.code} className="w-3 h-3" />
                    {pa.allergens.name_tr}
                  </span>
                ))}
              </span>
            </div>
            <span className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
              {p.calories ? `${p.calories} kcal` : ''}
              <span className="font-medium text-gray-900">{p.price} ₺</span>
              <button
                onClick={() => toggleProductActive(p.id, slug, !p.is_active)}
                className={`px-1.5 py-0.5 rounded text-xs ${p.is_active ? 'text-gray-300' : 'text-amber-600 bg-amber-50 font-medium'}`}
                title={p.is_active ? 'Pasif yap' : 'Aktif yap'}
              >
                {p.is_active ? '●' : '○ Pasif'}
              </button>
              <button onClick={() => setEditingProduct(p.id)} className="text-gray-400">Düzenle</button>
              <button
                onClick={() => {
                  if (confirm(`"${p.name}" ürününü silmek istediğine emin misin?`)) {
                    deleteProduct(p.id, slug);
                  }
                }}
                className="text-red-500"
              >Sil</button>
            </span>
          </div>
        )
      )}
    </>
  );
}

function ProductEditForm({
  slug,
  product,
  onDone,
}: {
  slug: string;
  product: ProductWithAllergens;
  onDone: () => void;
}) {
  const [imageUrl, setImageUrl] = useState(product.image_url ?? '');

  return (
    <form
      className="flex flex-col gap-2 px-3 py-2.5 border-b border-gray-100 bg-gray-50"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const price = Number((form.elements.namedItem('price') as HTMLInputElement).value);
        const caloriesRaw = (form.elements.namedItem('calories') as HTMLInputElement).value;
        const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
        await updateProduct(product.id, slug, {
          name, price,
          calories: caloriesRaw ? Number(caloriesRaw) : null,
          imageUrl: imageUrl || null,
          description: description || null,
        });
        broadcastPreviewRefresh();
        onDone();
      }}
    >
      <div className="flex gap-2">
        <input name="name" defaultValue={product.name} autoFocus
          className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-xs" />
        <input name="price" type="number" defaultValue={product.price}
          className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs" />
        <input name="calories" type="number" defaultValue={product.calories ?? ''}
          placeholder="Kcal"
          className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs" />
      </div>

      <textarea
        name="description"
        defaultValue={product.description ?? ''}
        placeholder="Açıklama (opsiyonel)"
        rows={2}
        className="border border-gray-200 rounded-md px-2 py-1 text-xs resize-none"
      />

      <div className="flex items-end gap-3">
        <ImageUploader
          folder="products"
          currentUrl={imageUrl}
          onUploaded={(url) => setImageUrl(url)}
          label="Fotoğraf yükle"
        />
        {imageUrl && (
          <button type="button" onClick={() => setImageUrl('')} className="text-xs text-red-500 pb-1">
            Fotoğrafı sil
          </button>
        )}
      </div>

      <p className="text-[11px] text-gray-400">
        Alerjenleri &quot;Alerjen listesi&quot; panelinden bu ürüne işaretleyebilirsin.
      </p>
      <div className="flex gap-2 mt-1">
        <button type="submit" className="text-xs bg-rose-600 text-white px-2 py-1 rounded-md">Kaydet</button>
        <button type="button" onClick={onDone} className="text-xs text-gray-400">Vazgeç</button>
      </div>
    </form>
  );
}
