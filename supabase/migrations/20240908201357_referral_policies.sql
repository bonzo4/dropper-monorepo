create policy "enable insert for users based on user_id"
on "public"."direct_referrals"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "enable select for users based on user_id"
on "public"."direct_referrals"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT auth.uid() AS uid) = referrer_id)));



create policy "enable select for users based on user_id"
on "public"."secondary_referrals"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT auth.uid() AS uid) = referrer_id)));



create policy "enable select for users based on user_id"
on "public"."tertiary_referrals"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT auth.uid() AS uid) = referrer_id)));
