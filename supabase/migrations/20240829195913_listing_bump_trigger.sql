drop trigger if exists "cto_bump_last_bump_trigger" on "public"."listing_bumps";

drop function if exists "public"."update_cto_last_bump"();

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

CREATE TRIGGER cto_bump_last_bump_trigger AFTER INSERT ON public.listing_bumps FOR EACH ROW EXECUTE FUNCTION update_listing_last_bump();


