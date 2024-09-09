alter table "public"."airdrop_banners" alter column "order" set not null;

alter table "public"."giveaway_banners" alter column "order" set not null;

alter table "public"."listing_banners" alter column "order" set not null;

create policy "Enable update for users based on user_id"
on "public"."giveaways"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



