set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_comment_listing_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_listing_stats
    SET listing_comments = listing_comments + 1
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;$function$
;


