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


