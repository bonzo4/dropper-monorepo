create policy "Enable read access for all users"
on "public"."user_listing_stats"
as permissive
for select
to public
using (true);



