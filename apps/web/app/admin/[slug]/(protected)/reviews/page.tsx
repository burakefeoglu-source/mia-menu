import { createClient } from '@/lib/supabase/server';
import { deleteReview } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single();

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .order('created_at', { ascending: false });

  const avg =
    reviews && reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Görüş &amp; yorumlar</h2>
      <p className="text-xs text-gray-500 mb-4">
        {avg ? `Ortalama puan: ${avg} ★ (${reviews!.length} değerlendirme)` : 'Henüz değerlendirme yok'}
      </p>

      <div className="flex flex-col gap-2 max-w-lg">
        {(reviews ?? []).map((r) => {
          const boundDelete = deleteReview.bind(null, r.id, params.slug);
          return (
            <div key={r.id} className="border border-gray-200 rounded-md p-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="text-amber-500 text-sm">{'★'.repeat(r.rating)}</span>
                  <span className="text-gray-300 text-sm">{'★'.repeat(5 - r.rating)}</span>
                  {r.customer_name && (
                    <span className="text-xs text-gray-500 ml-2">{r.customer_name}</span>
                  )}
                </div>
                <form action={boundDelete}>
                  <button className="text-xs text-red-500">Sil</button>
                </form>
              </div>
              {r.comment && <p className="text-sm text-gray-700">{r.comment}</p>}
              <p className="text-[11px] text-gray-400 mt-1">
                {new Date(r.created_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
          );
        })}
        {(!reviews || reviews.length === 0) && (
          <p className="text-sm text-gray-400">Henüz değerlendirme yok</p>
        )}
      </div>
    </div>
  );
}
