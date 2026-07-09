'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import { registerRestaurant, type RegisterResult } from './actions';

const initialState: RegisterResult = {};

export default function RegisterPage() {
  const [state, action, pending] = useFormState(registerRestaurant, initialState);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">mia.menu</h1>
          <p className="text-sm text-gray-500 mt-1">5 gün ücretsiz deneyin, kredi kartı gerekmez</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-5">İşletmenizi kaydedin</h2>

          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <form action={action} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">İşletme adı</label>
              <input name="business_name" type="text" required placeholder="örn. Mia Bistro"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm ${state.fieldError?.business_name ? 'border-red-400' : 'border-gray-200'}`} />
              {state.fieldError?.business_name && <p className="text-xs text-red-600 mt-1">{state.fieldError.business_name}</p>}
              <p className="text-[11px] text-gray-400 mt-1">Menü adresiniz otomatik oluşturulur (örn. miabistro.mia.menu)</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Telefon</label>
              <input name="phone" type="tel" placeholder="+90 5xx xxx xx xx"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">E-posta</label>
              <input name="email" type="email" required placeholder="siz@ornek.com"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm ${state.fieldError?.email ? 'border-red-400' : 'border-gray-200'}`} />
              {state.fieldError?.email && <p className="text-xs text-red-600 mt-1">{state.fieldError.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Şifre</label>
              <input name="password" type="password" required placeholder="En az 8 karakter"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm ${state.fieldError?.password ? 'border-red-400' : 'border-gray-200'}`} />
              {state.fieldError?.password && <p className="text-xs text-red-600 mt-1">{state.fieldError.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Şifre tekrar</label>
              <input name="password_confirm" type="password" required placeholder="Şifreyi tekrar girin"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm ${state.fieldError?.password_confirm ? 'border-red-400' : 'border-gray-200'}`} />
              {state.fieldError?.password_confirm && <p className="text-xs text-red-600 mt-1">{state.fieldError.password_confirm}</p>}
            </div>

            <button type="submit" disabled={pending}
              className="w-full bg-rose-600 text-white rounded-lg py-2.5 text-sm font-medium mt-1 disabled:opacity-60">
              {pending ? 'Kaydediliyor...' : '5 günlük deneme başlat'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Zaten hesabınız var mı?{' '}
            <Link href="/giris" className="text-rose-600 font-medium">Giriş yapın</Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-4">
          Kayıt olarak <a href="#" className="underline">Kullanım Şartları</a>&apos;nı kabul etmiş olursunuz.
        </p>
      </div>
    </main>
  );
}
