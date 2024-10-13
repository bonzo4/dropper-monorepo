create table "public"."telegram_accounts" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "username" text not null,
    "telegram_id" text not null
);


alter table "public"."telegram_accounts" enable row level security;

CREATE UNIQUE INDEX telegram_accounts_pkey ON public.telegram_accounts USING btree (user_id);

alter table "public"."telegram_accounts" add constraint "telegram_accounts_pkey" PRIMARY KEY using index "telegram_accounts_pkey";

alter table "public"."telegram_accounts" add constraint "telegram_accounts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE CASCADE not valid;

alter table "public"."telegram_accounts" validate constraint "telegram_accounts_user_id_fkey";

grant delete on table "public"."telegram_accounts" to "anon";

grant insert on table "public"."telegram_accounts" to "anon";

grant references on table "public"."telegram_accounts" to "anon";

grant select on table "public"."telegram_accounts" to "anon";

grant trigger on table "public"."telegram_accounts" to "anon";

grant truncate on table "public"."telegram_accounts" to "anon";

grant update on table "public"."telegram_accounts" to "anon";

grant delete on table "public"."telegram_accounts" to "authenticated";

grant insert on table "public"."telegram_accounts" to "authenticated";

grant references on table "public"."telegram_accounts" to "authenticated";

grant select on table "public"."telegram_accounts" to "authenticated";

grant trigger on table "public"."telegram_accounts" to "authenticated";

grant truncate on table "public"."telegram_accounts" to "authenticated";

grant update on table "public"."telegram_accounts" to "authenticated";

grant delete on table "public"."telegram_accounts" to "service_role";

grant insert on table "public"."telegram_accounts" to "service_role";

grant references on table "public"."telegram_accounts" to "service_role";

grant select on table "public"."telegram_accounts" to "service_role";

grant trigger on table "public"."telegram_accounts" to "service_role";

grant truncate on table "public"."telegram_accounts" to "service_role";

grant update on table "public"."telegram_accounts" to "service_role";

create policy "Enable access based on user_id"
on "public"."telegram_accounts"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));
