create table "public"."direct_referrals" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "referrer_id" uuid not null
);


alter table "public"."direct_referrals" enable row level security;

create table "public"."secondary_referrals" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "referrer_id" uuid not null
);


alter table "public"."secondary_referrals" enable row level security;

create table "public"."tertiary_referrals" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "referrer_id" uuid not null
);


alter table "public"."tertiary_referrals" enable row level security;

create table "public"."user_points" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "referral_points" bigint not null default '0'::bigint,
    "activity_points" bigint not null
);


alter table "public"."user_points" enable row level security;

CREATE UNIQUE INDEX direct_referrals_pkey ON public.direct_referrals USING btree (user_id);

CREATE UNIQUE INDEX secondary_referrals_pkey ON public.secondary_referrals USING btree (user_id);

CREATE UNIQUE INDEX tertiary_referrals_pkey ON public.tertiary_referrals USING btree (user_id);

CREATE UNIQUE INDEX user_points_pkey ON public.user_points USING btree (user_id);

alter table "public"."direct_referrals" add constraint "direct_referrals_pkey" PRIMARY KEY using index "direct_referrals_pkey";

alter table "public"."secondary_referrals" add constraint "secondary_referrals_pkey" PRIMARY KEY using index "secondary_referrals_pkey";

alter table "public"."tertiary_referrals" add constraint "tertiary_referrals_pkey" PRIMARY KEY using index "tertiary_referrals_pkey";

alter table "public"."user_points" add constraint "user_points_pkey" PRIMARY KEY using index "user_points_pkey";

alter table "public"."direct_referrals" add constraint "direct_referrals_referrer_id_fkey" FOREIGN KEY (referrer_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE CASCADE not valid;

alter table "public"."direct_referrals" validate constraint "direct_referrals_referrer_id_fkey";

alter table "public"."direct_referrals" add constraint "direct_referrals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE CASCADE not valid;

alter table "public"."direct_referrals" validate constraint "direct_referrals_user_id_fkey";

alter table "public"."secondary_referrals" add constraint "secondary_referrals_referrer_id_fkey" FOREIGN KEY (referrer_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE CASCADE not valid;

alter table "public"."secondary_referrals" validate constraint "secondary_referrals_referrer_id_fkey";

alter table "public"."secondary_referrals" add constraint "secondary_referrals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE CASCADE not valid;

alter table "public"."secondary_referrals" validate constraint "secondary_referrals_user_id_fkey";

alter table "public"."tertiary_referrals" add constraint "tertiary_referrals_referrer_id_fkey" FOREIGN KEY (referrer_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE CASCADE not valid;

alter table "public"."tertiary_referrals" validate constraint "tertiary_referrals_referrer_id_fkey";

alter table "public"."tertiary_referrals" add constraint "tertiary_referrals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE CASCADE not valid;

alter table "public"."tertiary_referrals" validate constraint "tertiary_referrals_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_dropman()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    INSERT INTO public.dropmans (username, icon, user_id)
    VALUES (COALESCE(substring(NEW.email from 1 for position('@' in NEW.email) - 1)), COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://pmlweoiqgtcwuxpclgql.supabase.co/storage/v1/object/public/icons/default_icon.png'), NEW.id);
    INSERT INTO public.dropman_stats (user_id) values (NEW.id);
    INSERT INTO public.dropman_gear (user_id) values (NEW.id);
    INSERT INTO public.user_points (user_id) values (NEW.id);
    RETURN NEW;
END;$function$
;

grant delete on table "public"."direct_referrals" to "anon";

grant insert on table "public"."direct_referrals" to "anon";

grant references on table "public"."direct_referrals" to "anon";

grant select on table "public"."direct_referrals" to "anon";

grant trigger on table "public"."direct_referrals" to "anon";

grant truncate on table "public"."direct_referrals" to "anon";

grant update on table "public"."direct_referrals" to "anon";

grant delete on table "public"."direct_referrals" to "authenticated";

grant insert on table "public"."direct_referrals" to "authenticated";

grant references on table "public"."direct_referrals" to "authenticated";

grant select on table "public"."direct_referrals" to "authenticated";

grant trigger on table "public"."direct_referrals" to "authenticated";

grant truncate on table "public"."direct_referrals" to "authenticated";

grant update on table "public"."direct_referrals" to "authenticated";

grant delete on table "public"."direct_referrals" to "service_role";

grant insert on table "public"."direct_referrals" to "service_role";

grant references on table "public"."direct_referrals" to "service_role";

grant select on table "public"."direct_referrals" to "service_role";

grant trigger on table "public"."direct_referrals" to "service_role";

grant truncate on table "public"."direct_referrals" to "service_role";

grant update on table "public"."direct_referrals" to "service_role";

grant delete on table "public"."secondary_referrals" to "anon";

grant insert on table "public"."secondary_referrals" to "anon";

grant references on table "public"."secondary_referrals" to "anon";

grant select on table "public"."secondary_referrals" to "anon";

grant trigger on table "public"."secondary_referrals" to "anon";

grant truncate on table "public"."secondary_referrals" to "anon";

grant update on table "public"."secondary_referrals" to "anon";

grant delete on table "public"."secondary_referrals" to "authenticated";

grant insert on table "public"."secondary_referrals" to "authenticated";

grant references on table "public"."secondary_referrals" to "authenticated";

grant select on table "public"."secondary_referrals" to "authenticated";

grant trigger on table "public"."secondary_referrals" to "authenticated";

grant truncate on table "public"."secondary_referrals" to "authenticated";

grant update on table "public"."secondary_referrals" to "authenticated";

grant delete on table "public"."secondary_referrals" to "service_role";

grant insert on table "public"."secondary_referrals" to "service_role";

grant references on table "public"."secondary_referrals" to "service_role";

grant select on table "public"."secondary_referrals" to "service_role";

grant trigger on table "public"."secondary_referrals" to "service_role";

grant truncate on table "public"."secondary_referrals" to "service_role";

grant update on table "public"."secondary_referrals" to "service_role";

grant delete on table "public"."tertiary_referrals" to "anon";

grant insert on table "public"."tertiary_referrals" to "anon";

grant references on table "public"."tertiary_referrals" to "anon";

grant select on table "public"."tertiary_referrals" to "anon";

grant trigger on table "public"."tertiary_referrals" to "anon";

grant truncate on table "public"."tertiary_referrals" to "anon";

grant update on table "public"."tertiary_referrals" to "anon";

grant delete on table "public"."tertiary_referrals" to "authenticated";

grant insert on table "public"."tertiary_referrals" to "authenticated";

grant references on table "public"."tertiary_referrals" to "authenticated";

grant select on table "public"."tertiary_referrals" to "authenticated";

grant trigger on table "public"."tertiary_referrals" to "authenticated";

grant truncate on table "public"."tertiary_referrals" to "authenticated";

grant update on table "public"."tertiary_referrals" to "authenticated";

grant delete on table "public"."tertiary_referrals" to "service_role";

grant insert on table "public"."tertiary_referrals" to "service_role";

grant references on table "public"."tertiary_referrals" to "service_role";

grant select on table "public"."tertiary_referrals" to "service_role";

grant trigger on table "public"."tertiary_referrals" to "service_role";

grant truncate on table "public"."tertiary_referrals" to "service_role";

grant update on table "public"."tertiary_referrals" to "service_role";

grant delete on table "public"."user_points" to "anon";

grant insert on table "public"."user_points" to "anon";

grant references on table "public"."user_points" to "anon";

grant select on table "public"."user_points" to "anon";

grant trigger on table "public"."user_points" to "anon";

grant truncate on table "public"."user_points" to "anon";

grant update on table "public"."user_points" to "anon";

grant delete on table "public"."user_points" to "authenticated";

grant insert on table "public"."user_points" to "authenticated";

grant references on table "public"."user_points" to "authenticated";

grant select on table "public"."user_points" to "authenticated";

grant trigger on table "public"."user_points" to "authenticated";

grant truncate on table "public"."user_points" to "authenticated";

grant update on table "public"."user_points" to "authenticated";

grant delete on table "public"."user_points" to "service_role";

grant insert on table "public"."user_points" to "service_role";

grant references on table "public"."user_points" to "service_role";

grant select on table "public"."user_points" to "service_role";

grant trigger on table "public"."user_points" to "service_role";

grant truncate on table "public"."user_points" to "service_role";

grant update on table "public"."user_points" to "service_role";


