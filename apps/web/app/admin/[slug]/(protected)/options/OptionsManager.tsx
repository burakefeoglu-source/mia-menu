'use client';

import { useState } from 'react';
import { addOptionGroup, deleteOptionGroup, addOptionItem, deleteOptionItem } from '../../actions';

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

  async function reload(productId: string) {
    const res = await fetch(`/api/product-options?productId=${productId}`);
    const groups = await res.json();
    setLocalProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, product_option_groups: groups } : p
    ));
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
              return (
                <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden mb-1.5">
                  {/* Ürün başlığı */}
                  <button
                    onClick={() => setExpandedProduct(isOpen ? null : product.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{product.name}</span>
                      {groups.length > 0 && (
                        <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md">
                          {groups.length} grup
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{product.price} ₺</span>
                      <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex flex-col gap-3">
                      {/* Mevcut gruplar */}
                      {groups.map(group => (
                        <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{group.name}</p>
                              {group.is_required && <span className="text-xs text-red-500">Zorunlu</span>}
                            </div>
                            <button
                              onClick={async () => { await deleteOptionGroup(group.id, slug); await reload(product.id); }}
                              className="text-xs text-red-400 hover:text-red-600"
                            >Grubu sil</button>
                          </div>

                          {/* Seçenekler */}
                          <div className="flex flex-col gap-1 mb-2">
                            {group.product_option_items
                              .sort((a, b) => a.sort_order - b.sort_order)
                              .map(item => (
                                <div key={item.id} className="flex items-center justify-between py-1 border-b border-gray-50">
                                  <div className="flex items-center gap-2">
                                    {item.is_default && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />}
                                    <span className="text-sm">{item.name}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-rose-600">{item.price} ₺</span>
                                    <button onClick={async () => { await deleteOptionItem(item.id, slug); await reload(product.id); }}
                                      className="text-xs text-gray-400 hover:text-red-500">✕</button>
                                  </div>
                                </div>
                              ))}
                          </div>

                          {/* Yeni seçenek ekle */}
                          <div className="flex gap-2 mt-1">
                            <input
                              placeholder="Seçenek adı"
                              value={newItems[group.id]?.name ?? ''}
                              onChange={e => setNewItems(prev => ({ ...prev, [group.id]: { ...prev[group.id], name: e.target.value } }))}
                              className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs"
                            />
                            <input
                              placeholder="₺"
                              type="number"
                              value={newItems[group.id]?.price ?? ''}
                              onChange={e => setNewItems(prev => ({ ...prev, [group.id]: { ...prev[group.id], price: e.target.value } }))}
                              className="w-16 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs"
                            />
                            <button
                              onClick={async () => {
                                const inp = newItems[group.id];
                                if (!inp?.name || !inp?.price) return;
                                const isFirst = group.product_option_items.length === 0;
                                await addOptionItem(group.id, slug, inp.name, parseFloat(inp.price), isFirst);
                                setNewItems(prev => ({ ...prev, [group.id]: { name: '', price: '' } }));
                                await reload(product.id);
                              }}
                              className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg"
                            >Ekle</button>
                          </div>
                        </div>
                      ))}

                      {/* Yeni grup ekle */}
                      <div className="flex gap-2">
                        <input
                          placeholder="Yeni grup adı (örn: Boyut, Pişirme, Ekstra)"
                          value={newGroupName[product.id] ?? ''}
                          onChange={e => setNewGroupName(prev => ({ ...prev, [product.id]: e.target.value }))}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                        />
                        <button
                          onClick={async () => {
                            const name = newGroupName[product.id]?.trim();
                            if (!name) return;
                            await addOptionGroup(product.id, slug, name, false);
                            setNewGroupName(prev => ({ ...prev, [product.id]: '' }));
                            await reload(product.id);
                          }}
                          className="text-sm bg-rose-600 text-white px-4 py-2 rounded-lg"
                        >+ Grup</button>
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
