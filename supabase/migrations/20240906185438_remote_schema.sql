set check_function_bodies = off;

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


