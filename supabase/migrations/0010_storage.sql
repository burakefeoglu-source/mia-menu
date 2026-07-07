-- ============================================================
-- mia.menu — görseller için Supabase Storage (Faz 1.8)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

create policy "public_read_menu_images" on storage.objects
  for select using (bucket_id = 'menu-images');

create policy "staff_insert_menu_images" on storage.objects
  for insert to authenticated with check (bucket_id = 'menu-images');

create policy "staff_update_menu_images" on storage.objects
  for update to authenticated using (bucket_id = 'menu-images');

create policy "staff_delete_menu_images" on storage.objects
  for delete to authenticated using (bucket_id = 'menu-images');
