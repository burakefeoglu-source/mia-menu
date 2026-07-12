'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/giris');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left text-xs text-gray-400 px-3 py-2 hover:text-red-500 transition-colors"
    >
      Çıkış yap
    </button>
  );
}
