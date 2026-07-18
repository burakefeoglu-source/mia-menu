'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Şifreler eşleşmiyor.'); return; }
    if (password.length < 8) { setError('Şifre en az 8 karakter olmalı.'); return; }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push('/giris');
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">mia.menu</h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-5">Yeni şifre belirle</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 text-sm text-red-700">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Yeni şifre (en az 8 karakter)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
            <input type="password" required value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Şifreyi tekrar girin"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
            <button type="submit" disabled={loading}
              className="w-full bg-rose-600 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60">
              {loading ? 'Kaydediliyor...' : 'Şifreyi güncelle'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
