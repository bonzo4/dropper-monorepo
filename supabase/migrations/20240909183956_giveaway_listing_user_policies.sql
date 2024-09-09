drop policy "Enable insert access for anon users" on "public"."giveaway_requirements";

drop policy "Enable insert for users based on user_id" on "public"."giveaway_stats";

drop policy "Enable read access for all users" on "public"."giveaway_stats";

drop policy "Enable update for users based on user_id" on "public"."giveaway_stats";

drop policy "Enable delete access for all users" on "public"."giveaways";

drop policy "Enable insert access for anon users" on "public"."giveaways";

drop policy "Enable update access for all users" on "public"."giveaways";

drop policy "Enable insert for authenticated users only" on "public"."listing_bumps";

drop policy "enable insert for all" on "public"."listing_comments";

drop policy "Enable insert for authenticated users only" on "public"."listings";

drop policy "Enable select for authenticated users only" on "public"."listing_bumps";

revoke delete on table "public"."giveaway_stats" from "anon";

revoke insert on table "public"."giveaway_stats" from "anon";

revoke references on table "public"."giveaway_stats" from "anon";

revoke select on table "public"."giveaway_stats" from "anon";

revoke trigger on table "public"."giveaway_stats" from "anon";

revoke truncate on table "public"."giveaway_stats" from "anon";

revoke update on table "public"."giveaway_stats" from "anon";

revoke delete on table "public"."giveaway_stats" from "authenticated";

revoke insert on table "public"."giveaway_stats" from "authenticated";

revoke references on table "public"."giveaway_stats" from "authenticated";

revoke select on table "public"."giveaway_stats" from "authenticated";

revoke trigger on table "public"."giveaway_stats" from "authenticated";

revoke truncate on table "public"."giveaway_stats" from "authenticated";

revoke update on table "public"."giveaway_stats" from "authenticated";

revoke delete on table "public"."giveaway_stats" from "service_role";

revoke insert on table "public"."giveaway_stats" from "service_role";

revoke references on table "public"."giveaway_stats" from "service_role";

revoke select on table "public"."giveaway_stats" from "service_role";

revoke trigger on table "public"."giveaway_stats" from "service_role";

revoke truncate on table "public"."giveaway_stats" from "service_role";

revoke update on table "public"."giveaway_stats" from "service_role";

alter table "public"."giveaway_stats" drop constraint "giveaway_stats_user_id_fkey";

alter table "public"."giveaways" drop constraint "giveaways_tx_key";

alter table "public"."giveaway_stats" drop constraint "giveaway_stats_pkey";

drop index if exists "public"."giveaway_stats_pkey";

drop index if exists "public"."giveaways_tx_key";

drop table "public"."giveaway_stats";

create table "public"."user_giveaway_stats" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "giveaways_created" bigint not null default '0'::bigint,
    "giveaways_entered" bigint not null default '0'::bigint,
    "giveaways_won" bigint not null default '0'::bigint
);


alter table "public"."user_giveaway_stats" enable row level security;

alter table "public"."giveaways" drop column "tx";

alter table "public"."giveaways" add column "badges" giveaway_badges[] not null default '{}'::giveaway_badges[];

alter table "public"."giveaways" add column "tx_string" text;

alter table "public"."giveaways" add column "user_id" uuid not null default gen_random_uuid();

alter table "public"."listing_bumps" add column "user_id" uuid not null;

alter table "public"."listing_comments" drop column "wallet_address";

alter table "public"."listing_comments" alter column "user_id" set not null;

alter table "public"."listings" add column "user_id" uuid;

CREATE UNIQUE INDEX giveaway_stats_pkey ON public.user_giveaway_stats USING btree (user_id);

CREATE UNIQUE INDEX giveaways_tx_key ON public.giveaways USING btree (tx_string);

alter table "public"."user_giveaway_stats" add constraint "giveaway_stats_pkey" PRIMARY KEY using index "giveaway_stats_pkey";

alter table "public"."giveaways" add constraint "giveaways_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE CASCADE not valid;

alter table "public"."giveaways" validate constraint "giveaways_user_id_fkey";

alter table "public"."listing_bumps" add constraint "listing_bumps_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE CASCADE not valid;

alter table "public"."listing_bumps" validate constraint "listing_bumps_user_id_fkey";

alter table "public"."listings" add constraint "listings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE SET NULL not valid;

alter table "public"."listings" validate constraint "listings_user_id_fkey";

alter table "public"."user_giveaway_stats" add constraint "giveaway_stats_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE CASCADE not valid;

alter table "public"."user_giveaway_stats" validate constraint "giveaway_stats_user_id_fkey";

alter table "public"."giveaways" add constraint "giveaways_tx_key" UNIQUE using index "giveaways_tx_key";

grant delete on table "public"."user_giveaway_stats" to "anon";

grant insert on table "public"."user_giveaway_stats" to "anon";

grant references on table "public"."user_giveaway_stats" to "anon";

grant select on table "public"."user_giveaway_stats" to "anon";

grant trigger on table "public"."user_giveaway_stats" to "anon";

grant truncate on table "public"."user_giveaway_stats" to "anon";

grant update on table "public"."user_giveaway_stats" to "anon";

grant delete on table "public"."user_giveaway_stats" to "authenticated";

grant insert on table "public"."user_giveaway_stats" to "authenticated";

grant references on table "public"."user_giveaway_stats" to "authenticated";

grant select on table "public"."user_giveaway_stats" to "authenticated";

grant trigger on table "public"."user_giveaway_stats" to "authenticated";

grant truncate on table "public"."user_giveaway_stats" to "authenticated";

grant update on table "public"."user_giveaway_stats" to "authenticated";

grant delete on table "public"."user_giveaway_stats" to "service_role";

grant insert on table "public"."user_giveaway_stats" to "service_role";

grant references on table "public"."user_giveaway_stats" to "service_role";

grant select on table "public"."user_giveaway_stats" to "service_role";

grant trigger on table "public"."user_giveaway_stats" to "service_role";

grant truncate on table "public"."user_giveaway_stats" to "service_role";

grant update on table "public"."user_giveaway_stats" to "service_role";

create policy "Enable insert for users based on user_id"
on "public"."giveaway_requirements"
as permissive
for insert
to authenticated
with check (( SELECT (auth.uid() = ( SELECT giveaways.user_id
           FROM giveaways
          WHERE (giveaways.id = giveaway_requirements.giveaway_id)))));


create policy "Enable delete for users based on user_id"
on "public"."giveaways"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."giveaways"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."listing_bumps"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."listing_comments"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."listings"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."user_giveaway_stats"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."user_giveaway_stats"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."user_giveaway_stats"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable select for authenticated users only"
on "public"."listing_bumps"
as permissive
for select
to public
using (true);



