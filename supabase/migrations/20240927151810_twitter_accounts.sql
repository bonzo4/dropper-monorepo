create table "public"."twitter_accounts" (
    "user_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "twitter_id" text,
    "username" text,
    "code_verifier" text
);


alter table "public"."twitter_accounts" enable row level security;

alter table "public"."discord_accounts" alter column "discord_id" drop not null;

alter table "public"."discord_accounts" alter column "username" drop not null;

CREATE UNIQUE INDEX twitter_account_pkey ON public.twitter_accounts USING btree (user_id);

CREATE UNIQUE INDEX twitter_accounts_twitter_id_key ON public.twitter_accounts USING btree (twitter_id);

alter table "public"."twitter_accounts" add constraint "twitter_account_pkey" PRIMARY KEY using index "twitter_account_pkey";

alter table "public"."twitter_accounts" add constraint "twitter_account_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE CASCADE not valid;

alter table "public"."twitter_accounts" validate constraint "twitter_account_user_id_fkey";

alter table "public"."twitter_accounts" add constraint "twitter_accounts_twitter_id_key" UNIQUE using index "twitter_accounts_twitter_id_key";

grant delete on table "public"."twitter_accounts" to "anon";

grant insert on table "public"."twitter_accounts" to "anon";

grant references on table "public"."twitter_accounts" to "anon";

grant select on table "public"."twitter_accounts" to "anon";

grant trigger on table "public"."twitter_accounts" to "anon";

grant truncate on table "public"."twitter_accounts" to "anon";

grant update on table "public"."twitter_accounts" to "anon";

grant delete on table "public"."twitter_accounts" to "authenticated";

grant insert on table "public"."twitter_accounts" to "authenticated";

grant references on table "public"."twitter_accounts" to "authenticated";

grant select on table "public"."twitter_accounts" to "authenticated";

grant trigger on table "public"."twitter_accounts" to "authenticated";

grant truncate on table "public"."twitter_accounts" to "authenticated";

grant update on table "public"."twitter_accounts" to "authenticated";

grant delete on table "public"."twitter_accounts" to "service_role";

grant insert on table "public"."twitter_accounts" to "service_role";

grant references on table "public"."twitter_accounts" to "service_role";

grant select on table "public"."twitter_accounts" to "service_role";

grant trigger on table "public"."twitter_accounts" to "service_role";

grant truncate on table "public"."twitter_accounts" to "service_role";

grant update on table "public"."twitter_accounts" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."twitter_accounts"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."twitter_accounts"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable select for users based on user_id"
on "public"."twitter_accounts"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users based on user_id"
on "public"."twitter_accounts"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



