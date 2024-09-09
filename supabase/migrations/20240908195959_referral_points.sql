alter table "public"."user_points" alter column "activity_points" set default '0'::bigint;

set check_function_bodies = off;

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

CREATE TRIGGER after_direct_referral_insert AFTER INSERT ON public.direct_referrals FOR EACH ROW EXECUTE FUNCTION create_secondary_referral();

CREATE TRIGGER after_secondary_referral_insert AFTER INSERT ON public.secondary_referrals FOR EACH ROW EXECUTE FUNCTION create_tertiary_referral();

CREATE TRIGGER after_tertiary_referral_insert AFTER INSERT ON public.tertiary_referrals FOR EACH ROW EXECUTE FUNCTION update_user_points_for_tertiary_referral();


