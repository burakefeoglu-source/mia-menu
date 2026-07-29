'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import {
  updateMenuSet, toggleMenuSet, deleteMenuSet,
  addMenuSetItem, removeMenuSetItem,
} from '../../actions';

type Product = { id: string; name: string; price: number; menu_sections?: { name: string }[] | null };
type SetItem = { id: string; quantity: number; products: { id: string; name: string; price: number } | null };
type MenuSet = {
  id: string; name: string; description: string | null; price: number;
  image_url: string | null; is_active: boolean; sort_order: number;
  menu_set_items: SetItem[];
};

export default function MenuSetsManager({
  slug, sets: initialSets, products, createAction,
}: {
  slug: string;
  sets: MenuSet[];
  products: Product[];
  createAction: (fd: FormData) => Promise<void>;
}) {
  const [sets, setSets] = useState(initialSets);
  const [expandedSet, setExpandedSet] = useState<string | null>(null);
  const [editingSet, setEditingSet] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  async function reload() {
    // Sayfayı yenile
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Mevcut setler */}
      {sets.map(s => (
        <div key={s.id} className={`border rounded-xl overflow-hidden ${s.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
          {/* Set başlığı */}
          <div className="flex items-center gap-3 px-4 py-3">
            {s.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.image_url} alt={s.name} className="w-12 h-10 object-cover rounded-lg flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{s.name}</p>
              <p className="text-xs text-gray-500">
                {s.menu_set_items.length} ürün · {s.price} ₺
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={async () => { await toggleMenuSet(s.id, slug, !s.is_active); await reload(); }}
                className={`text-xs px-2 py-1 rounded-md ${s.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {s.is_active ? 'Aktif' : 'Pasif'}
              </button>
              <button onClick={() => setExpandedSet(expandedSet === s.id ? null : s.id)}
                className="text-xs text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100">
                {expandedSet === s.id ? '▲' : 'Düzenle ▼'}
              </button>
              <button onClick={async () => { if (confirm('Seti sil?')) { await deleteMenuSet(s.id, slug); await reload(); } }}
                className="text-xs text-red-400">Sil</button>
            </div>
          </div>

          {/* Detay / Düzenleme */}
          {expandedSet === s.id && (
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex flex-col gap-4">
              {/* Set bilgileri */}
              <form action={async (fd) => {
                fd.set('image_url', imageUrls[s.id] ?? s.image_url ?? '');
                await updateMenuSet(s.id, slug, fd);
                await reload();
              }} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input name="name" defaultValue={s.name}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white" />
                  <input name="price" type="number" defaultValue={s.price} step="0.01"
                    className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white" />
                </div>
                <input name="description" defaultValue={s.description ?? ''}
                  placeholder="Açıklama" className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white" />
                <div className="flex items-center gap-3">
                  <ImageUploader folder="covers"
                    currentUrl={imageUrls[s.id] ?? s.image_url ?? ''}
                    onUploaded={(url) => setImageUrls(prev => ({ ...prev, [s.id]: url }))}
                    label="Fotoğraf" />
                </div>
                <button type="submit" className="self-start text-xs bg-rose-600 text-white px-3 py-1.5 rounded-md">Kaydet</button>
              </form>

              {/* İçindeki ürünler */}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Set içeriği</p>
                <div className="flex flex-col gap-1 mb-2">
                  {s.menu_set_items.map(item => item.products && (
                    <div key={item.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2">
                      <div>
                        <span className="text-sm">{item.products.name}</span>
                        {item.quantity > 1 && <span className="text-xs text-gray-400 ml-1">×{item.quantity}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{item.products.price} ₺</span>
                        <button onClick={async () => { await removeMenuSetItem(item.id, slug); await reload(); }}
                          className="text-xs text-red-400">✕</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ürün ekle */}
                <div className="flex gap-2">
                  <select id={`add-product-${s.id}`}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white">
                    <option value="">Ürün seç...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.price} ₺
                      </option>
                    ))}
                  </select>
                  <button onClick={async () => {
                    const sel = document.getElementById(`add-product-${s.id}`) as HTMLSelectElement;
                    if (!sel.value) return;
                    await addMenuSetItem(s.id, slug, sel.value, 1);
                    await reload();
                  }} className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg">Ekle</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Yeni set oluştur */}
      <form action={createAction}
        className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col gap-2 mt-2">
        <p className="text-xs font-medium text-gray-600">Yeni set oluştur</p>
        <div className="flex gap-2">
          <input name="name" placeholder="Set adı (örn: Kahvaltı Seti, Öğle Combo)" required
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <input name="price" type="number" placeholder="₺" required step="0.01"
            className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <input name="description" placeholder="Açıklama (opsiyonel)"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        <button type="submit" className="self-start text-xs bg-rose-600 text-white px-4 py-2 rounded-lg">
          + Set oluştur
        </button>
      </form>
    </div>
  );
}
