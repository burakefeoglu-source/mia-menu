import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function TrialBanner({ tenantId }: { tenantId: string }) {
  const supabase = createClient();
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, trial_ends_at, plan_expires_at')
    .eq('tenant_id', tenantId)
    .maybeSingle();

  if (!sub) return null;

  const now = new Date();

  if (sub.status === 'active' && sub.plan_expires_at) {
    const daysLeft = Math.ceil((new Date(sub.plan_expires_at).getTime() - now.getTime()) / 86400000);
    if (daysLeft > 30) return null;
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-2">
        <p className="text-xs text-amber-800">Aboneliğinizin bitmesine <strong>{daysLeft} gün</strong> kaldı.</p>
        <Link href="/odeme" className="text-xs bg-amber-600 text-white px-3 py-1 rounded-md flex-shrink-0">Yenile</Link>
      </div>
    );
  }

  if (sub.status === 'trialing' && sub.trial_ends_at) {
    const daysLeft = Math.ceil((new Date(sub.trial_ends_at).getTime() - now.getTime()) / 86400000);
    if (daysLeft <= 0) return (
      <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between gap-2">
        <p className="text-xs text-red-800 font-medium">Deneme süreniz doldu. Menünüz artık görüntülenemiyor.</p>
        <Link href="/odeme" className="text-xs bg-red-600 text-white px-3 py-1 rounded-md flex-shrink-0">Abone ol</Link>
      </div>
    );
    return (
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between gap-2">
        <p className="text-xs text-blue-800">Deneme sürenizin bitmesine <strong>{daysLeft} gün</strong> kaldı.</p>
        <Link href="/odeme" className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md flex-shrink-0">Abone ol</Link>
      </div>
    );
  }

  if (sub.status === 'expired' || sub.status === 'cancelled') return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between gap-2">
      <p className="text-xs text-red-800 font-medium">Aboneliğiniz sona erdi.</p>
      <Link href="/odeme" className="text-xs bg-red-600 text-white px-3 py-1 rounded-md flex-shrink-0">Yenile</Link>
    </div>
  );

  return null;
}
