drop policy "Enable read access for all users" on "public"."whitelisted_wallets";

revoke delete on table "public"."whitelisted_wallets" from "anon";

revoke insert on table "public"."whitelisted_wallets" from "anon";

revoke references on table "public"."whitelisted_wallets" from "anon";

revoke select on table "public"."whitelisted_wallets" from "anon";

revoke trigger on table "public"."whitelisted_wallets" from "anon";

revoke truncate on table "public"."whitelisted_wallets" from "anon";

revoke update on table "public"."whitelisted_wallets" from "anon";

revoke delete on table "public"."whitelisted_wallets" from "authenticated";

revoke insert on table "public"."whitelisted_wallets" from "authenticated";

revoke references on table "public"."whitelisted_wallets" from "authenticated";

revoke select on table "public"."whitelisted_wallets" from "authenticated";

revoke trigger on table "public"."whitelisted_wallets" from "authenticated";

revoke truncate on table "public"."whitelisted_wallets" from "authenticated";

revoke update on table "public"."whitelisted_wallets" from "authenticated";

revoke delete on table "public"."whitelisted_wallets" from "service_role";

revoke insert on table "public"."whitelisted_wallets" from "service_role";

revoke references on table "public"."whitelisted_wallets" from "service_role";

revoke select on table "public"."whitelisted_wallets" from "service_role";

revoke trigger on table "public"."whitelisted_wallets" from "service_role";

revoke truncate on table "public"."whitelisted_wallets" from "service_role";

revoke update on table "public"."whitelisted_wallets" from "service_role";

alter table "public"."whitelisted_wallets" drop constraint "whitelisted_wallets_pkey";

drop index if exists "public"."whitelisted_wallets_pkey";

drop table "public"."whitelisted_wallets";


