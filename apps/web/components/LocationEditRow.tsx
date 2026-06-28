'use client';

import { useState } from 'react';
import { updateLocation } from '@/app/admin/[slug]/actions';
import type { Location } from '@/types/database';

export default function LocationEditRow({
  slug,
  location,
  onDeleteAction,
}: {
  slug: string;
  location: Location;
  onDeleteAction: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const boundUpdate = updateLocation.bind(null, location.id, slug);

  if (editing) {
    return (
      <form
        action={async (formData) => {
          await boundUpdate(formData);
          setEditing(false);
        }}
        className="border border-gray-200 rounded-md p-3 flex flex-col gap-2"
      >
        <input
          name="name"
          defaultValue={location.name}
          required
          className="border border-gray-200 rounded-md px-2 py-1 text-sm"
        />
        <input
          name="address"
          defaultValue={location.address ?? ''}
          placeholder="Adres"
          className="border border-gray-200 rounded-md px-2 py-1 text-sm"
        />
        <input
          name="phone"
          defaultValue={location.phone ?? ''}
          placeholder="Telefon"
          className="border border-gray-200 rounded-md px-2 py-1 text-sm"
        />
        <div className="flex gap-2">
          <button type="submit" className="text-xs bg-rose-600 text-white px-2.5 py-1 rounded-md">
            Kaydet
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-xs text-gray-400"
          >
            Vazgeç
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="border border-gray-200 rounded-md p-3 flex justify-between items-start">
      <div>
        <p className="text-sm font-medium">{location.name}</p>
        {location.address && <p className="text-xs text-gray-500 mt-0.5">{location.address}</p>}
        {location.phone && <p className="text-xs text-gray-500">{location.phone}</p>}
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={() => setEditing(true)} className="text-xs text-gray-400">
          Düzenle
        </button>
        <button
          onClick={() => {
            if (confirm(`"${location.name}" şubesini silmek istediğine emin misin?`)) {
              onDeleteAction();
            }
          }}
          className="text-xs text-red-500"
        >
          Sil
        </button>
      </div>
    </div>
  );
}
