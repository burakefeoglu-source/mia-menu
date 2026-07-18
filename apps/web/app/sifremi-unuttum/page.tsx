'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/sifreyi-sifirla`,
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">mia.menu</h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <p className="text-2xl mb-3">✉️</p>
              <p className="font-medium mb-2">E-posta gönderildi</p>
              <p className="text-sm text-gray-500 mb-4">
                {email} adresine şifre sıfırlama bağlantısı gönderdik.
              </p>
              <Link href="/giris" className="text-sm text-rose-600 font-medium">Giriş sayfasına dön</Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-medium mb-1">Şifremi unuttum</h2>
              <p className="text-xs text-gray-500 mb-5">E-posta adresinizi girin, sıfırlama bağlantısı gönderelim.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
                />
                <button type="submit" disabled={loading}
                  className="w-full bg-rose-600 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60">
                  {loading ? 'Gönderiliyor...' : 'Sıfırlama bağlantısı gönder'}
                </button>
              </form>
              <p className="text-center text-xs text-gray-500 mt-4">
                <Link href="/giris" className="text-rose-600 font-medium">Giriş sayfasına dön</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
