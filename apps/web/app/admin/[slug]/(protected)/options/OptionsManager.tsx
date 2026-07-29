'use client';

import { useState } from 'react';
import { addOptionGroup, deleteOptionGroup, addOptionItem, deleteOptionItem, updateOptionItem } from '../../actions';

type OptionItem = { id: string; name: string; price: number; is_default: boolean; sort_order: number };
type OptionGroup = { id: string; name: string; is_required: boolean; product_option_items: OptionItem[] };
type Product = { id: string; name: string; price: number; section_id: string; product_option_groups?: OptionGroup[] };
type Section = { id: string; name: string };

export default function OptionsManager({
  slug, sections, products,
}: { slug: string; sections: Section[]; products: Product[] }) {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [localProducts, setLocalProducts] = useState(products);
  const [newGroupName, setNewGroupName] = useState<Record<string, string>>({});
  const [newItems, setNewItems] = useState<Record<string, { name: string; price: string }>>({});
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, { name: string; price: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  async function reload(productId: string) {
    const res = await fetch(`/api/product-options?productId=${productId}`);
    const groups = await res.json();
    setLocalProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, product_option_groups: groups } : p
    ));
  }

  function startEdit(item: OptionItem) {
    setEditingItem(item.id);
    setEditValues(prev => ({ ...prev, [item.id]: { name: item.name, price: String(item.price) } }));
  }

  async function saveEdit(item: OptionItem, productId: string) {
    const vals = editValues[item.id];
    if (!vals) return;
    setSaving(item.id);
    await updateOptionItem(item.id, slug, vals.name, parseFloat(vals.price) || 0);
    setEditingItem(null);
    setSaving(null);
    await reload(productId);
  }

  return (
    <div className="flex flex-col gap-2">
      {sections.map(section => {
        const sectionProducts = localProducts.filter(p => p.section_id === section.id);
        if (sectionProducts.length === 0) return null;
        return (
          <div key={section.id}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-1 mt-3">{section.name}</p>
            {sectionProducts.map(product => {
              const groups = product.product_option_groups ?? [];
              const isOpen = expandedProduct === product.id;
              const totalOptions = groups.reduce((sum, g) => sum + g.product_option_items.length, 0);

              return (
                <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden mb-1.5">
                  <button
                    onClick={() => {
                      if (!isOpen && groups.length === 0) reload(product.id);
                      setExpandedProduct(isOpen ? null : product.id);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{product.name}</span>
                      {totalOptions > 0 && (
                        <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md">
                          {groups.length} grup · {totalOptions} seçenek
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{product.price} ₺</span>
                      <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex flex-col gap-3">
                      {groups.map(group => (
                        <div key={group.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                          {/* Grup başlığı */}
                          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-semibold text-gray-700">{group.name}</p>
                              {group.is_required && <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Zorunlu</span>}
                            </div>
                            <button
                              onClick={async () => {
                                if (!confirm(`"${group.name}" grubunu ve tüm seçeneklerini sil?`)) return;
                                await deleteOptionGroup(group.id, slug);
                                await reload(product.id);
                              }}
                              className="text-[10px] text-red-400 hover:text-red-600"
                            >Grubu sil</button>
                          </div>

                          {/* Seçenek satırları */}
                          <div className="divide-y divide-gray-50">
                            {group.product_option_items
                              .sort((a, b) => a.sort_order - b.sort_order)
                              .map(item => (
                                <div key={item.id} className="flex items-center gap-2 px-3 py-2">
                                  {editingItem === item.id ? (
                                    /* Düzenleme modu */
                                    <>
                                      <input
                                        value={editValues[item.id]?.name ?? item.name}
                                        onChange={e => setEditValues(prev => ({ ...prev, [item.id]: { ...prev[item.id], name: e.target.value } }))}
                                        className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm"
                                        autoFocus
                                      />
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number"
                                          value={editValues[item.id]?.price ?? item.price}
                                          onChange={e => setEditValues(prev => ({ ...prev, [item.id]: { ...prev[item.id], price: e.target.value } }))}
                                          className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right"
                                          step="0.01"
                                          onKeyDown={e => e.key === 'Enter' && saveEdit(item, product.id)}
                                        />
                                        <span className="text-sm text-gray-400">₺</span>
                                      </div>
                                      <button
                                        onClick={() => saveEdit(item, product.id)}
                                        disabled={saving === item.id}
                                        className="text-xs bg-rose-600 text-white px-2.5 py-1 rounded-lg disabled:opacity-50"
                                      >{saving === item.id ? '...' : 'Kaydet'}</button>
                                      <button
                                        onClick={() => setEditingItem(null)}
                                        className="text-xs text-gray-400"
                                      >İptal</button>
                                    </>
                                  ) : (
                                    /* Görüntüleme modu */
                                    <>
                                      <div className="flex-1 flex items-center gap-2">
                                        {item.is_default && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0" title="Varsayılan" />}
                                        <span className="text-sm">{item.name}</span>
                                      </div>
                                      <span className="text-sm font-semibold text-rose-600 min-w-[60px] text-right">{item.price} ₺</span>
                                      <button
                                        onClick={() => startEdit(item)}
                                        className="text-xs text-gray-400 hover:text-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-100"
                                      >Düzenle</button>
                                      <button
                                        onClick={async () => {
                                          await deleteOptionItem(item.id, slug);
                                          await reload(product.id);
                                        }}
                                        className="text-xs text-red-400 hover:text-red-600 px-1 py-0.5 rounded hover:bg-red-50"
                                      >✕</button>
                                    </>
                                  )}
                                </div>
                              ))}
                          </div>

                          {/* Yeni seçenek */}
                          <div className="flex gap-2 px-3 py-2 border-t border-gray-100 bg-gray-50">
                            <input
                              placeholder="Seçenek adı"
                              value={newItems[group.id]?.name ?? ''}
                              onChange={e => setNewItems(prev => ({ ...prev, [group.id]: { ...prev[group.id], name: e.target.value } }))}
                              className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                            />
                            <input
                              placeholder="Fiyat"
                              type="number"
                              value={newItems[group.id]?.price ?? ''}
                              onChange={e => setNewItems(prev => ({ ...prev, [group.id]: { ...prev[group.id], price: e.target.value } }))}
                              className="w-20 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white text-right"
                            />
                            <span className="text-xs text-gray-400 self-center">₺</span>
                            <button
                              onClick={async () => {
                                const inp = newItems[group.id];
                                if (!inp?.name || !inp?.price) return;
                                const isFirst = group.product_option_items.length === 0;
                                await addOptionItem(group.id, slug, inp.name, parseFloat(inp.price), isFirst);
                                setNewItems(prev => ({ ...prev, [group.id]: { name: '', price: '' } }));
                                await reload(product.id);
                              }}
                              className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg whitespace-nowrap"
                            >+ Ekle</button>
                          </div>
                        </div>
                      ))}

                      {/* Yeni grup */}
                      <div className="flex gap-2">
                        <input
                          placeholder="Yeni grup adı (örn: Boyut, Pişirme, Ekstra)"
                          value={newGroupName[product.id] ?? ''}
                          onChange={e => setNewGroupName(prev => ({ ...prev, [product.id]: e.target.value }))}
                          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
                          onKeyDown={async e => {
                            if (e.key !== 'Enter') return;
                            const name = newGroupName[product.id]?.trim();
                            if (!name) return;
                            await addOptionGroup(product.id, slug, name, false);
                            setNewGroupName(prev => ({ ...prev, [product.id]: '' }));
                            await reload(product.id);
                          }}
                        />
                        <button
                          onClick={async () => {
                            const name = newGroupName[product.id]?.trim();
                            if (!name) return;
                            await addOptionGroup(product.id, slug, name, false);
                            setNewGroupName(prev => ({ ...prev, [product.id]: '' }));
                            await reload(product.id);
                          }}
                          className="text-sm bg-rose-600 text-white px-4 py-2 rounded-xl whitespace-nowrap"
                        >+ Grup ekle</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
