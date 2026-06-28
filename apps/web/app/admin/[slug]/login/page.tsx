'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError('E-posta veya şifre hatalı.');
      return;
    }

    router.push(`/admin/${params.slug}`);
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-sm"
      >
        <h1 className="text-lg font-medium mb-4">Backoffice girişi</h1>
        <label className="block text-xs text-gray-500 mb-1">E-posta</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mb-3"
        />
        <label className="block text-xs text-gray-500 mb-1">Şifre</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mb-4"
        />
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-600 text-white rounded-md py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
        </button>
      </form>
    </main>
  );
}
