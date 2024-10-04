drop policy "Enable select for authenticated users only" on "public"."listing_bumps";

drop policy "Enable insert for users based on user_id" on "public"."listing_bumps";

alter table "public"."listings" drop column "total_supply";

alter table "public"."listings" add column "market_cap" numeric not null default '0'::numeric;

create policy "Enable read access for all users"
on "public"."listing_bumps"
as permissive
for select
to public
using (true);


create policy "Enable insert for users based on user_id"
on "public"."listing_bumps"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



