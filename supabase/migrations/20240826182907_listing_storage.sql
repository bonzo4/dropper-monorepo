insert into storage.buckets ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") values ('listing_icons', 'listing_icons', NULL, 'now()', 'now()', true, false, NULL, NULL, NULL);

create policy "insert access 1gwnycf_0"
on "storage"."objects"
as permissive
for insert
to anon, authenticated
with check ((bucket_id = 'listing_icons'::text));



