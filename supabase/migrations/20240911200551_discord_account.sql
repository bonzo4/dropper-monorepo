create table "public"."discord_accounts" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "discord_id" text not null,
    "username" text not null
);


alter table "public"."discord_accounts" enable row level security;

CREATE UNIQUE INDEX discord_accounts_pkey ON public.discord_accounts USING btree (user_id);

alter table "public"."discord_accounts" add constraint "discord_accounts_pkey" PRIMARY KEY using index "discord_accounts_pkey";

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

CREATE OR REPLACE FUNCTION public.create_secondary_referral()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_referral public.direct_referrals%ROWTYPE;  -- Declare a variable to hold the direct_referral row
BEGIN
    -- Select the direct_referral into the user_referral variable
    SELECT * INTO user_referral
    FROM public.direct_referrals
    WHERE user_id = NEW.referrer_id;

    -- Check if the user_referral exists
    IF FOUND THEN
        -- Insert a new secondary_referral using user_referral.referrer_id
        INSERT INTO public.secondary_referrals (user_id,  referrer_id)
        VALUES (NEW.user_id, user_referral.referrer_id);

        -- Update user_points for the referrer
        
    END IF;
    UPDATE public.user_points
    SET referral_points = referral_points + 100
    WHERE user_id = NEW.referrer_id;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_tertiary_referral()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_referral public.direct_referrals%ROWTYPE;  -- Declare a variable to hold the secondary_referral row
BEGIN
    -- Select the secondary_referral into the user_referral variable
    SELECT * INTO user_referral
    FROM public.direct_referrals
    WHERE user_id = NEW.referrer_id;

    -- Check if the user_referral exists
    IF FOUND THEN
        -- Insert a new tertiary_referral using user_referral.referrer_id
        INSERT INTO public.tertiary_referrals (user_id,  referrer_id)
        VALUES (NEW.user_id, user_referral.referrer_id);

        -- Update user_points for the referrer
        
    END IF;
    UPDATE public.user_points
    SET referral_points = referral_points + 40
    WHERE user_id = NEW.referrer_id;
    RETURN NEW;
END;
$function$
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

CREATE OR REPLACE FUNCTION public.update_user_activity_points()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Update user_points for the referrer
    UPDATE public.user_points
    SET activity_points = activity_points + new.points
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_activity_points_giveaway_create()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Check if tx_string is not null and update activity_points
    IF NEW.tx_string IS NOT NULL AND OLD.tx_string IS NULL THEN
        UPDATE public.user_giveaway_stats
        SET giveaways_created = giveaways_created + 1
        WHERE user_id = NEW.user_id;
        INSERT into public.user_activities (user_id, activity, points)
        values (new.user_id, 'Giveaway created.', 100);
        update public.giveaways
        set badges = array_append(badges, 'CTO'::giveaway_badges)
        where token_address = new.token_address;
    END IF;

    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_user_bump_listing_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_listing_stats
    SET listing_bumps = listing_bumps + 1
    WHERE user_id = NEW.user_id;
    INSERT into public.user_activities (user_id, activity, points)
    values (new.user_id, 'Listing bumped.', 500);
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_user_create_listing_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_listing_stats
    SET listings_created = listings_created + 1
    WHERE user_id = NEW.user_id;
    INSERT into public.user_activities (user_id, activity, points)
    values (new.user_id, 'Listing created.', 500);
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_user_enter_giveaway_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_giveaway_stats
    SET giveaways_entered = giveaways_entered + 1
    WHERE user_id = NEW.user_id;
    INSERT into public.user_activities (user_id, activity, points)
    values (new.user_id, 'Giveaway entered.', 20);
    UPDATE public.giveaways
    SET entries = entries + 1
    WHERE id = NEW.giveaway_id;
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_user_points_for_tertiary_referral()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Update user_points for the referrer
    UPDATE public.user_points
    SET referral_points = referral_points + 10
    WHERE user_id = NEW.referrer_id;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_winner_giveaway_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_giveaway_stats
    SET giveaways_won = giveaways_won + 1
    WHERE user_id = NEW.user_id;
    INSERT into public.user_activities (user_id, activity, points)
    values (new.user_id, 'Giveaway won.', 100);
    RETURN NEW;
END;$function$
;

grant delete on table "public"."discord_accounts" to "anon";

grant insert on table "public"."discord_accounts" to "anon";

grant references on table "public"."discord_accounts" to "anon";

grant select on table "public"."discord_accounts" to "anon";

grant trigger on table "public"."discord_accounts" to "anon";

grant truncate on table "public"."discord_accounts" to "anon";

grant update on table "public"."discord_accounts" to "anon";

grant delete on table "public"."discord_accounts" to "authenticated";

grant insert on table "public"."discord_accounts" to "authenticated";

grant references on table "public"."discord_accounts" to "authenticated";

grant select on table "public"."discord_accounts" to "authenticated";

grant trigger on table "public"."discord_accounts" to "authenticated";

grant truncate on table "public"."discord_accounts" to "authenticated";

grant update on table "public"."discord_accounts" to "authenticated";

grant delete on table "public"."discord_accounts" to "service_role";

grant insert on table "public"."discord_accounts" to "service_role";

grant references on table "public"."discord_accounts" to "service_role";

grant select on table "public"."discord_accounts" to "service_role";

grant trigger on table "public"."discord_accounts" to "service_role";

grant truncate on table "public"."discord_accounts" to "service_role";

grant update on table "public"."discord_accounts" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."discord_accounts"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."discord_accounts"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable select for users based on user_id"
on "public"."discord_accounts"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



