import { createClient } from '@/lib/supabase/server';
import { addLocation, deleteLocation } from '../../actions';
import LocationEditRow from '@/components/LocationEditRow';

export const dynamic = 'force-dynamic';

export default async function LocationsPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single();

  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .eq('tenant_id', tenant!.id)
    .order('name');

  const boundAdd = addLocation.bind(null, tenant!.id, params.slug);

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Adres / şube ayarları</h2>
      <p className="text-xs text-gray-500 mb-4">
        Birden fazla şubeniz varsa her biri için ayrı satır ekleyin.
      </p>

      <div className="flex flex-col gap-2 mb-5 max-w-md">
        {(locations ?? []).map((loc) => {
          const boundDelete = deleteLocation.bind(null, loc.id, params.slug);
          return (
            <LocationEditRow
              key={loc.id}
              slug={params.slug}
              location={loc}
              onDeleteAction={boundDelete}
            />
          );
        })}
        {(!locations || locations.length === 0) && (
          <p className="text-sm text-gray-400">Henüz şube eklenmedi</p>
        )}
      </div>

      <form action={boundAdd} className="flex flex-col gap-2 max-w-sm border-t border-gray-100 pt-4">
        <input
          name="name"
          placeholder="Şube adı (örn. Kadıköy Şubesi)"
          required
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
        <input
          name="address"
          placeholder="Adres"
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
        <input
          name="phone"
          placeholder="Telefon"
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          className="self-start text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md mt-1"
        >
          Şube ekle
        </button>
      </form>
    </div>
  );
}
