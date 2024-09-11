set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_bump_listing_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_listing_stats
    SET listing_bumps = listing_bumps + 1
    WHERE user_id = NEW.user_id;
    UPDATE public.user_points
    SET activity_points = activity_points + 500
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;$function$
;

CREATE TRIGGER after_listing_bump_insert AFTER INSERT ON public.listing_bumps FOR EACH ROW EXECUTE FUNCTION update_user_bump_listing_stats();


