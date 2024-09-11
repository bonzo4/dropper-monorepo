drop policy "Give users authenticated access to folder 1njz16_0" on "storage"."objects";

create policy "authenticated insert 1njz16_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'icons'::text));



