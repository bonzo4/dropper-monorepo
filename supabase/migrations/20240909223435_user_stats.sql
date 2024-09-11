DROP TRIGGER IF EXISTS create_giveaway_stats_trigger ON auth.users;

create table "public"."user_listing_stats" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "listings_created" bigint not null default '0'::bigint,
    "listing_bumps" bigint not null default '0'::bigint,
    "listing_comments" bigint not null default '0'::bigint
);


alter table "public"."user_listing_stats" enable row level security;

CREATE UNIQUE INDEX user_listing_stats_pkey ON public.user_listing_stats USING btree (user_id);

alter table "public"."user_listing_stats" add constraint "user_listing_stats_pkey" PRIMARY KEY using index "user_listing_stats_pkey";

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
    INSERT INTO public.user_giveaway_stats (user_id) VALUES (NEW.id);
    INSERT INTO public.user_listing_stats (user_id) values (NEW.id);
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_giveaway_sol_usd_value()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    response jsonb;
    price_usd numeric;
BEGIN
    -- Fetch data from the API
    SELECT content::jsonb INTO response
    FROM http_get('https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112');

    -- Check if the response contains pairs and if the priceUsd is a valid number
    IF response->'pairs' IS NOT NULL AND jsonb_typeof(response->'pairs'->0->'priceUsd') = 'string' THEN
        -- Attempt to convert the priceUsd to numeric
        BEGIN
            price_usd := (response->'pairs'->0->>'priceUsd')::numeric;
        EXCEPTION
            WHEN others THEN
                RAISE WARNING 'Failed to convert priceUsd to numeric: %', response->'pairs'->0->>'priceUsd';
                RETURN; -- Exit the function if conversion fails
        END;
    ELSE
        RAISE WARNING 'No valid pairs found in the response or priceUsd is not a string.';
        RETURN; -- Exit the function if no valid pairs
    END IF;

    -- Update ongoing giveaways without a token_address, where start_time and end_time are after now
    UPDATE public.giveaways
    SET usd_value = reward_amount * price_usd
    WHERE token_address IS NULL
      AND start_time < now()
      AND end_time > now();

    RAISE NOTICE 'Updated usd_value for ongoing giveaways without token_address, with start_time and end_time after now.';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_listing_last_bump()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    UPDATE public.listings
    SET last_bump = NEW.created_at
    WHERE id = NEW.listing_id;
    RETURN NEW;
END;$function$
;

grant delete on table "public"."user_listing_stats" to "anon";

grant insert on table "public"."user_listing_stats" to "anon";

grant references on table "public"."user_listing_stats" to "anon";

grant select on table "public"."user_listing_stats" to "anon";

grant trigger on table "public"."user_listing_stats" to "anon";

grant truncate on table "public"."user_listing_stats" to "anon";

grant update on table "public"."user_listing_stats" to "anon";

grant delete on table "public"."user_listing_stats" to "authenticated";

grant insert on table "public"."user_listing_stats" to "authenticated";

grant references on table "public"."user_listing_stats" to "authenticated";

grant select on table "public"."user_listing_stats" to "authenticated";

grant trigger on table "public"."user_listing_stats" to "authenticated";

grant truncate on table "public"."user_listing_stats" to "authenticated";

grant update on table "public"."user_listing_stats" to "authenticated";

grant delete on table "public"."user_listing_stats" to "service_role";

grant insert on table "public"."user_listing_stats" to "service_role";

grant references on table "public"."user_listing_stats" to "service_role";

grant select on table "public"."user_listing_stats" to "service_role";

grant trigger on table "public"."user_listing_stats" to "service_role";

grant truncate on table "public"."user_listing_stats" to "service_role";

grant update on table "public"."user_listing_stats" to "service_role";


