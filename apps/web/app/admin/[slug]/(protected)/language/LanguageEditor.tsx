'use client';

import { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { updateEnabledLocales, autoTranslateMenu } from '../../actions';

type Product = { id: string; name: string; description: string | null };
type Section = { id: string; name: string };
type Translation = { entity_type: string; entity_id: string; locale: string; field: string; value: string };

export default function LanguageEditor({
  tenantId, slug, enabledLocales, products, sections, translations, hasAnthropicKey,
}: {
  tenantId: string;
  slug: string;
  enabledLocales: string[];
  products: Product[];
  sections: Section[];
  translations: Translation[];
  hasAnthropicKey: boolean;
}) {
  const [selected, setSelected] = useState<string[]>(enabledLocales);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);
  const [translateResults, setTranslateResults] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');

  const filtered = SUPPORTED_LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  );

  function toggle(code: string) {
    if (code === 'tr') return;
    setSelected(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  }

  async function save() {
    setSaving(true);
    await updateEnabledLocales(tenantId, slug, selected);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }

  async function translate(locale: string) {
    setTranslating(locale);
    setTranslateResults(prev => ({ ...prev, [locale]: 'Çevriliyor...' }));
    const res = await autoTranslateMenu(tenantId, slug, locale);
    if (res.error) {
      setTranslateResults(prev => ({ ...prev, [locale]: `❌ ${res.error}` }));
    } else {
      setTranslateResults(prev => ({ ...prev, [locale]: `✓ ${res.count} alan çevrildi` }));
    }
    setTranslating(null);
  }

  // Kaç alan çevrilmiş?
  function translatedCount(locale: string) {
    return translations.filter(t => t.locale === locale).length;
  }

  const activeLanguages = selected.filter(c => c !== 'tr');

  return (
    <div className="max-w-xl">
      {/* Aktif diller + çeviri butonları */}
      {activeLanguages.length > 0 && (
        <div className="mb-5 border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-600">Etkin diller</p>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center gap-3 px-4 py-2.5">
              <span className="text-sm">🇹🇷</span>
              <p className="text-sm flex-1">Türkçe <span className="text-xs text-gray-400">(varsayılan)</span></p>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-md">Aktif</span>
            </div>
            {activeLanguages.map(code => {
              const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
              if (!lang) return null;
              const count = translatedCount(code);
              const result = translateResults[code];
              return (
                <div key={code} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-sm">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{lang.name}</p>
                    {result ? (
                      <p className="text-xs text-gray-500">{result}</p>
                    ) : count > 0 ? (
                      <p className="text-xs text-gray-400">{count} alan çevrildi</p>
                    ) : (
                      <p className="text-xs text-amber-600">Henüz çevrilmedi</p>
                    )}
                  </div>
                  {hasAnthropicKey && (
                    <button
                      onClick={() => translate(code)}
                      disabled={translating === code}
                      className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-md disabled:opacity-50 flex-shrink-0"
                    >
                      {translating === code ? '...' : count > 0 ? 'Yenile' : 'Çevir'}
                    </button>
                  )}
                  <button onClick={() => toggle(code)} className="text-xs text-red-400 flex-shrink-0">Kaldır</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ANTHROPIC_API_KEY uyarısı */}
      {!hasAnthropicKey && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
          <p className="text-xs text-amber-800 font-medium">Otomatik çeviri kapalı</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Vercel'e <code className="bg-amber-100 px-1 rounded">ANTHROPIC_API_KEY</code> ekleyin.
          </p>
        </div>
      )}

      {/* Kaydet */}
      <button onClick={save} disabled={saving}
        className={`text-sm px-4 py-1.5 rounded-md mb-5 ${saved ? 'bg-green-500 text-white' : 'bg-rose-600 text-white'} disabled:opacity-50`}>
        {saved ? '✓ Kaydedildi' : saving ? 'Kaydediliyor...' : 'Kaydet'}
      </button>

      {/* Dil arama & listesi */}
      <p className="text-xs text-gray-500 mb-2">Dil ekle</p>
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Dil ara... (örn: German, Arabic)"
        className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm mb-3" />

      <div className="grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto pr-1">
        {filtered.map(lang => {
          const isSelected = selected.includes(lang.code);
          const isTr = lang.code === 'tr';
          return (
            <button key={lang.code} onClick={() => toggle(lang.code)} disabled={isTr}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-colors ${
                isSelected ? 'border-rose-300 bg-rose-50 text-rose-800' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              } ${isTr ? 'opacity-60 cursor-default' : ''}`}>
              <span className="text-base flex-shrink-0">{lang.flag}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{lang.name}</p>
                <p className="text-[10px] text-gray-400">{lang.code}</p>
              </div>
              {isSelected && <span className="text-rose-500 text-xs flex-shrink-0">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
