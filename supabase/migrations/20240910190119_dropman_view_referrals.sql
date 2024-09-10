create or replace view "public"."dropmans_view" as  SELECT dropmans.user_id,
    dropmans.username,
    dropmans.icon,
    dropmans.referral_id
   FROM dropmans;



