'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError('E-posta veya şifre hatalı.');
      setLoading(false);
      return;
    }

    // Kullanıcının tenant'ını bul ve yönlendir
    const { data: staff } = await supabase
      .from('staff_users')
      .select('tenant_id, tenants(slug)')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (!staff) {
      setError('Hesabınıza bağlı işletme bulunamadı.');
      setLoading(false);
      return;
    }

    const slug = (staff.tenants as unknown as { slug: string })?.slug;
    if (slug) {
      window.location.href = `/admin/${slug}`;
    } else {
      setError('Yönlendirme hatası.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-sm">
        <div className="text-center mb-6">
          <p className="text-xl font-semibold text-gray-900">mia.menu</p>
          <p className="text-sm text-gray-500 mt-1">Backoffice girişi</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">E-posta</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-50 mt-1"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Hesabınız yok mu?{' '}
            <a href="/kayit" className="text-rose-600 font-medium">Ücretsiz dene</a>
          </p>
        </div>
      </div>
    </main>
  );
}
