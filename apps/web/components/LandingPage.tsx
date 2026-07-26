import Link from 'next/link';
import type { LandingContent, LandingLang } from '@/lib/landingContent';

const LANG_FLAGS: Record<LandingLang, string> = { tr: '🇹🇷', en: '🇬🇧', de: '🇩🇪', nl: '🇳🇱', es: '🇪🇸', it: '🇮🇹' };
const LANG_PATHS: Record<LandingLang, string> = { tr: '/', en: '/en', de: '/de', nl: '/nl', es: '/es', it: '/it' };

export default function LandingPage({ c }: { c: LandingContent }) {
  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;500;600&display=swap');
        .font-anton { font-family: 'Anton', sans-serif; }
        .text-brand { color: #E11D48; }
        .bg-brand { background: #E11D48; }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="mia.menu" style={{ height: "60px", width: "auto", display: "block" }} />
            <div className="hidden md:flex items-center gap-1">
              {([['#ozellikler', c.nav.features], ['#nasil-calisir', c.nav.howItWorks], ['#paketler', c.nav.packages], ['#sss', c.nav.faq]] as [string, string][]).map(([href, label]) => (
                <a key={href} href={href} className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">{label}</a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {/* Dil seçici */}
              <div className="hidden md:flex items-center gap-0.5 border border-gray-200 rounded-xl p-0.5">
                {(Object.entries(LANG_FLAGS) as [LandingLang, string][]).map(([lang, flag]) => (
                  <a key={lang} href={LANG_PATHS[lang]}
                    className={`text-xs px-1.5 py-0.5 rounded-lg transition-colors ${c.lang === lang ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                    {flag}
                  </a>
                ))}
              </div>
              <Link href="/giris" className="hidden md:block text-sm text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">{c.nav.login}</Link>
              <Link href="/kayit" className="text-sm font-medium text-white px-4 py-2 rounded-xl transition-all" style={{ background: '#E11D48', boxShadow: '0 2px 8px rgba(225,29,72,0.35)' }}>{c.nav.cta}</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 pt-36 pb-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs px-3 py-1.5 rounded-full mb-6 font-medium">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>{c.badge}
            </div>
            <h1 className="font-anton text-5xl md:text-6xl leading-tight mb-6 text-gray-900">
              {c.heroTitle[0]}<br /><span className="text-brand">{c.heroTitle[1]}</span><br />{c.heroTitle[2]}
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">{c.heroSub}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/kayit" className="bg-brand text-white px-8 py-4 rounded-xl font-semibold text-sm shadow-lg" style={{ background: '#E11D48' }}>{c.heroCta1}</Link>
              <Link href="/menu/mia-bistro-coffee" target="_blank" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-sm">{c.heroCta2}</Link>
            </div>
            <p className="text-xs text-gray-400 mt-4">{c.heroNote}</p>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-red-50 rounded-full opacity-60" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gray-100 rounded-full" />
              <div className="relative bg-gray-900 rounded-[44px] p-3 shadow-2xl" style={{ width: 300 }}>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-700 rounded-full z-10" />
                <div className="rounded-[36px] overflow-hidden" style={{ height: 560 }}>
                  <iframe src="/menu/mia-bistro-coffee" style={{ width: '133%', height: '133%', border: 'none', transform: 'scale(0.75)', transformOrigin: 'top left' }} title="Demo menu" />
                </div>
              </div>
              <p className="relative z-20 text-center text-xs text-gray-500 mt-4 font-medium">{c.phoneCaption}</p>
            </div>
          </div>
        </div>
      </section>

      {/* AVANTAJLAR */}
      <section id="ozellikler" className="bg-gray-50 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest text-center mb-3">Avantajlar</p>
          <h2 className="font-anton text-4xl text-center text-gray-900 mb-12">{c.advantages.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {c.advantages.items.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl mb-4">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest text-center mb-3">Süreç</p>
          <h2 className="font-anton text-4xl text-center text-gray-900 mb-16">{c.howItWorks.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {c.howItWorks.steps.map(({ num, title, desc }) => (
              <div key={num} className="relative">
                <div className="font-anton text-7xl text-brand opacity-10 mb-2 leading-none">{num}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2 -mt-4">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="bg-gray-900 px-6 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="font-anton text-4xl text-white mb-8">{c.features.title}</h2>
            <div className="flex flex-col gap-4">
              {c.features.list.map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-brand rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#E11D48' }}>
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-300 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-gray-800 rounded-[44px] p-3 shadow-2xl" style={{ width: 280 }}>
              <div className="rounded-[36px] overflow-hidden" style={{ height: 520 }}>
                <iframe src="/menu/mia-bistro-coffee" style={{ width: '133%', height: '133%', border: 'none', transform: 'scale(0.75)', transformOrigin: 'top left' }} title="Demo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAYDALAR */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest text-center mb-3">Sonuçlar</p>
          <h2 className="font-anton text-4xl text-center text-gray-900 mb-12">{c.benefits.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {c.benefits.items.map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 border border-gray-100 rounded-2xl hover:border-red-100 hover:bg-red-50 transition-colors">
                <div className="text-3xl flex-shrink-0">{icon}</div>
                <div><h3 className="font-semibold text-gray-900 mb-1">{title}</h3><p className="text-sm text-gray-500">{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KULLANIM ALANLARI */}
      <section id="kullanim" className="bg-gray-50 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest text-center mb-3">Kullanım</p>
          <h2 className="font-anton text-4xl text-center text-gray-900 mb-12">{c.useCases.title}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {c.useCases.items.map(({ icon, label }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">{icon}</span>
                <span className="font-medium text-gray-700 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAKETLER */}
      <section id="paketler" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest text-center mb-3">Paketler</p>
          <h2 className="font-anton text-4xl text-center text-gray-900 mb-4">{c.packages.title}</h2>
          <p className="text-center text-gray-500 text-sm mb-12">{c.packages.subtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.packages.items.map(({ name, price, period, badge, desc, features, cta, href, primary }) => (
              <div key={name} className={`rounded-2xl p-6 relative ${primary ? 'text-white shadow-xl shadow-red-200 scale-105' : 'bg-white border border-gray-200'}`}
                style={primary ? { background: '#E11D48' } : {}}>
                {badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap">{badge}</span>}
                <p className={`text-sm font-semibold mb-1 ${primary ? 'text-red-100' : 'text-gray-500'}`}>{name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-bold ${primary ? 'text-white' : 'text-gray-900'}`}>{price}</span>
                  <span className={`text-sm ${primary ? 'text-red-100' : 'text-gray-400'}`}>{period}</span>
                </div>
                <p className={`text-xs mb-5 ${primary ? 'text-red-100' : 'text-gray-500'}`}>{desc}</p>
                <ul className="flex flex-col gap-2 mb-6">
                  {features.map(f => (
                    <li key={f} className={`text-xs flex items-center gap-2 ${primary ? 'text-red-50' : 'text-gray-600'}`}>
                      <span className={`flex-shrink-0 ${primary ? 'text-white' : 'text-brand'}`}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={href} className={`block text-center text-sm py-2.5 rounded-xl font-medium transition-colors ${primary ? 'bg-white text-brand hover:bg-red-50' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section id="sss" className="bg-gray-50 px-6 py-20">
        <div className="max-w-6xl mx-auto"><div className="max-w-2xl mx-auto w-full">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest text-center mb-3">SSS</p>
          <h2 className="font-anton text-4xl text-center text-gray-900 mb-12">{c.faq.title}</h2>
          <div className="flex flex-col gap-4">
            {c.faq.items.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{q}</h3>
                <p className="text-sm text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div></div>
      </section>

      {/* CTA */}
      <section style={{ background: '#E11D48' }} className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-anton text-5xl text-white mb-4">{c.finalCta.title}</h2>
          <p className="text-red-100 text-lg mb-8">{c.finalCta.sub}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/kayit" className="bg-white px-8 py-4 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors" style={{ color: '#E11D48' }}>{c.finalCta.cta1}</Link>
            <a href="mailto:merhaba@mia.menu" className="border border-white text-white px-8 py-4 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors">{c.finalCta.cta2}</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="mia.menu" style={{ height: "36px", width: "auto" }} />
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#ozellikler" className="hover:text-gray-700">{c.nav.features}</a>
            <a href="#paketler" className="hover:text-gray-700">{c.nav.packages}</a>
            <a href="#sss" className="hover:text-gray-700">{c.nav.faq}</a>
            <Link href="/giris" className="hover:text-gray-700">{c.nav.login}</Link>
          </div>
          <p className="text-xs text-gray-400">© 2026 Mia Digital Solutions</p>
        </div>
      </footer>
    </main>
  );
}
