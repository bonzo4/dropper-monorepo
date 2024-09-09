revoke delete on table "public"."creator_wallets" from "anon";

revoke insert on table "public"."creator_wallets" from "anon";

revoke references on table "public"."creator_wallets" from "anon";

revoke select on table "public"."creator_wallets" from "anon";

revoke trigger on table "public"."creator_wallets" from "anon";

revoke truncate on table "public"."creator_wallets" from "anon";

revoke update on table "public"."creator_wallets" from "anon";

revoke delete on table "public"."creator_wallets" from "authenticated";

revoke insert on table "public"."creator_wallets" from "authenticated";

revoke references on table "public"."creator_wallets" from "authenticated";

revoke select on table "public"."creator_wallets" from "authenticated";

revoke trigger on table "public"."creator_wallets" from "authenticated";

revoke truncate on table "public"."creator_wallets" from "authenticated";

revoke update on table "public"."creator_wallets" from "authenticated";

revoke delete on table "public"."creator_wallets" from "service_role";

revoke insert on table "public"."creator_wallets" from "service_role";

revoke references on table "public"."creator_wallets" from "service_role";

revoke select on table "public"."creator_wallets" from "service_role";

revoke trigger on table "public"."creator_wallets" from "service_role";

revoke truncate on table "public"."creator_wallets" from "service_role";

revoke update on table "public"."creator_wallets" from "service_role";

revoke delete on table "public"."spl_giveaways" from "anon";

revoke insert on table "public"."spl_giveaways" from "anon";

revoke references on table "public"."spl_giveaways" from "anon";

revoke select on table "public"."spl_giveaways" from "anon";

revoke trigger on table "public"."spl_giveaways" from "anon";

revoke truncate on table "public"."spl_giveaways" from "anon";

revoke update on table "public"."spl_giveaways" from "anon";

revoke delete on table "public"."spl_giveaways" from "authenticated";

revoke insert on table "public"."spl_giveaways" from "authenticated";

revoke references on table "public"."spl_giveaways" from "authenticated";

revoke select on table "public"."spl_giveaways" from "authenticated";

revoke trigger on table "public"."spl_giveaways" from "authenticated";

revoke truncate on table "public"."spl_giveaways" from "authenticated";

revoke update on table "public"."spl_giveaways" from "authenticated";

revoke delete on table "public"."spl_giveaways" from "service_role";

revoke insert on table "public"."spl_giveaways" from "service_role";

revoke references on table "public"."spl_giveaways" from "service_role";

revoke select on table "public"."spl_giveaways" from "service_role";

revoke trigger on table "public"."spl_giveaways" from "service_role";

revoke truncate on table "public"."spl_giveaways" from "service_role";

revoke update on table "public"."spl_giveaways" from "service_role";

alter table "public"."creator_wallets" drop constraint "creator_wallets_pkey";

alter table "public"."spl_giveaways" drop constraint "giveaway_pkey";

drop index if exists "public"."creator_wallets_pkey";

drop index if exists "public"."giveaway_pkey";

drop table "public"."creator_wallets";

drop table "public"."spl_giveaways";

create policy "Enable read access for all users"
on "public"."back_gear"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."chest_gear"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."drop_rate_configs"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."dropman_gear"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."feet_gear"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."head_gear"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."leg_gear"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."user_points"
as permissive
for select
to public
using (true);



