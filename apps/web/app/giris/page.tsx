'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setLoading(false);
      setError('E-posta veya şifre hatalı.');
      return;
    }

    // Kullanıcının tenant slug'ını bul
    const { data: staff } = await supabase
      .from('staff_users')
      .select('tenants(slug)')
      .maybeSingle();

    const slug = (staff?.tenants as unknown as { slug: string } | null)?.slug;
    router.push(slug ? `/admin/${slug}` : '/');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">mia.menu</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-5">Giriş yapın</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">E-posta</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Şifre</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-rose-600 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60">
              {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Hesabınız yok mu?{' '}
            <Link href="/kayit" className="text-rose-600 font-medium">Ücretsiz başlayın</Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-2">
            <Link href="/sifremi-unuttum" className="hover:text-gray-600">Şifremi unuttum</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
